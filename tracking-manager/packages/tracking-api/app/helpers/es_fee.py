from elasticsearch import helpers
from typing import List

from app.core import logger
from app.core.elasticsearch import create_index, index_data
from app.entities.fee.request import FeeReq


def get_all_fee(fees: List[FeeReq]):
    try:
        fee_records = []
        for fee in fees:
            record = {
                "route_id": fee.route.id,
                "route_code": fee.route.code,
                "vn_route": fee.route.vn_route,
                "eng_route": fee.route.eng_route,
                "pricing": [
                    {
                        "weight_less_than_equal": pricing.weight_less_than_equal,
                        "price": pricing.price,
                    }
                    for pricing in fee.pricing
                ],
                "threshold_weight": fee.additional_pricing.threshold_weight,
                "additional_price_per_step": fee.additional_pricing.additional_price_per_step,
                "step_weight": fee.additional_pricing.step_weight,
            }
            fee_records.append(record)
        return fee_records
    except Exception as e:
        logger.error("Failed to process fee records:", error=e)
        return []


async def insert_es_fee(fee_data, index):
    try:
        await create_index(index)

        index_data(index, get_all_fee(fee_data))
        print(f"{index} inserted successfully")
    except helpers.BulkIndexError as e:
        print("Bulk indexing error:", e)
        for error in e.errors:
            print(error)