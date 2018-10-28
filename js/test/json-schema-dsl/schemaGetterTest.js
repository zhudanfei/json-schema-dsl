const assert = require('chai').assert;
const expect = require('chai').expect;

require('../../src/json-schema-dsl/jsonSchemaDSL');
const schemaGetter = require('../../src/json-schema-dsl/schemaGetter');

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

describe('Schema 1 getter', function () {
    it('Should return value in the first level', function () {
        const data = {node: '5'};
        const expected = '5';
        const actual = schemaGetter(schema1, ['node'], data);
        assert.equal(actual, expected);
    });

    it('Should return whole object in the first level', function () {
        const data = {node: '5', tag: {name: 'abc', level: 10}};
        const expected = {name: 'abc', level: 10};
        const actual = schemaGetter(schema1, ['tag'], data);
        assert.deepEqual(actual, expected);
    });

    it('Should throw error if the name is not in the schema first level', function () {
        const data = {node: '5'};
        assert.throws(() => schemaGetter(schema1, ['nod'], data), Error, "Unrecognized field: nod");
    });

    it('Should return undefined if the value is missing schema first level', function () {
        const data = {tag: {name: 'abc', level: 10}};
        const actual = schemaGetter(schema1, ['node'], data);
        assert.isUndefined(actual);
    });

    it('Should return undefined if the object is missing schema first level', function () {
        const data = {node: '5'};
        const actual = schemaGetter(schema1, ['tag'], data);
        assert.isUndefined(actual);
    });

    it('Should return value in the second level', function () {
        const data = {node: '5', tag: {name: 'abc', level: 10}};
        const expected = 10;
        const actual = schemaGetter(schema1, ['tag', 'level'], data);
        assert.equal(actual, expected);
    });

    it('Should throw error if path is too long', function () {
        const data = {node: '5', tag: {name: 'abc', level: 10}};
        assert.throws(() => schemaGetter(schema1, ['tag', 'level', 'x'], data), Error, "Path is too long");
    });

    it('Should throw error if the name is not in the schema second level', function () {
        const data = {tag: {name: 'abc', level: 10}};
        assert.throws(() => schemaGetter(schema1, ['tag', 'node'], data), Error, "Unrecognized field: node");
    });

    it('Should throw error if the name is not in the schema twice', function () {
        const data = {tag: {name: 'abc', level: 10}};
        assert.throws(() => schemaGetter(schema1, ['nod', 'node'], data), Error, "Unrecognized field: nod");
    });

    it('Should return undefined if the value is missing schema second level', function () {
        const data = {tag: {name: 'abc'}};
        const actual = schemaGetter(schema1, ['tag', 'level'], data);
        assert.isUndefined(actual);
    });

    it('Should return undefined if the object is missing schema second level', function () {
        const data = {node: '5'};
        const actual = schemaGetter(schema1, ['tag', 'cascade'], data);
        assert.isUndefined(actual);
    });

    it('Should return value in the array', function () {
        const data = {node: '5', user: ['abc', 'xyz']};
        const expected = 'xyz';
        const actual = schemaGetter(schema1, ['user', '1'], data);
        assert.equal(actual, expected);
    });

    it('Should throw error if name is string in the array', function () {
        const data = {node: '5', user: ['abc', 'xyz']};
        assert.throws(() => schemaGetter(schema1, ['user', 'a'], data), Error, "Index should be integer");
    });

    it('Should return value in the array of object', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        const expected = 'xyz';
        const actual = schemaGetter(schema1, ['event', '1', 'name'], data);
        assert.equal(actual, expected);
    });

    it('Should throw error if name is string in the array of object', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        assert.throws(() => schemaGetter(schema1, ['event', 'x', 'name'], data), Error, "Index should be integer");
    });

    it('Should throw error if path is longer', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        assert.throws(() => schemaGetter(schema1, ['event', '0', 'name', 'abc'], data), Error, "Path is too long");
    });

    it('Should throw error if value is missing in the array of object', function () {
        const data = {node: '5', event: [{name: 'abc'}, {name: 'xyz'}]};
        assert.throws(() => schemaGetter(schema1, ['event', '0', 'nam'], data), Error, "Unrecognized field: nam");
    });

    it('Should return value in a string map', function () {
        const data = {node: '5', spec: {def: '1', size: 'xyz'}};
        const expected = 'xyz';
        const actual = schemaGetter(schema1, ['spec', 'size'], data);
        assert.equal(actual, expected);
    });

    it('Should throw error if path is too long in string map', function () {
        const data = {node: '5', spec: {def: '1', size: 'xyz'}};
        assert.throws(() => schemaGetter(schema1, ['spec', 'size', 'abc'], data), Error, 'Path is too long');
    });

});

