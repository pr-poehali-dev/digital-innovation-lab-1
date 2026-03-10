import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Принимает заявку с сайта и отправляет письмо на почту менеджера."""

    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
    except Exception:
        return {"statusCode": 400, "headers": cors_headers, "body": json.dumps({"error": "Invalid JSON"})}

    name = body.get("name", "").strip()
    phone = body.get("phone", "").strip()
    email = body.get("email", "").strip()
    service = body.get("service", "").strip()
    comment = body.get("comment", "").strip()

    if not name or not phone or not service:
        return {"statusCode": 400, "headers": cors_headers, "body": json.dumps({"error": "Missing required fields"})}

    smtp_host = os.environ['smtp.yandex.ru']
    smtp_port = int(os.environ[465])
    smtp_user = os.environ['oleg.zhilka@yandex.ru']
    smtp_password = os.environ["bkqufcrqakeyhfly"]
    notify_email = os.environ['oleg.zhilka@yandex.ru']

    print(f"[DEBUG] smtp_host={smtp_host} smtp_port={smtp_port} smtp_user={smtp_user} user_len={len(smtp_user)} pass_len={len(smtp_password)}")

    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FAFAF8; border: 1px solid #e8e6e0;">
        <h2 style="font-size: 24px; font-weight: 400; color: #1a1a1a; margin: 0 0 24px 0; border-bottom: 1px solid #e8e6e0; padding-bottom: 16px;">
            Новая заявка с сайта
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 10px 0; color: #9a9590; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 120px;">Услуга</td>
                <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">{service}</td>
            </tr>
            <tr style="border-top: 1px solid #e8e6e0;">
                <td style="padding: 10px 0; color: #9a9590; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Имя</td>
                <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px;">{name}</td>
            </tr>
            <tr style="border-top: 1px solid #e8e6e0;">
                <td style="padding: 10px 0; color: #9a9590; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Телефон</td>
                <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px;">{phone}</td>
            </tr>
            {"" if not email else f'<tr style="border-top: 1px solid #e8e6e0;"><td style="padding: 10px 0; color: #9a9590; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</td><td style="padding: 10px 0; color: #1a1a1a; font-size: 14px;">{email}</td></tr>'}
            {"" if not comment else f'<tr style="border-top: 1px solid #e8e6e0;"><td style="padding: 10px 0; color: #9a9590; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Комментарий</td><td style="padding: 10px 0; color: #1a1a1a; font-size: 14px;">{comment}</td></tr>'}
        </table>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Новая заявка: {service}"
    msg["From"] = smtp_user
    msg["To"] = notify_email
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, notify_email, msg.as_string())

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"success": True}),
    }