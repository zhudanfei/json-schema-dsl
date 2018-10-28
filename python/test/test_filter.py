# -*- coding: utf-8 -*-

import unittest
import filters


class TestDateTime(unittest.TestCase):

    def test_none(self):
        actual = filters.ToTimestamp(None, [])
        self.assertIsNone(actual)

    def test_short_iso(self):
        value = '1970-01-02T00:00:00.000Z'
        actual = filters.ToTimestamp(value, [])
        self.assertEqual(24 * 3600 * 1000, actual)

    def test_long_iso(self):
        value = '1970-01-02T00:00:00.000000Z'
        actual = filters.ToTimestamp(value, [])
        self.assertEqual(24 * 3600 * 1000, actual)

    def test_invalid_format(self):
        value = '197001-02T00:00:00.000000Z'
        try:
            filters.ToTimestamp(value, ['ROOT'])
            self.assertTrue(False)
        except ValueError as ex:
            self.assertEqual('ROOT: Invalid value', ex.message)


class TestTrim(unittest.TestCase):

    def test_none(self):
        actual = filters.Trim(None, [])
        self.assertIsNone(actual)

    def test_trim(self):
        value = ' \t\nabc\t\n '
        actual = filters.Trim(value, [])
        self.assertEqual('abc', actual)


class TestToString(unittest.TestCase):

    def test_none(self):
        actual = filters.ToString(None, [])
        self.assertIsNone(actual)

    def test_string(self):
        value = 'abc'
        actual = filters.ToString(value, [])
        self.assertEqual('abc', actual)

    def test_integer(self):
        value = 56
        actual = filters.ToString(value, [])
        self.assertEqual('56', actual)

    def test_float(self):
        value = 56.37
        actual = filters.ToString(value, [])
        self.assertEqual('56.37', actual)


if __name__ == '__main__':
    unittest.main()
