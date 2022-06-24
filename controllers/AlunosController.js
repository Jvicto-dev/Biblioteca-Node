const express = require('express');
const router = express.Router();
const mysql = require('./../database/mysql').pool

// buscar todos
router.get('/alunos', (req, res) => {
    mysql.query("SELECT * FROM `alunos`", (err, results, fields) => {
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
router.post('/aluno', (req, res) => {

    var { nome_aluno, idade_aluno, turma_aluno } = req.body



    var cmd = "INSERT INTO `alunos` (`id_aluno`, `nome`, `idade`, `turma`) VALUES (NULL, ?, ?, ?)"

    mysql.query(cmd, [nome_aluno, idade_aluno, turma_aluno], (err, results, fields) => {
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
router.get('/aluno/:id', (req, res) => {
    var id_aluno = parseInt(req.params.id)

    var cmd = "SELECT * FROM `alunos` WHERE alunos.id_aluno = ?"



    if (isNaN(id_aluno)) {
        return res.json({
            error: "Não é numerico"
        })
    } else {



        mysql.query(cmd, [id_aluno], (err, results, fields) => {
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
router.post('/aluno/del', (req, res) => {
    var { id_aluno } = req.body

    var cmd = "DELETE FROM `alunos` WHERE `alunos`.`id_aluno` = ?"

    mysql.query(cmd, [id_aluno], (err, results, fields) => {
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

    });

})

// update
router.post('/aluno/update', (req, res) => {
    var { nome_aluno, idade_aluno, turma_aluno, id_aluno} = req.body

    var cmd = "UPDATE `alunos` SET `nome` = ?, `idade` = ?, `turma` = ? WHERE `alunos`.`id_aluno` = ?"

    mysql.query(cmd, [nome_aluno, idade_aluno, turma_aluno, id_aluno], (err, results, fields) => {
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
router.get('/admin/alunos', (req, res) => {
    res.render('admin/alunos/alunos')
})

module.exports = router