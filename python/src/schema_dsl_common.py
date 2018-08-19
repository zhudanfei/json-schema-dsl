def get_path_string(path):
    if not path:
        return ''
    return '.'.join([x for x in path])


def get_message(path, msg):
    return get_path_string(path) + ': ' + msg

