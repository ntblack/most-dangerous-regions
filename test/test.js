const assert = require('assert');
const path = require('path');
const sum = require(path.join(__dirname, '..', 'lib', 'sum-richter'));
const dataSource = require(path.join(__dirname, '..', 'lib', 'data-source'));
const log = require('mathjs').log;

const mappingFunction = require(path.join(__dirname, '..', 'lib', 'name-regions'));
const regionMapper = require(path.join(__dirname, '..', 'lib', 'region-mapper'));

describe('sum-richter', function() {

    const feature = function(mag) {
        return { properties: {mag} };
    };

    it('should add log scaled values properly', function() {
        const data = [feature(1), feature(1)];
        assert.equal(log(20, 10), sum(data));

        const tenOnes = [feature(1), feature(1), feature(1), feature(1), feature(1),
            feature(1), feature(1), feature(1), feature(1), feature(1)];

        assert.equal(2, sum(tenOnes));
    });
    
    it('should map values according to mapping function', function() {
        const features = [
            {properties: {place: 'A', mag: 1.0}},
            {properties: {place: 'A', mag: 2.0}},
            {properties: {place: 'B', mag: 1.0}}
        ];

        // a map of region names to features
        const data = regionMapper(features, mappingFunction);

        assert.equal(2, data.get('A').length);
        assert.equal(1, data.get('B').length);
    });
    
});