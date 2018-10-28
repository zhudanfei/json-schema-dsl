const assert = require('chai').assert;
const expect = require('chai').expect;

require('../../src/json-schema-dsl/jsonSchemaDSL');
const schemaSetter = require('../../src/json-schema-dsl/schemaSetter');

const schema1 = JsonObject(
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
);

describe('Schema 1 setter', function () {
    it('Should throw error if the object itself is set', function () {
        const data = {};
        assert.throws(() => schemaSetter(schema1, [], data, {}), Error, 'Cannot set itself');
    });

    it('Should set value in the first level', function () {
        const data = {};
        const expected = {node: '5'};
        schemaSetter(schema1, ['node'], data, '5');
        assert.deepEqual(data, expected);
    });

    it('Should set whole object in the first level', function () {
        const data = {node: '5'};
        const expected = {node: '5', tag: {name: 'abc', level: 10}};
        schemaSetter(schema1, ['tag'], data, {name: 'abc', level: 10});
        assert.deepEqual(data, expected);
    });

    it('Should throw error if the name is not in the schema first level', function () {
        const data = {node: '5'};
        assert.throws(() => schemaSetter(schema1, ['nod'], data, 5), Error, "Unrecognized field: nod");
    });

    it('Should set value in the second level', function () {
        const data = {node: '5', tag: {name: 'abc', level: 10}};
        const expected = {node: '5', tag: {name: 'abc', level: 7}};
        schemaSetter(schema1, ['tag', 'level'], data, 7);
        assert.deepEqual(data, expected);
    });

    it('Should set value in the second level even it is null', function () {
        const data = {node: '5'};
        const expected = {node: '5', tag: {level: 7}};
        schemaSetter(schema1, ['tag', 'level'], data, 7);
        assert.deepEqual(data, expected);
    });

    it('Should throw error if path is too long', function () {
        const data = {node: '5'};
        assert.throws(() => schemaSetter(schema1, ['node', 'level'], data, 7), Error, 'Path is too long');
    });

    it('Should throw error if the name is not in the schema second level', function () {
        const data = {};
        assert.throws(() => schemaSetter(schema1, ['tag', 'node'], data, '5'), Error, "Unrecognized field: node");
    });

    it('Should throw error if the name is not in the schema twice', function () {
        const data = {};
        assert.throws(() => schemaSetter(schema1, ['nod', 'node'], data, '5'), Error, "Unrecognized field: nod");
    });

    it('Should set value in the array', function () {
        const data = {node: '5', user: ['abc', 'xyz']};
        const expected = {node: '5', user: ['abc', 'abc']};
        schemaSetter(schema1, ['user', '1'], data, 'abc');
        assert.deepEqual(data, expected);
    });

    it('Should set value in an empty array', function () {
        const data = {node: '5'};
        const expected = {node: '5', user: [undefined, 'abc']};
        schemaSetter(schema1, ['user', '1'], data, 'abc');
        assert.deepEqual(data, expected);
    });

    it('Should throw error if index is not an integer', function () {
        const data = {node: '5', user: ['abc', 'xyz']};
        assert.throws(() => schemaSetter(schema1, ['user', 'x'], data, 'abc'), Error, 'Index should be integer');
    });

    it('Should set value in the array of object', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        const expected = {node: '5', event: [{name: 'abc'}, {name: 'def'}]};
        schemaSetter(schema1, ['event', '1', 'name'], data, 'def');
        assert.deepEqual(data, expected);
    });

    it('Should throw error if index is not an integer(array of object)', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        assert.throws(() => schemaSetter(schema1, ['event', 'x', 'name'], data, 'abc'), Error, 'Index should be integer');
    });

    it('Should set value in an empty array of object', function () {
        const data = {node: '5'};
        const expected = {node: '5', event: [undefined, {name: 'def'}]};
        schemaSetter(schema1, ['event', '1', 'name'], data, 'def');
        assert.deepEqual(data, expected);
    });

    it('Should throw error if index is not an integer in an array of object', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        assert.throws(() => schemaSetter(schema1, ['event', 'x'], data, 'abc'), Error, 'Index should be integer');
    });

    it('Should throw error if path is longer', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        assert.throws(() => schemaSetter(schema1, ['event', '0', 'name', 'abc'], data, 'abc'), Error, "Path is too long");
    });

    it('Should throw error if value is missing in the array of object', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        assert.throws(() => schemaSetter(schema1, ['event', '0', 'nam'], data, 'abc'), Error, "Unrecognized field: nam");
    });

    it('Should set value in a string map', function () {
        const data = {node: '5', spec: {def: '1', size: 'xyz'}};
        const expected = {node: '5', spec: {def: '1', size: 'abc'}};
        schemaSetter(schema1, ['spec', 'size'], data, 'abc');
        assert.deepEqual(data, expected);
    });

    it('Should add value in a string map', function () {
        const data = {node: '5', spec: {def: '1', size: 'xyz'}};
        const expected = {node: '5', spec: {def: '1', size: 'xyz', abc: 'def'}};
        schemaSetter(schema1, ['spec', 'abc'], data, 'def');
        assert.deepEqual(data, expected);
    });

    it('Should throw error if path is too long in a string map', function () {
        const data = {node: '5', spec: {def: '1', size: 'xyz'}};
        assert.throws(() => schemaSetter(schema1, ['spec', 'size', 'abc'], data, 'abc'), Error, "Path is too long");
    });

});
