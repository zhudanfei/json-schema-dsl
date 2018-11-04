# -*- coding: utf-8 -*-

import unittest
from json_schema_dsl import *
from validators import *
from filters import *
import json_incoming

ROOT = ['root']

schema1 = JsonObject(
    JsonField('node', JsonString, MaxLength(6)),
    JsonField('user', JsonArray(JsonString, MaxLength(6))),
    JsonField('tag', JsonObject(JsonField('name', JsonString, MaxLength(4)),
                                JsonField('level', JsonInteger, Range(0, 3)),
                                )),
    JsonField('event', JsonArray(JsonObject(JsonField('name', JsonString, MaxLength(3)),
                                            JsonField('alarm', JsonBoolean)
                                            )))
)


class TestSchema1(unittest.TestCase):
    def test_integer_in_string_field(self):
        data = {'node': 5}
        try:
            json_incoming.convert(schema1, data)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('node: Should be a string', ex.message)

    def test_return_array(self):
        data = {'user': ['abc', 'def', 'xxxxxx']}
        expected = {'node': None,
                    'user': ['abc', 'def', 'xxxxxx'],
                    'tag': None,
                    'event': None}
        result = json_incoming.convert(schema1, data)
        self.assertEqual(expected, result)

    def test_array_element_type_mismatch(self):
        data = {'user': ['abc', 5, 'xxxxxxx']}
        try:
            json_incoming.convert(schema1, data)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('user.1: Should be a string', ex.message)

    def test_too_big(self):
        data = {'tag': {'name': 'abc', 'level': 4}}
        try:
            json_incoming.convert(schema1, data)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('tag.level: Value is too large', ex.message)

    def test_string_in_object_field(self):
        data = {'tag': 'abc'}
        try:
            json_incoming.convert(schema1, data)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('tag: Should be an object', ex.message)

    def test_return_object(self):
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

    def test_return_array_of_object(self):
        data = {'event': [{'name': 'abc'}, {'alarm': False}]}
        expected = {'node': None,
                    'user': None,
                    'tag': None,
                    'event': [{'name': 'abc', 'alarm': None}, {'name': None, 'alarm': False}]}
        result = json_incoming.convert(schema1, data)
        self.assertEqual(expected, result)

    def test_object_in_array_field(self):
        data = {'node': '5', 'user': {'abc': 123}}
        try:
            json_incoming.convert(schema1, data)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('user: Should be an array', ex.message)


