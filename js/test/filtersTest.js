const assert = require('chai').assert;
const expect = require('chai').expect;

const filters = require('../filters');

describe('Date Time', function() {
    it('Should convert short ISO string to date', function(){
        const input = '1970-01-02T00:00:00.000Z';
        const timestamp = filters.toTimestamp(input, null);
        assert.equal(24 * 3600 * 1000, timestamp);
    });

    it('Should convert long ISO string to date', function(){
        const input = '1970-01-02T00:00:00.000000Z';
        const timestamp = filters.toTimestamp(input, null);
        assert.equal(24 * 3600 * 1000, timestamp);
    });
});

describe('Length', function () {
    it('Should return value if length is not too long', function(){
        const f = filters.maxLength(4);
        const value = '太空旅客';
        assert.equal(value, f(value, null));
    });

    it('Should return value if length is too long', function(){
        const f = filters.maxLength(4);
        const value = '血战钢锯岭';
        assert.throws(() => f(value, ['node']), Error, "node: String is too long")
    });

});
