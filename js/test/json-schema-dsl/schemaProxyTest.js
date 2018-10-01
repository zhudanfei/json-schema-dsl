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

    it('Should return undefined if the value is missing schema first level', function () {
        const data = {tag: {name: 'abc', level: 10}};
        const proxy = schemaProxy.createProxy(data, schema1);
        const actual = proxy.node.$get();
        assert.isUndefined(actual);
    });

    it('Should return undefined if the object is missing schema first level', function () {
        const data = {node: '5'};
        const proxy = schemaProxy.createProxy(data, schema1);
        const actual = proxy.tag.$get();
        assert.isUndefined(actual);
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

    it('Should return undefined if the value is missing schema second level', function () {
        const data = {tag: {name: 'abc'}};
        const proxy = schemaProxy.createProxy(data, schema1);
        const actual = proxy.tag.level.$get();
        assert.isUndefined(actual);
    });

    it('Should return null if the object is missing schema second level', function () {
        const data = {node: '5'};
        const proxy = schemaProxy.createProxy(data, schema1);
        const actual = proxy.tag.cascade.$get();
        assert.isUndefined(actual);
    });

    it('Should return value in the array', function () {
        const data = {node: '5', user: ['abc', 'xyz']};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = 'xyz';
        const actual = proxy.user[1].$get();
        assert.equal(actual, expected);
    });

    it('Should throw error if name is string in the array', function () {
        const data = {node: '5', user: ['abc', 'xyz']};
        const proxy = schemaProxy.createProxy(data, schema1);
        assert.throws(() => proxy.user.a.$get(), Error, "Index should be integer");
    });

    it('Should return value in the array of object', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = 'xyz';
        const actual = proxy.event[1].name.$get();
        assert.equal(actual, expected);
    });

    it('Should throw error if name is string in the array of object', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        const proxy = schemaProxy.createProxy(data, schema1);
        assert.throws(() => proxy.event.x.name.$get(), Error, "Index should be integer");
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

    it('Should throw error if path is too long in string map', function () {
        const data = {node: '5', spec: {def: '1', size: 'xyz'}};
        const proxy = schemaProxy.createProxy(data, schema1);
        assert.throws(() => proxy.spec.size.abc.$get(), Error, 'Path is too long');
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

    it('Should set value in an empty array', function () {
        const data = {node: '5'};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = {node: '5', user: [undefined, 'abc']};
        proxy.user[1].$set('abc');
        assert.deepEqual(data, expected);
    });

    it('Should throw error if index is not an integer', function () {
        const data = {node: '5', user: ['abc', 'xyz']};
        const proxy = schemaProxy.createProxy(data, schema1);
        proxy.user[1].$set('abc');
        assert.throws(() => proxy.user.x.$set('abc'), Error, 'Index should be integer');
    });

    it('Should set value in the array of object', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = {node: '5', event: [{name: 'abc'}, {name: 'def'}]};
        proxy.event[1].name.$set('def');
        assert.deepEqual(data, expected);
    });

    it('Should set value in an empty array of object', function () {
        const data = {node: '5'};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = {node: '5', event: [undefined, {name: 'def'}]};
        proxy.event[1].name.$set('def');
        assert.deepEqual(data, expected);
    });

    it('Should throw error if index is not an integer in an array of object', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        const proxy = schemaProxy.createProxy(data, schema1);
        assert.throws(() => proxy.event.x.$set('abc'), Error, 'Index should be integer');
    });

    it('Should throw error if path is longer', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        const proxy = schemaProxy.createProxy(data, schema1);
        assert.throws(() => proxy.event[0].name.abc.$set('abc'), Error, "Path is too long");
    });

    it('Should throw error if value is missing in the array of object', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        const proxy = schemaProxy.createProxy(data, schema1);
        assert.throws(() => proxy.event[0].nam.$set('abc'), Error, "Unrecognized field: nam");
    });

    it('Should set value in a string map', function () {
        const data = {node: '5', spec: {def: '1', size: 'xyz'}};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = {node: '5', spec: {def: '1', size: 'abc'}};
        proxy.spec.size.$set('abc');
        assert.deepEqual(data, expected);
    });

    it('Should add value in a string map', function () {
        const data = {node: '5', spec: {def: '1', size: 'xyz'}};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = {node: '5', spec: {def: '1', size: 'xyz', abc: 'def'}};
        proxy.spec.abc.$set('def');
        assert.deepEqual(data, expected);
    });

    it('Should throw error if path is too long in a string map', function () {
        const data = {node: '5', spec: {def: '1', size: 'xyz'}};
        const proxy = schemaProxy.createProxy(data, schema1);
        const expected = {node: '5', spec: {def: '1', size: 'abc'}};
        assert.throws(() => proxy.spec.size.abc.$set('abc')('abc'), Error, "Path is too long");
    });

});
