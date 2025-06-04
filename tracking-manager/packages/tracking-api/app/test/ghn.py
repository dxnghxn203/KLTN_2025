import unittest
from app.core import ghn, logger
from app.entities.time.request import TimeGHNReq
from app.models import time, location, fee, order
from app.entities.fee.request import FeeGHNReq
from app.entities.order.request import  ShippingOrderGHN
import pandas as pd
import json
import asyncio
import re
import json
import asyncio


# def escape_unescaped_quotes_in_field(json_str, field_name):
#     # Regex tìm tất cả các giá trị của WardName mà chứa dấu " không được escape
#     pattern = fr'("{field_name}"\s*:\s*")([^"]*?)(?<!\\)"([^"]*?)(")'
#
#     def replacer(match):
#         return f'{match[1]}{match[2]}\\\"{match[3]}{match[4]}'
#
#     # Lặp cho đến khi không còn lỗi
#     while re.search(pattern, json_str):
#         json_str = re.sub(pattern, replacer, json_str)
#
#     return json_str
#
# def remove_quotes_in_field(json_str: str, field_name: str) -> str:
#     # Tìm đúng field cần xử lý
#     pattern = fr'("{field_name}"\s*:\s*")([^"]*?)"(.*?)(")'
#
#     def replacer(match):
#         # match[2] là phần trước dấu " cần xóa
#         # match[3] là phần sau dấu " cần xóa
#         cleaned_value = (match[2] + match[3]).replace('"', '')
#         return f'{match[1]}{cleaned_value}{match[4]}'
#
#     # Lặp cho đến khi không còn lỗi
#     while re.search(pattern, json_str):
#         json_str = re.sub(pattern, replacer, json_str)
#
#     return json_str
#
# async def safe_parse_provinces(raw_province_data: str):
#     try:
#         data = json.loads(raw_province_data)
#         provinces = data.get("data", [])
#         return provinces
#     except json.JSONDecodeError:
#         # Nếu lỗi, thay NameExtension lỗi thành rỗng
#         fixed_str = re.sub(r'"NameExtension"\s*:\s*\[[^\]]*\]', '"NameExtension": []', raw_province_data)
#         try:
#             data = json.loads(fixed_str)
#             provinces = data.get("data", [])
#             return provinces
#         except Exception as e:
#             print(f"Failed to parse provinces: {e}")
#             return []
#
# async def safe_parse_districts(raw_district_data):
#     try:
#         data = json.loads(raw_district_data)
#         districts = data.get("data", [])
#         return districts
#     except json.JSONDecodeError:
#         fixed_str = raw_district_data
#         # fixed_str = escape_unescaped_quotes_in_field(fixed_str, "DistrictName")
#         fixed_str = remove_quotes_in_field(fixed_str, "DistrictName")
#         fixed_str = re.sub(r'"NameExtension"\s*:\s*\[[^\]]*\]', '"NameExtension": []', fixed_str)
#         try:
#             data = json.loads(fixed_str)
#             districts = data.get("data", [])
#             return districts
#         except Exception as e:
#             print(fixed_str)
#             print(f"Failed to parse districts: {e}")
#             return []
#
# async def safe_parse_wards(raw_ward_data):
#     try:
#         data = json.loads(raw_ward_data)
#         wards = data.get("data", [])
#         return wards
#     except json.JSONDecodeError:
#         fixed_str = raw_ward_data
#         # fixed_str = escape_unescaped_quotes_in_field(fixed_str, "WardName")
#         fixed_str = remove_quotes_in_field(fixed_str, "WardName")
#         fixed_str = re.sub(r'"NameExtension"\s*:\s*\[[^\]]*\]', '"NameExtension": []', fixed_str)
#         try:
#             data = json.loads(fixed_str)
#             wards = data.get("data", [])
#             return wards
#         except Exception as e:
#             print(fixed_str)
#             print(f"Failed to parse wards: {e}")
#             return []

