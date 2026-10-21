import html as html_lib
import logging

import requests
from flask import current_app

logger = logging.getLogger(__name__)

# Every request submitted on the website is emailed here unless the
# ADMIN_NOTIFICATION_EMAIL environment variable overrides it.
DEFAULT_ADMIN_EMAIL = "admin@ucwestpark.com"


def _esc(value) -> str:
    """Escape user-submitted text so it can't inject HTML into the email."""
    if value is None or str(value).strip() == "":
        return "—"
    return html_lib.escape(str(value))


def send_admin_notification(subject: str, html: str, reply_to: str | None = None) -> None:
    """
    Sends a notification email to the UCwestpark admin inbox via Resend
    (https://resend.com).

    This is best-effort: if RESEND_API_KEY isn't configured, or the request
    fails, we log it and move on rather than failing the submission the
    person is waiting on. The request is always saved in the database and
    visible in the staff dashboard either way.
    """
    api_key = current_app.config.get("RESEND_API_KEY", "")
    to_email = (current_app.config.get("ADMIN_NOTIFICATION_EMAIL") or DEFAULT_ADMIN_EMAIL).strip()
    from_email = current_app.config["RESEND_FROM_EMAIL"]

    if not api_key:
        logger.warning(
            "RESEND_API_KEY is not set — email to %s skipped (%s)", to_email, subject
        )
        return

    payload = {
        "from": from_email,
        "to": [to_email],
        "subject": subject,
        "html": html,
    }
    # Lets the admin hit "Reply" and answer the customer directly.
    if reply_to:
        payload["reply_to"] = reply_to

    try:
        response = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=8,
        )
        if response.status_code >= 400:
            logger.warning(
                "Resend email to %s failed (%s): %s",
                to_email,
                response.status_code,
                response.text,
            )
        else:
            logger.info("Notification sent to %s (%s)", to_email, subject)
    except requests.RequestException as exc:
        logger.warning("Resend email request errored: %s", exc)


def _dashboard_link() -> str:
    base = (current_app.config.get("PUBLIC_BASE_URL") or "").rstrip("/")
    if not base:
        return ""
    return f'<p>View it in the <a href="{html_lib.escape(base)}/admin">staff dashboard</a>.</p>'


def notify_new_ticket_request(record: dict) -> None:
    """Parking request submitted from the Request Parking form."""
    name = f"{record.get('firstName', '')} {record.get('lastName', '')}".strip()
    html = f"""
    <h2>New parking request</h2>
    <p><strong>{_esc(name)}</strong> requested parking for
    <strong>{_esc(record.get('eventName'))}</strong>.</p>
    <ul>
      <li>Reference: {_esc(record.get('id'))}</li>
      <li>Email: {_esc(record.get('email'))}</li>
      <li>Phone: {_esc(record.get('phone'))}</li>
      <li>Venue / location: {_esc(record.get('location'))}</li>
      <li>Event date: {_esc(record.get('eventDate'))}</li>
      <li>Number of spots: {_esc(record.get('ticketQuantity'))}</li>
      <li>Flexibility: {_esc(record.get('seatPreference'))}</li>
      <li>Parking preference: {_esc(record.get('seatDetails'))}</li>
      <li>Budget: {_esc(record.get('budget'))}</li>
      <li>Notes: {_esc(record.get('notes'))}</li>
    </ul>
    {_dashboard_link()}
    """
    send_admin_notification(
        f"New parking request — {record.get('eventName') or 'UCwestpark'}",
        html,
        reply_to=record.get("email"),
    )


def notify_new_event_request(record: dict) -> None:
    """Request for parking at an event/venue that isn't listed."""
    name = f"{record.get('firstName', '')} {record.get('lastName', '')}".strip()
    html = f"""
    <h2>New unlisted event request</h2>
    <p><strong>{_esc(name)}</strong> is looking for parking for
    <strong>{_esc(record.get('eventName'))}</strong>, which isn't currently listed.</p>
    <ul>
      <li>Reference: {_esc(record.get('id'))}</li>
      <li>Email: {_esc(record.get('email'))}</li>
      <li>Phone: {_esc(record.get('phone'))}</li>
      <li>Venue: {_esc(record.get('venue'))}</li>
      <li>City: {_esc(record.get('city'))}</li>
      <li>Event date: {_esc(record.get('eventDate'))}</li>
      <li>Number of spots: {_esc(record.get('ticketQuantity'))}</li>
      <li>Budget: {_esc(record.get('budget'))}</li>
      <li>Notes: {_esc(record.get('notes'))}</li>
    </ul>
    {_dashboard_link()}
    """
    send_admin_notification(
        f"New event request — {record.get('eventName') or 'UCwestpark'}",
        html,
        reply_to=record.get("email"),
    )


def notify_new_contact_message(record: dict) -> None:
    """Message sent from the Contact & Support page."""
    name = f"{record.get('firstName', '')} {record.get('lastName', '')}".strip()
    message = _esc(record.get("message")).replace("\n", "<br>")
    html = f"""
    <h2>New contact message</h2>
    <p><strong>{_esc(name)}</strong> sent a message through the website.</p>
    <ul>
      <li>Reference: {_esc(record.get('id'))}</li>
      <li>Email: {_esc(record.get('email'))}</li>
      <li>Phone: {_esc(record.get('phone'))}</li>
      <li>Subject: {_esc(record.get('subject'))}</li>
    </ul>
    <p><strong>Message:</strong></p>
    <p>{message}</p>
    {_dashboard_link()}
    """
    send_admin_notification(
        f"New contact message — {record.get('subject') or 'UCwestpark'}",
        html,
        reply_to=record.get("email"),
    )