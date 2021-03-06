const assert = require('chai').assert;
const expect = require('chai').expect;

const filters = require('../../src/json-schema-dsl/filters');

describe('Date Time', function() {
    it('Should return undefined if input is undefined', function(){
        const actual = filters.ToTimestamp.action(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = filters.ToTimestamp.action(null, []);
        assert.isNull(actual);
    });

    it('Should convert short ISO string to date', function(){
        const value = '1970-01-02T00:00:00.000Z';
        const actual = filters.ToTimestamp.action(value, []);
        assert.equal(actual, 24 * 3600 * 1000);
    });

    it('Should convert long ISO string to date', function(){
        const value = '1970-01-02T00:00:00.000000Z';
        const actual = filters.ToTimestamp.action(value, []);
        assert.equal(actual, 24 * 3600 * 1000);
    });

    it('Should throw error if format is invalid', function(){
        const value = '197001-02T00:00:00.000000Z';
        assert.throws(() => filters.ToTimestamp.action(value, ['ROOT']), Error, "ROOT: Invalid value");
    });
});

describe('Trim', function() {
    it('Should return undefined if input is undefined', function(){
        const actual = filters.Trim.action(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = filters.Trim.action(null, []);
        assert.isNull(actual);
    });

    it('Should trim string', function(){
        const value = ' \t\nabc\t\n ';
        const actual = filters.Trim.action(value, []);
        assert.equal(actual, 'abc');
    });

});

describe('To String', function() {
    it('Should return undefined if input is undefined', function(){
        const actual = filters.ToString.action(undefined, []);
        assert.isUndefined(actual);
    });

    it('Should return null if input is undefined', function(){
        const actual = filters.ToString.action(null, []);
        assert.isNull(actual);
    });

    it('Should return string', function(){
        const value = 'abc';
        const actual = filters.ToString.action(value, []);
        assert.equal(actual, value);
    });

    it('Should convert integer to string', function(){
        const value = 56;
        const actual = filters.ToString.action(value, []);
        assert.equal(actual, '56');
    });

    it('Should convert float to string', function(){
        const value = 56.37;
        const actual = filters.ToString.action(value, []);
        assert.equal(actual, '56.37');
    });

});

