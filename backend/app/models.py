import secrets
import string
from datetime import datetime, timezone

from werkzeug.security import generate_password_hash, check_password_hash

from .extensions import db


def make_reference(prefix: str) -> str:
    suffix = "".join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(6))
    return f"{prefix}-{suffix}"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class AdminUser(db.Model):
    __tablename__ = "admin_users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)


class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)

    def to_dict(self):
        return self.name


class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.String(20), primary_key=True, default=lambda: make_reference("EV"))
    name = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(220), unique=True, nullable=False)
    description = db.Column(db.Text, default="")
    long_description = db.Column(db.Text, default="")
    category = db.Column(db.String(120), nullable=False)
    image = db.Column(db.Text, default="")
    date = db.Column(db.String(20), nullable=False)  # ISO date, e.g. 2027-01-01
    time = db.Column(db.String(40), default="")
    venue = db.Column(db.String(200), default="")
    address = db.Column(db.String(255), default="")
    city = db.Column(db.String(120), default="")  # "City, ST"
    country = db.Column(db.String(80), default="USA")
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    starting_price = db.Column(db.Integer, nullable=True)
    tickets_available = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), default="on-sale")  # on-sale | limited | request
    featured = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "description": self.description,
            "longDescription": self.long_description,
            "category": self.category,
            "image": self.image,
            "date": self.date,
            "time": self.time,
            "venue": self.venue,
            "address": self.address,
            "city": self.city,
            "country": self.country,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "startingPrice": self.starting_price,
            "ticketsAvailable": self.tickets_available,
            "status": self.status,
            "featured": self.featured,
        }


class TicketRequest(db.Model):
    __tablename__ = "ticket_requests"

    id = db.Column(db.String(20), primary_key=True, default=lambda: make_reference("TKT"))
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    event_id = db.Column(db.String(20), nullable=False)
    event_name = db.Column(db.String(200), nullable=False)
    event_date = db.Column(db.String(20), default="")
    location = db.Column(db.String(255), default="")
    ticket_quantity = db.Column(db.Integer, default=1)
    seat_preference = db.Column(db.String(20), default="any")
    seat_details = db.Column(db.String(255), default="")
    budget = db.Column(db.String(50), default="")
    ticket_type = db.Column(db.String(50), default="")
    notes = db.Column(db.Text, default="")
    status = db.Column(db.String(20), default="Pending")
    created_at = db.Column(db.String(40), default=now_iso)

    def to_dict(self):
        return {
            "id": self.id,
            "kind": "ticket",
            "firstName": self.first_name,
            "lastName": self.last_name,
            "email": self.email,
            "phone": self.phone,
            "eventId": self.event_id,
            "eventName": self.event_name,
            "eventDate": self.event_date,
            "location": self.location,
            "ticketQuantity": self.ticket_quantity,
            "seatPreference": self.seat_preference,
            "seatDetails": self.seat_details,
            "budget": self.budget,
            "ticketType": self.ticket_type,
            "notes": self.notes,
            "status": self.status,
            "createdAt": self.created_at,
        }


class ContactMessage(db.Model):
    __tablename__ = "contact_messages"

    id = db.Column(db.String(20), primary_key=True, default=lambda: make_reference("MSG"))
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(50), default="")
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default="Pending")
    created_at = db.Column(db.String(40), default=now_iso)

    def to_dict(self):
        return {
            "id": self.id,
            "kind": "contact",
            "firstName": self.first_name,
            "lastName": self.last_name,
            "email": self.email,
            "phone": self.phone,
            "subject": self.subject,
            "message": self.message,
            "status": self.status,
            "createdAt": self.created_at,
        }

class CustomEventRequest(db.Model):
    __tablename__ = "custom_event_requests"

    id = db.Column(db.String(20), primary_key=True, default=lambda: make_reference("EVT"))
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    event_name = db.Column(db.String(200), nullable=False)
    artist = db.Column(db.String(200), default="")
    category = db.Column(db.String(120), default="")
    event_date = db.Column(db.String(20), default="")
    city = db.Column(db.String(120), default="")
    venue = db.Column(db.String(200), default="")
    ticket_quantity = db.Column(db.Integer, default=1)
    seat_preference = db.Column(db.String(120), default="")
    budget = db.Column(db.String(50), default="")
    flexibility = db.Column(db.String(20), default="flexible")
    notes = db.Column(db.Text, default="")
    status = db.Column(db.String(20), default="Pending")
    created_at = db.Column(db.String(40), default=now_iso)

    def to_dict(self):
        return {
            "id": self.id,
            "kind": "custom-event",
            "firstName": self.first_name,
            "lastName": self.last_name,
            "email": self.email,
            "phone": self.phone,
            "eventName": self.event_name,
            "artist": self.artist,
            "category": self.category,
            "eventDate": self.event_date,
            "city": self.city,
            "venue": self.venue,
            "ticketQuantity": self.ticket_quantity,
            "seatPreference": self.seat_preference,
            "budget": self.budget,
            "flexibility": self.flexibility,
            "notes": self.notes,
            "status": self.status,
            "createdAt": self.created_at,
        }
