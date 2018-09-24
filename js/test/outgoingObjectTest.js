const assert = require('chai').assert;
const expect = require('chai').expect;

require('../jsonSchemaDSL');
const filters = require('../filters');
const jsonOutgoing = require('../jsonOutgoing');

const IntegerToString = filters.integerToString;

const schema1 = JsonObject(
    JsonField('node', JsonString),
    JsonField('user', JsonArray(JsonString)),
    JsonField('tag', JsonObject(JsonField('name', JsonString),
        JsonField('level', JsonInteger),
    )),
    JsonField('event', JsonArray(JsonObject(JsonField('name', JsonString),
        JsonField('alarm', JsonBoolean)
    )))
);


describe('Outgoing Schema 1', function(){
    it('Should throw error when get an integer value in string field', function() {
        const data = {node: 5};
        assert.throws(() => jsonOutgoing.convert(schema1, data), Error, "node: Should be a string");
    });

    it('Should return array', function() {
        const data = {'user': ['abc', 'def', 'xxxxxx']};
        const expected = {node:null, user:['abc', 'def', 'xxxxxx'], tag:null, event:null};
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
        const expected = {node:null, user:null, tag:{name: 'abc', level:null}, event:null};
        const actual = jsonOutgoing.convert(schema1, data);
        assert.deepEqual(actual, expected);
    });

    it('Should return array of object', function() {
        const data =  {event: [{name: 'abc'}, {alarm: false}]};
        const expected = {node:null, user:null, tag:null, event:[{name: 'abc', alarm:null}, {name:null, alarm: false}]};
        const actual = jsonOutgoing.convert(schema1, data);
        assert.deepEqual(actual, expected);
    });

});

const schema2 = JsonObject(
    JsonField('node', JsonString),
    JsonField('user', JsonArray(JsonString)),
    JsonField('tag', JsonObject(JsonField('name', JsonString),
        JsonField('level', JsonInteger),
    )),
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
    JsonField('node', JsonString),
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
    JsonField('name', JsonString),
    JsonField('spec', JsonStringMap),
);

describe('Outgoing Schema 4 StringMap', function() {
    it('Should throw error when the type is not object', function() {
        const data = {name:'abc', spec:'def'};
        assert.throws(() => jsonOutgoing.convert(schema4, data), Error, "spec: Should be an object");
    });

    it('Should throw error when the element type is not string', function () {
        const data = {name:'abc', spec:{def:1, size:'xyz'}};
        assert.throws(() => jsonOutgoing.convert(schema4, data), Error, "spec.def: Should be a string");
    });

    it('Should return string map', function () {
        const data = {name:'abc', spec:{def:'1', size:'xyz'}};
        const expected = {name:'abc', spec:{def:'1', size:'xyz'}};
        const actual = jsonOutgoing.convert(schema4, data);
        assert.deepEqual(actual, expected);
    });
});

const schema5 = JsonObject(
    JsonField('object_id', JsonString, IntegerToString),
    JsonField('userIds', JsonArray(JsonString, IntegerToString))
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
    JsonField('f5', JsonAny),
);

describe('Outgoing Schema 6', function() {
    it('Should return any type', function () {
        const data = {f1:'v1', f2:78, f3:false, f4:{a:5, b:'7'}, f5:['123', 456], f6:'xyz'};
        const expected = {f1:'v1', f2:78, f3:false, f4:{a:5, b:'7'}, f5:['123', 456]};
        const actual = jsonOutgoing.convert(schema6, data);
        assert.deepEqual(actual, expected);
    });
});

