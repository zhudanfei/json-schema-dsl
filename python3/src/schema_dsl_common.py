def get_path_string(path):
    if not path:
        return ''
    return '.'.join([x for x in path])


def get_message(path, msg):
    if len(path) == 0:
        return msg
    return get_path_string(path) + ': ' + msg


class SchemaFilter:
    def __init__(self, filter_type, name, action):
        self.filter_type = filter_type
        self.name = name
        self.action = action

    def __call__(self, *args):
        return self.action(*args)


def find_field(schema_object, field_name):
    for field in schema_object['fields']:
        if field['name'] == field_name:
            return field
    return None


