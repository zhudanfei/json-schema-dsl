import re
from schema_dsl_common import *


def _not_null(value, path):
    if value is None:
        raise ValueError(get_message(path, 'Cannot be null'))
    return value


def _not_empty(value, path):
    if value is None:
        raise ValueError(get_message(path, 'Cannot be null'))
    if value == '':
        raise ValueError(get_message(path, 'Cannot be empty'))
    return value


def _max_length(length):
    def f(value, path):
        if value is None:
            return None
        if len(value) > length:
            raise ValueError(get_message(path, 'String is too long'))
        return value

    return f


def _min_length(length):
    def f(value, path):
        if value is None:
            return None
        if len(value) < length:
            raise ValueError(get_message(path, 'String is too short'))
        return value

    return f


def _length_range(low, high):
    def f(value, path):
        if value is None:
            return None
        if len(value) < low:
            raise ValueError(get_message(path, 'String is too short'))
        if len(value) > high:
            raise ValueError(get_message(path, 'String is too long'))
        return value

    return f


def _only(*options):
    option_set = set(options)

    def f(value, path):
        if value is None:
            return None
        if value not in option_set:
            raise ValueError(get_message(path, 'Invalid value'))
        return value

    return f


def _range(low, high):
    def f(value, path):
        if value is None:
            return None
        if value < low:
            raise ValueError(get_message(path, 'Value is too small'))
        if value > high:
            raise ValueError(get_message(path, 'Value is too large'))
        return value

    return f


def _pattern(_pattern):
    re_obj = re.compile(_pattern)

    def f(value, path):
        if value is None:
            return None
        if re_obj.match(value) is None:
            raise ValueError(get_message(path, 'Pattern not match'))
        return value

    return f


NotNull = SchemaFilter('validator', 'NotNull', _not_null)
NotEmpty = SchemaFilter('validator', 'NotEmpty', _not_empty)


def MaxLength(length):
    return SchemaFilter('validator', 'MaxLength', _max_length(length))


def MinLength(length):
    return SchemaFilter('validator', 'MinLength', _min_length(length))


def LengthRange(low, high):
    return SchemaFilter('validator', 'LengthRange', _length_range(low, high))


def Only(*options):
    return SchemaFilter('validator', 'Only', _only(*options))


def Range(low, high):
    return SchemaFilter('validator', 'Range', _range(low, high))


def Pattern(re):
    return SchemaFilter('validator', 'Pattern', _pattern(re))


