const express = require(`express`)
const { request } = require("express")
const router = express.Router()
const dbConnection = require('../connection/db');
const uploadFile2 = require("../middleware/upload2")
router.use(express.json())

const toDatabase = ((query) => {
    dbConnection.getConnection(function (err, conn) {
      if (err) throw err;
      conn.query(query)
      // console.log(toPages)
      dbConnection.releaseConnection(conn)
    })
})

router.get('/', (req,res)=> {
    isLogin = req.session.isLogin
    const database = `SELECT * FROM tb_music`
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(database,(err,data)=> {
            const musicD = []
            console.log(data)
            for (_ of data){
                musicD.push({
                    id: _.id,
                    title: _.title,
                    cover: _.cover_music
                })
            }
            let test = []
            // test.push(data[0].user_id)
            let own = false
            // if ( req.session.userId == test[0].user_id){
            //     own = true
            // }
            let isLogin = true
            if (req.session.isLogin == undefined) {
                isLogin = false
            }
            res.render('music',{isLogin: req.session.isLogin ,musicD})
        })
        dbConnection.releaseConnection(conn)
    }) 
})
router.get('/about/:id', (req,res)=> {
    const {id} = req.params
    isLogin = req.session.isLogin
    const database = `SELECT * FROM tb_music where tb_music.id = ${id};SELECT tb_gendre.id, tb_gendre.name FROM tb_gendre;SELECT * FROM tb_music GROUP BY RAND() DESC LIMIT 4;SELECT tb_artist.name,tb_artist.id FROM tb_artist;`
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(database,(err,data)=> {
            console.log(data[0])
            const musicD = []
            const music4D = []
            const gendreD = []
            const artistD = []
            
            for (_ of data[0]){
                // if (_.id == null) {continue}
                if (_.id == id){
                    musicD.push({
                        id: _.id,
                        title: _.title,
                        cover: _.cover_music,
                        musicFile: _.music,
                        date: _.create_at,
                        artist: _.artist_id,
                        owner: _.user_id,
                        gendre: _.gendre_id
                    })
                }
            }
            
            for(_ of data[1]){
                gendreD.push({
                    id: _.id,
                    gendre: _.name
                })
            }
            for(_ of data[2]){
                music4D.push({
                    id: _.id,
                    title: _.title,
                    cover: _.cover_music
                })
            }
            for(_ of data[3]){
                artistD.push({
                    id: _.id,
                    name: _.name
                })
            }
            let idgendre = ''
            let artistname = ''
            for( _ of gendreD){
                if(musicD[0].gendre == _.id){idgendre = _.gendre;break}
            }
            for(_ of artistD){
                console.log(musicD[0].artist)
                console.log(_.id)
                if (musicD[0].artist == _.id){artistname = _.name; break}
            }
            console.log(artistname)
            console.log(idgendre)
            let isLogin = true
            if (req.session.isLogin == undefined) {
                isLogin = false
            }
            let own = false
            if ( req.session.userId == musicD[0].owner){
                console.log(true)
                own = true
            }
            res.render('about-music',{isLogin: req.session.isLogin,own ,musicD,gendreD,music4D,idgendre,artistD,artistname})
        })
        dbConnection.releaseConnection(conn)
    }) 
})
router.post ('/update/:id', uploadFile2('newimgaboutmusic','newaudioaboutmusic'),(req,res)=>{
    const {id } = req.params
    const { titlemusicaboutmusic } = req.body
    const { artistmusicaboutmusic } = req.body
    const { defaultmusic } = req.body
    const { defaultimg } =req.body
    const { defaultgendre } =req.body
    const { defaulttitle } =req.body
    const { defaultartist } =req.body
    const {gendre} =req.body
    let img = defaultimg
    let music = defaultmusic
    let defaulttitlee = defaulttitle
    let defaultartists = defaultartist
    let defaultgendree = defaultgendre
    
    if (titlemusicaboutmusic) {
        defaulttitlee = titlemusicaboutmusic
    }
    if (artistmusicaboutmusic) {
        defaultartists = artistmusicaboutmusic
    }
    if (gendre) {
        defaultgendree = gendre
    }
    let checkvalid = []
    checkvalid.push(req.files)
    // if(checkvalid){
    //     console.log('err')
    // } else{
    //     if(!req.files.length){
    //         img = req.files.newimgaboutmusic[0].filename
    //         console.log(img)
    //         music = req.files.newaudioaboutmusic[0].filename
    //         console.log(music)
    //     }
    // }

    for (_ of checkvalid) {
        // console.log(_.newaudioaboutmusic[0].filename)
        if(_.newimgaboutmusic){
            img = _.newimgaboutmusic[0].filename
            console.log(img)
           
        }
        if(_.newaudioaboutmusic){
            music = _.newaudioaboutmusic[0].filename
            console.log(music)
       }
    }
    
   
    console.log("===================")
    console.log(checkvalid)
    console.log(defaultimg)
    console.log(img)
    console.log("===================")
    update = `UPDATE tb_music SET title='${defaulttitlee}', music='${music}', cover_music='${img}',artist_id='${defaultartists}',gendre_id='${defaultgendree}' WHERE id = ${id};`
    // update = `UPDATE tb_music.title, tb_music.cover, tb_music.music ,tb_music.gendre_id, tb_music.artist_id FROM tb_music WHERE id = ${id} VALUES ('${titlemusicaboutmusic}'','${img}','${music}',${gendre},${artistmusicaboutmusic})`
    console.log(update)
    toDatabase(update)
    res.redirect('/music')
})
router.get('/deleted/:id',(req,res)=>{
    const {id} = req.params
    del =  `DELETE FROM tb_music WHERE tb_music.id = ${id}`
    console.log(del)
    toDatabase(del)
    res.redirect('/music')
})
router.post('/', (req,res)=>{
    const {searchinput} = req.body

    const database = `SELECT * FROM tb_music WHERE title LIKE '%${searchinput}%';`
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(database,(err,data)=> {
            const musicD = []
            console.log(data)
            for (_ of data){
                musicD.push({
                    id: _.id,
                    title: _.title,
                    cover: _.cover_music
                })
            }
            let val = false
            if(musicD.length == 0) {
                val = true
                console.log(val)
            }
            console.log(val)
            res.render('music',{isLogin,musicD,val})
        })
        dbConnection.releaseConnection(conn)
    }) 
    console.log(searchinput)
})
router.get('/a-z', (req,res)=> {
    isLogin = req.session.isLogin
    const database = `SELECT * FROM tb_music GROUP BY title ASC`
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(database,(err,data)=> {
            const musicD = []
            console.log(data)
            for (_ of data){
                musicD.push({
                    id: _.id,
                    title: _.title,
                    cover: _.cover_music
                })
            }
            res.render('music',{isLogin: req.session.isLogin ,musicD})
        })
        dbConnection.releaseConnection(conn)
    }) 
})
router.get('/z-a', (req,res)=> {
    isLogin = req.session.isLogin
    const database = `SELECT * FROM tb_music GROUP BY title DESC;`
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(database,(err,data)=> {
            const musicD = []
            console.log(data)
            for (_ of data){
                musicD.push({
                    id: _.id,
                    title: _.title,
                    cover: _.cover_music
                })
            }
            res.render('music',{isLogin: req.session.isLogin ,musicD})
        })
        dbConnection.releaseConnection(conn)
    }) 
})
module.exports = router