schema2 = JsonObject(
    JsonField('node', JsonString, MaxLength(4)),
    JsonField('user', JsonArray(JsonString, MaxLength(6))),
    JsonField('tag', JsonObject(JsonField('name', JsonString, MaxLength(4)),
                                JsonField('level', JsonInteger, Range(0, 3)),
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
    JsonField('node', JsonString, NotNull, MaxLength(4)),
)


class TestSchema3(unittest.TestCase):
    def test_null(self):
        data = {'node': None}
        try:
            json_incoming.convert(schema3, data)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('node: Cannot be null', ex.message)

    def test_two_filters(self):
        data = {'node': 'abcde'}
        try:
            json_incoming.convert(schema3, data)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('node: String is too long', ex.message)

    def test_redundant_field(self):
        data = {'node': 'abcd', 'xxx': 6}
        try:
            json_incoming.convert(schema3, data)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('Unrecognized field: xxx', ex.message)

    def test_two_redundant_fields(self):
        data = {'node': 'abcd', 'xxx': 6, 'yyy': 11.1}
        try:
            json_incoming.convert(schema3, data, ROOT)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('root: Unrecognized fields: xxx, yyy', ex.message)


schema4 = JsonArray(JsonObject(
    JsonField('arrayOfObject', JsonString, NotNull, MaxLength(4)),
))


class TestSchema4(unittest.TestCase):
    def test_array_of_object(self):
        data = [{'arrayOfObject': 'def'}, {'arrayOfObject': 'abcde'}]
        try:
            json_incoming.convert(schema4, data)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('1.arrayOfObject: String is too long', ex.message)

    def test_return_array(self):
        data = [{'arrayOfObject': 'def'}, {'arrayOfObject': 'abce'}]
        result = json_incoming.convert(schema4, data)
        self.assertEqual(data, result)


schema5 = JsonObject(
    JsonField('node', JsonString),
    JsonField('event_id', JsonArray(JsonInteger), NotNull),
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
    JsonField('name', JsonNumber),
    JsonField('spec', JsonStringMap, NotNull),
)


class TestSchema6(unittest.TestCase):
    def test_string_in_string_map_field(self):
        data = {'name': 1.99, 'spec': 'def'}
        try:
            json_incoming.convert(schema6, data)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('spec: Should be an object', ex.message)

    def test_integer_in_string_map(self):
        data = {'name': 1.99, 'spec': {'def': 1, 'size': 'xyz'}}
        try:
            json_incoming.convert(schema6, data)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('spec.def: Should be a string', ex.message)

    def test_return_number_and_string_map(self):
        data = {'name': 1.99, 'spec': {'def': "1", 'size': 'xyz'}}
        result = json_incoming.convert(schema6, data)
        self.assertEqual(data, result)


schema7 = JsonObject(
    JsonField('amount', JsonEither(JsonString, JsonNumber), ToString)
)


class TestSchema7(unittest.TestCase):
    def test_string(self):
        data = {'amount': '1.11'}
        result = json_incoming.convert(schema7, data)
        self.assertEqual(data, result)

    def test_number(self):
        data = {'amount': 1.11}
        result = json_incoming.convert(schema7, data)
        expected = {'amount': '1.11'}
        self.assertEqual(expected, result)

    def test_not_number_nor_string(self):
        data = {'amount': True}
        try:
            json_incoming.convert(schema7, data, ROOT)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('root.amount: Invalid value', ex.message)


schema8 = JsonObject(
    JsonField('credential', JsonEither(JsonObject(
        JsonField('userId', JsonInteger),
        JsonField('password', JsonString, MinLength(4))
    ), JsonString, JsonObject(
        JsonField('email', JsonString),
        JsonField('passphrase', JsonString, MinLength(5))
    ))
              )
)


class TestSchema8(unittest.TestCase):
    def test_string(self):
        data = {'credential': 'xyc'}
        result = json_incoming.convert(schema8, data)
        self.assertEqual(data, result)

    def test_object1(self):
        data = {'credential': {'userId': 5, 'password': 'abcde'}}
        result = json_incoming.convert(schema8, data)
        self.assertEqual(data, result)

    def test_object2(self):
        data = {'credential': {'email': 'abc', 'passphrase': 'abcdef'}}
        result = json_incoming.convert(schema8, data)
        self.assertEqual(data, result)

    def test_type_mismatch(self):
        data = {'credential': 3.5}
        try:
            json_incoming.convert(schema8, data)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('credential: Invalid value', ex.message)

    def test_validation_failed(self):
        data = {'credential': {'userId': 5, 'password': 'abc'}}
        try:
            json_incoming.convert(schema8, data)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('credential: Invalid value', ex.message)


schema9 = JsonEither(
    JsonObject(
        JsonField('userId', JsonInteger),
        JsonField('password', JsonString, MinLength(4))
    ),
    JsonObject(
        JsonField('email', JsonString),
        JsonField('passphrase', JsonString, MinLength(5))
    )
)


class TestSchema9(unittest.TestCase):
    def test_object1(self):
        data = {'userId': 5, 'password': 'abcde'}
        result = json_incoming.convert(schema9, data)
        self.assertEqual(data, result)

    def test_object2(self):
        data = {'email': 'abc', 'passphrase': 'abcdef'}
        result = json_incoming.convert(schema9, data)
        self.assertEqual(data, result)

    def test_invalid(self):
        data = {'userId': 5, 'passphrase': 'abcdef'}
        try:
            json_incoming.convert(schema9, data)
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('Invalid value', ex.message)


if __name__ == '__main__':
    unittest.main()
