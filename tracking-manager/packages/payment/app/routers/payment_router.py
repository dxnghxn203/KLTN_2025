
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.core.response import BaseResponse
from app.entities.payment import GeneratePaymentQr
from app.models.payment import PaymentModel

router = APIRouter()

@router.post("/payment/qr")
async def generate_sepay_qr(request: GeneratePaymentQr):
    """Generate QR code using SePay"""
    try:
        qr_data = await PaymentModel.generate_sepay_qr(**request.dict())
        if not qr_data:
            return BaseResponse(status_code=404, message="not found bank")

        return StreamingResponse(
            status_code=200,
            content=iter([qr_data]),
            media_type="image/png",
            headers={
                "Content-Disposition": f'attachment; filename=sepay_qr_{request.order_id}.png'
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/payment/callback")
async def payment_callback(request: str):
    """Payment callback"""
    try:
        result = await PaymentModel.call_add_order_api(request)
        if result.status_code != 200:
            return BaseResponse(status_code=500, message=result.message)
        return BaseResponse(status_code=200, message=result.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

