import qrcode
from io import BytesIO
from app.entities.bank import Bank
from app.core.bank_utils import get_qr_format

def generate_bank_qr(order_id: str, bank_id: Bank, amount: float = 0) -> BytesIO:
    qr_format = get_qr_format(bank_id.value)
    if not qr_format:
        raise ValueError(f"Unsupported or inactive bank: {bank_id}")

    qr_data = qr_format.format(order_id=order_id, amount=amount)
    
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img_bytes = BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    
    return img_bytes
