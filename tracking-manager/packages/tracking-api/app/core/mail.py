import hashlib
import os
import time
from urllib.parse import urlencode

import resend

from app.core import logger

resend.api_key=os.getenv("MAIL_API_KEY")

def send_otp_email(email: str, otp_code: str) -> bool:

    try:
        response = resend.Emails.send({
            "from": "onboarding@resend.dev",  # Dùng domain mặc định
            "to": [email],
            "subject": "Your OTP Code",
            "html": f"<h3>Your OTP Code is: <strong>{otp_code}</strong></h3><p>This code is valid for 5 minutes.</p>"
        })

        logger.info(f"OTP {otp_code} sent to {email}")
        return True
    except Exception as e:
        logger.error(f"Error sending OTP: {str(e)}")
        return False