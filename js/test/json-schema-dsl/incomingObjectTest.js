const assert = require('chai').assert;
const expect = require('chai').expect;

require('../../src/json-schema-dsl/jsonSchemaDSL');
const filters = require('../../src/json-schema-dsl/filters');
const jsonIncoming = require('../../src/json-schema-dsl/jsonIncoming');

const MaxLength = filters.maxLength;
const MinLength = filters.minLength;
const Range = filters.range;
const NotNull = filters.notNull;

const ROOT = ['root'];

const schema1 = JsonObject(
    JsonField('node', JsonString, MaxLength(6)),
    JsonField('user', JsonArray(JsonString, MaxLength(6))),
    JsonField('tag', JsonObject(JsonField('name', JsonString, MaxLength(4)),
        JsonField('level', JsonInteger, Range(0, 3))
    )),
    JsonField('event', JsonArray(JsonObject(JsonField('name', JsonString, MaxLength(3)),
        JsonField('alarm', JsonBoolean)
    )))
);

describe('Incoming Schema 1', function(){
    it('Should throw error when get an integer value in string field', function() {
        const data = {node: 5};
        assert.throws(() => jsonIncoming.convert(schema1, data), Error, "node: Should be a string");
    });

    it('Should return array', function() {
        const data = {user:['abc', 'def', 'xxxxxx']};
        const expected = {node:null, user:['abc', 'def', 'xxxxxx'], tag:null, event:null};
        const actual = jsonIncoming.convert(schema1, data);
        assert.deepEqual(actual, expected);
    });

    it('Should throw error when the type of an element in array is not correct', function() {
        const data = {user:['abc', 5, 'xxxxxx']};
        assert.throws(() => jsonIncoming.convert(schema1, data), Error, "user.1: Should be a string");
    });

    it('Should throw error if the value is larger than the upper limit', function() {
        const data = {tag: {name: 'abc', level: 4}};
        assert.throws(() => jsonIncoming.convert(schema1, data), Error, "tag.level: Value is too large");
    });

    it('Should throw error when get a string value in object field', function() {
        const data = {tag: 'abc'};
        assert.throws(() => jsonIncoming.convert(schema1, data), Error, "tag: Should be an object");
    });

    it('Should return object', function() {
        const data =  {tag: {name: 'abc'}};
        const expected = {node:null, user:null, tag:{name: 'abc', level:null}, event:null};
        const actual = jsonIncoming.convert(schema1, data);
        assert.deepEqual(actual, expected);
    });

    it('Should throw error when the length of an element exceed the limit', function() {
        const data = {event: [{name: 'abcd', alarm: true}, {name: 'def', alarm: false}]};
        assert.throws(() => jsonIncoming.convert(schema1, data), Error, "event.0.name: String is too long");
    });

    it('Should return array of object', function() {
        const data =  {event: [{name: 'abc'}, {alarm: false}]};
        const expected = {node:null, user:null, tag:null, event:[{name: 'abc', alarm:null}, {name:null, alarm: false}]};
        const actual = jsonIncoming.convert(schema1, data);
        assert.deepEqual(actual, expected);
    });

});

const schema2 = JsonObject(
    JsonField('node', JsonString, MaxLength(4)),
    JsonField('user', JsonArray(JsonString, MaxLength(6))),
    JsonField('tag', JsonObject(JsonField('name', JsonString, MaxLength(4)),
        JsonField('level', JsonInteger, Range(0, 3)),
    )),
);

describe('Incoming Schema 2', function() {
    it('Should convert all null', function () {
        const data = {node: null, user: null, tag: null};
        const expected = {node: null, user: null, tag: null};
        const actual = jsonIncoming.convert(schema2, data, ROOT);
        assert.deepEqual(actual, expected);
    });

    it('Should convert null inside object', function () {
        const data = {node: 'abc', user: ['def', null, 'f'], tag: {name: null, level: 2}};
        const expected = {node: 'abc', user: ['def', null, 'f'], tag: {name: null, level: 2}};
        const actual = jsonIncoming.convert(schema2, data);
        assert.deepEqual(actual, expected);
    });

});

const schema3 = JsonObject(
    JsonField('node', JsonString, NotNull, MaxLength(4)),
);

describe('Incoming Schema 3', function() {
    it('Should throw error when get a null in a not null field', function () {
        const data = {node: null};
        assert.throws(() => jsonIncoming.convert(schema3, data), Error, "node: Cannot be null");
    });

    it('Should support 2 filters', function () {
        const data = {node: 'abcde'};
        assert.throws(() => jsonIncoming.convert(schema3, data, ROOT), Error, "root.node: String is too long");
    });

    it('Should throw error if there is a redundant field', function () {
        const data = {node: 'abcd', xxx:6};
        assert.throws(() => jsonIncoming.convert(schema3, data, ROOT), Error, "root: Unrecognized field: xxx");
    });

});

const schema4 = JsonArray(JsonObject(
    JsonField('arrayOfObject', JsonString, NotNull, MaxLength(4)),
));

describe('Incoming Schema 4', function() {
    it('Should throw error when the length of an item exceed the limit', function () {
        const data = [{arrayOfObject: 'def'}, {arrayOfObject: 'abcde'}];
        assert.throws(() => jsonIncoming.convert(schema4,data), Error, "1.arrayOfObject: String is too long");
    });

});

const schema5 = JsonObject(
    JsonField('node', JsonString),
    JsonField('event_id', JsonArray(JsonInteger), NotNull),
);

describe('Incoming Schema 5', function() {
    it('Should throw error when get a null in a not null field', function () {
        const data = {node: 'abc'};
        assert.throws(() => jsonIncoming.convert(schema5,data), Error, "event_id: Cannot be null");
    });

});

const schema6 = JsonObject(
    JsonField('name', JsonNumber),
    JsonField('spec', JsonStringMap, NotNull),
);

describe('Incoming Schema 6', function() {
    it('Should throw error when type is not match', function () {
        const data = {name:1.99, spec:'def'};
        assert.throws(() => jsonIncoming.convert(schema6,data), Error, "spec: Should be an object");
    });

    it('Should throw error when an integer is in a string map', function () {
        const data = {name:1.99, spec:{def:1, size:'xyz'}};
        assert.throws(() => jsonIncoming.convert(schema6,data), Error, "spec.def: Should be a string");
    });

    it('Should convert string map & number', function () {
        const data = {name:1.99, spec:{def:'1', size:'xyz'}};
        const expected = {name:1.99, spec:{def:'1', size:'xyz'}};
        const actual = jsonIncoming.convert(schema6,data, ROOT);
        assert.deepEqual(actual, expected);
    });
});

