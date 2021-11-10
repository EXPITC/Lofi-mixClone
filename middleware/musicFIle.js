const multer = require('multer')

module.exports = (musicFile) => {
    //path
    const storage = multer.diskStorage({
        destination: function(req, files,cb){
            cb(null, 'data')
        },
        filename: function(req, files,cb){
            cb(null, Date.now() + files.originalname.replace(/\s/g,''))
        }
    })
    // filter
    const filter = function(req,files,cb) {
        if(files.filename === musicFile){
            if(files.originalname.match(/\.(mp3|MP3|wav|wav)$/)){
                return cb(new Error('Only musicfile allowed',false))
            }
        }
        cb(null,true)
    }

    const size = 10000000

    const up = multer({
        storage,
        filter,
        limits:{
            fieldSize: size
        }
    }).single(musicFile)
    
    //midleware
    return (req,res, next) => {
        up(req,res,(err)=>{
            if(req.fileValidationError){
                console.log('error')
                return res.redirect(req.originalUrl)
            }
            if(err){
                if(err.code == 'LIMIT_FILE_SIZE' ){
                    console.log('file-size-err')
                    return res.redirect(req.originalUrl)
                }
                return res.redirect(req.originalUrl)
            }
            console.log(err)
            return next()
        })
    }
}
