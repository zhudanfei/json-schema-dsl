# -*- coding: utf-8 -*-

import unittest
from json_schema_dsl import *
from filters import *
import json_incoming

ROOT = ['root']

schema1 = JsonObject(
    JsonField('node', JsonString, max_length(6)),
    JsonField('user', JsonArray(JsonString, max_length(6))),
    JsonField('tag', JsonObject(JsonField('name', JsonString, max_length(4)),
                        JsonField('level', JsonInteger, range(0, 3)),
                        )),
    JsonField('event', JsonArray(JsonObject(JsonField('name', JsonString, max_length(3)),
                                JsonField('alarm', JsonBoolean)
                                )))
)


class TestSchema1(unittest.TestCase):
    def test_simple_type_mismatch(self):
        data = {'node': 5}
        try:
            json_incoming.convert(schema1, data, ROOT)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('root.node: Should be a string', ex.message)

    def test_array_type_match(self):
        data = {'user': ['abc', 'def', 'xxxxxx']}
        expected = {'node': None,
                     'user': ['abc', 'def', 'xxxxxx'],
                     'tag': None,
                     'event': None}
        result = json_incoming.convert(schema1, data)
        self.assertEqual(expected, result)

    def test_array_type_mismatch(self):
        data = {'user': ['abc', 5, 'xxxxxxx']}
        try:
            json_incoming.convert(schema1, data)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('user.1: Should be a string', ex.message)

    def test_too_big_mismatch(self):
        data = {'tag': {'name': 'abc', 'level': 4}}
        try:
            json_incoming.convert(schema1, data)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('tag.level: Value is too large', ex.message)

    def test_object_type_mismatch(self):
        data = {'tag': 'abc'}
        try:
            json_incoming.convert(schema1, data)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('tag: Should be an object', ex.message)

    def test_object_type_match(self):
        data = {'tag': {'name': 'abc'}}
        expected = {'node': None,
                     'user': None,
                     'tag': {'name': 'abc', 'level': None},
                     'event': None}
        result = json_incoming.convert(schema1, data)
        self.assertEqual(expected, result)

    def test_array_element_too_long(self):
        data = {'event': [{'name': 'abcd', 'alarm': True}, {'name': 'def', 'alarm': False}]}
        try:
            json_incoming.convert(schema1, data)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('event.0.name: String is too long', ex.message)

    def test_array_object_type_match(self):
        data = {'event': [{'name': 'abc'}, {'alarm': False}]}
        expected = {'node': None,
                     'user': None,
                     'tag': None,
                     'event': [{'name': 'abc', 'alarm': None}, {'name': None, 'alarm': False}]}
        result = json_incoming.convert(schema1, data)
        self.assertEqual(expected, result)


schema2 = JsonObject(
    JsonField('node', JsonString, max_length(4)),
    JsonField('user', JsonArray(JsonString, max_length(6))),
    JsonField('tag', JsonObject(JsonField('name', JsonString, max_length(4)),
                        JsonField('level', JsonInteger, range(0, 3)),
                        )),
)

class TestSchema2(unittest.TestCase):
    def test_all_none(self):
        data = {'node': None, 'user': None, 'tag': None}
        result = json_incoming.convert(schema2, data, ROOT)
        self.assertEqual(data, result)


    def test_none_inside(self):
        data = {'node': 'abc', 'user': ['def', None, 'f'], 'tag': {'name': None, 'level': 2}}
        result = json_incoming.convert(schema2, data)
        self.assertEqual(data, result)


schema3 = JsonObject(
    JsonField('node', JsonString, not_null, max_length(4)),
)

class TestSchema3(unittest.TestCase):
    def test_not_null(self):
        data = {'node': None}
        try:
            json_incoming.convert(schema3, data)
            self.assertTrue(False)
        except ValueError as ex:
            print ex

    def test_two_filters(self):
        data = {'node': 'abcde'}
        try:
            json_incoming.convert(schema3, data, ROOT)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('root.node: String is too long', ex.message)

    def test_too_many_fields(self):
        data = {'node': 'abcd', 'xxx': 6}
        try:
            json_incoming.convert(schema3, data)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('Unrecognized field: xxx', ex.message)


schema4 = JsonArray(JsonObject(
    JsonField('arrayOfObject', JsonString, not_null, max_length(4)),
))


class TestSchema4(unittest.TestCase):
    def test_array_of_object(self):
        data = [{'arrayOfObject': 'def'}, {'arrayOfObject': 'abcde'}]
        try:
            json_incoming.convert(schema4, data)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('1.arrayOfObject: String is too long', ex.message)


schema5 = JsonObject(
    JsonField('node', JsonString),
    JsonField('event_id', JsonArray(JsonInteger), not_null),
)

class TestSchema5(unittest.TestCase):
    def test_empty_array(self):
        data = {'node': 'abc'}
        try:
            json_incoming.convert(schema5, data)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('event_id: Cannot be null', ex.message)

schema6 = JsonObject(
    JsonField('name', JsonString),
    JsonField('spec', JsonStringMap, not_null),
)


class TestSchema6(unittest.TestCase):
    def test_map_type(self):
        data = {'name':'abc', 'spec':'def'}
        try:
            json_incoming.convert(schema6, data)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('spec: Should be an object', ex.message)

    def test_map_field_type(self):
        data = {'name':'abc', 'spec':{'def':1, 'size':'xyz'}}
        try:
            json_incoming.convert(schema6, data)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('spec.def: Should be a string', ex.message)

    def test_good_map(self):
        data = {'name':'abc', 'spec':{'def':"1", 'size':'xyz'}}
        result = json_incoming.convert(schema6, data)
        self.assertEqual(data, result)


if __name__ == '__main__':
    unittest.main()
