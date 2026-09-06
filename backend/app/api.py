import os
import re
import uuid

from flask import Blueprint, current_app, jsonify, request
from PIL import Image

from .auth import login_required
from .email_service import (
    notify_new_contact_message,
    notify_new_event_request,
    notify_new_ticket_request,
)
from .extensions import db, limiter
from .models import Category, ContactMessage, CustomEventRequest, Event, TicketRequest, make_reference

api_bp = Blueprint("api", __name__)

REQUIRED_EVENT_FIELDS = ["name", "category", "date", "venue", "city"]
VALID_STATUSES = {"Pending", "Contacted", "Confirmed", "Closed", "Cancelled"}


def is_bot_submission(data: dict) -> bool:
    """
    Honeypot check: the frontend includes a hidden field real visitors
    never see or fill in. Simple bots that auto-fill every field on a
    form end up filling this one too, giving them away.
    """
    return bool(str(data.get("website", "")).strip())


def slugify(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug or uuid.uuid4().hex[:8]


def unique_slug(name: str, ignore_id: str | None = None) -> str:
    base = slugify(name)
    slug = base
    n = 2
    query = Event.query.filter(Event.slug == slug)
    if ignore_id:
        query = query.filter(Event.id != ignore_id)
    while query.count() > 0:
        slug = f"{base}-{n}"
        n += 1
        query = Event.query.filter(Event.slug == slug)
        if ignore_id:
            query = query.filter(Event.id != ignore_id)
    return slug


# --------------------------------------------------------------------------
# Events (public read, admin write)
# --------------------------------------------------------------------------

@api_bp.get("/events")
def list_events():
    events = Event.query.order_by(Event.date.asc()).all()
    return jsonify([e.to_dict() for e in events])


@api_bp.get("/events/<slug>")
def get_event(slug):
    event = Event.query.filter_by(slug=slug).first()
    if not event:
        return jsonify({"error": "Event not found."}), 404
    return jsonify(event.to_dict())


@api_bp.post("/events")
@login_required
def create_event():
    data = request.get_json(silent=True) or {}
    missing = [f for f in REQUIRED_EVENT_FIELDS if not str(data.get(f, "")).strip()]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    event = Event(
        id=make_reference("EV"),
        name=data["name"],
        slug=unique_slug(data["name"]),
        description=data.get("description", ""),
        long_description=data.get("longDescription") or data.get("description", ""),
        category=data["category"],
        image=data.get("image", ""),
        date=data["date"],
        time=data.get("time", ""),
        venue=data["venue"],
        address=data.get("address", ""),
        city=data["city"],
        country="USA",
        starting_price=data.get("startingPrice"),
        tickets_available=int(data.get("ticketsAvailable") or 0),
        status=data.get("status", "on-sale"),
        featured=bool(data.get("featured", False)),
    )
    db.session.add(event)
    db.session.commit()
    return jsonify(event.to_dict()), 201


@api_bp.put("/events/<event_id>")
@login_required
def update_event(event_id):
    event = db.session.get(Event, event_id)
    if not event:
        return jsonify({"error": "Event not found."}), 404

    data = request.get_json(silent=True) or {}

    if "name" in data and data["name"] != event.name:
        event.name = data["name"]
        event.slug = unique_slug(data["name"], ignore_id=event.id)

    for json_key, attr in [
        ("description", "description"),
        ("longDescription", "long_description"),
        ("category", "category"),
        ("image", "image"),
        ("date", "date"),
        ("time", "time"),
        ("venue", "venue"),
        ("address", "address"),
        ("city", "city"),
        ("status", "status"),
    ]:
        if json_key in data:
            setattr(event, attr, data[json_key])

    if "startingPrice" in data:
        event.starting_price = data["startingPrice"]
    if "ticketsAvailable" in data:
        event.tickets_available = int(data["ticketsAvailable"] or 0)
    if "featured" in data:
        event.featured = bool(data["featured"])

    db.session.commit()
    return jsonify(event.to_dict())


@api_bp.delete("/events/<event_id>")
@login_required
def delete_event(event_id):
    event = db.session.get(Event, event_id)
    if not event:
        return jsonify({"error": "Event not found."}), 404
    db.session.delete(event)
    db.session.commit()
    return "", 204


# --------------------------------------------------------------------------
# Categories (public read, admin write)
# --------------------------------------------------------------------------

@api_bp.get("/categories")
def list_categories():
    categories = Category.query.order_by(Category.id.asc()).all()
    return jsonify([c.name for c in categories])


@api_bp.post("/categories")
@login_required
def create_category():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"error": "Category name is required."}), 400
    if Category.query.filter(db.func.lower(Category.name) == name.lower()).first():
        return jsonify({"error": "That category already exists."}), 409
    db.session.add(Category(name=name))
    db.session.commit()
    return jsonify({"name": name}), 201


@api_bp.delete("/categories/<name>")
@login_required
def delete_category(name):
    category = Category.query.filter_by(name=name).first()
    if not category:
        return jsonify({"error": "Category not found."}), 404
    db.session.delete(category)
    db.session.commit()
    return "", 204


# --------------------------------------------------------------------------
# Image uploads (admin only)
# --------------------------------------------------------------------------

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "gif"}


