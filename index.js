#! /usr/bin/env node
const path = require('path');
const nameRegionMapping = require(path.join(__dirname, 'lib', 'name-regions'));

const place = nameRegionMapping({properties: {place: "San Francisco, CA"}});
console.log(`hello ${place}`);

