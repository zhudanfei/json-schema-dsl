const assert = require('chai').assert;
const expect = require('chai').expect;

const basicType = require('../basicType');

describe('JSON Any Type', function() {
    it('Should return value', function () {
        assert.equal(3, basicType.anyType(3, []))
    });
});

describe('JSON String Type', function(){
    it('String should return null if input is null', function(){
        assert.equal(basicType.stringType(null, []), null)
    });
    it('String should return input if input is a string', function(){
        assert.equal(basicType.stringType('abc', []), 'abc')
    });
    it('String should throw error if input is an integer', function(){
        assert.throws(() => basicType.stringType(4, ['node', '3']), Error, "node.3: Should be a string")
    });
    it('String should throw error if input is a float', function(){
        assert.throws(() => basicType.stringType(3.4, ['3']), Error, "3: Should be a string")
    });
    it('String should throw error if input is a boolean', function(){
        assert.throws(() => basicType.stringType(false, ['node']), Error, "node: Should be a string")
    });
    it('String should throw error if input is an object', function(){
        const obj = {'a':1, 'b':2};
        assert.throws(() => basicType.stringType(obj, ['node', '3']), Error, "node.3: Should be a string")
    });
    it('String should throw error if input is an array', function(){
        const arr = [1, 3, 5];
        assert.throws(() => basicType.stringType(arr, ['node']), Error, "node: Should be a string")
    });
});

describe('JSON Integer Type', function(){
    it('Integer should return null if input is null', function(){
        assert.equal(basicType.integerType(null, []), null)
    });
    it('Integer should return input if input is an integer', function(){
        assert.equal(basicType.integerType(5, []), 5)
    });
    it('Integer should throw error if input is a string', function(){
        assert.throws(() => basicType.integerType('6abc', ['node', '3']), Error, "node.3: Should be an integer")
    });
    it('Integer should throw error if input is a float', function(){
        assert.throws(() => basicType.integerType(3.4, ['3']), Error, "3: Should be an integer")
    });
    it('Integer should throw error if input is a boolean', function(){
        assert.throws(() => basicType.integerType(true, null), Error, "Should be an integer")
    });
    it('Integer should throw error if input is an object', function(){
        const obj = {'a':1, 'b':2};
        assert.throws(() => basicType.integerType(obj, ['node', '3']), Error, "node.3: Should be an integer")
    });
    it('Integer should throw error if input is an array', function(){
        const arr = [1,3,5];
        assert.throws(() => basicType.integerType(arr, ['node']), Error, "node: Should be an integer")
    });
});

describe('JSON Number Type', function(){
    it('Integer should return null if input is null', function(){
        assert.equal(basicType.numberType(null, []), null)
    });
    it('Integer should return input if input is an integer', function(){
        assert.equal(basicType.numberType(5, []), 5)
    });
    it('Integer should return input if input is a float', function(){
        assert.equal(3.4, basicType.numberType(3.4, []))
    });
    it('Integer should throw error if input is a string', function(){
        assert.throws(() => basicType.numberType('6abc', ['node', '3']), Error, "node.3: Should be a number")
    });
    it('Integer should throw error if input is a boolean', function(){
        assert.throws(() => basicType.numberType(true, null), Error, "Should be a number")
    });
    it('Integer should throw error if input is an object', function(){
        const obj = {'a':1, 'b':2};
        assert.throws(() => basicType.numberType(obj, ['node', '3']), Error, "node.3: Should be a number")
    });
    it('Integer should throw error if input is an array', function(){
        const arr = [1,3,5];
        assert.throws(() => basicType.numberType(arr, ['node']), Error, "node: Should be a number")
    });
});

describe('JSON Boolean Type', function(){
    it('Boolean should return null if input is null', function(){
        assert.equal(basicType.booleanType(null, []), null)
    });
    it('Boolean should return input if input is a boolean', function(){
        assert.equal(basicType.booleanType(true, []), true)
    });
    it('Boolean should throw error if input is a string', function(){
        assert.throws(() => basicType.booleanType('abc', ['node']), Error, "node: Should be a boolean")
    });
    it('Boolean should throw error if input is an integer', function(){
        assert.throws(() => basicType.booleanType(4, ['node', '3']), Error, "node.3: Should be a boolean")
    });
    it('Boolean should throw error if input is a float', function(){
        assert.throws(() => basicType.booleanType(3.4, ['3']), Error, "3: Should be a boolean")
    });
    it('Boolean should throw error if input is an object', function(){
        const obj = {'a':1, 'b':2};
        assert.throws(() => basicType.booleanType(obj, ['node', '3']), Error, "node.3: Should be a boolean")
    });
    it('Boolean should throw error if input is an array', function(){
        const arr = [1,3,5];
        assert.throws(() => basicType.booleanType(arr, ['node']), Error, "node: Should be a boolean")
    });
});

describe('JSON String Map', function(){
    it('StringMap should return null if input is null', function(){
        assert.equal(basicType.stringMap(null, []), null)
    });
    it('StringMap should return input if input is a string map', function(){
        const sm = {'a':'b', 'd':'c'};
        assert.equal(basicType.stringMap(sm, []), sm)
    });
    it('StringMap should throw error if input is a string', function(){
        assert.throws(() => basicType.stringMap('abc', ['node']), Error, "node: Should be an object")
    });
    it('StringMap should throw error if input is an integer', function(){
        assert.throws(() => basicType.stringMap(4, ['node', '3']), Error, "node.3: Should be an object")
    });
    it('StringMap should throw error if input is a float', function(){
        assert.throws(() => basicType.stringMap(3.4, ['3']), Error, "3: Should be an object")
    });
    it('StringMap should throw error if input is a boolean', function(){
        assert.throws(() => basicType.stringMap(false, ['node']), Error, "node: Should be an object")
    });
    it('StringMap should throw error if input is an array', function(){
        const arr = ['abc', 'def'];
        assert.throws(() => basicType.stringMap(arr, []), Error, "Should be an object")
    });
    it('StringMap should throw error if input contains non-strings', function(){
        const arr = {'a':'b', 'd':4};
        assert.throws(() => basicType.stringMap(arr, []), Error, "d: Should be a string")
    });
});

