import datetime
import time

from .schema_dsl_common import *

JSON_TIME_FORMAT = '%Y-%m-%dT%H:%M:%S.%fZ'


def to_datetime(value, path):
    if value is None:
        return None
    try:
        return datetime.datetime.strptime(value, JSON_TIME_FORMAT)
    except ValueError as e:
        raise ValueError(get_message(path, 'Invalid value'))


def to_timestamp(value, path):
    dt = to_datetime(value, path)
    if dt is None:
        return None
    timestamp_float = time.mktime(dt.timetuple())
    timestamp = int(timestamp_float + 0.5) - time.timezone
    long_timestamp = timestamp * 1000 + dt.microsecond / 1000
    return long_timestamp


def trim(value, path):
    if value is None:
        return None
    return value.strip()


def to_string(value, path):
    if value is None:
        return None
    return str(value)


ToTimestamp = SchemaFilter('filter', 'ToTimestamp', to_timestamp)
Trim = SchemaFilter('filter', 'Trim', trim)
ToString = SchemaFilter('filter', 'ToString', to_string)
