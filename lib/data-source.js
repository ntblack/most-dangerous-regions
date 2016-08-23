const rp = require('request-promise');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('data.sqlite3');

const TABLE_NAME = 'data';

let _features = [];

function init() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (features TEXT)`);
    });
}
/**
 * @param timestamp milliseconds
 * @returns geojson features array since `timestamp` (inclusive)
 */
function since(timestamp) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM data', (err, res) => {
            if(err) {
                reject(err);
            }

            const features = JSON.parse(res.features);
            resolve (features.filter((feature) => feature.properties.time >= timestamp));
        });
    });
}

function load(features) {

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const stmt = db.prepare(`INSERT INTO ${TABLE_NAME} VALUES (?)`);
            stmt.run(JSON.stringify(features), (err, row) => {
                if(err) {
                    reject(err);
                }
                resolve(row);
            });
            stmt.finalize();
        });
    });

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
    return new Promise((resolve, reject) => {
        db.get(`SELECT count(*) FROM ${TABLE_NAME}`, (err, row) => {
            if(err) {
                reject(err);
            }

            resolve(row['count(*)']);
        });
    });
}

function clear() {
    db.serialize(() => {
        db.run(`DELETE FROM ${TABLE_NAME}`);
    });
}

module.exports = {
    init,
    since,
    load,
    update,
    size,
    clear
};