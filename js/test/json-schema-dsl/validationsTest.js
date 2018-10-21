const assert = require('chai').assert;
const expect = require('chai').expect;

const validations = require('../../src/json-schema-dsl/validations');

describe('Not Null', function() {
    it('Should throw error if input is undefined', function(){
        assert.throws(() => validations.NotNull.action(undefined, []), Error, "Cannot be null");
    });

    it('Should throw error if input is null', function(){
        assert.throws(() => validations.NotNull.action(null, ['node']), Error, "node: Cannot be null");
    });

    it('Should return value if input is not undefined/null', function(){
        const value = {user: 11};
        const actual = validations.NotNull.action(value, []);
        assert.deepEqual(actual, value);
    });

});

describe('Max Length', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validations.MaxLength(4).action(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validations.MaxLength(4).action(null, []);
        assert.isNull(actual);
    });

    it('Should return value if length is not too long', function(){
        const value = 'abcd';
        const actual = validations.MaxLength(4).action(value);
        assert.equal(actual, value);
    });

    it('Should throw error if length is too long', function(){
        const value = '12345';
        assert.throws(() => validations.MaxLength(4).action(value, ['node']), Error, "node: String is too long");
    });

});

describe('Min Length', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validations.MinLength(5).action(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validations.MinLength(5).action(null, []);
        assert.isNull(actual);
    });

    it('Should throw error if length is too short', function(){
        const value = 'abcd';
        assert.throws(() => validations.MinLength(5).action(value, ['node']), Error, "node: String is too short");
    });

    it('Should return value if length is not too short', function(){
        const value = '12345';
        const actual = validations.MinLength(5).action(value);
        assert.equal(actual, value);
    });

});

describe('Length Range', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validations.LengthRange(4, 5).action(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validations.LengthRange(4, 5).action(null, []);
        assert.isNull(actual);
    });

    it('Should return value if length is in range', function(){
        const value = 'abcd';
        const actual = validations.LengthRange(4, 5).action(value);
        assert.equal(actual, value);
    });

    it('Should throw error if length is too long', function(){
        const value = '123456';
        assert.throws(() => validations.LengthRange(4, 5).action(value, ['node']), Error, "node: String is too long");
    });

    it('Should throw error if length is too short', function(){
        const value = 'abc';
        assert.throws(() => validations.LengthRange(4, 5).action(value, ['node']), Error, "node: String is too short");
    });

});

describe('Only', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validations.Only('user', 'node').action(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validations.Only('user', 'node').action(null, []);
        assert.isNull(actual);
    });

    it('Should throw error if value is not in the set', function(){
        const value = 'abcd';
        assert.throws(() => validations.Only('user', 'node').action(value, ['root']), Error, "root: Invalid value");
    });

    it('Should return value if value is in the set', function(){
        const value = 'user';
        const actual = validations.Only('user', 'node').action(value);
        assert.equal(actual, value);
    });

});

describe('Range', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validations.Range(4, 5).action(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validations.Range(4, 5).action(null, []);
        assert.isNull(actual);
    });

    it('Should return value if value is in range', function(){
        const value = 4;
        const actual = validations.Range(4, 5).action(value);
        assert.equal(actual, value);
    });

    it('Should throw error if length is too big', function(){
        const value = 6;
        assert.throws(() => validations.Range(4, 5).action(value, ['node']), Error, "node: Value is too large");
    });

    it('Should throw error if length is too small', function(){
        const value = 3;
        assert.throws(() => validations.Range(4, 5).action(value, ['node']), Error, "node: Value is too small");
    });

});

describe('Pattern', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validations.Pattern('^[a-zA-Z0-9]{4}$').action(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validations.Pattern('^[a-zA-Z0-9]{4}$').action(null, []);
        assert.isNull(actual);
    });

    it('Should throw error if pattern not match', function(){
        const value = 'abcde';
        assert.throws(() => validations.Pattern('^[a-zA-Z0-9]{4}$').action(value, ['root']), Error, "root: Pattern not match");
    });

    it('Should return value if value is in the set', function(){
        const value = 'user';
        const actual = validations.Pattern('^[a-zA-Z0-9]{4}$').action(value);
        assert.equal(actual, value);
    });

});

