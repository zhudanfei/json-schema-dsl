import unittest
from src import basic_type


class TestAnyType(unittest.TestCase):

    def test_return_value(self):
        self.assertEqual(3, basic_type.any_type(3, []))


class TestStringType(unittest.TestCase):

    def test_none(self):
        self.assertEqual(None, basic_type.string_type(None, []))

    def test_string(self):
        self.assertEqual('abc', basic_type.string_type('abc', []))

    def test_integer(self):
        try:
            basic_type.string_type(4, ['node', '3'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('node.3: Should be a string', ex.args[0])

    def test_float(self):
        try:
            basic_type.string_type(3.4, ['3'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('3: Should be a string', ex.args[0])

    def test_boolean(self):
        try:
            basic_type.string_type(False, ['node'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('node: Should be a string', ex.args[0])

    def test_dict(self):
        try:
            basic_type.string_type({'a': 1, 'b': 2}, ['node', '3'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('node.3: Should be a string', ex.args[0])

    def test_list(self):
        try:
            basic_type.string_type([1, 3, 5], ['node'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('node: Should be a string', ex.args[0])


class TestIntegerType(unittest.TestCase):

    def test_none(self):
        self.assertEqual(None, basic_type.integer_type(None, []))

    def test_integer(self):
        self.assertEqual(5, basic_type.integer_type(5, []))

    def test_string(self):
        try:
            basic_type.integer_type('6abc', ['node', '3'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('node.3: Should be an integer', ex.args[0])

    def test_float(self):
        try:
            basic_type.integer_type(3.4, ['3'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('3: Should be an integer', ex.args[0])

    def test_boolean(self):
        try:
            basic_type.integer_type(True, None)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('Should be an integer', ex.args[0])

    def test_dict(self):
        try:
            basic_type.integer_type({'a': 1, 'b': 2}, ['node', '3'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('node.3: Should be an integer', ex.args[0])

    def test_list(self):
        try:
            basic_type.integer_type([1, 3, 5], ['node'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('node: Should be an integer', ex.args[0])


class TestNumberType(unittest.TestCase):

    def test_none(self):
        self.assertEqual(None, basic_type.number_type(None, []))

    def test_integer(self):
        self.assertEqual(5, basic_type.number_type(5, []))

    def test_float(self):
        self.assertEqual(3.4, basic_type.number_type(3.4, []))

    def test_string(self):
        try:
            basic_type.number_type('6abc', ['node', '3'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('node.3: Should be a number', ex.args[0])

    def test_boolean(self):
        try:
            basic_type.number_type(True, None)
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('Should be a number', ex.args[0])

    def test_dict(self):
        try:
            basic_type.number_type({'a': 1, 'b': 2}, ['node', '3'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('node.3: Should be a number', ex.args[0])

    def test_list(self):
        try:
            basic_type.number_type([1, 3, 5], ['node'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('node: Should be a number', ex.args[0])


class TestBooleanType(unittest.TestCase):

    def test_none(self):
        self.assertEqual(None, basic_type.boolean_type(None, []))

    def test_boolean(self):
        self.assertEqual(True, basic_type.boolean_type(True, []))

    def test_string(self):
        try:
            basic_type.boolean_type('6abc', ['node'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('node: Should be a boolean', ex.args[0])

    def test_integer(self):
        try:
            basic_type.boolean_type(4, ['node', '3'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('node.3: Should be a boolean', ex.args[0])

    def test_float(self):
        try:
            basic_type.boolean_type(3.4, ['3'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('3: Should be a boolean', ex.args[0])

    def test_dict(self):
        try:
            basic_type.boolean_type({'a': 1, 'b': 2}, ['node', '3'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('node.3: Should be a boolean', ex.args[0])

    def test_list(self):
        try:
            basic_type.boolean_type([1, 3, 5], ['node'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('node: Should be a boolean', ex.args[0])


class TestStringMap(unittest.TestCase):

    def test_none(self):
        self.assertEqual(None, basic_type.string_map(None, []))

    def test_string_map(self):
        self.assertEqual({'a': 'b', 'd': 'c'}, basic_type.string_map({'a': 'b', 'd': 'c'}, []))

    def test_string(self):
        try:
            basic_type.string_map('6abc', ['node'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('node: Should be an object', ex.args[0])

    def test_integer(self):
        try:
            basic_type.string_map(4, ['node', '3'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('node.3: Should be an object', ex.args[0])

    def test_float(self):
        try:
            basic_type.string_map(3.4, ['3'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('3: Should be an object', ex.args[0])

    def test_boolean(self):
        try:
            basic_type.string_map(False, ['node'])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('node: Should be an object', ex.args[0])

    def test_list(self):
        try:
            basic_type.string_map(['abc', 'def'], [])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('Should be an object', ex.args[0])

    def test_caontains_non_string(self):
        try:
            basic_type.string_map({'a': 'b', 'd': 4}, [])
            self.assertTrue(False)
        except TypeError as ex:
            self.assertEqual('d: Should be a string', ex.args[0])


if __name__ == '__main__':
    unittest.main()
