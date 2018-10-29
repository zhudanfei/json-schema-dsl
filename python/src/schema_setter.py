import schema_dsl_common


def _walk_field_common(obj, name, field_type):
    field_type_type = field_type['type']
    if field_type_type != 'Object' and field_type_type != 'Array' and field_type_type != 'StringMap':
        raise ValueError('Path is too long')
    if name not in obj or obj[name] is None:
        if field_type_type == 'Object' or field_type_type == 'StringMap':
            obj[name] = {}
        else:
            obj[name] = []
    return field_type, obj[name]


def _walk_object_field(schema_obj, obj, name):
    field = schema_dsl_common.find_field(schema_obj, name)
    if field is None:
        raise ValueError('Unrecognized field: ' + name)
    field_type = field['field_type']
    return _walk_field_common(obj, name, field_type)


def _walk_array_field(schema_obj, obj, index):
    if isinstance(index, bool) or not isinstance(index, (int, long)):
        raise TypeError('Index should be integer')
    if len(obj) <= index:
        obj += [None] * (index - len(obj) + 1)
    field_type = schema_obj['element_type']
    return _walk_field_common(obj, index, field_type)


def _walk_fields(schema_obj, obj, path):
    for name in path:
        if schema_obj['type'] == 'Object':
            schema_obj, obj = _walk_object_field(schema_obj, obj, name)
        elif schema_obj['type'] == 'Array':
            schema_obj, obj = _walk_array_field(schema_obj, obj, name)
        else:
            raise ValueError('Path is too long')
    return schema_obj, obj


def _set_field(schema_obj, obj, name, value):
    if schema_obj['type'] == 'Object':
        field = schema_dsl_common.find_field(schema_obj, name)
        if field is None:
            raise ValueError('Unrecognized field: ' + name)
    elif schema_obj['type'] == 'Array':
        index = name
        if isinstance(index, bool) or not isinstance(index, (int, long)):
            raise TypeError('Index should be integer')
        if len(obj) <= index:
            obj += [None] * (index - len(obj) + 1)
    obj[name] = value


def setter(schema_obj, path, obj, value):
    if len(path) == 0:
        raise ValueError('Cannot set itself')
    schema_obj, obj = _walk_fields(schema_obj, obj, path[:-1])
    _set_field(schema_obj, obj, path[-1], value)
