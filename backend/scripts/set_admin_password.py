"""
Set or reset an admin user's password directly in the database.

Why this exists: the app only auto-creates the admin account once, the
first time the server ever runs. Changing ADMIN_USERNAME/ADMIN_PASSWORD
in your environment afterward has no effect on an account that already
exists — this script is how you actually change it (or add a second
admin account) after the fact.

Usage:
    python scripts/set_admin_password.py <username> <new-password>

Example:
    python scripts/set_admin_password.py admin "My-New-Password-123"

On Render: run this from the "Shell" tab on your service (it already has
your production environment and database available), from the backend
root:
    python scripts/set_admin_password.py admin "My-New-Password-123"
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.extensions import db
from app.models import AdminUser


def main():
    if len(sys.argv) != 3:
        print("Usage: python scripts/set_admin_password.py <username> <new-password>")
        sys.exit(1)

    username, new_password = sys.argv[1], sys.argv[2]

    if len(new_password) < 8:
        print("Choose a password with at least 8 characters.")
        sys.exit(1)

    app = create_app()
    with app.app_context():
        user = AdminUser.query.filter_by(username=username).first()
        if user:
            user.set_password(new_password)
            action = "updated"
        else:
            user = AdminUser(username=username)
            user.set_password(new_password)
            db.session.add(user)
            action = "created"
        db.session.commit()
        print(f"Password {action} for admin user '{username}'.")


if __name__ == "__main__":
    main()
