# -*- coding: utf-8 -*-

import unittest
import filters


class TestFilter(unittest.TestCase):

    def test_timestamp(self):
        value = '1970-01-02T00:00:00.000Z'
        timestamp = filters.to_timestamp(value, '')
        self.assertEqual(24 * 3600 * 1000, timestamp)

    def test_timestamp_long(self):
        value = '1970-01-02T00:00:00.000000Z'
        timestamp = filters.to_timestamp(value, '')
        self.assertEqual(24 * 3600 * 1000, timestamp)

    def test_max_length(self):
        f = filters.max_length(4)
        value = 'abcde'
        with self.assertRaises(ValueError) as context:
            f(value, '')

    def test_max_length_unicode_pass(self):
        f = filters.max_length(4)
        value = u'太空旅客'
        self.assertEqual(value, f(value, ''))

    def test_max_length_unicode_fail(self):
        f = filters.max_length(4)
        value = u'血战钢锯岭'
        with self.assertRaises(ValueError) as context:
            f(value, '')


if __name__ == '__main__':
    unittest.main()
