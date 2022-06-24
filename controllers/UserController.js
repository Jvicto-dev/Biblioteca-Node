const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const mysql = require('./../database/mysql').pool
// const jwt = require('jsonwebtoken')

router.get('/users/create', (req, res) => {

    var password = "12345678"
    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(password, salt)

    res.json({
        hash: hash
    })

})

router.post('/authenticate', (req, res) => {
    var { email, senha } = req.body

    var cmd = "SELECT * FROM `users` WHERE users.email = ?";
    mysql.query(cmd, [email], (err, results, fields) => {


        if (results == undefined || results == "") {
            req.flash('msg', 'Email não encontrado')
            res.redirect('/')
        } else {

            var correct = bcrypt.compareSync(senha, results[0].senha)

            if (correct) {
               
                req.session.user = {
                    id: results[0].id_user,
                    nome: results[0].nome,
                    email: results[0].email
                }
                res.redirect('/admin')

            } else {
                req.flash('msg', 'Senha Invalida')
                res.redirect('/')
            }
        }
    });
})






module.exports = router