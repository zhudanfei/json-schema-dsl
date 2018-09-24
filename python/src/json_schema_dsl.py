JsonAny = {'type': 'Any'}
JsonString = {'type': 'String'}
JsonInteger = {'type': 'Integer'}
JsonNumber = {'type': 'Number'}
JsonBoolean = {'type': 'Boolean'}
JsonStringMap = {'type': 'StringMap'}


def JsonField(name, field_type, *filters):
    return {'name': name, 'field_type': field_type, 'filters': filters}


def JsonObject(*fields):
    return {'type': 'Object', 'fields': fields}


def JsonArray(element_type, *filters):
    return {'type': 'Array', 'element_type': element_type, 'filters': filters}

