const assert = require('chai').assert;
const expect = require('chai').expect;

require('../json-schema-dsl');
require('../filters');

let schema1 = JsonObject(
    JsonField('node', JsonString, MaxLength(6)),
    JsonField('user', JsonArray(JsonString, MaxLength(6))),
    JsonField('tag', JsonObject(JsonField('name', JsonString, MaxLength(4)),
        JsonField('level', JsonInteger, Range(0, 3))
    )),
    JsonField('event', JsonArray(JsonObject(JsonField('name', JsonString, MaxLength(3)),
        JsonField('alarm', JsonBoolean)
    )))
);

describe('Schema 1', function(){
    it('Should throw error when get an integer value in string JsonField', function() {
        let data = {node: 5};
        assert.throws(() => schema1(data), Error, "node:Should be a string");
    });

    it('Should return array', function() {
        let data = {user:['abc', 'def', 'xxxxxx']};
        let expected = {node:null, user:['abc', 'def', 'xxxxxx'], tag:null, event:null};
        let actual = schema1(data);
        assert.deepEqual(expected, actual);
    });

    it('Should throw error when the type of an element in array is not correct', function() {
        let data = {user:['abc', 5, 'xxxxxx']};
        assert.throws(() => schema1(data), Error, "user.1:Should be a string");
    });

    it('Should throw error if the value is larger than the upper limit', function() {
        let data = {tag: {name: 'abc', level: 4}};
        assert.throws(() => schema1(data), Error, "tag.level:Value is too large");
    });

    it('Should throw error when get a string value in object JsonField', function() {
        let data = {tag: 'abc'};
        assert.throws(() => schema1(data), Error, "tag:Should be an object");
    });

    it('Should return object', function() {
        let data =  {tag: {name: 'abc'}};
        let expected = {node:null, user:null, tag:{name: 'abc', level:null}, event:null};
        let actual = schema1(data);
        assert.deepEqual(expected, actual);
    });

    it('Should throw error when the length of an element exceed the limit', function() {
        let data = {event: [{name: 'abcd', alarm: true}, {name: 'def', alarm: false}]};
        assert.throws(() => schema1(data), Error, "event.0.name:String is too long");
    });

    it('Should return array of object', function() {
        let data =  {event: [{name: 'abc'}, {alarm: false}]};
        let expected = {node:null, user:null, tag:null, event:[{name: 'abc', alarm:null}, {name:null, alarm: false}]};
        let actual = schema1(data);
        assert.deepEqual(expected, actual);
    });

});

let schema2 = JsonObject(
    JsonField('node', JsonString, MaxLength(4)),
    JsonField('user', JsonArray(JsonString, MaxLength(6))),
    JsonField('tag', JsonObject(JsonField('name', JsonString, MaxLength(4)),
        JsonField('level', JsonInteger, Range(0, 3)),
    )),
);

const ROOT = ['root'];

describe('Schema 2', function() {
    it('Should convert all null', function () {
        let data = {node: null, user: null, tag: null};
        let expected = {node: null, user: null, tag: null};
        let actual = schema2(data, ROOT);
        assert.deepEqual(expected, actual);
    });

    it('Should convert null inside object', function () {
        let data = {node: 'abc', user: ['def', null, 'f'], tag: {name: null, level: 2}};
        let expected = {node: 'abc', user: ['def', null, 'f'], tag: {name: null, level: 2}};
        let actual = schema2(data);
        assert.deepEqual(expected, actual);
    });

});

let schema3 = JsonObject(
    JsonField('node', JsonString, NotNull, MaxLength(4)),
);

describe('Schema 3', function() {
    it('Should throw error when get a null in a not null JsonField', function () {
        let data = {node: null};
        assert.throws(() => schema3(data), Error, "node:Cannot be null");
    });

    it('Should support 2 filters', function () {
        let data = {node: 'abcde'};
        assert.throws(() => schema3(data, ROOT), Error, "root.node:String is too long");
    });

    it('Should throw error if there is a redundant JsonField', function () {
        let data = {node: 'abcd', xxx:6};
        assert.throws(() => schema3(data, ROOT), Error, "root:Unrecognized field: xxx");
    });

});

let schema4 = JsonArray(JsonObject(
    JsonField('arrayOfObject', JsonString, NotNull, MaxLength(4)),
));

describe('Schema 4', function() {
    it('Should throw error when the length of an item exceed the limit', function () {
        let data = [{arrayOfObject: 'def'}, {arrayOfObject: 'abcde'}];
        assert.throws(() => schema4(data), Error, "1.arrayOfObject:String is too long");
    });

});

let schema5 = JsonObject(
    JsonField('node', JsonString),
    JsonField('event_id', JsonArray(JsonInteger), NotNull),
);

describe('Schema 5', function() {
    it('Should throw error when get a null in a not null JsonField', function () {
        let data = {node: 'abc'};
        assert.throws(() => schema5(data), Error, "event_id:Cannot be null");
    });

});

let schema6 = JsonObject(
    JsonField('name', JsonString),
    JsonField('spec', JsonStringMap, NotNull),
);

describe('Schema 6', function() {
    it('Should throw error when type is not match', function () {
        let data = {name:'abc', spec:'def'};
        assert.throws(() => schema6(data), Error, "spec:Should be an object");
    });

    it('Should throw error when an integer is in a string map', function () {
        let data = {name:'abc', spec:{def:1, size:'xyz'}};
        assert.throws(() => schema6(data), Error, "spec.def:Should be a string");
    });

    it('Should convert string map', function () {
        let data = {name:'abc', spec:{def:'1', size:'xyz'}};
        let expected = {name:'abc', spec:{def:'1', size:'xyz'}};
        let actual = schema6(data, ROOT);
        assert.deepEqual(expected, actual);
    });
});

