# email_sender.py (Phiên bản đã chỉnh sửa)
import aiosmtplib
from email.message import EmailMessage
from app.core.config import settings # Đảm bảo dòng này tồn tại và đúng

async def send_email(to_email: str, subject: str, html_content: str):
    # Tạo email message
    message = EmailMessage()
    message["From"] = f"{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM}>"
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(html_content, subtype="html")  # HTML content

    # Gửi email async bằng aiosmtplib
    await aiosmtplib.send(
        message,
        hostname=settings.SMTP_SERVER,
        port=settings.SMTP_PORT,
        username=settings.SMTP_USER,
        password=settings.SMTP_PASSWORD,
        start_tls=True
    )