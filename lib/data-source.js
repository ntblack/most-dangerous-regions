const rp = require('request-promise');

let _features = [];

/**
 * @param timestamp milliseconds
 * @returns geojson features array since `timestamp` (inclusive)
 */
function since(timestamp) {
    return _features.filter((feature) => {
        return feature.properties.time >= timestamp;
    })
}

function load(features) {
    _features = _features.concat(features);
}

function update(uri, dir) {
    const options = {
        uri,
        json: true
    };

    return rp.get(options)
        .then((res) => {
            load(res.features)
        })

}

function size() {
    return _features.length;
}

function clear() {
    _features = [];
}

module.exports = {
    since,
    load,
    update,
    size,
    clear
};