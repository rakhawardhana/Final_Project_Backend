const mysql = require('mysql')

const conn = mysql.createConnection(
    {
        user: 'userbersama',
        password: 'Mysql123',
        host: 'localhost',
        database: 'coffee_ex_machine',
        port : 3306
    }
)

module.exports = conn
