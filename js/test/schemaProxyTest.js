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
    JsonField('event', JsonArray(
        JsonObject(
            JsonField('name', JsonString),
            JsonField('alarm', JsonBoolean)
        )
        )
    ),
    JsonField('spec', JsonStringMap),
);

describe('Schema 1 proxy', function () {
    it('Should return value in the first level', function () {
        const data = {node: '5'};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = '5';
        const actual = proxy.node.$get();
        assert.equal(actual, expected);
    });

    it('Should return whole object in the first level', function () {
        const data = {node: '5', tag: {name: 'abc', level: 10}};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = {name: 'abc', level: 10};
        const actual = proxy.tag.$get();
        assert.deepEqual(actual, expected);
    });

    it('Should return undefined if the name is not in the schema first level', function () {
        const data = {node: '5'};
        const proxy = schemaProxy.createProxy(data, schema1);
        assert.throws(() => proxy.nod.$get(), Error, "Unrecognized field: nod");
    });

    it('Should return null if the value is missing schema first level', function () {
        const data = {tag: {name: 'abc', level: 10}};
        const proxy = schemaProxy.createProxy(data, schema1);
        const actual = proxy.node.$get();
        assert.isNull(actual);
    });

    it('Should return null if the object is missing schema first level', function () {
        const data = {node: '5'};
        const proxy = schemaProxy.createProxy(data, schema1);
        const actual = proxy.tag.$get();
        assert.isNull(actual);
    });

    it('Should return value in the second level', function () {
        const data = {node: '5', tag: {name: 'abc', level: 10}};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = 10;
        const actual = proxy.tag.level.$get();
        assert.equal(actual, expected);
    });

    it('Should throw error if there is no second level', function () {
        const data = {node: '5', tag: {name: 'abc', level: 10}};
        const proxy = schemaProxy.createProxy(data, schema1);
        assert.throws(() => proxy.tag.level.x.$get(), Error, "Path is too long");
    });

    it('Should return undefined if the name is not in the schema second level', function () {
        const data = {tag: {name: 'abc', level: 10}};
        const proxy = schemaProxy.createProxy(data, schema1);
        assert.throws(() => proxy.tag.node.$get(), Error, "Unrecognized field: node");
    });

    it('Should return undefined if the name is not in the schema twice', function () {
        const data = {tag: {name: 'abc', level: 10}};
        const proxy = schemaProxy.createProxy(data, schema1);
        assert.throws(() => proxy.nod.node.$get(), Error, "Unrecognized field: nod");
    });

    it('Should return null if the value is missing schema second level', function () {
        const data = {tag: {name: 'abc'}};
        const proxy = schemaProxy.createProxy(data, schema1);
        const actual = proxy.tag.level.$get();
        assert.isNull(actual);
    });

    it('Should return null if the object is missing schema second level', function () {
        const data = {node: '5'};
        const proxy = schemaProxy.createProxy(data, schema1);
        const actual = proxy.tag.cascade.$get();
        assert.isNull(actual);
    });

    it('Should return null if the object is missing schema second level', function () {
        const data = {tag: {name: 'abc'}};
        const proxy = schemaProxy.createProxy(data, schema1);
        const actual = proxy.tag.cascade.$get();
        assert.isNull(actual);
    });

    it('Should return value in the array', function () {
        const data = {node: '5', user: ['abc', 'xyz']};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = 'xyz';
        const actual = proxy.user[1].$get();
        assert.equal(actual, expected);
    });

    it('Should return undefined if name is string in the array', function () {
        const data = {node: '5', user: ['abc', 'xyz']};
        const proxy = schemaProxy.createProxy(data, schema1);
        const actual = proxy.user.a.$get();
        assert.isUndefined(actual);
    });

    it('Should return value in the array of object', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = 'xyz';
        const actual = proxy.event[1].name.$get();
        assert.equal(actual, expected);
    });

    it('Should return undefined if name is string in the array', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        const proxy = schemaProxy.createProxy(data, schema1);
        const actual = proxy.event.x.name.$get();
        assert.isUndefined(actual);
    });

    it('Should return undefined if path is longer', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        const proxy = schemaProxy.createProxy(data, schema1);
        assert.throws(() => proxy.event[0].name.abc.$get(), Error, "Path is too long");
    });

    it('Should return undefined if value is missing in the array of object', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        const proxy = schemaProxy.createProxy(data, schema1);
        assert.throws(() => proxy.event[0].nam.$get(), Error, "Unrecognized field: nam");
    });

    it('Should return value in a string map', function () {
        const data = {node: '5', spec: {def: '1', size: 'xyz'}};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = 'xyz';
        const actual = proxy.spec.size.$get();
        assert.equal(actual, expected);
    });

});

