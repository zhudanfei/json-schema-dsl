# -*- coding: utf-8 -*-

import unittest
import validators


class TestNotNull(unittest.TestCase):

    def test_none(self):
        try:
            validators.NotNull(None, ['node'])
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('node: Cannot be null', ex.message)

    def test_not_none(self):
        value = {'user': 11}
        actual = validators.NotNull(value, [])
        self.assertEqual(value, actual)


class TestNotEmpty(unittest.TestCase):

    def test_none(self):
        try:
            validators.NotEmpty(None, [])
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('Cannot be null', ex.message)

    def test_empty(self):
        try:
            validators.NotEmpty('', ['node'])
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('node: Cannot be empty', ex.message)

    def test_not_empty(self):
        value = 'abc'
        actual = validators.NotEmpty(value, [])
        self.assertEqual(value, actual)


class TestMaxLength(unittest.TestCase):

    def test_none(self):
        actual = validators.MaxLength(4)(None, [])
        self.assertIsNone(actual)

    def test_not_too_long(self):
        value = 'abcd'
        actual = validators.MaxLength(4)(value, [])
        self.assertEqual(value, actual)

    def test_too_long(self):
        value = '12345'
        try:
            validators.MaxLength(4)(value, ['node'])
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('node: String is too long', ex.message)


class TestMinLength(unittest.TestCase):

    def test_none(self):
        actual = validators.MinLength(5)(None, [])
        self.assertIsNone(actual)

    def test_not_too_short(self):
        value = '12345'
        actual = validators.MinLength(5)(value, [])
        self.assertEqual(value, actual)

    def test_too_short(self):
        value = 'abcd'
        try:
            validators.MinLength(5)(value, ['node'])
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('node: String is too short', ex.message)


class TestLengthRange(unittest.TestCase):

    def test_none(self):
        actual = validators.LengthRange(4, 5)(None, [])
        self.assertIsNone(actual)

    def test_in_range(self):
        value = 'abcd'
        actual = validators.LengthRange(4, 5)(value, [])
        self.assertEqual(value, actual)

    def test_too_long(self):
        value = '123456'
        try:
            validators.LengthRange(4, 5)(value, ['node'])
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('node: String is too long', ex.message)

    def test_too_short(self):
        value = 'abc'
        try:
            validators.LengthRange(4, 5)(value, ['node'])
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('node: String is too short', ex.message)


class TestOnly(unittest.TestCase):

    def test_none(self):
        actual = validators.Only('user', 'node')(None, [])
        self.assertIsNone(actual)

    def test_in_set(self):
        value = 'user'
        actual = validators.Only('user', 'node')(value, [])
        self.assertEqual(value, actual)

    def test_not_in_set(self):
        value = 'abcd'
        try:
            validators.Only('user', 'node')(value, ['root'])
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('root: Invalid value', ex.message)


class TestRange(unittest.TestCase):

    def test_none(self):
        actual = validators.Range(4, 5.3)(None, [])
        self.assertIsNone(actual)

    def test_in_range(self):
        value = 4.5
        actual = validators.Range(4, 5.3)(value, [])
        self.assertEqual(value, actual)

    def test_too_big(self):
        value = 6.1
        try:
            validators.Range(4, 5.3)(value, ['node'])
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('node: Value is too large', ex.message)

    def test_too_small(self):
        value = 3
        try:
            validators.Range(4, 5.3)(value, ['node'])
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('node: Value is too small', ex.message)


class TestPattern(unittest.TestCase):

    def test_none(self):
        actual = validators.Pattern('^[a-zA-Z0-9]{4}$')(None, [])
        self.assertIsNone(actual)

    def test_pattern_match(self):
        value = 'user'
        actual = validators.Pattern('^[a-zA-Z0-9]{4}$')(value, [])
        self.assertEqual(value, actual)

    def test_not_in_set(self):
        value = 'abcde'
        try:
            validators.Pattern('^[a-zA-Z0-9]{4}$')(value, ['root'])
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('root: Pattern not match', ex.message)


if __name__ == '__main__':
    unittest.main()
