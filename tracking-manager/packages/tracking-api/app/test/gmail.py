import unittest
from app.core.s3 import s3_client, list_all_objects


class MyTestCase(unittest.IsolatedAsyncioTestCase):
    async def test(self):
        # Sử dụng hàm
        list_all_objects("kltn2025")

        self.assertTrue(True)

if __name__ == '__main__':
    unittest.main(verbosity=2)
