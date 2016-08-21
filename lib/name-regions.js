// Function that takes a GeoJson feature and returns a region identifier based on the place name
// Unknown regions are put into _ignore
const isNullOrUndefined = require('util').isNullOrUndefined;

module.exports = function (feature, defaultMapping=() => "_") {
    if (isNullOrUndefined(feature) || isNullOrUndefined(feature.properties)
        || isNullOrUndefined(feature.properties.place)) {
        return defaultMapping(feature);
    } else {
        return feature.properties.place;
    }
};