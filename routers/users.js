const { request } = require("express")
const express = require(`express`)
const router = express.Router()
const uploadFile = require("../middleware/upload")
const musicFile = require("../middleware/musicFIle")
const dbConnection = require('../connection/db');
router.use(express.json())
  
const toDatabase = ((query) => {
    dbConnection.getConnection(function (err, conn) {
      if (err) throw err;
      conn.query(query)
      // console.log(toPages)
      dbConnection.releaseConnection(conn)
    })
})

let isLogin = false
userId = false

let about = ''
router.get('/', (req,res)=> {
    isLogin = req.session.isLogin
    // console.log(isLogin)
    if (!isLogin) {
        return res.redirect("/")
    }
    username = req.session
    about = req.session.user.about
    
    // renew query to get all 
    const database = `SELECT * ,g.id AS gendre_id, g.name as gendre FROM tb_gendre as g;SELECT *,a.name as artist,a.id as artist_id FROM tb_artist AS a;SELECT *, m.id as music_id FROM tb_music as m;`
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(database, (err,data) => {
            // console.log(data)
            const gendreD = []
            const artistD = []
            const musicD = []
            for( _ of data[0]) {
                if ( _.gendre_id == null){continue}
                gendreD.push ({id : _.gendre_id,gendre : _.gendre})}

            for( _ of data[1]) {if ( _.artist_id == null){continue}
                artistD.push ({id : _.artist_id,artist: _.artist})}

            for (_ of data[2]) {
                if (_.music_id == null) {continue}
                musicD.push ({id : _.music_id,title: _.title,coverMusic: _.cover_music,music : _.music})}
            // console.log(gendreD)
            // console.log(artistD)
            // console.log(musicD)
            let isLogin = true
            if (req.session.isLogin == undefined) {
                isLogin = false
            }
            const user =[]
            user.push(req.session.user)
            // console.log(user)
            res.render('user',{isLogin: req.session.isLogin ,about,gendreD,artistD,musicD,user})
        })
        dbConnection.releaseConnection(conn)
    })
})

router.get('/add-music',(req,res)=>{
    let isLogin = true
    if (req.session.isLogin == undefined) {
        isLogin = false
    }
    res.render('user', {isLogin: req.session.isLogin })
    // userId = req.session.user.id
    // console.log(userId)
})

