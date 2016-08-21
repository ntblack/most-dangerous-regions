#! /usr/bin/env node
const path = require('path');
const mappingFunction = require(path.join(__dirname, 'lib', 'name-regions'));
const regionMapper = require(path.join(__dirname, 'lib', 'region-mapper'));
const features = require(path.join(__dirname, 'data', 'all_month.json')).features.slice(0, 1);

const mappedData = regionMapper(features, mappingFunction);

// ES6 Map cannot be converted to JSON because the keys may be any object, while JSON spec requires keys
// to be of type string. Therefore we can't just use JSON.stringify to debug.
for(let [key, val] of mappedData) {
    console.log("%j: %j", key, val);
}