class MyTestCase(unittest.IsolatedAsyncioTestCase):
    async def test(self):
        # Sử dụng hàm
        # data = location.get_provinces_ghn()
        # data = location.get_districts_ghn(268)
        # data = location.get_wards_ghn(2219)

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

        data_create = ShippingOrderGHN(
            ** {
                "payment_type_id": 2,
                "note": "Tintest 123",
                "required_note": "KHONGCHOXEMHANG",
                "return_phone": "0332190158",
                "return_address": "39 NTT",
                "return_district_id": None,
                "return_ward_code": "",
                "client_order_code": "",
                "from_name": "TinTest124",
                "from_phone": "0987654321",
                "from_address": "72 Thành Thái, Phường 14, Quận 10, Hồ Chí Minh, Vietnam",
                "from_ward_name": "Phường 14",
                "from_district_name": "Quận 10",
                "from_province_name": "HCM",
                "to_name": "TinTest124",
                "to_phone": "0987654321",
                "to_address": "72 Thành Thái, Phường 14, Quận 10, Hồ Chí Minh, Vietnam",
                "to_ward_name": "Phường 14",
                "to_district_name": "Quận 10",
                "to_province_name": "HCM",
                "cod_amount": 200000,
                "content": "Theo New York Times",
                "length": 12,
                "width": 12,
                "height": 12,
                "weight": 1200,
                "cod_failed_amount": 2000,
                "pick_station_id": 1444,
                "deliver_station_id": None,
                "insurance_value": 0,
                "service_type_id": 2,
                "coupon": None,
                "pickup_time": 1692840132,
                "pick_shift": [2],
                "items": [
                {
                    "name": "Áo Polo",
                    "code": "Polo123",
                    "quantity": 1,
                    "price": 200000,
                    "length": 12,
                    "width": 12,
                    "height": 12,
                    "weight": 1200,
                    "category":
                    {
                        "level1": "Áo"
                    }
                }]
            }
        )
        data = order.create_order_ghn(data_create)

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
        print(data)
        self.assertTrue(True)

    async def test_location(self):
        # try:
        #     with open('locations_ghn.json', 'r', encoding='utf-8') as f:
        #         ghn_data = json.load(f)
        #     all_data = []
        #
        #     raw_province_data = location.get_provinces_ghn()
        #     provinces_data = await safe_parse_provinces(raw_province_data)
        #
        #     for province in provinces_data:
        #         province_id = province.get("ProvinceID")
        #         province_name = province.get("ProvinceName")
        #         province_name_extension = province.get("NameExtension")
        #
        #         province_dict = {
        #             "province_id": province_id,
        #             "province_name": province_name,
        #             "province_name_extension": province_name_extension,
        #             "districts": []
        #         }
        #
        #         saved_province = next((p for p in ghn_data if p["province_id"] == province_id), None)
        #
        #         if saved_province and saved_province.get("districts"):
        #             province_dict["districts"] = []
        #
        #             for saved_district in saved_province["districts"]:
        #                 district_id = saved_district.get("district_id")
        #                 district_name = saved_district.get("district_name")
        #                 district_name_extension = saved_district.get("district_name_extension")
        #
        #                 raw_ward_data = location.get_wards_ghn(district_id)
        #                 await asyncio.sleep(0.1)
        #                 wards_data = await safe_parse_wards(raw_ward_data)
        #
        #                 district_dict = {
        #                     "district_id": district_id,
        #                     "district_name": district_name,
        #                     "district_name_extension": district_name_extension,
        #                     "wards": wards_data
        #                 }
        #
        #                 province_dict["districts"].append(district_dict)
        #
        #         else:
        #             raw_district_data = location.get_districts_ghn(province_id)
        #             await asyncio.sleep(0.1)
        #             districts_data = await safe_parse_districts(raw_district_data)
        #
        #             for district in districts_data:
        #                 district_id = district.get("DistrictID")
        #                 district_name = district.get("DistrictName")
        #                 district_name_extension = district.get("NameExtension") or ""
        #
        #                 raw_ward_data = location.get_wards_ghn(district_id)
        #                 await asyncio.sleep(0.1)
        #                 wards_data = await safe_parse_wards(raw_ward_data)
        #
        #                 district_dict = {
        #                     "district_id": district_id,
        #                     "district_name": district_name,
        #                     "district_name_extension": district_name_extension,
        #                     "wards": wards_data
        #                 }
        #
        #                 province_dict["districts"].append(district_dict)
        #
        #         all_data.append(province_dict)
        #
        #     with open("locations_ghn.json", "w", encoding="utf-8") as f:
        #         json.dump(all_data, f, ensure_ascii=False, indent=2)
        #
        #     self.assertTrue(len(all_data) > 0)
        #
        # except Exception as e:
        #     logger.error(f"Failed [test_location]: {e}")
        #     raise e
        self.assertTrue(True)

if __name__ == '__main__':
    unittest.main(verbosity=2)
