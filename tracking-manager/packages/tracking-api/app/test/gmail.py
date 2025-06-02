import unittest
from app.core.s3 import s3_client


class MyTestCase(unittest.IsolatedAsyncioTestCase):
    async def test(self):
        # Sử dụng hàm

        self.assertTrue(True)

if __name__ == '__main__':
    unittest.main(verbosity=2)
