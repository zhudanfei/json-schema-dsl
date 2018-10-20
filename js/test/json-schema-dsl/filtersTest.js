const assert = require('chai').assert;
const expect = require('chai').expect;

const filters = require('../../src/json-schema-dsl/filters');

describe('Date Time', function() {
    it('Should return undefined if input is undefined', function(){
        const actual = filters.toTimestamp(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = filters.toTimestamp(null, []);
        assert.isNull(actual);
    });

    it('Should convert short ISO string to date', function(){
        const value = '1970-01-02T00:00:00.000Z';
        const actual = filters.toTimestamp(value, []);
        assert.equal(actual, 24 * 3600 * 1000);
    });

    it('Should convert long ISO string to date', function(){
        const value = '1970-01-02T00:00:00.000000Z';
        const actual = filters.toTimestamp(value, []);
        assert.equal(actual, 24 * 3600 * 1000);
    });

    it('Should throw error if format is invalid', function(){
        const value = '197001-02T00:00:00.000000Z';
        assert.throws(() => filters.toTimestamp(value, ['ROOT']), Error, "ROOT: Invalid value");
    });
});

describe('Not Null', function() {
    it('Should throw error if input is undefined', function(){
        assert.throws(() => filters.notNull(undefined, []), Error, "Cannot be null");
    });

    it('Should throw error if input is null', function(){
        assert.throws(() => filters.notNull(null, ['node']), Error, "node: Cannot be null");
    });

    it('Should return value if input is not undefined/null', function(){
        const value = {user: 11};
        const actual = filters.notNull(value, []);
        assert.deepEqual(actual, value);
    });

});

describe('Trim', function() {
    it('Should return undefined if input is undefined', function(){
        const actual = filters.trim(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = filters.trim(null, []);
        assert.isNull(actual);
    });

    it('Should trim string', function(){
        const value = ' \t\nabc\t\n ';
        const actual = filters.trim(value, []);
        assert.equal(actual, 'abc');
    });

});

describe('Max Length', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = filters.maxLength(4)(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = filters.maxLength(4)(null, []);
        assert.isNull(actual);
    });

    it('Should return value if length is not too long', function(){
        const value = 'abcd';
        const actual = filters.maxLength(4)(value);
        assert.equal(actual, value);
    });

    it('Should throw error if length is too long', function(){
        const value = '12345';
        assert.throws(() => filters.maxLength(4)(value, ['node']), Error, "node: String is too long");
    });

});

describe('Min Length', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = filters.minLength(5)(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = filters.minLength(5)(null, []);
        assert.isNull(actual);
    });

    it('Should throw error if length is too short', function(){
        const value = 'abcd';
        assert.throws(() => filters.minLength(5)(value, ['node']), Error, "node: String is too short");
    });

    it('Should return value if length is not too short', function(){
        const value = '12345';
        const actual = filters.minLength(5)(value);
        assert.equal(actual, value);
    });

});

describe('Length Range', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = filters.lengthRange(4, 5)(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = filters.lengthRange(4, 5)(null, []);
        assert.isNull(actual);
    });

    it('Should return value if length is in range', function(){
        const value = 'abcd';
        const actual = filters.lengthRange(4, 5)(value);
        assert.equal(actual, value);
    });

    it('Should throw error if length is too long', function(){
        const value = '123456';
        assert.throws(() => filters.lengthRange(4, 5)(value, ['node']), Error, "node: String is too long");
    });

    it('Should throw error if length is too short', function(){
        const value = 'abc';
        assert.throws(() => filters.lengthRange(4, 5)(value, ['node']), Error, "node: String is too short");
    });

});

describe('Only', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = filters.only('user', 'node')(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = filters.only('user', 'node')(null, []);
        assert.isNull(actual);
    });

    it('Should throw error if value is not in the set', function(){
        const value = 'abcd';
        assert.throws(() => filters.only('user', 'node')(value, ['root']), Error, "root: Invalid value");
    });

    it('Should return value if value is in the set', function(){
        const value = 'user';
        const actual = filters.only('user', 'node')(value);
        assert.equal(actual, value);
    });

});

describe('Range', function () {
    it('Should return undefined if input is undefined', function(){
        const actual = filters.range(4, 5)(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = filters.range(4, 5)(null, []);
        assert.isNull(actual);
    });

    it('Should return value if value is in range', function(){
        const value = 4;
        const actual = filters.range(4, 5)(value);
        assert.equal(actual, value);
    });

    it('Should throw error if length is too big', function(){
        const value = 6;
        assert.throws(() => filters.range(4, 5)(value, ['node']), Error, "node: Value is too large");
    });

    it('Should throw error if length is too small', function(){
        const value = 3;
        assert.throws(() => filters.range(4, 5)(value, ['node']), Error, "node: Value is too small");
    });

});

describe('To String', function() {
    it('Should return undefined if input is undefined', function(){
        const actual = filters.toString(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = filters.toString(null, []);
        assert.isNull(actual);
    });

    it('Should return string', function(){
        const value = 'abc';
        const actual = filters.toString(value, []);
        assert.equal(actual, value);
    });

    it('Should convert integer to string', function(){
        const value = 56;
        const actual = filters.toString(value, []);
        assert.equal(actual, '56');
    });

    it('Should convert float to string', function(){
        const value = 56.37;
        const actual = filters.toString(value, []);
        assert.equal(actual, '56.37');
    });

});

