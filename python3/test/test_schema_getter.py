import unittest

from src.json_schema_dsl import *
from src import schema_getter


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


class TestSchemaGetter(unittest.TestCase):

    def test_whole_object(self):
        data = {'node': '5', 'tag': {'name': 'abc', 'level': 10}}
        expected = {'node': '5', 'tag': {'name': 'abc', 'level': 10}}
        actual = schema_getter.getter(schema1, [], data)
        self.assertEqual(expected, actual)

    def test_first_level_value(self):
        data = {'node': '5'}
        expected = '5'
        actual = schema_getter.getter(schema1, ['node'], data)
        self.assertEqual(expected, actual)

    def test_first_level_object(self):
        data = {'node': '5', 'tag': {'name': 'abc', 'level': 10}}
        expected = {'name': 'abc', 'level': 10}
        actual = schema_getter.getter(schema1, ['tag'], data)
        self.assertEqual(expected, actual)

    def test_first_level_invalid_name(self):
        data = {'node': '5'}
        try:
            schema_getter.getter(schema1, ['nod'], data)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual("Unrecognized field: nod", ex.args[0])

    def test_first_level_none_value(self):
        data = {'tag': {'name': 'abc', 'level': 10}}
        actual = schema_getter.getter(schema1, ['node'], data)
        self.assertIsNone(actual)

    def test_first_level_none_object(self):
        data = {'node': '5'}
        actual = schema_getter.getter(schema1, ['tag'], data)
        self.assertIsNone(actual)

    def test_second_level_value(self):
        data = {'node': '5', 'tag': {'name': 'abc', 'level': 10}}
        expected = 10
        actual = schema_getter.getter(schema1, ['tag', 'level'], data)
        self.assertEqual(expected, actual)

    def test_path_too_long(self):
        data = {'node': '5', 'tag': {'name': 'abc', 'level': 10}}
        try:
            schema_getter.getter(schema1, ['tag', 'level', 'x'], data)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual("Path is too long", ex.args[0])

    def test_second_level_invalid_name(self):
        data = {'tag': {'name': 'abc', 'level': 10}}
        try:
            schema_getter.getter(schema1, ['tag', 'node'], data)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual("Unrecognized field: node", ex.args[0])

    def test_second_level_invalid_name_twice(self):
        data = {'tag': {'name': 'abc', 'level': 10}}
        try:
            schema_getter.getter(schema1, ['nod', 'node'], data)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual("Unrecognized field: nod", ex.args[0])

    def test_second_level_none_value(self):
        data = {'tag': {'name': 'abc'}}
        actual = schema_getter.getter(schema1, ['tag', 'level'], data)
        self.assertIsNone(actual)

    def test_second_level_none_object(self):
        data = {'tag': {'name': 'abc'}}
        actual = schema_getter.getter(schema1, ['tag', 'cascade'], data)
        self.assertIsNone(actual)

    def test_array(self):
        data = {'node': '5', 'user': ['abc', 'xyz']}
        expected = 'xyz'
        actual = schema_getter.getter(schema1, ['user', 1], data)
        self.assertEqual(expected, actual)

    def test_array_string_index(self):
        data = {'node': '5', 'user': ['abc', 'xyz']}
        try:
            schema_getter.getter(schema1, ['user', 'a'], data)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual("Index should be integer", ex.args[0])

    def test_array_of_object(self):
        data = {'node': '5', 'event': [{'name': 'abc'}, {'name': 'xyz'}]}
        expected = 'xyz'
        actual = schema_getter.getter(schema1, ['event', 1, 'name'], data)
        self.assertEqual(expected, actual)

    def test_array_of_object_string_index(self):
        data = {'node': '5', 'event': [{'name': 'abc'}, {'name': 'xyz'}]}
        try:
            schema_getter.getter(schema1, ['event', 'x', 'name'], data)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual("Index should be integer", ex.args[0])

    def test_array_path_too_long(self):
        data = {'node': '5', 'event': [{'name': 'abc'}, {'name': 'xyz'}]}
        try:
            schema_getter.getter(schema1, ['event', 0, 'name', 'abc'], data)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual("Path is too long", ex.args[0])

    def test_array_of_object_invalid_name(self):
        data = {'node': '5', 'event': [{'name': 'abc'}, {'name': 'xyz'}]}
        try:
            schema_getter.getter(schema1, ['event', 0, 'nam'], data)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual("Unrecognized field: nam", ex.args[0])

    def test_string_map(self):
        data = {'node': '5', 'spec': {'def': '1', 'size': 'xyz'}}
        expected = 'xyz'
        actual = schema_getter.getter(schema1, ['spec', 'size'], data)
        self.assertEqual(expected, actual)

    def test_string_map_path_too_long(self):
        data = {'node': '5', 'spec': {'def': '1', 'size': 'xyz'}}
        try:
            schema_getter.getter(schema1, ['spec', 'size', 'abc'], data)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual("Path is too long", ex.args[0])


if __name__ == '__main__':
    unittest.main()
