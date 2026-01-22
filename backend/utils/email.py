import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

EMAIL_FROM = os.getenv("EMAIL_FROM")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
EMAIL_TO = os.getenv("EMAIL_TO")

def send_contact_email(
    subject: str,
    body: str,
    reply_to: str
):
    msg = MIMEMultipart()
    msg["From"] = EMAIL_FROM              # ✅ must be your Gmail
    msg["To"] = EMAIL_TO                  # ✅ admin email
    msg["Subject"] = subject
    msg["Reply-To"] = reply_to            # ✅ USER EMAIL SHOWN HERE

    msg.attach(MIMEText(body, "html"))

    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    server.login(EMAIL_FROM, EMAIL_PASSWORD)
    server.send_message(msg)
    server.quit()
