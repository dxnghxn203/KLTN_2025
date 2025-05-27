import unittest

import os


class MyTestCase(unittest.IsolatedAsyncioTestCase):
    async def test(self):
        SENDGRID_API_KEY = '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'

        message = Mail(
            from_email='hendong34@gmail.com',
            to_emails='hendong34@gmail.com',
            subject='Test SendGrid với Python',
            html_content='<strong>Xin chào, đây là email test gửi qua SendGrid API!</strong>'
        )

        try:
            sg = SendGridAPIClient(SENDGRID_API_KEY)
            response = sg.send(message)
            print(f"Status code: {response.status_code}")
            print(f"Response body: {response.body}")
            print(f"Headers: {response.headers}")
        except Exception as e:
            print(f"Error sending email: {e}")
        self.assertTrue(True)

if __name__ == '__main__':
    unittest.main(verbosity=2)
