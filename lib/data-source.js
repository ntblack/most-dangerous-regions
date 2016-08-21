const path = require('path');

module.exports = function() {
    return require(path.join(__dirname, 'data', 'all_month.json'));
};