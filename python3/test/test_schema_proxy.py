import unittest

from src.json_schema_dsl import *
from src import schema_proxy


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


class TestSchemaProxy(unittest.TestCase):

    def test_get_array_object(self):
        data = {'node': '5', 'event': [{'name': 'abc'}, {'name': 'xyz'}]}
        expected = 'xyz'
        proxy = schema_proxy.Proxy(data, schema1)
        actual = proxy.event[1].name._GET_()
        self.assertEqual(expected, actual)

    def test_set_array_object(self):
        data = {'node': '5'}
        expected ={'node': '5', 'event': [None, {'name': 'def'}]}
        proxy = schema_proxy.Proxy(data, schema1)
        proxy.event[1].name._SET_('def')
        self.assertEqual(expected, data)


if __name__ == '__main__':
    unittest.main()
