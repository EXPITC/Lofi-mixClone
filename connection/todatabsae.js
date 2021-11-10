const dbConnection = require('./db');
const { Console } = require('console');
const { query } = require('express');

module.exports = (query) =>{
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        console.log('Connected on ID '+ conn.threadId)
      })
      
    const toDatabase = ((query) => {
        dbConnection.getConnection(function (err, conn) {
          if (err) throw err;
          conn.query(query)
          // console.log(toPages)
        })
    })
    return (req, res, next) => {
        toDatabase(req, res, function (err) {
            if (err) {
               console.log(err)
                return res.redirect(req.originalUrl)
            }  
            return next()
        })
    }
}

