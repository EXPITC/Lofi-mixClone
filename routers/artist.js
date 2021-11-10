const { application, request } = require("express")
const express = require(`express`)
const router = express.Router()
const dbConnection = require('../connection/db');  
const toDatabase = ((query) => {
  dbConnection.getConnection(function (err, conn) {
      if (err) throw err;
      conn.query(query)
      // console.log(toPages)
    })
    dbConnection.releaseConnection(conn)
})
let machine = function (value) {
    return value.replace(/[^a-zA-Z0-9_-]/g,'')
}
router.get('/', (req,res)=> {
    isLogin = req.session.isLogin

    database = `SELECT id,name,photo FROM tb_artist`

    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(database, (err,data) => {
            console.log(data)
            const artistD = []
            
            for (_ of data) {
               
    
                artistD.push ({
                    id: _.id,
                    artist: _.name,
                    photo: _.photo,
                    artisturl: machine(_.name)
                })
            }
            // console.log(artistD)
            res.render('artist',{isLogin: req.session.isLogin ,artistD})
        })
        dbConnection.releaseConnection(conn)
    })
})

router.post('/', (req,res)=> {
    isLogin = req.session.isLogin
    const {searchinput} = req.body

    database = `SELECT id,name,photo FROM tb_artist WHERE name LIKE '%${searchinput}%'`

    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(database, (err,data) => {
            console.log(data)
            const artistD = []
            
            for (_ of data) {
               
    
                artistD.push ({
                    id: _.id,
                    artist: _.name,
                    photo: _.photo,
                    artisturl: machine(_.name)
                })
            }
            let val = false
            if(artistD.length == 0) {
                val = true
                console.log(val)
            }
            // console.log(artistD)
            res.render('artist',{isLogin: req.session.isLogin ,artistD,val})
        })
        dbConnection.releaseConnection(conn)
    })
})


router.get('/a-z', (req,res)=> {
    isLogin = req.session.isLogin

    database = `SELECT id,name,photo FROM tb_artist GROUP BY name ASC`

    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(database, (err,data) => {
            console.log(data)
            const artistD = []
            
            for (_ of data) {
               
    
                artistD.push ({
                    id: _.id,
                    artist: _.name,
                    photo: _.photo,
                    artisturl: machine(_.name)
                })
            }
            // console.log(artistD)
            res.render('artist',{isLogin: req.session.isLogin ,artistD})
        })
        dbConnection.releaseConnection(conn)
    })
})

router.get('/z-a', (req,res)=> {
    isLogin = req.session.isLogin

    database = `SELECT id,name,photo FROM tb_artist GROUP BY name DESC`

    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(database, (err,data) => {
            console.log(data)
            const artistD = []
            
            for (_ of data) {
               
    
                artistD.push ({
                    id: _.id,
                    artist: _.name,
                    photo: _.photo,
                    artisturl: machine(_.name)
                })
            }
            // console.log(artistD)
            res.render('artist',{isLogin: req.session.isLogin ,artistD})
        })
        dbConnection.releaseConnection(conn)
    })
})

router.get('/about/:id/:artist', (req,res)=> {
    const { id } = req.params
    isLogin = req.session.isLogin
    console.log(id)

    let artistabout = `SELECT * FROM tb_artist WHERE id = "${id}";SELECT * FROM tb_artist GROUP BY RAND() DESC LIMIT 4 `

    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(artistabout, (err,data)=>{
            console.log(data)
            const artistaboutD = {
                name: data[0][0].name,
                year: data[0][0].start_career,
                photo: data[0][0].photo,
                about: data[0][0].about
            }
            const moreArtist = []
            for (_ of data[1]) {
                moreArtist.push({
                    id: _.id,
                    artist: _.name,
                    photoartist: _.photo,
                    artistUrl: machine(_.name)
                })
            }
            console.log(moreArtist)
            console.log(artistaboutD)
            res.render('artist-about',{isLogin: req.session.isLogin ,artistaboutD,moreArtist})
        })
        dbConnection.releaseConnection(conn)
    })
})


module.exports = router