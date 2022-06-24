const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const session = require('express-session')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const auth = require('./middlewares/auth')

// const jwtSecret = "sjifdk654548"
const mysql = require('./database/mysql').pool


// // MODELS
// const User = require('./Models/')

// // CONTROLLERS
const LivrosController = require('./controllers/LivrosController')
const UserController = require('./controllers/UserController')
const AlunosController = require('./controllers/AlunosController')
const emprestimosController = require('./controllers/EmprestimosController')
const ProfessorController = require('./controllers/ProfessorController')

// view engine
app.set('view engine', 'ejs')

// body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser('s6D&r$%TRkow'))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 120000
    }
}))

app.use(flash())

// arquivos 
app.use(express.static('public'))

// CHAMADA DOS CONTROLLERS
app.use('/', LivrosController)
app.use('/', UserController)
app.use('/', AlunosController)
app.use('/', emprestimosController)
app.use('/', ProfessorController)
// ProfessorController



app.get('/', (req, res) => {
    var msg = req.flash('msg')

    msg = msg == undefined || msg.length == 0 ? undefined : msg

    res.render('index', {
        msg: msg
    })
})

app.get('/admin', auth, (req, res) => {
    res.render('admin')
})










app.listen(3000, () => {
    console.log('server rodando...')
})