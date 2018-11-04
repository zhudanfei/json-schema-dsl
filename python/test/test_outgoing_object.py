# -*- coding: utf-8 -*-

import unittest
from json_schema_dsl import *
from filters import *
import json_outgoing

ROOT = ['root']

schema1 = JsonObject(
    JsonField('node', JsonString),
    JsonField('user', JsonArray(JsonString)),
    JsonField('tag', JsonObject(
        JsonField('name', JsonString),
        JsonField('level', JsonInteger)
    )),
    JsonField('event', JsonArray(JsonObject(JsonField('name', JsonString),
                                            JsonField('alarm', JsonBoolean)
                                            )))
)


class TestSchema1(unittest.TestCase):
    def test_integer_in_string_field(self):
        data = {'node': 5}
        try:
            json_outgoing.convert(schema1, data)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('node: Should be a string', ex.message)

    def test_return_array(self):
        data = {'user': ['abc', None, 'xxxxxx']}
        expected = {'user': ['abc', None, 'xxxxxx']}
        result = json_outgoing.convert(schema1, data)
        self.assertEqual(expected, result)

    def test_array_element_type_mismatch(self):
        data = {'user': ['abc', 5, 'xxxxxxx']}
        try:
            json_outgoing.convert(schema1, data)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('user.1: Should be a string', ex.message)

    def test_string_in_object_field(self):
        data = {'tag': 'abc'}
        try:
            json_outgoing.convert(schema1, data)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('tag: Should be an object', ex.message)

    def test_return_object(self):
        data = {'tag': {'name': 'abc'}}
        expected = {'tag': {'name': 'abc'}}
        result = json_outgoing.convert(schema1, data)
        self.assertEqual(expected, result)

    def test_return_array_of_object(self):
        data = {'event': [{'name': 'abc'}, None, {'alarm': False}]}
        expected = {'event': [{'name': 'abc'}, None, {'alarm': False}]}
        result = json_outgoing.convert(schema1, data)
        self.assertEqual(expected, result)

    def test_object_in_array_field(self):
        data = {'node': '5', 'user': {'abc': 123}}
        try:
            json_outgoing.convert(schema1, data)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('user: Should be an array', ex.message)


schema2 = JsonObject(
    JsonField('node', JsonString),
    JsonField('user', JsonArray(JsonString)),
    JsonField('tag', JsonObject(
        JsonField('name', JsonString),
        JsonField('level', JsonInteger)
    ))
)


class TestSchema2(unittest.TestCase):
    def test_all_none(self):
        data = {'node': None, 'user': None, 'tag': None}
        result = json_outgoing.convert(schema2, data, ROOT)
        self.assertEqual(data, result)

    def test_none_inside(self):
        data = {'node': 'abc', 'user': ['def', None, 'f'], 'tag': {'name': None, 'level': 2}}
        result = json_outgoing.convert(schema2, data)
        self.assertEqual(data, result)


schema3 = JsonObject(
    JsonField('node', JsonString),
)


class TestSchema3(unittest.TestCase):
    def test_redundant_field(self):
        data = {'node': 'abcd', 'xxx': 6}
        result = json_outgoing.convert(schema3, data)
        expected = {'node': 'abcd'}
        self.assertEqual(expected, result)


schema4 = JsonObject(
    JsonField('name', JsonNumber),
    JsonField('spec', JsonStringMap),
)


class TestSchema4(unittest.TestCase):
    def test_string_in_string_map_field(self):
        data = {'name': 1.99, 'spec': 'def'}
        try:
            json_outgoing.convert(schema4, data)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('spec: Should be an object', ex.message)

    def test_integer_in_string_map(self):
        data = {'name': 1.99, 'spec': {'def': 1, 'size': 'xyz'}}
        try:
            json_outgoing.convert(schema4, data)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('spec.def: Should be a string', ex.message)

    def test_return_number_and_string_map(self):
        data = {'name': 1.99, 'spec': {'def': "1", 'size': 'xyz'}}
        result = json_outgoing.convert(schema4, data)
        self.assertEqual(data, result)


schema5 = JsonObject(
    JsonField('object_id', JsonString, ToString),
    JsonField('userIds', JsonArray(JsonString, ToString))
)


class TestSchema5(unittest.TestCase):
    def test_to_string(self):
        data = {'object_id': 56, 'userIds': [3, 7]}
        result = json_outgoing.convert(schema5, data)
        expected = {'object_id': '56', 'userIds': ['3', '7']}
        self.assertEqual(expected, result)


schema6 = JsonObject(
    JsonField('f1', JsonAny),
    JsonField('f2', JsonAny),
    JsonField('f3', JsonAny),
    JsonField('f4', JsonAny),
    JsonField('f5', JsonAny)
)


class TestSchema6(unittest.TestCase):
    def test_any(self):
        data = {'f1': 'v1', 'f2': 78, 'f3': False, 'f4': {'a': 5, 'b': '7'}, 'f5': ['123', 456], 'f6': 'xyz'}
        result = json_outgoing.convert(schema6, data)
        expected = {'f1': 'v1', 'f2': 78, 'f3': False, 'f4': {'a': 5, 'b': '7'}, 'f5': ['123', 456]}
        self.assertEqual(expected, result)


schema7 = JsonArray(JsonObject(
    JsonField('user', JsonString)
))


class TestSchema7(unittest.TestCase):
    def test_return_array(self):
        data = [{'user': 'xyz'}]
        result = json_outgoing.convert(schema7, data)
        self.assertEqual(data, result)


if __name__ == '__main__':
    unittest.main()
