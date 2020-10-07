import functools

from . import basic_type
from .schema_dsl_common import *


def _check_object_type(input_object, path):
    if not isinstance(input_object, dict):
        raise TypeError(get_message(path, 'Should be an object'))


def _validate_outgoing_object(input_object, path):
    if input_object is None:
        return None
    _check_object_type(input_object, path)


def _process_field(field, parent, input_object):
    path = parent + [field['name']]
    result = functools.reduce(lambda res, f: f(res, path), field['filters'], input_object)
    return convert(field['field_type'], result, path)


def _collect_object_result(input_object, path, fields):
    result = {}
    for field in fields:
        field_name = field['name']
        if field_name in input_object:
            result[field_name] = _process_field(field, path, input_object[field_name])
        else:
            field_result = _process_field(field, path, None)
            if field_result is not None:
                result[field_name] = field_result
    return result


def _convert_object(schema, input_object, path):
    path = path or []
    _validate_outgoing_object(input_object, path)
    if input_object is None:
        return None
    return _collect_object_result(input_object, path, schema['fields'])


def _check_array_type(input_object, path):
    if not isinstance(input_object, list):
        raise TypeError(get_message(path, 'Should be an array'))


def _validate_array(input_object, path):
    if input_object is None:
        return
    _check_array_type(input_object, path)


def _filter_array_element(input_object, path, element_type, filters):
    result = functools.reduce(lambda res, f: f(res, path), filters, input_object)
    return convert(element_type, result, path)


def _collect_array_result(input_object, path, element_type, filters):
    return [_filter_array_element(input_object[i], path + [str(i)], element_type, filters) for i in
            range(len(input_object))]


def _convert_array(schema, input_object, path):
    path = path or []
    _validate_array(input_object, path)
    if input_object is None:
        return None
    return _collect_array_result(input_object, path, schema['element_type'], schema['filters'])


def _schema_wrap(converter):
    def f(schema, input_object, path):
        return converter(input_object, path)

    return f


TYPE_FUNCTION_MAP = {
    'Any': _schema_wrap(basic_type.any_type),
    'String': _schema_wrap(basic_type.string_type),
    'Integer': _schema_wrap(basic_type.integer_type),
    'Number': _schema_wrap(basic_type.number_type),
    'Boolean': _schema_wrap(basic_type.boolean_type),
    'StringMap': _schema_wrap(basic_type.string_map),
    'Object': _convert_object,
    'Array': _convert_array
}


def convert(schema, input_object, path=None):
    return TYPE_FUNCTION_MAP[schema['type']](schema, input_object, path)
