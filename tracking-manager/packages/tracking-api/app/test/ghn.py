import unittest
from app.core import ghn, logger
from app.entities.time.request import TimeGHNReq
from app.models import time, location, fee, order
from app.entities.fee.request import FeeGHNReq
from app.entities.order.request import  ShippingOrderGHN

class MyTestCase(unittest.IsolatedAsyncioTestCase):
    async def test(self):
        # Sử dụng hàm
        # data = location.get_provinces_ghn()
        # data = location.get_districts_ghn(268)
        # data = location.get_wards_ghn(3451)

        # shipping_data = FeeGHNReq(**{
        #     "service_type_id":2,
        #     "from_district_id":3695,
        #     "from_ward_code": "90768",
        #     "to_district_id":1533,
        #     "to_ward_code":"22007",
        #     "length":30,
        #     "width":40,
        #     "height":20,
        #     "weight":3000,
        #     "insurance_value":0,
        #     "coupon": None,
        #     "items": [
        #     {
        #         "name": "TEST1",
        #         "quantity": 1,
        #         "length": 200,
        #         "width": 200,
        #         "height": 200,
        #         "weight": 1000
        #     }]
        # })
        # data = fee.get_fee_ghn(shipping_data)

        # data_create = ShippingOrderGHN(
        #     ** {
        #         "payment_type_id": 2,
        #         "note": "Tintest 123",
        #         "required_note": "KHONGCHOXEMHANG",
        #         "return_phone": "0332190158",
        #         "return_address": "39 NTT",
        #         "return_district_id": None,
        #         "return_ward_code": "",
        #         "client_order_code": "",
        #         "from_name": "TinTest124",
        #         "from_phone": "0987654321",
        #         "from_address": "72 Thành Thái, Phường 14, Quận 10, Hồ Chí Minh, Vietnam",
        #         "from_ward_name": "Phường 14",
        #         "from_district_name": "Quận 10",
        #         "from_province_name": "HCM",
        #         "to_name": "TinTest124",
        #         "to_phone": "0987654321",
        #         "to_address": "72 Thành Thái, Phường 14, Quận 10, Hồ Chí Minh, Vietnam",
        #         "to_ward_name": "Phường 14",
        #         "to_district_name": "Quận 10",
        #         "to_province_name": "HCM",
        #         "cod_amount": 200000,
        #         "content": "Theo New York Times",
        #         "length": 12,
        #         "width": 12,
        #         "height": 12,
        #         "weight": 1200,
        #         "cod_failed_amount": 2000,
        #         "pick_station_id": 1444,
        #         "deliver_station_id": None,
        #         "insurance_value": 0,
        #         "service_type_id": 2,
        #         "coupon": None,
        #         "pickup_time": 1692840132,
        #         "pick_shift": [2],
        #         "items": [
        #         {
        #             "name": "Áo Polo",
        #             "code": "Polo123",
        #             "quantity": 1,
        #             "price": 200000,
        #             "length": 12,
        #             "width": 12,
        #             "height": 12,
        #             "weight": 1200,
        #             "category":
        #             {
        #                 "level1": "Áo"
        #             }
        #         }]
        #     }
        # )
        # data = order.create_order_ghn(data_create)

        # {
        #     "service_id": 53320,
        #     "short_name": "Hàng nhẹ",
        #     "service_type_id": 2,
        #     "config_fee_id": "",
        #     "extra_cost_id": "",
        #     "standard_config_fee_id": "",
        #     "standard_extra_cost_id": "",
        #     "ecom_config_fee_id": 684,
        #     "ecom_extra_cost_id": 103,
        #     "ecom_standard_config_fee_id": 684,
        #     "ecom_standard_extra_cost_id": 103
        # },
        # {
        #     "service_id": 100039,
        #     "short_name": "Hàng nặng",
        #     "service_type_id": 5,
        #     "config_fee_id": "677b7e6aa3b1437b3a7e4862",
        #     "extra_cost_id": "65dedfd6b5bd2050b45c0ddf",
        #     "standard_config_fee_id": "677b7e6aa3b1437b3a7e4862",
        #     "standard_extra_cost_id": "65dedfd6b5bd2050b45c0ddf",
        #     "ecom_config_fee_id": 0,
        #     "ecom_extra_cost_id": 0,
        #     "ecom_standard_config_fee_id": 0,
        #     "ecom_standard_extra_cost_id": 0
        # }
        # data = time.get_delivery_time_ghn(TimeGHNReq(**{
        #     "from_district_id": 3695,
        #     "from_ward_code": "90768",
        #     "to_district_id":1533,
        #     "to_ward_code":"22007",
        #     "service_id": 53320 # nhẹ
        # }))
        # logger.info(data)
        self.assertTrue(True)

if __name__ == '__main__':
    unittest.main(verbosity=2)
