const assert = require('chai').assert;
const expect = require('chai').expect;

require('../basic-type');

describe('JSON Any Type', function() {
    it('Should return value', function () {
        assert.equal(3, JsonAny(3, []))
    });
});

describe('JSON String Type', function(){
    it('String should return null if input is null', function(){
        assert.equal(null, JsonString(null, []))
    });
    it('String should return input if input is a string', function(){
        assert.equal('abc', JsonString('abc', []))
    });
    it('String should throw error if input is an integer', function(){
        assert.throws(() => JsonString(4, ['node', '3']), Error, "node.3:Should be a string")
    });
    it('String should throw error if input is a boolean', function(){
        assert.throws(() => JsonString(false, ['node']), Error, "node:Should be a string")
    });
    it('String should throw error if input is an object', function(){
        const obj = {'a':1, 'b':2};
        assert.throws(() => JsonString(obj, ['node', '3']), Error, "node.3:Should be a string")
    });
    it('String should throw error if input is an array', function(){
        const arr = [1, 3, 5];
        assert.throws(() => JsonString(arr, ['node']), Error, "node:Should be a string")
    });
});

describe('JSON Integer Type', function(){
    it('Integer should return null if input is null', function(){
        assert.equal(null, JsonInteger(null, []))
    });
    it('Integer should return input if input is an integer', function(){
        assert.equal(5, JsonInteger(5, []))
    });
    it('Integer should throw error if input is a string', function(){
        assert.throws(() => JsonInteger('6abc', ['node', '3']), Error, "node.3:Should be an integer")
    });
    it('Integer should throw error if input is a float', function(){
        assert.throws(() => JsonInteger(3.4, ['3']), Error, "3:Should be an integer")
    });
    it('Integer should throw error if input is a boolean', function(){
        assert.throws(() => JsonInteger(true, null), Error, ":Should be an integer")
    });
    it('Integer should throw error if input is an object', function(){
        const obj = {'a':1, 'b':2};
        assert.throws(() => JsonInteger(obj, ['node', '3']), Error, "node.3:Should be an integer")
    });
    it('Integer should throw error if input is an array', function(){
        const arr = [1,3,5];
        assert.throws(() => JsonInteger(arr, ['node']), Error, "node:Should be an integer")
    });
});

describe('JSON Boolean Type', function(){
    it('Boolean should return null if input is null', function(){
        assert.equal(null, JsonBoolean(null, []))
    });
    it('Boolean should return input if input is a boolean', function(){
        assert.equal(true, JsonBoolean(true, []))
    });
    it('Boolean should throw error if input is an integer', function(){
        assert.throws(() => JsonBoolean(4, ['node', '3']), Error, "node.3:Should be a boolean")
    });
    it('Boolean should throw error if input is a string', function(){
        assert.throws(() => JsonBoolean('abc', ['node']), Error, "node:Should be a boolean")
    });
    it('Boolean should throw error if input is an object', function(){
        const obj = {'a':1, 'b':2};
        assert.throws(() => JsonBoolean(obj, ['node', '3']), Error, "node.3:Should be a boolean")
    });
    it('Boolean should throw error if input is an array', function(){
        const arr = [1,3,5];
        assert.throws(() => JsonBoolean(arr, ['node']), Error, "node:Should be a boolean")
    });
});

describe('JSON String Map', function(){
    it('StringMap should return null if input is null', function(){
        assert.equal(null, JsonStringMap(null, []))
    });
    it('StringMap should return input if input is a string map', function(){
        const sm = {'a':'b', 'd':'c'};
        assert.equal(sm, JsonStringMap(sm, []))
    });
    it('StringMap should throw error if input is an integer', function(){
        assert.throws(() => JsonStringMap(4, ['node', '3']), Error, "node.3:Should be an object")
    });
    it('StringMap should throw error if input is a string', function(){
        assert.throws(() => JsonStringMap('abc', ['node']), Error, "node:Should be an object")
    });
    it('StringMap should throw error if input is a boolean', function(){
        assert.throws(() => JsonStringMap(false, ['node']), Error, "node:Should be an object")
    });
    it('StringMap should throw error if input is an array', function(){
        const arr = ['abc', 'def'];
        assert.throws(() => JsonStringMap(arr, []), Error, ":Should be an object")
    });
    it('StringMap should throw error if input contains non-strings', function(){
        const arr = {'a':'b', 'd':4};
        assert.throws(() => JsonStringMap(arr, []), Error, "d:Should be a string")
    });
});

