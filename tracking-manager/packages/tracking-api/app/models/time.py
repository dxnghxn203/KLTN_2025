from datetime import datetime, timedelta, timezone
from typing import Union

from starlette.status import HTTP_400_BAD_REQUEST

from app.core import logger
from app.core import response
from app.helpers.constant import TIME_INDEX
from app.helpers.es_helpers import insert_es_common, delete_index, query_es_data, search_es


async def insert_time_into_elasticsearch():
    await insert_es_common(TIME_INDEX, 'time.json')

async def delete_time():
    delete_index(TIME_INDEX)

async def get_time():
    data = await query_es_data(TIME_INDEX, {"query": {"match_all": {}}, "size": 1000})
    return response.SuccessResponse(data=data)

async def get_range_time(route_code: str) -> Union[str, response.JsonException]:
    result = await search_es(TIME_INDEX, {"route_code": route_code})
    if isinstance(result, response.JsonException):
        return result

    range_time = result.get("range_time")
    logger.info(f"Range time of {TIME_INDEX}: {range_time}")

    if range_time is None:
        raise response.JsonException(
            status_code=HTTP_400_BAD_REQUEST,
            message="Không tìm thấy thời gian giao hàng"
        )
    if not isinstance(range_time, (float, int)):
        raise response.JsonException(
            status_code=HTTP_400_BAD_REQUEST,
            message="Dữ liệu thời gian giao hàng không hợp lệ"
        )

    days = int(range_time)
    seconds = (range_time % 1) * 86400
    delivery_time = (datetime.utcnow() + timedelta(days=days, seconds=seconds, hours=7)).replace(tzinfo=timezone.utc)

    return delivery_time.isoformat()