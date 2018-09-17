const assert = require('chai').assert;
const expect = require('chai').expect;

require('../jsonSchemaDSL');
require('../filters');

let schema1 = JsonOutgoingObject(
    JsonField('node', JsonString),
    JsonField('user', JsonArray(JsonString)),
    JsonField('tag', JsonOutgoingObject(JsonField('name', JsonString),
        JsonField('level', JsonInteger),
    )),
    JsonField('event', JsonArray(JsonOutgoingObject(JsonField('name', JsonString),
        JsonField('alarm', JsonBoolean)
    )))
);


describe('Outgoing Schema 1', function(){
    it('Should throw error when get an integer value in string field', function() {
        let data = {node: 5};
        assert.throws(() => schema1(data), Error, "node:Should be a string");
    });

    it('Should return array', function() {
        let data = {'user': ['abc', 'def', 'xxxxxx']};
        let expected = {node:null, user:['abc', 'def', 'xxxxxx'], tag:null, event:null};
        let actual = schema1(data);
        assert.deepEqual(expected, actual);
    });

    it('Should throw error when the type of an element in array is not correct', function() {
        let data = {user:['abc', 5, 'xxxxxx']};
        assert.throws(() => schema1(data), Error, "user.1:Should be a string");
    });

    it('Should throw error when get a string value in object field', function() {
        let data = {tag: 'abc'};
        assert.throws(() => schema1(data), Error, "tag:Should be an object");
    });

    it('Should return object', function() {
        let data =  {tag: {name: 'abc'}};
        let expected = {node:null, user:null, tag:{name: 'abc', level:null}, event:null};
        let actual = schema1(data);
        assert.deepEqual(expected, actual);
    });

    it('Should return array of object', function() {
        let data =  {event: [{name: 'abc'}, {alarm: false}]};
        let expected = {node:null, user:null, tag:null, event:[{name: 'abc', alarm:null}, {name:null, alarm: false}]};
        let actual = schema1(data);
        assert.deepEqual(expected, actual);
    });

});

