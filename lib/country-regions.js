// Function that takes a GeoJson feature and returns a region identifier based on the place name
// Unknown regions are put into _ignore
const isNullOrUndefined = require('util').isNullOrUndefined;

module.exports = function (feature, defaultMapping=() => "_") {
    if (isNullOrUndefined(feature) || isNullOrUndefined(feature.properties)
        || isNullOrUndefined(feature.properties.place)) {
        return defaultMapping(feature);
    } else {
        const regexToRegion = new Map();

        // U.S. States
        regexToRegion.set(/Alaska/i, 'Alaska');
        regexToRegion.set(/, AK$/, 'Alaska');
        regexToRegion.set(/California/i, 'California');
        regexToRegion.set(/, CA$/, 'California');
        regexToRegion.set(/Hawaii/i, 'Hawaii');
        regexToRegion.set(/Nevada/i, 'Nevada');

        // Countries
        regexToRegion.set(/Japan/i, 'Japan');
        regexToRegion.set(/, NV/, 'Nevada');
        regexToRegion.set(/Mexico/i, 'Mexico');
        regexToRegion.set(/, MX$/, 'Mexico');
        regexToRegion.set(/Canada/i, 'Canada');

        for([regex, region] of regexToRegion) {
            if(regex.test(feature.properties.place)) {
                return region;
            }
        }
        return 'other';
    }
};