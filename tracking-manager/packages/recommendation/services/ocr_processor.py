import os
import tempfile
from typing import Union, List, Optional
from pathlib import Path
import subprocess

# Sử dụng logger đã cấu hình
from core import logger

# Kiểm tra Tesseract có sẵn không
TESSERACT_AVAILABLE = False
try:
    import cv2
    import pytesseract
    from PIL import Image
    import numpy as np

    # Thử gọi tesseract để kiểm tra
    subprocess.check_output(['tesseract', '--version'])
    TESSERACT_AVAILABLE = True
except (ImportError, subprocess.SubprocessError, FileNotFoundError):
    pass


def is_tesseract_available() -> bool:
    """Kiểm tra xem Tesseract OCR có khả dụng không"""
    return TESSERACT_AVAILABLE


def preprocess_image(image_path: Union[str, Path]) -> np.ndarray:
    """Tiền xử lý hình ảnh để cải thiện kết quả OCR"""
    if not TESSERACT_AVAILABLE:
        return None

    img = cv2.imread(str(image_path))

    # Chuyển sang grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Khử nhiễu
    blur = cv2.GaussianBlur(gray, (5, 5), 0)

    # Tăng độ tương phản
    _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Giãn ảnh để tăng độ rõ ký tự
    kernel = np.ones((1, 1), np.uint8)
    dilated = cv2.dilate(thresh, kernel, iterations=1)

    # Lọc nhiễu sau khi giãn
    eroded = cv2.erode(dilated, kernel, iterations=1)

    return eroded


def extract_text_from_image(image_path: Union[str, Path], preprocess: bool = True) -> str:
    """
    Trích xuất văn bản từ hình ảnh sử dụng Tesseract OCR.
    Trả về chuỗi trống nếu Tesseract không khả dụng.
    """
    if not TESSERACT_AVAILABLE:
        logger.warn("Tesseract OCR không khả dụng. Bỏ qua bước OCR.")
        return ""

    try:
        config = r'--oem 3 --psm 6 -l vie'

        # Tiền xử lý hình ảnh nếu được yêu cầu
        if preprocess:
            processed_img = preprocess_image(image_path)

            # Lưu ảnh đã xử lý vào file tạm thời
            with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp:
                cv2.imwrite(temp.name, processed_img)
                temp_path = temp.name

            # Thực hiện OCR trên ảnh đã xử lý
            text = pytesseract.image_to_string(Image.open(temp_path), config=config)

            # Xóa file tạm
            os.unlink(temp_path)
        else:
            # OCR trực tiếp không qua tiền xử lý
            text = pytesseract.image_to_string(Image.open(image_path), config=config)

        return text

    except Exception as e:
        logger.error(f"OCR error for {image_path}: {str(e)}")
        return ""


def detect_layout_type(text: str) -> str:
    """
    Phân loại tài liệu là đơn thuốc hay hóa đơn dựa trên từ khóa.
    Nếu text trống, mặc định là đơn thuốc.
    """
    if not text:
        logger.info("Không có text OCR để phân loại. Mặc định là đơn thuốc.")
        return "prescription"

    # Danh sách từ khóa đặc trưng cho đơn thuốc
    prescription_keywords = [
        "đơn thuốc", "kê đơn", "chẩn đoán", "liều dùng", "ngày uống",
        "bác sĩ", "điều trị", "cách dùng", "bệnh nhân", "khám bệnh"
    ]

    # Danh sách từ khóa đặc trưng cho hóa đơn
    invoice_keywords = [
        "hóa đơn", "thanh toán", "tổng tiền", "thành tiền", "đơn giá",
        "số lượng", "chiết khấu", "vat", "thuế", "nhà thuốc"
    ]

    # Đếm số từ khóa khớp cho mỗi loại
    prescription_matches = sum(1 for kw in prescription_keywords if kw.lower() in text.lower())
    invoice_matches = sum(1 for kw in invoice_keywords if kw.lower() in text.lower())

    # Phân loại dựa trên số từ khóa khớp
    if prescription_matches > invoice_matches:
        return "prescription"
    elif invoice_matches > prescription_matches:
        return "invoice"
    else:
        # Mặc định là đơn thuốc nếu không xác định được
        return "prescription"