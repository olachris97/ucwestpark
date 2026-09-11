from datetime import datetime, timedelta, timezone
from functools import wraps

import jwt
from flask import Blueprint, current_app, jsonify, request

from .extensions import db
from .models import AdminUser

auth_bp = Blueprint("auth", __name__)


def generate_token(user_id: int) -> str:
    payload = {
        "sub": user_id,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc)
        + timedelta(hours=current_app.config["JWT_EXPIRES_HOURS"]),
    }
    return jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")


def decode_token(token: str):
    try:
        return jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
    except jwt.PyJWTError:
        return None


def login_required(fn):
    """Protects admin-only routes. Expects `Authorization: Bearer <token>`."""

    @wraps(fn)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header."}), 401
        token = header.split(" ", 1)[1]
        payload = decode_token(token)
        if not payload:
            return jsonify({"error": "Your session has expired. Please log in again."}), 401
        request.admin_user_id = payload["sub"]
        return fn(*args, **kwargs)

    return wrapper


def ensure_default_admin():
    """Creates the first admin account from env vars if none exists yet."""
    if AdminUser.query.first() is not None:
        return
    admin = AdminUser(username=current_app.config["ADMIN_USERNAME"])
    admin.set_password(current_app.config["ADMIN_PASSWORD"])
    db.session.add(admin)
    db.session.commit()
    current_app.logger.info(
        "Created initial admin user '%s' from ADMIN_USERNAME/ADMIN_PASSWORD.",
        admin.username,
    )


@auth_bp.post("/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400

    user = AdminUser.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Incorrect username or password."}), 401

    token = generate_token(user.id)
    return jsonify({"token": token, "username": user.username})


@auth_bp.get("/auth/me")
@login_required
def me():
    user = db.session.get(AdminUser, request.admin_user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404
    return jsonify({"username": user.username})
