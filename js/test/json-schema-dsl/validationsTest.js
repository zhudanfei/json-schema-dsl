const assert = require('chai').assert;
const expect = require('chai').expect;

const validations = require('../../src/json-schema-dsl/validations');

describe('Not Null', function() {
    it('Should throw error if input is undefined', function(){
        assert.throws(() => validations.notNull(undefined, []), Error, "Cannot be null");
    });

    it('Should throw error if input is null', function(){
        assert.throws(() => validations.notNull(null, ['node']), Error, "node: Cannot be null");
    });

    it('Should return value if input is not undefined/null', function(){
        const value = {user: 11};
        const actual = validations.notNull(value, []);
        assert.deepEqual(actual, value);
    });

});

describe('Max Length', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validations.maxLength(4)(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validations.maxLength(4)(null, []);
        assert.isNull(actual);
    });

    it('Should return value if length is not too long', function(){
        const value = 'abcd';
        const actual = validations.maxLength(4)(value);
        assert.equal(actual, value);
    });

    it('Should throw error if length is too long', function(){
        const value = '12345';
        assert.throws(() => validations.maxLength(4)(value, ['node']), Error, "node: String is too long");
    });

});

describe('Min Length', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validations.minLength(5)(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validations.minLength(5)(null, []);
        assert.isNull(actual);
    });

    it('Should throw error if length is too short', function(){
        const value = 'abcd';
        assert.throws(() => validations.minLength(5)(value, ['node']), Error, "node: String is too short");
    });

    it('Should return value if length is not too short', function(){
        const value = '12345';
        const actual = validations.minLength(5)(value);
        assert.equal(actual, value);
    });

});

describe('Length Range', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validations.lengthRange(4, 5)(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validations.lengthRange(4, 5)(null, []);
        assert.isNull(actual);
    });

    it('Should return value if length is in range', function(){
        const value = 'abcd';
        const actual = validations.lengthRange(4, 5)(value);
        assert.equal(actual, value);
    });

    it('Should throw error if length is too long', function(){
        const value = '123456';
        assert.throws(() => validations.lengthRange(4, 5)(value, ['node']), Error, "node: String is too long");
    });

    it('Should throw error if length is too short', function(){
        const value = 'abc';
        assert.throws(() => validations.lengthRange(4, 5)(value, ['node']), Error, "node: String is too short");
    });

});

describe('Only', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validations.only('user', 'node')(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validations.only('user', 'node')(null, []);
        assert.isNull(actual);
    });

    it('Should throw error if value is not in the set', function(){
        const value = 'abcd';
        assert.throws(() => validations.only('user', 'node')(value, ['root']), Error, "root: Invalid value");
    });

    it('Should return value if value is in the set', function(){
        const value = 'user';
        const actual = validations.only('user', 'node')(value);
        assert.equal(actual, value);
    });

});

describe('Range', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validations.range(4, 5)(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validations.range(4, 5)(null, []);
        assert.isNull(actual);
    });

    it('Should return value if value is in range', function(){
        const value = 4;
        const actual = validations.range(4, 5)(value);
        assert.equal(actual, value);
    });

    it('Should throw error if length is too big', function(){
        const value = 6;
        assert.throws(() => validations.range(4, 5)(value, ['node']), Error, "node: Value is too large");
    });

    it('Should throw error if length is too small', function(){
        const value = 3;
        assert.throws(() => validations.range(4, 5)(value, ['node']), Error, "node: Value is too small");
    });

});

describe('Pattern', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validations.pattern('^[a-zA-Z0-9]{4}$')(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validations.pattern('^[a-zA-Z0-9]{4}$')(null, []);
        assert.isNull(actual);
    });

    it('Should throw error if pattern not match', function(){
        const value = 'abcde';
        assert.throws(() => validations.pattern('^[a-zA-Z0-9]{4}$')(value, ['root']), Error, "root: Pattern not match");
    });

    it('Should return value if value is in the set', function(){
        const value = 'user';
        const actual = validations.pattern('^[a-zA-Z0-9]{4}$')(value);
        assert.equal(actual, value);
    });

});

