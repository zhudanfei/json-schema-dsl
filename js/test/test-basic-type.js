const assert = require('chai').assert;
const expect = require('chai').expect;

require('../basic-type');

describe('JSON String Type', function(){
    it('String should return null if input is null', function(){
        assert.equal(null, JsonString.convert(null, []))
    });
    it('String should return input if input is a string', function(){
        assert.equal('abc', JsonString.convert('abc', []))
    });
    it('String should throw error if input is an integer', function(){
        assert.throws(() => JsonString.convert(4, ['node', '3']), Error, "node.3:Should be a string")
    });
    it('String should throw error if input is a boolean', function(){
        assert.throws(() => JsonString.convert(false, ['node']), Error, "node:Should be a string")
    });
    it('String should throw error if input is an object', function(){
        const obj = {'a':1, 'b':2};
        assert.throws(() => JsonString.convert(obj, ['node', '3']), Error, "node.3:Should be a string")
    });
    it('String should throw error if input is an array', function(){
        const arr = [1, 3, 5];
        assert.throws(() => JsonString.convert(arr, ['node']), Error, "node:Should be a string")
    });
});

describe('JSON Integer Type', function(){
    it('Integer should return null if input is null', function(){
        assert.equal(null, JsonInteger.convert(null, []))
    });
    it('Integer should return input if input is an integer', function(){
        assert.equal(5, JsonInteger.convert(5, []))
    });
    it('Integer should throw error if input is a string', function(){
        assert.throws(() => JsonInteger.convert('6abc', ['node', '3']), Error, "node.3:Should be an integer")
    });
    it('Integer should throw error if input is a float', function(){
        assert.throws(() => JsonInteger.convert(3.4, ['3']), Error, "3:Should be an integer")
    });
    it('Integer should throw error if input is a boolean', function(){
        assert.throws(() => JsonInteger.convert(true, null), Error, ":Should be an integer")
    });
    it('Integer should throw error if input is an object', function(){
        const obj = {'a':1, 'b':2};
        assert.throws(() => JsonInteger.convert(obj, ['node', '3']), Error, "node.3:Should be an integer")
    });
    it('Integer should throw error if input is an array', function(){
        const arr = [1,3,5];
        assert.throws(() => JsonInteger.convert(arr, ['node']), Error, "node:Should be an integer")
    });
});

describe('JSON Boolean Type', function(){
    it('Boolean should return null if input is null', function(){
        assert.equal(null, JsonBoolean.convert(null, []))
    });
    it('Boolean should return input if input is a boolean', function(){
        assert.equal(true, JsonBoolean.convert(true, []))
    });
    it('Boolean should throw error if input is an integer', function(){
        assert.throws(() => JsonBoolean.convert(4, ['node', '3']), Error, "node.3:Should be a boolean")
    });
    it('Boolean should throw error if input is a string', function(){
        assert.throws(() => JsonBoolean.convert('abc', ['node']), Error, "node:Should be a boolean")
    });
    it('Boolean should throw error if input is an object', function(){
        const obj = {'a':1, 'b':2};
        assert.throws(() => JsonBoolean.convert(obj, ['node', '3']), Error, "node.3:Should be a boolean")
    });
    it('Boolean should throw error if input is an array', function(){
        const arr = [1,3,5];
        assert.throws(() => JsonBoolean.convert(arr, ['node']), Error, "node:Should be a boolean")
    });
});

describe('JSON String Map', function(){
    it('StringMap should return null if input is null', function(){
        assert.equal(null, StringMap.convert(null, []))
    });
    it('StringMap should return input if input is a string map', function(){
        const sm = {'a':'b', 'd':'c'};
        assert.equal(sm, StringMap.convert(sm, []))
    });
    it('StringMap should throw error if input is an integer', function(){
        assert.throws(() => StringMap.convert(4, ['node', '3']), Error, "node.3:Should be an object")
    });
    it('StringMap should throw error if input is a string', function(){
        assert.throws(() => StringMap.convert('abc', ['node']), Error, "node:Should be an object")
    });
    it('StringMap should throw error if input is a boolean', function(){
        assert.throws(() => StringMap.convert(false, ['node']), Error, "node:Should be an object")
    });
    it('StringMap should throw error if input is an array', function(){
        const arr = ['abc', 'def'];
        assert.throws(() => StringMap.convert(arr, []), Error, ":Should be an object")
    });
    it('StringMap should throw error if input contains non-strings', function(){
        const arr = {'a':'b', 'd':4};
        assert.throws(() => StringMap.convert(arr, []), Error, "d:Should be a string")
    });
});

