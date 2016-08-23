#! /usr/bin/env node
const path = require('path');
const mappingFunction = require(path.join(__dirname, 'lib', 'country-regions'));
const regionMapper = require(path.join(__dirname, 'lib', 'region-mapper'));
const sum = require(path.join(__dirname, 'lib', 'sum-richter'));
const dataSource = require(path.join(__dirname, 'lib', 'data-source'));

const program = require('commander');

const millisPerDay = 24 * 60 * 60 * 1000;

const dataUri = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

const run = function(days) {
    dataSource.update(dataUri)
        .then(() => {
            const features = dataSource.since(Date.now() - days * millisPerDay);

            const N = 10;

            const mappedData = regionMapper(features, mappingFunction);
            const topN = [];
            for(let [regionName, features] of mappedData) {

                const entry = {region: regionName, earthquakeCount: features.length, totalPower: sum(features)}
                if (topN.length < N) {
                    topN.push(entry);
                } else {
                    const weakest = topN.pop();
                    if(entry.totalPower > weakest) {
                        topN.push(entry);
                    } else {
                        topN.push(weakest);
                    }
                }

                topN.sort((a, b) => a.totalPower < b.totalPower);
            }

            console.log(JSON.stringify(topN));
        });
};

program.option('--days <days>', 'The number of days to consider', 30).parse(process.argv);


run(program.days);





