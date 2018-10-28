const assert = require('chai').assert;
const expect = require('chai').expect;

require('../../src/json-schema-dsl/jsonSchemaDSL');
const schemaProxy = require('../../src/json-schema-dsl/schemaProxy');

const schema1 = JsonObject(
    JsonField('node', JsonString),
    JsonField('user', JsonArray(JsonString)),
    JsonField('tag', JsonObject(
        JsonField('name', JsonString),
        JsonField('level', JsonInteger),
        JsonField('cascade', JsonObject(
            JsonField('amount', JsonString)
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
);

describe('Schema 1 proxy', function () {
    it('Should return value in the array of object', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = 'xyz';
        const actual = proxy.event[1].name.$get();
        assert.equal(actual, expected);
    });

    it('Should set value in an empty array of object', function () {
        const data = {node: '5'};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = {node: '5', event: [undefined, {name: 'def'}]};
        proxy.event[1].name.$set('def');
        assert.deepEqual(data, expected);
    });

});

