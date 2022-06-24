const express = require('express');
const router = express.Router();
const mysql = require('./../database/mysql').pool
// const auth = require('./../middlewares/auth')


// buscar todos
router.get('/emprestimos', (req, res) => {
    var cmd = "SELECT * FROM `emprestimos` INNER JOIN alunos ON alunos.id_aluno = emprestimos.id_aluno_fk INNER JOIN livros ON livros.id_livro = emprestimos.id_livro_fk"

    mysql.query(cmd, (err, results, fields) => {
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


router.get('/admin/emprestimos', (req, res) => {
    res.render('admin/emprestimos/emprestimos')
})

// criar
router.post('/emprestimo', (req, res) => {

    var { id_aluno_fk, id_livro_fk, data_emprestimo, data_devolucao } = req.body

    var cmd = "INSERT INTO `emprestimos` (`id_emprestimo`, `id_livro_fk`, `id_aluno_fk`, `data_emprestimo`, `data_devolucao`) VALUES (NULL, ?, ?, ?, ?)"

    mysql.query(cmd, [id_livro_fk, id_aluno_fk, data_emprestimo, data_devolucao], (err, results, fields) => {
        if (err) {
            return res.status(500).send({
                error: err,
                response: null
            })
        }

        cmd = "UPDATE `livros` SET `disponivel` = '2' WHERE `livros`.`id_livro` = ?"

        // para atualizar o status de disponobilidade do livro

        mysql.query(cmd, [id_livro_fk], (err, results, fields) => {
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
        })


    });

})

// Devolver livro
router.post('/devolucao', (req, res) => {

    var {id_livro_fk} = req.body

    var cmd = "DELETE FROM `emprestimos` WHERE emprestimos.id_livro_fk = ?";

    mysql.query(cmd, [id_livro_fk], (err, results, fields) => {
        if (err) {
            return res.status(500).send({
                error: err,
                response: null
            })
        }

        cmd = "UPDATE `livros` SET `disponivel` = '1' WHERE `livros`.`id_livro` = ?"

        /**
         * para atualizar o status de disponobilidade do livro
         * como ele foi devolvido, agora ele volta para 1
         *  */ 

        mysql.query(cmd, [id_livro_fk], (err, results, fields) => {
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
        })


    });

})



module.exports = router