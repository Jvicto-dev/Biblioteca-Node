const mysql = require('mysql2')

var pool = mysql.createConnection({
    "user": "root",
    "password": "",
    "host": "localhost",
    "database": "biblioteca_node",
    "port": 3306
})



exports.pool = pool