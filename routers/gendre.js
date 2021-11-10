const express = require(`express`)
const router = express.Router()
const dbConnection = require('../connection/db');

router.get('/', (req,res)=> {
    const datasend = `SELECT DISTINCT id,name FROM tb_gendre;SELECT * , tb_music.id as music_id FROM tb_gendre LEFT JOIN tb_music ON tb_music.gendre_id = tb_gendre.id;`
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(datasend,(err,data)=>{
            // console.log(data)
            const gendres = []
            const gendreD = []
            for( _ of data[0]){
                gendres.push({
                    id: _.id,
                    gendre: _.name
                })
                for(__ of data[1]) {
                    if( __.name == _.name) {
                        if( __.title == null){continue}
                        gendreD.push ({
                            gendre: __.name,
                            musicId: __.music_id,
                            musicTitle: __.title,
                            musicFile: __.music,
                            cover: __.cover_music
                        })
                    }
                }
            }
            dbConnection.releaseConnection(conn)
            console.log(gendreD)
            console.log(gendres)
            let val = false
            if(gendreD.length == 0) {
                val = true
                console.log(val)
            }
            console.log(val)
            let isLogin = true
            if (req.session.isLogin == undefined) {
                isLogin = false
            }
            console.log(gendreD)
            res.render('gendre',{isLogin,gendres,gendreD})
        })
    })
})

module.exports = router