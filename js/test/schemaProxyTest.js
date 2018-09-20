const assert = require('chai').assert;
const expect = require('chai').expect;

require('../jsonSchemaDSL');
const schemaProxy = require('../schemaProxy');

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
    JsonField('event', JsonArray(JsonObject(JsonField('name', JsonString),
        JsonField('alarm', JsonBoolean)
    )))
);

describe('Schema 1 proxy', function() {
    const proxy = schemaProxy.createProxy(schema1);
    it('Should return value in the first level', function () {
        const data = {node: '5'};
        const expected = '5';
        const actual = proxy.node(data);
        assert.equal(actual, expected);
    });

    it('Should return undefined if the name is not in the schema first level', function () {
        const data = {node: '5'};
        const actual = proxy.nod(data);
        assert.isUndefined(actual);
    });

    it('Should return null if the value is missing schema first level', function () {
        const data = {tag: {name: 'abc', level: 10}};
        const actual = proxy.node(data);
        assert.isNull(actual);
    });

    it('Should return null if the object is missing schema first level', function () {
        const data = {node: '5'};
        const actual = proxy.tag(data);
        assert.isNull(actual);
    });

    it('Should return value in the second level', function () {
        const data = {node: '5', tag: {name: 'abc', level: 10}};
        const expected = 10;
        const actual = proxy.tag.level(data);
        assert.equal(actual, expected);
    });

    it('Should return undefined if the name is not in the schema second level', function () {
        const data = {tag: {name: 'abc', level: 10}};
        const actual = proxy.tag.node(data);
        assert.isUndefined(actual);
    });

    it('Should return null if the value is missing schema second level', function () {
        const data = {tag: {name: 'abc'}};
        const actual = proxy.tag.level(data);
        assert.isNull(actual);
    });

    it('Should return null if the object is missing schema second level', function () {
        const data = {node: '5'};
        const actual = proxy.tag.cascade(data);
        assert.isNull(actual);
    });

    it('Should return null if the object is missing schema second level', function () {
        const data = {tag: {name: 'abc'}};
        const actual = proxy.tag.cascade(data);
        assert.isNull(actual);
    });

});
