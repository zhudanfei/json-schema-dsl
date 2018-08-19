# -*- coding: utf-8 -*-

import datetime
import time

from schema_dsl_common import *

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
    timestamp =  int(timestamp_float + 0.5) - time.timezone
    long_timestamp = timestamp * 1000 + dt.microsecond /1000
    return long_timestamp


def not_null(value, path):
    if value is None:
        raise ValueError(get_message(path, 'Cannot be null'))
    return value


def trim(value, path):
    if value is None:
        return None
    return value.strip()


def max_length(length):
    def f(value, path):
        if value is None:
            return None
        if len(value) > length:
            raise ValueError(get_message(path, 'String is too long'))
        return value
    return f


def min_length(length):
    def f(value, path):
        if value is None:
            return None
        if len(value) < length:
            raise ValueError(get_message(path, 'String is too short'))
        return value
    return f


def length_range(low, high):
    def f(value, path):
        if value is None:
            return None
        if len(value) < low:
            raise ValueError(get_message(path, 'String is too short'))
        if len(value) > high:
            raise ValueError(get_message(path, 'String is too long'))
        return value
    return f


def only(*options):
    option_set = set(options)
    def f(value, path):
        if value is None:
            return None
        if value not in option_set:
            raise ValueError(get_message(path, 'Invalid value'))
        return value
    return f


def range(low, high):
    def f(value, path):
        if value is None:
            return None
        if value < low:
            raise ValueError(get_message(path, 'Value is too small'))
        if value > high:
            raise ValueError(get_message(path, 'Value is too large'))
        return value
    return f
