
from typing import Optional

from app.core.bank_utils import get_bank_by_code
from app.core.sepay import SepayQR, logger


class PaymentModel:
    @staticmethod
    async def generate_sepay_qr(
        bank_id: str,
        order_id: str,
        amount: float 
    ) -> Optional[bytes]:
        bank = get_bank_by_code(bank_id)
        if not bank:
            logger.error(f"Bank not found: {bank_id}")
            return None
        return await SepayQR.generate_qr(
            account=bank['account_number'],
            bank=bank_id,
            amount=amount,
            description="description",
            template="template",
            download=False
        )
