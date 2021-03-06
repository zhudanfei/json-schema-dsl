const assert = require('chai').assert;
const expect = require('chai').expect;

require('../../src/json-schema-dsl/jsonSchemaDSL');
const filters = require('../../src/json-schema-dsl/filters');
const jsonOutgoing = require('../../src/json-schema-dsl/jsonOutgoing');

const ToString = filters.ToString;

const schema1 = JsonObject(
    JsonField('node', JsonString),
    JsonField('user', JsonArray(JsonString)),
    JsonField('tag', JsonObject(
        JsonField('name', JsonString),
        JsonField('level', JsonInteger)
    )),
    JsonField('event', JsonArray(JsonObject(
        JsonField('name', JsonString),
        JsonField('alarm', JsonBoolean)
    )))
);


describe('Outgoing Schema 1', function(){
    it('Should throw error when get an integer value in string field', function() {
        const data = {node: 5};
        assert.throws(() => jsonOutgoing.convert(schema1, data, null), Error, "node: Should be a string");
    });

    it('Should return array', function() {
        const data = {'user': ['abc', undefined, 'xxxxxx']};
        const expected = {user:['abc', undefined, 'xxxxxx']};
        const actual = jsonOutgoing.convert(schema1, data);
        assert.deepEqual(actual, expected);
    });

    it('Should throw error when the type of an element in array is not correct', function() {
        const data = {user:['abc', 5, 'xxxxxx']};
        assert.throws(() => jsonOutgoing.convert(schema1, data), Error, "user.1: Should be a string");
    });

    it('Should throw error when get a string value in object field', function() {
        const data = {tag: 'abc'};
        assert.throws(() => jsonOutgoing.convert(schema1, data), Error, "tag: Should be an object");
    });

    it('Should return object', function() {
        const data =  {tag: {name: 'abc'}};
        const expected = {tag:{name: 'abc'}};
        const actual = jsonOutgoing.convert(schema1, data);
        assert.deepEqual(actual, expected);
    });

    it('Should return array of object', function() {
        const data =  {event: [{name: 'abc'}, undefined, {alarm: false}]};
        const expected = {event:[{name: 'abc'}, undefined, {alarm: false}]};
        const actual = jsonOutgoing.convert(schema1, data);
        assert.deepEqual(actual, expected);
    });

    it('Should throw error if an object is in array field', function() {
        const data = {node: '5', user: {abc: 123}};
        assert.throws(() => jsonOutgoing.convert(schema1, data), Error, "user: Should be an array");
    });

});

const schema2 = JsonObject(
    JsonField('node', JsonString),
    JsonField('user', JsonArray(JsonString)),
    JsonField('tag', JsonObject(
        JsonField('name', JsonString),
        JsonField('level', JsonInteger)
    ))
);

describe('Outgoing Schema 2', function() {
    it('Should return object with all null', function () {
        const data = {node: null, user: null, tag: null};
        const expected = {node: null, user: null, tag: null};
        const actual = jsonOutgoing.convert(schema2, data);
        assert.deepEqual(actual, expected);
    });

    it('Should return object with null inside', function () {
        const data = {node: 'abc', user: ['def', null, 'f'], tag: {name: null, level: 2}};
        const expected = {node: 'abc', user: ['def', null, 'f'], tag: {name: null, level: 2}};
        const actual = jsonOutgoing.convert(schema2, data);
        assert.deepEqual(actual, expected);
    });

});

const schema3 = JsonObject(
    JsonField('node', JsonString)
);

describe('Outgoing Schema 3', function() {
    it('Should remove redudancy fields', function () {
        const data = {node: 'abcd', xxx: 6};
        const expected = {node: 'abcd'};
        const actual = jsonOutgoing.convert(schema3, data);
        assert.deepEqual(actual, expected);
    });
});

const schema4 = JsonObject(
    JsonField('name', JsonNumber),
    JsonField('spec', JsonStringMap)
);

describe('Outgoing Schema 4 StringMap', function() {
    it('Should throw error when the type is not object', function() {
        const data = {name:1.99, spec:'def'};
        assert.throws(() => jsonOutgoing.convert(schema4, data), Error, "spec: Should be an object");
    });

    it('Should throw error when the element type is not string', function () {
        const data = {name:1.99, spec:{def:1, size:'xyz'}};
        assert.throws(() => jsonOutgoing.convert(schema4, data), Error, "spec.def: Should be a string");
    });

    it('Should return string map', function () {
        const data = {name:1.99, spec:{def:'1', size:'xyz'}};
        const expected = {name:1.99, spec:{def:'1', size:'xyz'}};
        const actual = jsonOutgoing.convert(schema4, data);
        assert.deepEqual(actual, expected);
    });
});

const schema5 = JsonObject(
    JsonField('object_id', JsonString, ToString),
    JsonField('userIds', JsonArray(JsonString, ToString))
);

describe('Outgoing Schema 5', function() {
    it('Should use filters', function () {
        const data = {object_id: 56, userIds: [3, 7]};
        const expected = {object_id: '56', userIds:['3', '7']};
        const actual = jsonOutgoing.convert(schema5, data);
        assert.deepEqual(actual, expected);
    });
});

const schema6 = JsonObject(
    JsonField('f1', JsonAny),
    JsonField('f2', JsonAny),
    JsonField('f3', JsonAny),
    JsonField('f4', JsonAny),
    JsonField('f5', JsonAny)
);

describe('Outgoing Schema 6', function() {
    it('Should return any type', function () {
        const data = {f1:'v1', f2:78, f3:false, f4:{a:5, b:'7'}, f5:['123', 456], f6:'xyz'};
        const expected = {f1:'v1', f2:78, f3:false, f4:{a:5, b:'7'}, f5:['123', 456]};
        const actual = jsonOutgoing.convert(schema6, data);
        assert.deepEqual(actual, expected);
    });
});

const schema7 = JsonArray(JsonObject(
    JsonField('user', JsonString)
));

describe('Outgoing Schema 7', function() {
    it('Should return an array', function () {
        const data = [{user: 'xyz'}];
        const expected = [{user: 'xyz'}];
        const actual = jsonOutgoing.convert(schema7, data, null);
        assert.deepEqual(actual, expected);
    });
});

