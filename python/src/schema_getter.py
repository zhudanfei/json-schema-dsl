class NoneValue(Exception):
    pass


def _find_field(schema_object, field_name):
    for field in schema_object['fields']:
        if field['name'] == field_name:
            return field
    return None


def _get_object_field(schema_object, obj, name):
    field = _find_field(schema_object, name)
    if field is None:
        raise ValueError('Unrecognized field: ' + name)
    if name not in obj or obj[name] is None:
        raise NoneValue()
    return [field['field_type'], obj[name]]


def _get_array_field(schema_object, obj, index):
    if isinstance(index, bool) or not isinstance(index, (int, long)):
        raise TypeError( 'Index should be integer')
    return [schema_object['element_type'], obj[index]]


def _get_string_map_field(schema_object, obj, name):
    return [{'type': 'String'}, obj[name]]


def _get_basic_field(schema_object, obj, name):
    raise ValueError('Path is too long')


FIELD_TYPE_GETTER_MAP = {
    'String': _get_basic_field,
    'Integer': _get_basic_field,
    'Number': _get_basic_field,
    'Boolean': _get_basic_field,
    'StringMap': _get_string_map_field,
    'Object': _get_object_field,
    'Array': _get_array_field
}


def _get_field(schema_object, obj, name):
    return FIELD_TYPE_GETTER_MAP[schema_object['type']](schema_object, obj, name)


def getter(schema_object, path, obj):
    try:
        for name in path:
            schema_object, obj = _get_field(schema_object, obj, name)
        return obj
    except NoneValue:
        return None
