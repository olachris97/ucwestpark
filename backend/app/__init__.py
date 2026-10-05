import os

from dotenv import load_dotenv

load_dotenv()

from flask import Flask, send_from_directory
from sqlalchemy import inspect, text
from flask_cors import CORS

from .api import api_bp
from .auth import auth_bp, ensure_default_admin
from .config import Config
from .extensions import db, limiter
from .models import Event
from .seed import seed_if_empty


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    db.init_app(app)
    limiter.init_app(app)
    CORS(app, origins=app.config["CORS_ORIGINS"], supports_credentials=True)

    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")

    with app.app_context():
        db.create_all()
        # Lightweight migration for databases created by an earlier location
        # version. SQLite needs the column added explicitly because
        # db.create_all() does not alter an existing table.
        location_columns = {c["name"] for c in inspect(db.engine).get_columns("locations")}
        if "sort_order" not in location_columns:
            db.session.execute(text("ALTER TABLE locations ADD COLUMN sort_order INTEGER DEFAULT 0 NOT NULL"))
            db.session.commit()

        # Location tables are created automatically; seed_if_empty()
        # populates the default regions and venues.
        db.session.commit()
        ensure_default_admin()
        seed_if_empty()

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    # Registered directly on the app (not the /api blueprint) so uploaded
    # image URLs are just /uploads/<file>, matching what upload_image()
    # in api.py returns.
    @app.get("/uploads/<filename>")
    def serve_upload(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    return app
