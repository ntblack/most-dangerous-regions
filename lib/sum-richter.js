const {log} = require('mathjs');
// A reduction function that sums the richter scale values of an array of geojson features

module.exports = function (features) {
    let sum = 0;
    for(let i=0, len=features.length; i < len; ++i) {
        sum += Math.pow(10, features[i].properties.mag);
    }

    return log(sum, 10);
};