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

    it('should filter data by time', function() {
        const theYearTwoThousaaand = new Date(2000, 1, 1).getTime();

        // Only two of these features occurred since the year 2000
        const features = [
            {properties: {time: new Date(1999, 12, 30).getTime()}},
            {properties: {time: theYearTwoThousaaand}},
            {properties: {time: new Date(2000, 1, 1, 1).getTime()}}
        ];

        dataSource.clear();
        return dataSource.load(features)
            .then(() => {
                return dataSource.since(theYearTwoThousaaand);
            })
            .then((filteredData) => {
                assert.equal(2, filteredData.length);
            });
    });
    
    it('should load data from url', function() {
        dataSource.init();
        dataSource.clear();
        return dataSource.size((n) => {
            assert.equal(0, n);
        }).then(() => {
            const url = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';
            dataSource.update(url)
                .then(() => {

                });
        }).then(() => {
            return dataSource.size((n) => {
                assert.notEqual(0, n);
            });
        });


    });
    
});