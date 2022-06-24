const express = require('express');
const router = express.Router();
const mysql = require('./../database/mysql').pool
// const auth = require('./../middlewares/auth')


// buscar todos
router.get('/livros', (req, res) => {
    mysql.query("SELECT * FROM `livros`", (err, results, fields) => {
        if (err) {
            return res.status(500).send({
                error: err,
                response: null
            })
        }

        return res.status(200).send({
            error: null,
            response: results
        })

    }
    );
})

// criar
router.post('/livro', (req, res) => {

    var { nome_livro, codigo_livro } = req.body

 

    var cmd = "INSERT INTO `livros` (`id_livro`, `nome_livro`, `codigo`, `disponivel`) VALUES (NULL, ?, ?, '1')"

    mysql.query(cmd, [nome_livro, codigo_livro], (err, results, fields) => {
        if (err) {
            return res.status(500).send({
                error: err,
                response: null
            })
        }

        return res.status(201).send({
            error: null,
            response: results
        })

    }
    );

})

// buscar 1
router.get('/livro/:id', (req, res) => {
    var id_livro = parseInt(req.params.id)

    var cmd = "SELECT * FROM `livros` WHERE livros.id_livro = ?"



    if (isNaN(id_livro)) {
        return res.json({
            error: "Não é numerico"
        })
    } else {



        mysql.query(cmd, [id_livro], (err, results, fields) => {
            if (err) {
                return res.status(500).send({
                    error: err,
                    response: null
                })
            }

            return res.status(200).send({
                error: null,
                response: results
            })

        }
        );

    }

})

// deletar
router.post('/livro/del', (req, res) => {
    var { id_livro } = req.body

    var cmd = "DELETE FROM `livros` WHERE `livros`.`id_livro` = ?"

    mysql.query(cmd, [id_livro], (err, results, fields) => {
        if (err) {
            return res.status(500).send({
                error: err,
                response: null
            })
        }

        return res.status(200).send({
            error: null,
            response: results
        })

    }
    );

})

// update
router.post('/livro/update', (req, res) => {
    var { nome_livro, codigo, id_livro } = req.body

    var cmd = "UPDATE `livros` SET `nome_livro` = ?, `codigo` = ? WHERE `livros`.`id_livro` = ?"

    mysql.query(cmd, [nome_livro, codigo, id_livro], (err, results, fields) => {
        if (err) {
            return res.status(500).send({
                error: err,
                response: null
            })
        }

        return res.status(200).send({
            error: null,
            response: results
        })

    }
    );

})

// Renderiza a view do CRUD de Livros
router.get('/admin/livros', (req, res) => {
    res.render('admin/livros/livros')
})

module.exports = router