from .schema_dsl_common import *


def any_type(value, path):
    return value


def string_type(value, path):
    path = path or []
    if value is None:
        return None
    if not isinstance(value, str):
        raise TypeError(get_message(path, 'Should be a string'))
    return value


def integer_type(value, path):
    path = path or []
    if value is None:
        return None
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(get_message(path, 'Should be an integer'))
    return value


def number_type(value, path):
    path = path or []
    if value is None:
        return None
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise TypeError(get_message(path, 'Should be a number'))
    return value


def boolean_type(value, path=None):
    path = path or []
    if value is None:
        return None
    if not isinstance(value, bool):
        raise TypeError(get_message(path, 'Should be a boolean'))
    return value


def _validate_string_map(value, path):
    if not isinstance(value, dict):
        raise TypeError(get_message(path, 'Should be an object'))
    for k, v in value.items():
        if not isinstance(v, str):
            raise TypeError(get_message(path + [k], 'Should be a string'))


def string_map(value, path):
    path = path or []
    if value is None:
        return None
    _validate_string_map(value, path)
    return value
