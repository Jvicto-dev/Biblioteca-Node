function load_tabela_main() {
    $('#table').DataTable({
        lengthMenu: [
            [10, 20, 50, -1],
            [10, 20, 50, "Todos"]
        ],
        "bJQueryUI": true,
        "oLanguage": {
            "sProcessing": "Processando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "Não foram encontrados resultados",
            "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando de 0 até 0 de 0 registros",
            "sInfoFiltered": "",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "Primeiro",
                "sPrevious": "Anterior",
                "sNext": "Seguinte",
                "sLast": "Último"
            }
        }
    });
}

function getEmprestimos() {
    axios.get('/emprestimos').then(res => {
        var html = ""

        console.log(res)
        // pego a data de hoje para formular o calculo da diferença 
        const hoje = moment((new Date())).format("YYYY-MM-DD");

        res.data.response.forEach(alunos => {

            var diff = moment(alunos.data_devolucao).diff(moment(hoje));
            var dias = moment.duration(diff).asDays();

            if (dias < 0) {
                dias = `<span class="badge rounded-pill bg-danger">Passou ` + -dias + ` dias - ${moment(alunos.data_devolucao).format("DD/MM/YYYY")}</span>`
            } else {
                dias = moment(alunos.data_devolucao).format("DD/MM/YYYY")
            }

            html += `
            <tr>
               <td>${alunos.id_emprestimo}</td>
               <td>${alunos.nome_livro}</td>
               <td>${moment(alunos.data_emprestimo).format("DD/MM/YYYY")}</td>
               <td>${dias}</td>
               <td>
                 <button type="button" class="btn btn-success" onclick="devolverLivro(${alunos.id_livro_fk})"><ion-icon name="checkmark-outline"></ion-icon></button>
               </td>
            </tr>
            `
        });

        $("#table_emprestimos").html(html)
        load_tabela_main()

    }).catch(err => {
        console.log(err)
    })

}

function devolverLivro(id_livro_fk) {
    if (isNaN(id_livro_fk)) {
        Swal.fire(
            'Ops',
            'Você tentou passar um valor não numerico ?',
            'warning'
        );
    } else {
        Swal.fire({
            title: 'Tem certeza disso ?',
            text: "Você não poderá reverter isso!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, faça isso!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {

                axios.post('/devolucao', {
                    id_livro_fk: id_livro_fk
                }).then(res => {
                    if (res.status == 201) {
                        Swal.fire(
                            'Sucesso',
                            'Livro Devolvido com sucesso !',
                            'success'
                        );

                        $("#table").DataTable().destroy()
                        getEmprestimos()
                    }
                }).catch(err => {

                })

            }
        })
    }
}


function getLivrosEmprestimos() {
    axios.get('/livros').then(res => {
        var option = ""
        var disponibilidade = ""

        res.data.response.forEach(livros => {

            if (livros.disponivel == 1) {
                disponibilidade += `<option value="${livros.id_livro}">${livros.nome_livro}</option>`
            } else {
                disponibilidade += `<option value="${livros.id_livro}" disabled>${livros.nome_livro}</option>`
            }

            $("#select_livro").html(`<option>Selecione um livro</option>` + disponibilidade)

        });

    }).catch(err => {
        console.log(err)
    })
}

getLivrosEmprestimos()



function getAlunosEmprestimos() {
    axios.get('/alunos').then(res => {
        var option = ""

        res.data.response.forEach(alunos => {

            option += `
            <option value="${alunos.id_aluno}">${alunos.nome} - ${alunos.turma}</option>
            `
        });

        $("#select_aluno").html(`<option>Selecione um aluno</option>` + option)

    }).catch(err => {
        console.log(err)
    })
}

getAlunosEmprestimos()





function criarEmprestimo() {
    var select_aluno = $("#select_aluno").val()
    var select_livro = $("#select_livro").val()
    var data_emprestimo = $("#data_emprestimo").val()
    var data_devolucao = $("#data_devolucao").val()

    if (select_aluno == "" ||
        select_livro == "" ||
        data_emprestimo == "" ||
        data_devolucao == "") {
        Swal.fire(
            'Ops',
            'Você deixou algum campo em branco',
            'warning'
        );
    } else {
        axios.post('/emprestimo', {
            id_aluno_fk: select_aluno,
            id_livro_fk: select_livro,
            data_emprestimo: data_emprestimo,
            data_devolucao: data_devolucao
        }).then(res => {
            if (res.status == 201) {
                Swal.fire(
                    'Sucesso',
                    'Emprestimo cadastrado com sucesso !',
                    'success'
                );

                // $("#cadastrar_aluno_modal").modal('hide')

                $("#table").DataTable().destroy()
                getEmprestimos()
            }
        })
    }

}



