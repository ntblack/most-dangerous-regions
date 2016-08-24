// Function that takes a GeoJson feature and returns a region identifier based on the place name
// Unknown regions are put into _ignore
const isNullOrUndefined = require('util').isNullOrUndefined;
const path = require('path');

const usStates = require(path.join(__dirname, '..', 'data', 'states.json'));
const countries = require(path.join(__dirname, '..', 'data', 'countries.json'));

const regexToRegion = new Map();

for(let abbreviation in usStates) {
    const stateName = usStates[abbreviation];
    regexToRegion.set(new RegExp(`, ${abbreviation}`), stateName);
    regexToRegion.set(new RegExp(stateName, 'i'), stateName);
}

for(let abbreviation in countries) {
    const countryName = countries[abbreviation];

    // if the abbreviation collides with a U.S. state, there is ambiguity in the data
    if(usStates[abbreviation]) {
        const collidedName = `${abbreviation} (${usStates[abbreviation]} or ${countryName})`;
        regexToRegion.set(new RegExp(`, ${abbreviation}`), collidedName);
    } else {
        regexToRegion.set(new RegExp(`, ${abbreviation}`), countryName);
    }

    regexToRegion.set(new RegExp(countryName, 'i'), countryName);
}

// Countries
regexToRegion.set(/Japan/i, 'Japan');
regexToRegion.set(/, NV/, 'Nevada');
regexToRegion.set(/Mexico/i, 'Mexico');
regexToRegion.set(/, MX$/, 'Mexico');
regexToRegion.set(/Canada/i, 'Canada');


module.exports = function (feature, defaultMapping=() => "_") {
    if (isNullOrUndefined(feature) || isNullOrUndefined(feature.properties)
        || isNullOrUndefined(feature.properties.place)) {
        return defaultMapping(feature);
    } else {


        for([regex, region] of regexToRegion) {
            if(regex.test(feature.properties.place)) {
                return region;
            }
        }

        return feature.properties.place;
    }
};