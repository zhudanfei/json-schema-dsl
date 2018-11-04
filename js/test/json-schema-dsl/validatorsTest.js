const assert = require('chai').assert;
const expect = require('chai').expect;

const validators = require('../../src/json-schema-dsl/validators');

describe('Not Null', function() {
    it('Should throw error if input is undefined', function(){
        assert.throws(() => validators.NotNull.action(undefined, []), Error, "Cannot be null");
    });

    it('Should throw error if input is null', function(){
        assert.throws(() => validators.NotNull.action(null, ['node']), Error, "node: Cannot be null");
    });

    it('Should return value if input is not undefined/null', function(){
        const value = {user: 11};
        const actual = validators.NotNull.action(value, []);
        assert.deepEqual(actual, value);
    });

});

describe('Not Empty', function() {
    it('Should throw error if input is undefined', function(){
        assert.throws(() => validators.NotEmpty.action(undefined, []), Error, "Cannot be null");
    });

    it('Should throw error if input is null', function(){
        assert.throws(() => validators.NotEmpty.action(null, ['node']), Error, "node: Cannot be null");
    });

    it('Should throw error if input is empty', function(){
        assert.throws(() => validators.NotEmpty.action('', ['node']), Error, "node: Cannot be empty");
    });

    it('Should return value if input has value', function(){
        const value = 'abc';
        const actual = validators.NotEmpty.action(value, []);
        assert.deepEqual(actual, value);
    });

});

describe('Max Length', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validators.MaxLength(4).action(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validators.MaxLength(4).action(null, []);
        assert.isNull(actual);
    });

    it('Should return value if length is not too long', function(){
        const value = 'abcd';
        const actual = validators.MaxLength(4).action(value);
        assert.equal(actual, value);
    });

    it('Should throw error if length is too long', function(){
        const value = '12345';
        assert.throws(() => validators.MaxLength(4).action(value, ['node']), Error, "node: String is too long");
    });

});

describe('Min Length', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validators.MinLength(5).action(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validators.MinLength(5).action(null, []);
        assert.isNull(actual);
    });

    it('Should throw error if length is too short', function(){
        const value = 'abcd';
        assert.throws(() => validators.MinLength(5).action(value, ['node']), Error, "node: String is too short");
    });

    it('Should return value if length is not too short', function(){
        const value = '12345';
        const actual = validators.MinLength(5).action(value);
        assert.equal(actual, value);
    });

});

describe('Length Range', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validators.LengthRange(4, 5).action(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validators.LengthRange(4, 5).action(null, []);
        assert.isNull(actual);
    });

    it('Should return value if length is in range', function(){
        const value = 'abcd';
        const actual = validators.LengthRange(4, 5).action(value);
        assert.equal(actual, value);
    });

    it('Should throw error if length is too long', function(){
        const value = '123456';
        assert.throws(() => validators.LengthRange(4, 5).action(value, ['node']), Error, "node: String is too long");
    });

    it('Should throw error if length is too short', function(){
        const value = 'abc';
        assert.throws(() => validators.LengthRange(4, 5).action(value, ['node']), Error, "node: String is too short");
    });

});

describe('Only', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validators.Only('user', 'node').action(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validators.Only('user', 'node').action(null, []);
        assert.isNull(actual);
    });

    it('Should throw error if value is not in the set', function(){
        const value = 'abcd';
        assert.throws(() => validators.Only('user', 'node').action(value, ['root']), Error, "root: Invalid value");
    });

    it('Should return value if value is in the set', function(){
        const value = 'user';
        const actual = validators.Only('user', 'node').action(value);
        assert.equal(actual, value);
    });

});

describe('Minimum', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validators.Minimum(4).action(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validators.Minimum(4).action(null, []);
        assert.isNull(actual);
    });

    it('Should return value if value is in range', function(){
        const value = 4.5;
        const actual = validators.Minimum(4).action(value);
        assert.equal(actual, value);
    });

    it('Should throw error if value is too small', function(){
        const value = 3.99;
        assert.throws(() => validators.Minimum(4).action(value, ['node']), Error, "node: Value is too small");
    });

});

describe('Exclusive Minimum', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validators.ExclusiveMinimum(4).action(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validators.ExclusiveMinimum(4).action(null, []);
        assert.isNull(actual);
    });

    it('Should return value if value is in range', function(){
        const value = 4.5;
        const actual = validators.ExclusiveMinimum(4).action(value);
        assert.equal(actual, value);
    });

    it('Should throw error if value is too small', function(){
        const value = 4;
        assert.throws(() => validators.ExclusiveMinimum(4).action(value, ['node']), Error, "node: Value is too small");
    });

});

describe('Maximum', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validators.Maximum(5.3).action(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validators.Maximum(5.3).action(null, []);
        assert.isNull(actual);
    });

    it('Should return value if value is in range', function(){
        const value = 4.5;
        const actual = validators.Maximum(5.3).action(value);
        assert.equal(actual, value);
    });

    it('Should throw error if value is too big', function(){
        const value = 5.301;
        assert.throws(() => validators.Maximum(5.3).action(value, ['node']), Error, "node: Value is too large");
    });

});

describe('Exclusive Maximum', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validators.ExclusiveMaximum(5.3).action(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validators.ExclusiveMaximum(5.3).action(null, []);
        assert.isNull(actual);
    });

    it('Should return value if value is in range', function(){
        const value = 4.5;
        const actual = validators.ExclusiveMaximum(5.3).action(value);
        assert.equal(actual, value);
    });

    it('Should throw error if value is too big', function(){
        const value = 5.3;
        assert.throws(() => validators.ExclusiveMaximum(5.3).action(value, ['node']), Error, "node: Value is too large");
    });

});

describe('Range', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validators.Range(4, 5.3).action(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validators.Range(4, 5.3).action(null, []);
        assert.isNull(actual);
    });

    it('Should return value if value is in range', function(){
        const value = 4.5;
        const actual = validators.Range(4, 5.3).action(value);
        assert.equal(actual, value);
    });

    it('Should throw error if value is too big', function(){
        const value = 6.1;
        assert.throws(() => validators.Range(4, 5.3).action(value, ['node']), Error, "node: Value is too large");
    });

    it('Should throw error if value is too small', function(){
        const value = 3;
        assert.throws(() => validators.Range(4, 5.3).action(value, ['node']), Error, "node: Value is too small");
    });

});

describe('Pattern', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = validators.Pattern('^[a-zA-Z0-9]{4}$').action(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = validators.Pattern('^[a-zA-Z0-9]{4}$').action(null, []);
        assert.isNull(actual);
    });

    it('Should throw error if pattern not match', function(){
        const value = 'abcde';
        assert.throws(() => validators.Pattern('^[a-zA-Z0-9]{4}$').action(value, ['root']), Error, "root: Pattern not match");
    });

    it('Should return value if pattern match', function(){
        const value = 'user';
        const actual = validators.Pattern('^[a-zA-Z0-9]{4}$').action(value);
        assert.equal(actual, value);
    });

});

