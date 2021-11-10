const http = require('http');
const express = require('express');
const path = require('path')
const {dirname} = require('path')
const app = express()
const hbs = require('hbs')
const hostname = '127.0.0.1';
const port = 5000;
const { response, query } = require('express')
const session = require('express-session')
app.use(express.json());
app.use(
  session({
    cookie:{
      maxAge: 1000 * 60 * 60 * 2,
      secure: false,
      httpOnly:true
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: 'secretkey'
  })
)


// engine view set
app.set('view engine', 'hbs')

// register hbs
hbs.registerPartials(__dirname + '/views/partials')

// path
app.use('/public', express.static(path.join(__dirname,'public')))
app.use('/data', express.static(path.join(__dirname, 'data')));
// const pathFile = 'http://127.0.0.1:5000/data'



// multer 
const uploadFile = require("./middleware/upload")
const uploadMusic = require("./middleware/musicFIle")

//encode
app.use(express.urlencoded({extended:true}))

//session
// middleware
// app.use ((req, res, next){
//   response.locals
// })
// main page

var isLogin = false
var userId = false
app.get ('/',(req, res) => {
  res.render('main-page', {
    isLogin: req.session.isLogin
  })
})
// main page register
app.post('/register', (req,res)=> {
  const { name, email, password } = req.body
  const singup = `INSERT INTO tb_user (name,password,email) VALUES ("${name}","${password}","${email}")`
  toDatabase(singup,req,res)
  console.log('x')
  res.redirect('back')
})
// main page login
app.post('/login', (req,res)=> {
  const {email, password} = req.body
  const login = `SELECT *, MD5(password) AS password FROM tb_user WHERE email="${email}" AND password="${password}"`
  
  dbConnection.getConnection(function (err, conn) {
    if (err) throw err;

    conn.query(login, (err, results) => {
      if (err) throw err
    
      if (results.length <= 0) {
        req.session.isLogin = false;
        console.log(results)
        return res.redirect('back')
      } else {
        req.session.isLogin = true;
        console.log(results)
        
        req.session.user = {
          id: results[0].id,
          email: results[0].email,
          name: results[0].name,
          photo: results[0].photo,
          about: results[0].about
        }
        req.session.username = req.session.name
        req.session.userId = req.session.user.id
        if ((req.session.userId).length > 0) {
          req.session.isLogin = true;
          console.log(true)
        } else {
          console.log(false)
          // req.session.isLogin = false
        }
        console.log('login')
      }
      res.redirect('back')
    })
    dbConnection.releaseConnection(conn)
  })
})

// logout 
app.get('/logout', (req,res)=>{
  req.session.destroy()
  res.redirect('/')
})


// router
  //user
const userRouter = require('./routers/users')
app.use ('/user', userRouter)
  //artist
const artistRouter = require('./routers/artist')
app.use ('/artist', artistRouter)
  //gendre
const gendreRouter = require('./routers/gendre')
app.use ('/gendre', gendreRouter)
  //music
const musicRouter = require('./routers/music')
app.use ('/music', musicRouter)
  //playlist
const playlistRouter = require('./routers/playlist')
app.use ('/playlist', playlistRouter)



// about db
const dbConnection = require('./connection/db');
const { Console } = require('console');
dbConnection.getConnection(function (err, conn) {
  if (err) throw err;
  console.log('Connected on ID '+ conn.threadId)
  dbConnection.releaseConnection(conn)
})

const toDatabase = ((query) => {
  dbConnection.getConnection(function (err, conn) {
    if (err) throw err;
    conn.query(query)
    // console.log(toPages)
  })
  dbConnection.releaseConnection(conn)
})
// listen port
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});