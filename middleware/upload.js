const multer = require('multer')

module.exports = (userpic,imageFile,musiccc) => {
    //path
    const storage = multer.diskStorage({
        destination: function(req, file,cb){
            cb(null, 'data')
        },
        filename: function(req, file,cb){
            cb(null, Date.now() +'-'+  file.originalname.replace(/\s/g, ''))
        }
    })
    // filter
    const filter = function(req,file,cb) {
        if(file.filename === imageFile){
            if(!file.originalname.match(/\.(jpg|PNG|JPG|png|mp3|MP3)$/)) {
                return cb(new Error('Only image file allowed', false))
            }
        }
        cb(null, true)
    }

    const size = 10000000

    const upload = multer({
        storage,
        filter,
        limits: {
            fileSize: size
        }
    }).fields([
        { name: imageFile, maxCount: 1 },
        { name: musiccc, maxCount: 1 },
        { name: userpic, maxCount: 1 }
      ])
    
    //midleware
    return (req, res, next) => {
        upload(req, res, function (err) {
            if (req.fileValidationError) {
                return res.redirect(req.originalUrl)
            }

            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.redirect(req.originalUrl)
                }
                return res.redirect(req.originalUrl)
            }
            
            return next()
        })
    }
}
