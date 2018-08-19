from schema_dsl_common import *


class StringType(object):
    @staticmethod
    def convert(value, path=None):
        path = path or []
        if value is None:
            return None
        if not isinstance(value, (str, unicode)):
            raise TypeError(get_message(path, 'Should be a string'))
        return value


class IntegerType(object):
    @staticmethod
    def convert(value, path=None):
        path = path or []
        if value is None:
            return None
        if not isinstance(value, (int, long)):
            raise TypeError(get_message(path, 'Should be a integer'))
        return value


class BooleanType(object):
    @staticmethod
    def convert(value, path=None):
        path = path or []
        if value is None:
            return None
        if not isinstance(value, bool):
            raise TypeError(get_message(path, 'Should be a boolean'))
        return value


class StringMapType(object):
    @staticmethod
    def validate(input_object, path):
        if input_object is None:
            return
        StringMapType.check_type(input_object, path)

    @staticmethod
    def check_type(input_object, path):
        if not isinstance(input_object, dict):
            raise TypeError(get_message(path, 'Should be a object'))
        for key, value in input_object.items():
            if not isinstance(value, (str, unicode)):
                raise TypeError(get_message(path + [key], 'Should be a string'))

    @staticmethod
    def convert(input_object, path=None):
        path = path or []
        StringMapType.validate(input_object, path)
        return input_object


class Field(object):
    def __init__(self, name, field_type, *filters):
        self.name = name
        self.field_type = field_type
        self.filters = filters

    def get_name(self):
        return self.name

    def process(self, parent, input_object):
        path = parent + [self.name]
        result = self.field_type.convert(input_object, path)
        return reduce(lambda res, f: f(res, path), self.filters, result)


class Object(object):
    def __init__(self, *fields):
        super(Object, self).__init__()
        self.fields = fields
        self.field_name_set = set([x.get_name() for x in self.fields])
        self.path = None

    def validate(self, input_object):
        if input_object is None:
            return
        self.check_type(input_object)
        self.check_redundancy(input_object)

    def check_type(self, input_object):
        if not isinstance(input_object, dict):
            raise TypeError(get_message(self.path, 'Should be a object'))

    def check_redundancy(self, input_object):
        input_key_set = set(input_object.keys())
        if not input_key_set <= self.field_name_set:
            msg = self.get_unrecognized_message(input_key_set)
            raise ValueError(get_message(self.path, msg))

    def get_unrecognized_message(self, actual_key_set):
        diff = list(actual_key_set - self.field_name_set)
        if len(diff) == 1:
            return 'Unrecognized field: ' + diff[0]
        return 'Unrecognized fields: ' + ', '.join([x for x in diff])

    def collect_result(self, input_object):
        result = {}
        for field in self.fields:
            field_name = field.get_name()
            if field_name in input_object:
                result[field_name] = field.process(self.path, input_object[field_name])
            else:
                result[field_name] = field.process(self.path, None)
        return result

    def convert(self, input_object, path=None):
        self.path = path or []
        self.validate(input_object)
        if input_object is None:
            return None
        return self.collect_result(input_object)


class Array(object):
    def __init__(self, element_type, *filters):
        super(Array, self).__init__()
        self.element_type = element_type
        self.filters = filters

    def validate(self, input_object):
        if input_object is None:
            return
        self.check_type(input_object)

    def check_type(self, input_object):
        if not isinstance(input_object, list):
            raise TypeError(get_message(self.path, 'Should be a array'))

    def filter(self, input_object, i):
        result = input_object[i]
        path = self.path + [str(i)]
        result = self.element_type.convert(result, path)
        return reduce(lambda res, f: f(res, path), self.filters, result)

    def collect_result(self, input_object):
        return [self.filter(input_object, i) for i in xrange(len(input_object))]

    def convert(self, input_object, path=None):
        self.path = path or []
        self.validate(input_object)
        if input_object is None:
            return None
        return self.collect_result(input_object)


String = StringType()
Integer = IntegerType()
Boolean = BooleanType()
StringMap = StringMapType()
