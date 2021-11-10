const mysql = require('mysql')

const connectionPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_music',
    multipleStatements: true
})

// connectionPool.getConnection((err,connection) => {
//     if(err) throw err;
//     console.log(`connected. id ${connection.id}`)
// }

module.exports = connectionPool