@api_bp.post("/uploads")
@login_required
def upload_image():
    file = request.files.get("file")
    if not file or not file.filename:
        return jsonify({"error": "No file was uploaded."}), 400

    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        return jsonify({"error": "Please upload a PNG, JPG, WEBP, or GIF image."}), 400

    try:
        image = Image.open(file.stream)
        image = image.convert("RGB")
    except Exception:
        return jsonify({"error": "That file doesn't look like a valid image."}), 400

    max_width = current_app.config["UPLOAD_MAX_WIDTH"]
    if image.width > max_width:
        ratio = max_width / image.width
        image = image.resize((max_width, int(image.height * ratio)))

    filename = f"{uuid.uuid4().hex}.jpg"
    os.makedirs(current_app.config["UPLOAD_FOLDER"], exist_ok=True)
    filepath = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
    image.save(filepath, "JPEG", quality=82)

    base_url = current_app.config["PUBLIC_BASE_URL"] or request.host_url.rstrip("/")
    return jsonify({"url": f"{base_url}/uploads/{filename}"}), 201



# --------------------------------------------------------------------------
# Contact messages (public create, admin list/update)
# --------------------------------------------------------------------------

@api_bp.post("/contact")
@limiter.limit("5 per hour")
def create_contact_message():
    data = request.get_json(silent=True) or {}

    if is_bot_submission(data):
        # Pretend it worked so the bot doesn't learn it was caught —
        # nothing is actually saved.
        return jsonify({"id": make_reference("MSG"), "status": "Pending"}), 201

    required = ["firstName", "lastName", "email", "subject", "message"]
    missing = [f for f in required if not str(data.get(f, "")).strip()]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    email = str(data["email"]).strip()
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        return jsonify({"error": "Please enter a valid email address."}), 400

    message = ContactMessage(
        id=make_reference("MSG"),
        first_name=str(data["firstName"]).strip(),
        last_name=str(data["lastName"]).strip(),
        email=email,
        phone=str(data.get("phone", "")).strip(),
        subject=str(data["subject"]).strip(),
        message=str(data["message"]).strip(),
        status="Pending",
    )
    db.session.add(message)
    db.session.commit()

    result = message.to_dict()
    notify_new_contact_message(result)
    return jsonify(result), 201


# --------------------------------------------------------------------------
# Ticket requests (public create, admin list/update)
# --------------------------------------------------------------------------

@api_bp.post("/ticket-requests")
@limiter.limit("10 per hour")
def create_ticket_request():
    data = request.get_json(silent=True) or {}

    if is_bot_submission(data):
        return jsonify({"id": make_reference("TKT"), "status": "Pending"}), 201

    required = ["firstName", "lastName", "email", "phone", "eventId", "eventName"]
    missing = [f for f in required if not str(data.get(f, "")).strip()]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    record = TicketRequest(
        id=make_reference("TKT"),
        first_name=data["firstName"],
        last_name=data["lastName"],
        email=data["email"],
        phone=data["phone"],
        event_id=data["eventId"],
        event_name=data["eventName"],
        event_date=data.get("eventDate", ""),
        location=data.get("location", ""),
        ticket_quantity=int(data.get("ticketQuantity") or 1),
        seat_preference=data.get("seatPreference", "any"),
        seat_details=data.get("seatDetails", ""),
        budget=data.get("budget", ""),
        ticket_type=data.get("ticketType", ""),
        notes=data.get("notes", ""),
        status="Pending",
    )
    db.session.add(record)
    db.session.commit()

    result = record.to_dict()
    notify_new_ticket_request(result)
    return jsonify(result), 201


@api_bp.post("/event-requests")
@limiter.limit("10 per hour")
def create_event_request():
    data = request.get_json(silent=True) or {}

    if is_bot_submission(data):
        return jsonify({"id": make_reference("EVT"), "status": "Pending"}), 201

    required = ["firstName", "lastName", "email", "phone", "eventName"]
    missing = [f for f in required if not str(data.get(f, "")).strip()]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    record = CustomEventRequest(
        id=make_reference("EVT"),
        first_name=data["firstName"],
        last_name=data["lastName"],
        email=data["email"],
        phone=data["phone"],
        event_name=data["eventName"],
        artist=data.get("artist", ""),
        category=data.get("category", ""),
        event_date=data.get("eventDate", ""),
        city=data.get("city", ""),
        venue=data.get("venue", ""),
        ticket_quantity=int(data.get("ticketQuantity") or 1),
        seat_preference=data.get("seatPreference", ""),
        budget=data.get("budget", ""),
        flexibility=data.get("flexibility", "flexible"),
        notes=data.get("notes", ""),
        status="Pending",
    )
    db.session.add(record)
    db.session.commit()

    result = record.to_dict()
    notify_new_event_request(result)
    return jsonify(result), 201


@api_bp.get("/requests")
@login_required
def list_requests():
    tickets = [r.to_dict() for r in TicketRequest.query.all()]
    events = [r.to_dict() for r in CustomEventRequest.query.all()]
    contacts = [r.to_dict() for r in ContactMessage.query.all()]
    combined = tickets + events + contacts
    combined.sort(key=lambda r: r["createdAt"], reverse=True)
    return jsonify(combined)


@api_bp.patch("/requests/<kind>/<request_id>")
@login_required
def update_request_status(kind, request_id):
    data = request.get_json(silent=True) or {}
    status = data.get("status")
    if status not in VALID_STATUSES:
        return jsonify({"error": f"Status must be one of: {', '.join(sorted(VALID_STATUSES))}"}), 400

    model = (
        TicketRequest
        if kind == "ticket"
        else CustomEventRequest
        if kind == "custom-event"
        else ContactMessage
        if kind == "contact"
        else None
    )
    if model is None:
        return jsonify({"error": "Unknown request type."}), 400

    record = db.session.get(model, request_id)
    if not record:
        return jsonify({"error": "Request not found."}), 404

    record.status = status
    db.session.commit()
    return jsonify(record.to_dict())