router.post('/add-music', uploadFile('userpic','img','musiccc') , (req,res) => {
    const {title, artist, gendre} = req.body
    if (req.session.user.id == undefined) {
        return res.redirect('/')
    }
    userId = req.session.user.id
    
    console.log(userId)

    let img = ''
    let music = ''
    let checkvalid = []
    checkvalid.push(req.files)

    // // ========= SYCH
    // if(checkvalid.length > 0){
    //     img = req.files.img[0].filename
    //     console.log(img)
    // }
    // if(checkvalid.length > 0){
    //     music = req.files.musiccc[0].filename
    //     console.log(music)
    // }

    // // ========= PROMISE 1
    const imgfilef = new Promise ((res,rej)=> {
        if(checkvalid.length > 0){
            res(req.files.img[0].filename)
        }
        rej(new Error('cant get img file'))
    })
    const musicfilef = new Promise((res,rej)=>{
        if(checkvalid.length > 0){
            return res(req.files.musiccc[0].filename)
        }
        rej(new Error('cant get music file'))
    })
    // imgfilef
    //     .then(res => {
    //         console.log(res)
    //         img = res
    //         theimg(res)
    //     })
    //     .catch(err => {
    //         console.log(err.massage)
    //     })
    // musicfilef
    //     .then(res => {
    //         console.log(res)
    //         music = res
    //         themsc(res)
    //     })
    //     .catch(err => {
    //         console.log(err.massage)
    //     })
    // function theimg(x){
    //     img = x
    // }
    // function themsc(x){
    //     msc = x
    // }

    // // ========== PROMISE 2
    let getthefiletrig = false
    const getthefile = new Promise ((res,rej)=>{
        if(!getthefiletrig) {
            let getthefiledata = []
            if(checkvalid.length > 0){
               getthefiledata.push({
                   img: {
                       name:  req.files.img[0].filename
                   }
               })
            }
            if(checkvalid.length > 0){
                getthefiledata.push({
                    msc: {
                        name: req.files.musiccc[0].filename
                    }
                })
            }
            // console.log(getthefiledata)
            return res(getthefiledata)
        }
        return rej(new Error('cant get the file'))
    })
    // == ver 1
    // const loadthefile = x => {
    //     return new Promise ((res,rej)=>{
    //         let thenameofdata = []
    //         thenameofdata.push({
    //             imgname : x[0].img.name,
    //             mscname: x[1].msc.name
    //         })
    //         res(thenameofdata)
    //     })
    // }
    // == ver 2
    const loadthefile = x =>{
        let thenameofdata = []
        thenameofdata.push({imgname : x[0].img.name,mscname: x[1].msc.name})
        return Promise.resolve(thenameofdata)
    }
    // getthefile
    // .then(loadthefile)
    // .then(res => {
    //         console.log("===================")
    //         console.log(res)
    //         img = res[0].imgname
    //         music = res[0].mscname
    //         console.log(img)
    //         console.log(music)
            
    //         setTimeout((res)=>{
    //             const musicdata= `INSERT INTO tb_music (title,cover_music, music, artist_id, gendre_id,user_id) VALUES ("${title}","${img}","${music}","${artist}","${gendre}",${userId})`
    //             toDatabase(musicdata)
    //             console.log(musicdata)
    //             // return res.redirect('back')
    //             redirectbackk(music)
    //             console.log('finish')
    //         },100);
    //     })
    //     .catch( err => {
    //         console.log(err.massage)
    //     })
    // function redirectbackk(x){
    //     console.log('back yo')
    //     console.log('with file' + x)
    //     res.redirect('back')
    // }

    // // =========== PROMISE 3
    //linked all on f P1
    // Promise.all([imgfilef,musicfilef]).then(resv => {
    //     img =  resv[0]
    //     music = resv[1]
    //     console.log(img)
    //     console.log(music)
    //     console.log(resv)
    // setTimeout(()=>{
    //     const musicdata= `INSERT INTO tb_music (title,cover_music, music, artist_id, gendre_id,user_id) VALUES ("${title}","${img}","${music}","${artist}","${gendre}",${userId})`
    //     toDatabase(musicdata)
    //     console.log(musicdata)
    //     res.redirect('back')
    // },100);
    // })

    // test for asyc
    // setTimeout(()=>{
        // if (title == '' || artist == ''|| gendre == '' || music == '' || img == ''){
        //     console.log('blank')
        //     console.log(title)
        //     console.log(artist)
        //     console.log(gendre)
        //     console.log(music)
        //     console.log(img)
        //     return res.redirect('back')
        // }
    //     const musicdata= `INSERT INTO tb_music (title,cover_music, music, artist_id, gendre_id,user_id) VALUES ("${title}","${img}","${music}","${artist}","${gendre}",${userId})`
    //     toDatabase(musicdata)
    //     return res.redirect('back')
    // },100)
    

    // ========== ASYC
    // link all p2 v2
    // async function comeheredata(){
    //     const one = await getthefile;
    //     const two = await loadthefile(one);
    //     img = two[0].imgname
    //     music = two[0].mscname
    //     console.log(img)
    //     console.log(music)
    //     setTimeout(()=>{
    //         const musicdata= `INSERT INTO tb_music (title,cover_music, music, artist_id, gendre_id,user_id) VALUES ("${title}","${img}","${music}","${artist}","${gendre}",${userId})`
    //         toDatabase(musicdata)
    //         console.log(musicdata)
    //         res.redirect('back')
    //     },100);
    // }
    // return comeheredata().catch(err => {console.log(err.massage)})


    // ======= ASYC complete
    async function comeheredata(){
        try{
            const one = await getthefile;
            const two = await loadthefile(one);
            setTimeout(()=>{
            const musicdata= `INSERT INTO tb_music (title,cover_music, music, artist_id, gendre_id,user_id) VALUES ("${title}","${img}","${music}","${artist}","${gendre}",${userId})`
            toDatabase(musicdata)
            return res.redirect('back')
            },100);
            img = two[0].imgname
            music = two[0].mscname
        }catch {
            new Error('not able to upload')
        }
        
    }
    return comeheredata()


    // const musicdata= `INSERT INTO tb_music (title,cover_music, music, artist_id, gendre_id,user_id) VALUES ("${title}","${img}","${music}","${artist}","${gendre}",${userId})`
    // toDatabase(musicdata)
    // // console.log(musicdata)

    // return res.redirect('back')
})

module.exports = router