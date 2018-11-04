import basic_type
from schema_dsl_common import *


def _check_object_type(input_object, path):
    if not isinstance(input_object, dict):
        raise TypeError(get_message(path, 'Should be an object'))


def _get_unrecognized_message(diff_set):
    diff = list(diff_set)
    if len(diff) == 1:
        return 'Unrecognized field: ' + diff[0]
    return 'Unrecognized fields: ' + ', '.join([x for x in diff])


def _check_redundancy(input_object, path, field_name_set):
    input_key_set = set(input_object.keys())
    if not input_key_set <= field_name_set:
        msg = _get_unrecognized_message(input_key_set - field_name_set)
        raise ValueError(get_message(path, msg))


def _validate_incoming_object(input_object, path, field_name_set):
    if input_object is None:
        return None
    _check_object_type(input_object, path)
    _check_redundancy(input_object, path, field_name_set)


def _process_field(field, parent, input_object):
    path = parent + [field['name']]
    result = convert(field['field_type'], input_object, path)
    return reduce(lambda res, f: f(res, path), field['filters'], result)


def _collect_object_result(input_object, path, fields):
    result = {}
    for field in fields:
        field_name = field['name']
        if field_name in input_object:
            result[field_name] = _process_field(field, path, input_object[field_name])
        else:
            result[field_name] = _process_field(field, path, None)
    return result


def _convert_object(schema, input_object, path):
    path = path or []
    field_name_set = set([x['name'] for x in schema['fields']])
    _validate_incoming_object(input_object, path, field_name_set)
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
    result = convert(element_type, input_object, path)
    return reduce(lambda res, f: f(res, path), filters, result)


def _collect_array_result(input_object, path, element_type, filters):
    return [_filter_array_element(input_object[i], path + [str(i)], element_type, filters) for i in
            xrange(len(input_object))]


def _convert_array(schema, input_object, path):
    path = path or []
    _validate_array(input_object, path)
    if input_object is None:
        return None
    return _collect_array_result(input_object, path, schema['element_type'], schema['filters'])


def _convert_either(schema, input_object, path):
    for data_type in schema['types']:
        try:
            return convert(data_type, input_object, path)
        except ValueError:
            pass
        except TypeError:
            pass
    raise ValueError(get_message(path, 'Invalid value'))


def _schema_wrap(converter):
    def f(schema, input_object, path):
        return converter(input_object, path)

    return f


TYPE_FUNCTION_MAP = {
    'String': _schema_wrap(basic_type.string_type),
    'Integer': _schema_wrap(basic_type.integer_type),
    'Number': _schema_wrap(basic_type.number_type),
    'Boolean': _schema_wrap(basic_type.boolean_type),
    'StringMap': _schema_wrap(basic_type.string_map),
    'Object': _convert_object,
    'Array': _convert_array,
    'Either': _convert_either
}


def convert(schema, input_object, path=None):
    path = path or []
    return TYPE_FUNCTION_MAP[schema['type']](schema, input_object, path)
