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
        # Lightweight schema upgrade for existing deployments. db.create_all()
        # does not add columns to an already-created events table, so add the
        # new coordinates safely when upgrading an existing database.
        columns = {c["name"] for c in inspect(db.engine).get_columns("events")}
        if "latitude" not in columns:
            db.session.execute(text("ALTER TABLE events ADD COLUMN latitude FLOAT"))
        if "longitude" not in columns:
            db.session.execute(text("ALTER TABLE events ADD COLUMN longitude FLOAT"))

        # Backfill coordinates for the built-in events when upgrading an
        # existing database. This is idempotent and only fills missing values.
        venue_coordinates = {
            "super-bowl-lxi": (36.0909, -115.1830),
            "beyonce-renaissance-live": (25.9580, -80.2389),
            "coachella-2027": (33.6803, -116.2375),
            "nba-finals-game-4": (37.7680, -122.3877),
            "hamilton-national-tour": (34.0455, -118.2551),
            "kevin-hart-acting-my-age": (40.7505, -73.9934),
            "cowboys-vs-eagles-snf": (32.7473, -97.0945),
            "cirque-du-soleil-nova": (36.1360, -115.1639),
            "us-open-mens-semifinal": (40.7498, -73.8456),
            "sundance-opening-night": (40.6468, -111.4978),
            "the-lion-king-musical": (34.1016, -118.3257),
            "austin-city-limits": (30.2669, -97.7729),
        }
        for slug, (latitude, longitude) in venue_coordinates.items():
            event = Event.query.filter_by(slug=slug).first()
            if event:
                if event.latitude is None:
                    event.latitude = latitude
                if event.longitude is None:
                    event.longitude = longitude

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
