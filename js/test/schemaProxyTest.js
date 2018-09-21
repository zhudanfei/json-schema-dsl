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

describe('Schema 1 proxy getter', function () {
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

    it('Should throw error if the name is not in the schema first level', function () {
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

    it('Should throw error if path is too long', function () {
        const data = {node: '5', tag: {name: 'abc', level: 10}};
        const proxy = schemaProxy.createProxy(data, schema1);
        assert.throws(() => proxy.tag.level.x.$get(), Error, "Path is too long");
    });

    it('Should throw error if the name is not in the schema second level', function () {
        const data = {tag: {name: 'abc', level: 10}};
        const proxy = schemaProxy.createProxy(data, schema1);
        assert.throws(() => proxy.tag.node.$get(), Error, "Unrecognized field: node");
    });

    it('Should throw error if the name is not in the schema twice', function () {
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

    it('Should throw error if path is longer', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        const proxy = schemaProxy.createProxy(data, schema1);
        assert.throws(() => proxy.event[0].name.abc.$get(), Error, "Path is too long");
    });

    it('Should throw error if value is missing in the array of object', function () {
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

describe('Schema 1 proxy setter', function () {
    it('Should throw error if the object itself is set', function () {
        const data = {};
        const proxy = schemaProxy.createProxy(data, schema1);
        assert.throws(() => proxy.$set(), Error, 'Cannot set itself');
    });

    it('Should set value in the first level', function () {
        const data = {};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = {node: '5'};
        proxy.node.$set('5');
        assert.deepEqual(data, expected);
    });

    it('Should set whole object in the first level', function () {
        const data = {node: '5'};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = {node: '5', tag: {name: 'abc', level: 10}};
        proxy.tag.$set({name: 'abc', level: 10});
        assert.deepEqual(data, expected);
    });

    it('Should throw error if the name is not in the schema first level', function () {
        const data = {node: '5'};
        const proxy = schemaProxy.createProxy(data, schema1);
        assert.throws(() => proxy.nod.$set(5), Error, "Unrecognized field: nod");
    });

    it('Should set value in the second level', function () {
        const data = {node: '5', tag: {name: 'abc', level: 10}};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = {node: '5', tag: {name: 'abc', level: 7}};
        proxy.tag.level.$set(7);
        assert.deepEqual(data, expected);
    });

    it('Should set value in the second level even it is null', function () {
        const data = {node: '5'};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = {node: '5', tag: {level: 7}};
        proxy.tag.level.$set(7);
        assert.deepEqual(data, expected);
    });

    it('Should throw error if path is too long', function () {
        const data = {node: '5'};
        const proxy = schemaProxy.createProxy(data, schema1);
        assert.throws(() => proxy.node.level.$set(7), Error, 'Path is too long');
    });

    it('Should throw error if the name is not in the schema second level', function () {
        const data = {};
        const proxy = schemaProxy.createProxy(data, schema1);
        assert.throws(() => proxy.tag.node.$set('5'), Error, "Unrecognized field: node");
    });

    it('Should throw error if the name is not in the schema twice', function () {
        const data = {};
        const proxy = schemaProxy.createProxy(data, schema1);
        assert.throws(() => proxy.nod.node.$set('5'), Error, "Unrecognized field: nod");
    });

    it('Should set value in the array', function () {
        const data = {node: '5', user: ['abc', 'xyz']};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = {node: '5', user: ['abc', 'abc']};
        proxy.user[1].$set('abc');
        assert.deepEqual(data, expected);
    });

});
