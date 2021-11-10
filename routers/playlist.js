const express = require(`express`)
const router = express.Router()
const dbConnection = require('../connection/db');

const toDatabase = ((query) => {
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(query)
        // console.log(toPages)
        dbConnection.releaseConnection(conn)
      })
  })
let machine = function (value) {
    return value.replace(/[^a-zA-Z0-9_-]/g,'')
}
router.get('/', (req,res)=> {
    isLogin = req.session.isLogin
    const datasend =  `SELECT DISTINCT name as uniqplaylist FROM tb_playlist GROUP BY name ASC;SELECT cover_music AS cover, tb_playlist.name AS playlistID FROM tb_music LEFT JOIN tb_playlist ON tb_music.id = tb_playlist.music_id;SELECT DISTINCT id as playlistID FROM tb_playlist GROUP BY name ASC;`
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(datasend,(err,data)=>{
            const playlistD = []
            // console.log(data)
            // console.log(data[2][1])
            let x = 0
            let cov = ''
            for (_ of data[0]) {
                console.log('=======================')
                console.log(data[1][x].cover === undefined)
                console.log('=======================')
                if(data[1][x].cover === undefined) {cov = ""}
                cov = data[1][x].cover
                playlistD.push ({
                    playlist: _.uniqplaylist,
                    ID : data[2][x].playlistID,
                    cover: cov,
                    playlistUrl: machine(_.uniqplaylist)
                })
                x ++
            }
            // console.log(playlistD)
            let isLogin = true
            if (req.session.isLogin == undefined) {
                isLogin = false
            }
            req.session.playlistD = playlistD
            res.render('playlist', {isLogin: req.session.isLogin ,playlistD})
            dbConnection.releaseConnection(conn)
        })
    })
})
router.get('/a-z', (req,res)=> {
    isLogin = req.session.isLogin
    const datasend =  `SELECT DISTINCT name as uniqplaylist FROM tb_playlist GROUP BY name ASC;SELECT cover_music AS cover, tb_playlist.name AS playlistID FROM tb_music LEFT JOIN tb_playlist ON tb_music.id = tb_playlist.music_id;SELECT DISTINCT id as playlistID FROM tb_playlist GROUP BY name ASC;`
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(datasend,(err,data)=>{
            const playlistD = []
            console.log(data[2][1])
            let x = 0
            for (_ of data[0]) {
                playlistD.push ({
                    playlist: _.uniqplaylist,
                    ID : data[2][x].playlistID,
                    cover: data[1][x].cover,
                    playlistUrl: machine(_.uniqplaylist)
                })
                x ++
            }
            console.log(playlistD)
            let isLogin = true
            if (req.session.isLogin == undefined) {
                isLogin = false
            }
            res.render('playlist', {isLogin: req.session.isLogin ,playlistD})
        })
        dbConnection.releaseConnection(conn)
    })
})
router.get('/z-a', (req,res)=> {
    const datasend =  `SELECT DISTINCT name as uniqplaylist FROM tb_playlist GROUP BY name DESC;SELECT cover_music AS cover, tb_playlist.name AS playlistID FROM tb_music LEFT JOIN tb_playlist ON tb_music.id = tb_playlist.music_id;SELECT DISTINCT id as playlistID FROM tb_playlist GROUP BY name DESC;`
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(datasend,(err,data)=>{
            const playlistD = []
            console.log(data[2][1])
            let x = (data[0]).length - 1
            for (_ of data[0]) {
                playlistD.push ({
                    playlist: _.uniqplaylist,
                    ID : data[2][x].playlistID,
                    cover: data[1][x].cover,
                    playlistUrl: machine(_.uniqplaylist)
                })
                console.log(x)
                x--
            }
            let isLogin = true
            if (req.session.isLogin == undefined) {
                isLogin = false
            }
            console.log(playlistD)
            res.render('playlist', {isLogin: req.session.isLogin ,playlistD})
        })
        dbConnection.releaseConnection(conn)
    })
})
router.post('/', (req,res)=> {
    isLogin = req.session.isLogin
    const { searchinput} =req.body
    const datasend =  `SELECT DISTINCT name FROM tb_playlist WHERE name LIKE '%${searchinput}%';SELECT cover_music AS cover, tb_playlist.name AS playlistID FROM tb_music LEFT JOIN tb_playlist ON tb_music.id = tb_playlist.music_id;SELECT DISTINCT id as playlistID FROM tb_playlist;`
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(datasend,(err,data)=>{
            const playlistD = []
            console.log(data[2][1])
            let x = 0
            for (_ of data[0]) {
                playlistD.push ({
                    playlist: _.uniqplaylist,
                    ID : data[2][x].playlistID,
                    cover: data[1][x].cover,
                    playlistUrl: machine(_.uniqplaylist)
                })
                console.log(x)
                x++
            }
            let isLogin = true
            if (req.session.isLogin == undefined) {
                isLogin = false
            }
            
            console.log(playlistD)
            res.render('playlist', {isLogin: req.session.isLogin ,playlistD})
        })
        dbConnection.releaseConnection(conn)
    })
})
router.post('/add-playlist',(req,res)=>{
    const { addPlayist} = req.body
    const { playlist } = req.body
    const { checkval } = req.body
    const { id} =  req.session.user

    console.log(id)
    console.log(checkval)
    console.log(addPlayist)
    console.log(playlist)
    let idval = []
    i = 0
    q = 0
    for (_ of checkval){
        if( _ == ','){
            idval.push (parseInt((checkval.substring(q,i))))
            q = i +1
        }
        i++
    }
    let datasend = ``
    for (_ of idval){
        datasend += `INSERT INTO tb_playlist (name,music_id,user_id) VALUES ('${playlist}','${_}','${id}');`
    }
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(datasend,(err,data)=>{
            console.log(data)
        })
        dbConnection.releaseConnection(conn)
      })
    console.log(datasend)
    for (_ of checkval){
        console.log(_)
    }
    let isLogin = true
    if (req.session.isLogin == undefined) {
        isLogin = false
    }
    res.redirect('/user')
})
router.get('/about/:id/:playlistname',(req,res)=>{
    const {id} = req.params
    isLogin = req.session.isLogin
    const datasend = `SELECT name FROM tb_playlist WHERE id = '${id}'`

    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(datasend,(err,data)=>{
            console.log(data[0].name)
            const datass = `SELECT DISTINCT title AS music, tb_playlist.create_at as date ,tb_playlist.name AS playlist,tb_playlist.id AS id ,tb_playlist.user_id, cover_music AS cover , tb_music.music AS music_file , tb_artist.name AS artist, tb_gendre.name AS gendre FROM tb_music LEFT JOIN tb_playlist ON tb_music.id = tb_playlist.music_id LEFT JOIN tb_artist ON tb_music.artist_id = tb_artist.id LEFT JOIN tb_gendre ON tb_music.gendre_id = tb_gendre.id WHERE tb_playlist.name = '${data[0].name}';`
            dbConnection.getConnection(function (err, conn) {
                if (err) throw err;
                conn.query(datass,(err,datas)=>{
                    // console.log(datas)
                    const theplaylist = []
                    for (_ of datas){
                        theplaylist.push ({
                            id: _.id, // tb playlist id
                            date: _.date, // tb playlist
                            user : _.user_id, // tb playlist user id
                            musicName: _.music, // tb music
                            playlist: _.playlist, // tb playlist name
                            musicCover: _.cover, // tb music
                            musicFile:_.music_file, // tb music
                            artist: _.artist, // tb artist
                            gendre:_.gendre // tb gendre
                        })
                    }
                    let own = true
                    if ( req.session.userId == data[0].user_id){
                        console.log(true)
                        own = false
                    }
                    let isLogin = true
                    if (req.session.isLogin == undefined) {
                        isLogin = false
                    }
                    // console.log(isLogin)
                    console.log(own)
                    console.log(req.session.userId)
                    console.log(datas[0].user_id)
                    // console.log(theplaylist)
                    const {playlistD} =req.session
                    const playlistD2 = []
                    // if(playlistD < 0){
                    for (_ of playlistD) {
                        if(playlistD2.length == 4){
                            break
                        }
                        playlistD2.push ({
                                ID : _.ID,
                                playlistUrl: _.playlistUrl,
                                cover: _.cover,
                                playlist: _.playlist
                        })
                    }
                    const { username} = req.session
                    // }
                    // console.log(req.session.playlistD)
                    res.render("about-playlist",{isLogin,theplaylist,own,playlistD2,username})
                })
                dbConnection.releaseConnection(conn)
            })
        })
        dbConnection.releaseConnection(conn)
    })
})
router.get('/delete/:id', (req,res)=>{
    const { id } = req.params
    const datasend = `SELECT name FROM tb_playlist WHERE id = '${id}'`
    // console.log(datasend)

    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(datasend,(err,data)=>{
            console.log("==================")
            console.log(data)
            console.log("==================")
            const x = `DELETE FROM tb_playlist WHERE name = '${data[0].name}'`
            toDatabase(x)
            // console.log(x)
            res.redirect('/playlist')
        })
        dbConnection.releaseConnection(conn)
    })

    // res.redirect('/')
})
router.get('/delete/music/:id', (req,res)=>{
    const { id } = req.params
    const datasend = `DELETE FROM tb_playlist WHERE id = '${id}'`
    toDatabase(datasend)

    res.redirect('/playlist')
})
// SELECT DISTINCT name as uniqplaylist FROM tb_playlist GROUP BY name ASC; a-z
// SELECT DISTINCT name name as uniqplaylist FROM tb_playlist GROUP BY name DESC; z-a

// SELECT name FROM tb_playlist WHERE name LIKE '%al%'; search

// SELECT DISTINCT title AS music, tb_playlist.name AS playlist, cover_music AS cover, tb_artist.name AS artist, tb_gendre.name AS gendre FROM tb_music LEFT JOIN tb_playlist ON tb_music.id = tb_playlist.music_id LEFT JOIN tb_artist ON tb_music.artist_id = tb_artist.id LEFT JOIN tb_gendre ON tb_music.gendre_id = tb_gendre.id WHERE tb_playlist.name = 'check album';
// results music, playlist, cover , artist, gendre
// SELECT * FROM tb_music LEFT JOIN tb_playlist ON tb_music.id = tb_playlist.music_id WHERE tb_playlist.name = 'check album';

module.exports = router