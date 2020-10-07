import unittest

from src.json_schema_dsl import *
from src import schema_setter


schema1 = JsonObject(
    JsonField('node', JsonString),
    JsonField('user', JsonArray(JsonString)),
    JsonField('tag', JsonObject(
        JsonField('name', JsonString),
        JsonField('level', JsonInteger),
        JsonField('cascade', JsonObject(
            JsonField('amount', JsonNumber)
        )
                  )
    )),
    JsonField('event', JsonArray(
        JsonObject(
            JsonField('name', JsonString),
            JsonField('alarm', JsonBoolean)
        )
    )
              ),
    JsonField('spec', JsonStringMap)
)


class TestSchemaSetter(unittest.TestCase):

    def test_whole_object(self):
        data = {}
        try:
            schema_setter.setter(schema1, [], data, {})
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('Cannot set itself', ex.args[0])

    def test_first_level_value(self):
        data = {}
        expected = {'node': '5'}
        schema_setter.setter(schema1, ['node'], data, '5')
        self.assertEqual(expected, data)

    def test_first_level_object(self):
        data = {'node': '5'}
        expected = {'node': '5', 'tag': {'name': 'abc', 'level': 10}}
        schema_setter.setter(schema1, ['tag'], data, {'name': 'abc', 'level': 10})
        self.assertEqual(expected, data)

    def test_first_level_invalid_name(self):
        data = {'node': '5'}
        try:
            schema_setter.setter(schema1, ['nod'], data, 5)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('Unrecognized field: nod', ex.args[0])

    def test_second_level_value(self):
        data = {'node': '5', 'tag': {'name': 'abc', 'level': 10}}
        expected = {'node': '5', 'tag': {'name': 'abc', 'level': 7}}
        schema_setter.setter(schema1, ['tag', 'level'], data, 7)
        self.assertEqual(expected, data)

    def test_second_level_none_value(self):
        data = {'node': '5'}
        expected = {'node': '5', 'tag': {'level': 7}}
        schema_setter.setter(schema1, ['tag', 'level'], data, 7)
        self.assertEqual(expected, data)

    def test_path_too_long(self):
        data = {'node': '5'}
        try:
            schema_setter.setter(schema1, ['node', 'level'], data, 7)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('Path is too long', ex.args[0])

    def test_second_level_invalid_name(self):
        data = {}
        try:
            schema_setter.setter(schema1, ['tag', 'node'], data, '5')
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('Unrecognized field: node', ex.args[0])

    def test_second_level_invalid_name_twice(self):
        data = {}
        try:
            schema_setter.setter(schema1, ['nod', 'node'], data, '5')
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('Unrecognized field: nod', ex.args[0])

    def test_array(self):
        data = {'node': '5', 'user': ['abc', 'xyz']}
        expected = {'node': '5', 'user': ['abc', 'abc']}
        schema_setter.setter(schema1, ['user', 1], data, 'abc')
        self.assertEqual(expected, data)

    def test_array_none(self):
        data = {'node': '5'}
        expected = {'node': '5', 'user': [None, 'abc']}
        schema_setter.setter(schema1, ['user', 1], data, 'abc')
        self.assertEqual(expected, data)

    def test_array_string_index(self):
        data = {'node': '5', 'user': ['abc', 'xyz']}
        try:
            schema_setter.setter(schema1, ['user', 'x'], data, 'abc')
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('Index should be integer', ex.args[0])

    def test_array_of_object(self):
        data = {'node': '5', 'event': [{'name': 'abc'}, {'name': 'xyz'}]}
        expected = {'node': '5', 'event': [{'name': 'abc'}, {'name': 'def'}]}
        schema_setter.setter(schema1, ['event', 1, 'name'], data, 'def')
        self.assertEqual(expected, data)

    def test_array_of_object_string_index(self):
        data = {'node': '5', 'event': [{'name': 'abc'}, {'name': 'xyz'}]}
        try:
            schema_setter.setter(schema1, ['event', 'x', 'name'], data, 'abc')
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('Index should be integer', ex.args[0])

    def test_array_of_object_none(self):
        data = {'node': '5'}
        expected = {'node': '5', 'event': [None, {'name': 'def'}]}
        schema_setter.setter(schema1, ['event', 1, 'name'], data, 'def')
        self.assertEqual(expected, data)

    def test_array_path_too_long(self):
        data = {'node': '5', 'event': [{'name': 'abc'}, {'name': 'xyz'}]}
        try:
            schema_setter.setter(schema1, ['event', 0, 'name', 'abc'], data, 'abc')
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('Path is too long', ex.args[0])

    def test_array_of_object_invalid_name(self):
        data = {'node': '5', 'event': [{'name': 'abc'}, {'name': 'xyz'}]}
        try:
            schema_setter.setter(schema1, ['event', 0, 'nam'], data, 'abc')
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('Unrecognized field: nam', ex.args[0])

    def test_string_map(self):
        data = {'node': '5', 'spec': {'def': '1', 'size': 'xyz'}}
        expected = {'node': '5', 'spec': {'def': '1', 'size': 'abc'}}
        schema_setter.setter(schema1, ['spec', 'size'], data, 'abc')
        self.assertEqual(expected, data)

    def test_string_map_add(self):
        data = {'node': '5', 'spec': {'def': '1', 'size': 'xyz'}}
        expected = {'node': '5', 'spec': {'def': '1', 'size': 'xyz', 'abc': 'def'}}
        schema_setter.setter(schema1, ['spec', 'abc'], data, 'def')
        self.assertEqual(expected, data)

    def test_string_map_none(self):
        data = {'node': '5'}
        expected = {'node': '5', 'spec': {'size': 'abc'}}
        schema_setter.setter(schema1, ['spec', 'size'], data, 'abc')
        self.assertEqual(expected, data)

    def test_string_map_path_too_long(self):
        data = {'node': '5', 'spec': {'def': '1', 'size': 'xyz'}}
        try:
            schema_setter.setter(schema1, ['spec', 'size', 'abc'], data, 'abc')
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('Path is too long', ex.args[0])


if __name__ == '__main__':
    unittest.main()
