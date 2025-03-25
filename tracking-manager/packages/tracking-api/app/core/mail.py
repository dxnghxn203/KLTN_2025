import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core import logger

GMAIL_USER=os.getenv("GMAIL_USER")
GMAIL_PASSWORD=os.getenv("GMAIL_PASS")

def send_otp_email(email: str, otp_code: str) -> bool:

    try:
        subject = "Your OTP Code"
        html_content = f"""
                <html>
                <body>
                    <h3>Your OTP Code is: <strong>{otp_code}</strong></h3>
                    <p>This code is valid for 5 minutes.</p>
                </body>
                </html>
                """

        msg = MIMEMultipart()
        msg["From"] = GMAIL_USER
        msg["To"] = email
        msg["Subject"] = subject
        msg.attach(MIMEText(html_content, "html"))

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(GMAIL_USER, GMAIL_PASSWORD)
        server.sendmail(GMAIL_USER, email, msg.as_string())
        server.quit()
        logger.info(f"OTP sent to {email}")
        return True
    except Exception as e:
        logger.error(f"Error sending OTP: {str(e)}")
        return False