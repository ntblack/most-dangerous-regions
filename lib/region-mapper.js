// function that takes an array of features and a region mapping function and returns
// a map of regionName -> array[feature]
module.exports = function(features, mappingFunction) {
    // a map of region names to features
    const data = new Map();

    features.forEach((feature) => {
        const regionName = mappingFunction(feature);
        if (!data.has(regionName)) {
            data.set(regionName, []);
        }

        data.get(regionName).push(feature);
    });

    return data;
};