let _features = [];

function since(timestamp) {
    return _features.filter((feature) => {
        return feature.properties.time >= timestamp;
    })
}

function load(features) {
    _features = _features.concat(features);
}

module.exports = {
    since,
    load
};