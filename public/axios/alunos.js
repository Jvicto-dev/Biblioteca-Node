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

function getAlunos() {
    axios.get('/alunos').then(res => {
        var html = ""

        res.data.response.forEach(alunos => {



            html += `
            <tr>
               <td>${alunos.id_aluno}</td>
               <td>${alunos.nome}</td>
               <td>${alunos.idade}</td>
               <td>${alunos.turma}</td>
               <td>
                 <button type="button" class="btn btn-primary" onclick="editarAluno(${alunos.id_aluno})">Editar</button>
               </td>
               <td> 
                 <button type="button" class="btn btn-danger" onclick="excluirAluno(${alunos.id_aluno})">Excluir</button>
               </td>
            </tr>
            `

        });

        $("#table_alunos").html(html)
        load_tabela_main()

    }).catch(err => {
        console.log(err)
    })

}

function excluirAluno(id) {
    if (isNaN(id)) {
        Swal.fire(
            'Ops',
            'Você tentou passar um valor numerico ?',
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

                axios.post('/aluno/del', {
                    id_aluno: id
                }).then(res => {
                    if (res.status == 200) {
                        Swal.fire(
                            'Sucesso',
                            'Aluno excluido com sucesso !',
                            'success'
                        );

                        $("#table").DataTable().destroy()
                        getAlunos()
                    }
                }).catch(err => {

                })

            }
        })
    }
}

function CadastrarAluno() {
    var nome_aluno = $("#nome_aluno").val()
    var idade_aluno = $("#idade_aluno").val()
    var turma_aluno = $("#turma_aluno").val()

    if (nome_aluno == "" || idade_aluno == "" || turma_aluno == "") {
        Swal.fire(
            'Ops',
            'Você deixou algum campo em branco',
            'warning'
        );
    } else {
        axios.post('/aluno', {
            nome_aluno: nome_aluno,
            idade_aluno: idade_aluno,
            turma_aluno: turma_aluno
        }).then(res => {
            if (res.status == 201) {
                Swal.fire(
                    'Sucesso',
                    'Aluno cadastrado com sucesso !',
                    'success'
                );

                $("#nome_aluno").val('')
                $("#idade_aluno").val('')
                $("#turma_aluno").val('')
                $("#cadastrar_aluno_modal").modal('hide')

                $("#table").DataTable().destroy()
                getAlunos()
            }
        }).catch(err => {

        })
    }
}

function editarAluno(id) {
    $('#modal_editar_aluno').modal('show')

    axios.get(`/aluno/${id}`).then(res => {
        const data = res.data.response[0]

        console.log(data)

        $("#nome_aluno_editar").val(data.nome)
        $("#idade_aluno_editar").val(data.idade)
        $("#turma_aluno_editar").val(data.turma)
        $("#id_aluno").val(data.id_aluno)

    })
}

function update() {
    var nome_aluno = $("#nome_aluno_editar").val()
    var idade_aluno = $("#idade_aluno_editar").val()
    var turma_aluno = $("#turma_aluno_editar").val()
    var id_aluno = $("#id_aluno").val()

    if (nome_aluno == "" || idade_aluno == "" || turma_aluno == "" || id_aluno == "") {
        Swal.fire(
            'Ops',
            'Você, algum campo ficou vazio',
            'warning'
        );
    } else {
        axios.post('/aluno/update', {
            nome_aluno: nome_aluno,
            idade_aluno: idade_aluno,
            turma_aluno: turma_aluno,
            id_aluno: id_aluno
        }).then(res => {
            if (res.status == 200) {
                Swal.fire(
                    'Sucesso',
                    'Livro editado com sucesso',
                    'success'
                );
                $("#nome_aluno_editar").val('')
                $("#idade_aluno_editar").val('')
                $("#turma_aluno_editar").val('')
                $("#id_aluno").val('')

                $("#table").DataTable().destroy()
                getAlunos()
                $('#modal_editar_aluno').modal('hide')

            }
        }).catch(err => {

        })
    }


}
