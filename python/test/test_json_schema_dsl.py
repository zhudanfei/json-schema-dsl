# -*- coding: utf-8 -*-

import unittest
from json_schema_dsl import *
from filters import *

schema1 = Object(
    Field('node', String, max_length(6)),
    Field('user', Array(String, max_length(6))),
    Field('tag', Object(Field('name', String, max_length(4)),
                        Field('level', Integer, range(0, 3)),
                        )),
    Field('event', Array(Object(Field('name', String, max_length(3)),
                                Field('alarm', Boolean)
                                )))
)

schema2 = Object(
    Field('node', String, max_length(4)),
    Field('user', Array(String, max_length(6))),
    Field('tag', Object(Field('name', String, max_length(4)),
                        Field('level', Integer, range(0, 3)),
                        )),
)

schema3 = Object(
    Field('node', String, not_null, max_length(4)),
)

schema4 = Array(Object(
    Field('arrayOfObject', String, not_null, max_length(4)),
))

schema5 = Object(
    Field('node', String),
    Field('event_id', Array(Integer), not_null),
)

schema6 = Object(
    Field('name', String),
    Field('spec', StringMap, not_null),
)

ROOT = ['root']


class TestJsonSchemaDSL(unittest.TestCase):
    def test_simple_type_mismatch(self):
        data = {'node': 5}
        try:
            schema1.convert(data, ROOT)
            self.assertTrue(False)
        except TypeError as ex:
            print ex

    def test_array_type_match(self):
        data = {'user': ['abc', 'def', 'xxxxxx']}
        expected = {'node': None,
                     'user': ['abc', 'def', 'xxxxxx'],
                     'tag': None,
                     'event': None}
        result = schema1.convert(data)
        self.assertEqual(expected, result)

    def test_array_type_mismatch(self):
        data = {'user': ['abc', 5, 'xxxxxxx']}
        try:
            schema1.convert(data)
            self.assertTrue(False)
        except TypeError as ex:
            print ex

    def test_too_big_mismatch(self):
        data = {'tag': {'name': 'abc', 'level': 4}}
        try:
            schema1.convert(data)
            self.assertTrue(False)
        except ValueError as ex:
            print ex

    def test_object_type_mismatch(self):
        data = {'tag': 'abc'}
        try:
            schema1.convert(data)
            self.assertTrue(False)
        except TypeError as ex:
            print ex

    def test_object_type_match(self):
        data = {'tag': {'name': 'abc'}}
        expected = {'node': None,
                     'user': None,
                     'tag': {'name': 'abc', 'level': None},
                     'event': None}
        result = schema1.convert(data)
        self.assertEqual(expected, result)

    def test_array_element_too_long(self):
        data = {'event': [{'name': 'abcd', 'alarm': True}, {'name': 'def', 'alarm': False}]}
        try:
            schema1.convert(data)
            self.assertTrue(False)
        except ValueError as ex:
            print ex

    def test_array_object_type_match(self):
        data = {'event': [{'name': 'abc'}, {'alarm': False}]}
        expected = {'node': None,
                     'user': None,
                     'tag': None,
                     'event': [{'name': 'abc', 'alarm': None}, {'name': None, 'alarm': False}]}
        result = schema1.convert(data)
        self.assertEqual(expected, result)

    def test_all_none(self):
        data = {'node': None, 'user': None, 'tag': None}
        result = schema2.convert(data, ROOT)
        self.assertEqual(data, result)

    def test_none_inside(self):
        data = {'node': 'abc', 'user': ['def', None, 'f'], 'tag': {'name': None, 'level': 2}}
        result = schema2.convert(data)
        self.assertEqual(data, result)

    def test_not_null(self):
        data = {'node': None}
        try:
            schema3.convert(data)
            self.assertTrue(False)
        except ValueError as ex:
            print ex

    def test_two_filters(self):
        data = {'node': 'abcde'}
        try:
            schema3.convert(data, ROOT)
            self.assertTrue(False)
        except ValueError as ex:
            print ex

    def test_too_many_fields(self):
        data = {'node': 'abcd', 'xxx': 6}
        try:
            schema3.convert(data)
            self.assertTrue(False)
        except ValueError as ex:
            print ex

    def test_array_of_object(self):
        data = [{'arrayOfObject': 'def'}, {'arrayOfObject': 'abcde'}]
        try:
            schema4.convert(data)
            self.assertTrue(False)
        except ValueError as ex:
            print ex

    def test_empty_array(self):
        data = {'node': 'abc'}
        try:
            schema5.convert(data)
            self.assertTrue(False)
        except ValueError as ex:
            print ex

    def test_map_type(self):
        data = {'name':'abc', 'spec':'def'}
        try:
            schema6.convert(data)
            self.assertTrue(False)
        except TypeError as ex:
            print ex

    def test_map_field_type(self):
        data = {'name':'abc', 'spec':{'def':1, 'size':'xyz'}}
        try:
            schema6.convert(data)
            self.assertTrue(False)
        except TypeError as ex:
            print ex

    def test_good_map(self):
        data = {'name':'abc', 'spec':{'def':"1", 'size':'xyz'}}
        result = schema6.convert(data)
        self.assertEqual(data, result)


if __name__ == '__main__':
    unittest.main()
