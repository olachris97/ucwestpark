import logging

import requests
from flask import current_app

logger = logging.getLogger(__name__)


def send_admin_notification(subject: str, html: str) -> None:
    """
    Sends a notification email via Resend (https://resend.com).

    This is best-effort: if RESEND_API_KEY or ADMIN_NOTIFICATION_EMAIL isn't
    configured, or the request fails, we log it and move on rather than
    failing the request submission the person is waiting on.
    """
    api_key = current_app.config["RESEND_API_KEY"]
    to_email = current_app.config["ADMIN_NOTIFICATION_EMAIL"]
    from_email = current_app.config["RESEND_FROM_EMAIL"]

    if not api_key or not to_email:
        logger.info("Email notifications not configured — skipping (%s)", subject)
        return

    try:
        response = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "from": from_email,
                "to": [to_email],
                "subject": subject,
                "html": html,
            },
            timeout=8,
        )
        if response.status_code >= 400:
            logger.warning(
                "Resend email failed (%s): %s", response.status_code, response.text
            )
    except requests.RequestException as exc:
        logger.warning("Resend email request errored: %s", exc)


def notify_new_ticket_request(record: dict) -> None:
    html = f"""
    <h2>New ticket request</h2>
    <p><strong>{record['firstName']} {record['lastName']}</strong> requested
    tickets for <strong>{record['eventName']}</strong>.</p>
    <ul>
      <li>Reference: {record['id']}</li>
      <li>Email: {record['email']}</li>
      <li>Phone: {record['phone']}</li>
      <li>Quantity: {record['ticketQuantity']}</li>
      <li>Budget: {record.get('budget') or '—'}</li>
      <li>Notes: {record.get('notes') or '—'}</li>
    </ul>
    <p>View it in the <a href="{current_app.config.get('PUBLIC_BASE_URL', '')}">staff dashboard</a>.</p>
    """
    send_admin_notification(f"New ticket request — {record['eventName']}", html)


def notify_new_event_request(record: dict) -> None:
    html = f"""
    <h2>New custom event request</h2>
    <p><strong>{record['firstName']} {record['lastName']}</strong> is looking
    for tickets to <strong>{record['eventName']}</strong>, which isn't
    currently listed.</p>
    <ul>
      <li>Reference: {record['id']}</li>
      <li>Email: {record['email']}</li>
      <li>Phone: {record['phone']}</li>
      <li>Artist/team: {record.get('artist') or '—'}</li>
      <li>City: {record.get('city') or '—'}</li>
      <li>Quantity: {record['ticketQuantity']}</li>
      <li>Budget: {record.get('budget') or '—'}</li>
      <li>Notes: {record.get('notes') or '—'}</li>
    </ul>
    """
    send_admin_notification(f"New event request — {record['eventName']}", html)


def notify_new_contact_message(record: dict) -> None:
    html = f"""
    <h2>New contact message</h2>
    <p><strong>{record['firstName']} {record['lastName']}</strong> sent a message through the website.</p>
    <ul>
      <li>Reference: {record['id']}</li>
      <li>Email: {record['email']}</li>
      <li>Phone: {record.get('phone') or '—'}</li>
      <li>Subject: {record['subject']}</li>
    </ul>
    <p><strong>Message:</strong></p>
    <p>{record['message']}</p>
    """
    send_admin_notification(f"New contact message — {record['subject']}", html)
