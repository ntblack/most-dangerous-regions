const rp = require('request-promise');
const fp = require('lodash-fp');
const path = require('path');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(path.join(process.env.HOME, '.most-dangerous-regions.sqlite3'));

const TABLE_NAME = 'data';

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
        db.all('SELECT * FROM data', (err, rows) => {
            if(err) {
                console.error(err);
                reject(err);
            }

            let features = [];

            rows.forEach((row) => {
                features = features.concat(JSON.parse(row.features));
            });

            const timeFilter = (feature) => feature.properties.time >= timestamp
            const grouped = fp.uniqBy('id', features);
            resolve (fp.filter(timeFilter, grouped));
        });
    });
}

function load(features) {

    return new Promise((resolve, reject) => {
        try {
            db.serialize(() => {
                const stmt = db.prepare(`INSERT INTO ${TABLE_NAME} VALUES (?)`);
                stmt.run(JSON.stringify(features), (err, row) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(row);
                });
                stmt.finalize();
            });
        } catch(err) {
            reject(err);
        }
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