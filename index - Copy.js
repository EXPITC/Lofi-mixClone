const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
const hbs = require('hbs');
const session = require('express-session')

app.use(express.json());
app.use(express.static('express'));

app.use(express.urlencoded({ extended: false }))

// Use session to setting
app.use(
  session(
    {
      cookie: {
        maxAge: 1000 * 60 * 60 * 2,
        secure: false,
        httpOnly: true
      },
      store: new session.MemoryStore(),
      saveUninitialized: true,
      resave: false,
      secret: 'secretkey'
    }
  )
)

// setup flash meesage midleware
app.use(function (request, response, next) {
  response.locals.message = request.session.message
  delete request.session.message
  next()
})

// get connection
const dbConnection = require('./connection/db')
const uploadFile = require('./middleware/uploadFile')
const { response } = require('express')

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');

var isLogin = false;
const pathFile = 'http://localhost:3000/uploads/'

// default URL for website
app.get('/', function (request, response) {
  const query = `SELECT * FROM articles ORDER BY id DESC`

  dbConnection.getConnection(function (err, conn) {
    if (err) throw err;

    conn.query(query, function (err, results) {
      if (err) throw err

      // console.log(results)

      const articles = []

      for (let result of results) {
        articles.push({
          id: result.id,
          title: result.title,
          image: pathFile + result.image,
          content: result.content,
        })
      }

      response.render('index', {
        title: 'Article',
        isLogin: request.session.isLogin,
        articles
      })
    })
  })
});

app.get('/article/:id', function (request, response) {
  var id = request.params.id;

  const query = `SELECT * FROM articles WHERE id=${id}`

  dbConnection.getConnection(function (err, conn) {
    if (err) throw err;

    conn.query(query, function (err, results) {
      if (err) throw err

      const article = {
        id: results[0].id,
        title: results[0].title,
        image: pathFile + results[0].image,
        content: results[0].content,
      }

      var isContentOwner = false

      if (request.session.isLogin) {
        if (request.session.user.id == results[0].user_id) {
          isContentOwner = true
        }
      }

      response.render('article', {
        title: "Article",
        isLogin: request.session.isLogin,
        article,
        isContentOwner
      })

    })
  })
});

app.get('/add-article', function (request, response) {
  response.render('addArticle', {
    title: 'Add Articles',
    isLogin: request.session.isLogin
  });
});

app.post('/add-article', uploadFile('image'), function (request, response) {
  const { title, content } = request.body
  const userId = request.session.user.id
  let image = ''

  if (request.file) {
    image = request.file.filename
  }

  if (title == '' || content == '' || image == '') {
    request.session.message = {
      type: 'danger',
      message: 'Please insert all data'
    }
    response.redirect('/add-article')
  }

  const query = `INSERT INTO articles (title,image,content, user_id) VALUES ("${title}","${image}","${content}",${userId})`
  dbConnection.getConnection(function (err, conn) {
    if (err) throw err;

    conn.query(query, function (err, results) {
      if (err) throw err

      request.session.message = {
        type: 'success',
        message: 'Add article has saccessfully'
      }
      response.redirect(`/article/${results.insertId}`)
    })
  })
});

app.get('/edit-article/:id', function (request, response) {
  const { id } = request.params
  const title = "Edit Article"

  console.log(id)

  const query = `SELECT * FROM articles WHERE id = ${id}`

  dbConnection.getConnection(function (err, conn) {
    if (err) throw err;

    conn.query(query, function (err, results) {
      if (err) throw err

      const article = {
        ...results[0],
        image: pathFile + results[0].image
      }

      response.render('editArticle', {
        title,
        isLogin: request.session.isLogin,
        article
      })
    })
  })
});

app.post('/edit-article', uploadFile('image'), function (req, res) {
  let { id, title, content, oldImage } = req.body;

  let image = oldImage.replace(pathFile, '');

  if (req.file) {
    image = req.file.filename;
  }

  const query = `UPDATE articles SET title = "${title}", content = "${content}", image = "${image}" WHERE id = ${id}`;

  dbConnection.getConnection((err, conn) => {
    // if (err) throw err;
    if (err) {
      console.log(err);
    }

    conn.query(query, (err, results) => {
      // if (err) throw err;

      if (err) {
        console.log(err);
      }
      res.redirect(`/article/${id}`);
    });
  });
});
app.get('/delete-article/:id', function (request, response) {
  const id = request.params.id

  const query = `DELETE FROM articles WHERE id=${id}`
  dbConnection.getConnection(function (err, conn) {
    if (err) throw err;

    conn.query(query, function (err, results) {
      if (err) throw err

      response.redirect('/')
    })
  })
})

app.get('/login', function (request, response) {
  response.render('login', {
    title: 'Login',
    auth: true
  });
});

app.post('/login', function (request, response) {
  const { email, password } = request.body

  if (email == '' || password == '') {
    request.session.message = {
      type: 'danger',
      message: 'Please insert all data'
    }
    response.redirect('/login')
  }

  const query = `SELECT *, MD5(password) AS password FROM users WHERE email = "${email}" AND password="${password}"`
  dbConnection.getConnection(function (err, conn) {
    if (err) throw err;

    conn.query(query, function (err, results) {
      if (err) throw err

      // console.log(results)
      if (results.length == 0) {
        request.session.message = {
          type: 'danger',
          message: 'Email and password doesnt exist or match'
        }
        response.redirect('/login')
      } else {
        request.session.message = {
          type: 'success',
          message: 'You are logged'
        }

        request.session.isLogin = true;

        request.session.user = {
          id: results[0].id,
          email: results[0].email,
          name: results[0].name,
          photo: results[0].photo
        }
      }
      response.redirect('/')
    })
  })
});

app.get('/logout', function (request, response) {
  request.session.destroy()
  response.redirect('/')
})


app.get('/register', function (request, response) {
  response.render('register', {
    title: 'Register',
    auth: true
  });
});

app.post('/register', function (request, response) {
  // const data = request.body
  // console.log(data)
  const { email, password, name } = request.body

  if (email == '' || password == '' || name == '') {
    request.session.message = {
      type: 'danger',
      message: 'Please insert all field'
    }

    return response.redirect('/register')
  }

  // const hashPassword = bcrypt.hashSync(password, 10)

  // const query = `INSERT INTO users (email, password, name) VALUES ("${email}","${hashPassword}","${name}")`
  const query = `INSERT INTO users (email, password, name) VALUES ("${email}","${password}","${name}")`
  dbConnection.getConnection(function (err, conn) {
    if (err) throw err;

    conn.query(query, function (err, results) {
      if (err) throw err
      request.session.message = {
        type: 'success',
        message: 'Your account succesfully registered'
      }
      response.redirect('/register')
    })
  })


});

const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);

hbs.handlebars.registerHelper('isAuth', function (value) {
  if (value == true) {
    return false;
  } else {
    return true;
  }
});
