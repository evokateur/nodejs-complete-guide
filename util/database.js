const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'mysql',
    user: 'root',
    database: 'node_complete',
    password: 'root_password'
});

module.exports = pool.promise();
