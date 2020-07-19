const path = require('path');
module.exports = {
    test: {
        username: 'root',
        password: null,
        storage: path.join(__dirname, '../db', 'test.sqlite'),
        host: 'localhost',
        dialect: 'sqlite',
        logging: false,
    },
};
