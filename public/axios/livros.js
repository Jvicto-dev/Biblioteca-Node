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

function getLivros() {
    axios.get('/livros').then(res => {
        var html = ""
        var disponibilidade = ""

        res.data.response.forEach(livros => {

            if (livros.disponivel == 1) {
                disponibilidade = `<span class="badge rounded-pill bg-success">Disponivel</span>`
            } else {
                disponibilidade = `<span class="badge rounded-pill bg-danger">Indisponivel</span>`
            }

            html += `
            <tr>
               <td>${livros.id_livro}</td>
               <td>${livros.nome_livro}</td>
               <td>${livros.codigo}</td>
               <td>`+ disponibilidade + `</td>
               <td>
                 <button type="button" class="btn btn-primary" onclick="editarLivro(${livros.id_livro})">Editar</button>
               </td>
               <td> 
                 <button type="button" class="btn btn-danger" onclick="excluirLivro(${livros.id_livro})">Excluir</button>
               </td>
            </tr>
            `

        });

        $("#table_livros").html(html)
        load_tabela_main()

    })
    // load_tabela_main()
}

function CadastrarLivro() {
    var nome_livro = $("#nome_livro").val()
    var codigo_livro = $("#codigo_livro").val()

    if (nome_livro == "" || codigo_livro == "") {
        Swal.fire(
            'Ops',
            'Você deixou algum campo em branco',
            'warning'
        );
    } else {
        axios.post('/livro', {
            nome_livro: nome_livro,
            codigo_livro: codigo_livro
        }).then(res => {
            if (res.status == 201) {
                Swal.fire(
                    'Sucesso',
                    'Livro cadastrado com sucesso !',
                    'success'
                );

                $("#nome_livro").val('')
                $("#codigo_livro").val('')

                $("#table").DataTable().destroy()
                getLivros()
            }
        }).catch(err => {

        })
    }
}

function excluirLivro(id) {
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

                axios.post('/livro/del', {
                    id_livro: id
                }).then(res => {
                    if (res.status == 200) {
                        Swal.fire(
                            'Sucesso',
                            'Livro excluido com sucesso !',
                            'success'
                        );

                        $("#table").DataTable().destroy()
                        getLivros()
                    }
                }).catch(err => {

                })

            }
        })
    }
}

function editarLivro(id) {
    $('#modal_editar_livro').modal('show')

    axios.get(`/livro/${id}`).then(res => {
        const data = res.data.response[0]

        console.log(data)

        $("#nome_livro_editar").val(data.nome_livro)
        $("#codigo_livro_editar").val(data.codigo)
        $("#id_livro").val(data.id_livro)
    })
}

function update() {
    var nome_livro = $("#nome_livro_editar").val()
    var codigo = $("#codigo_livro_editar").val()
    var id_livro = $("#id_livro").val()

    if (nome_livro == "" || codigo == "") {
        Swal.fire(
            'Ops',
            'Você, algum campo ficou vazio',
            'warning'
        );
    } else {
        axios.post('/livro/update', {
            nome_livro: nome_livro,
            codigo: codigo,
            id_livro: id_livro
        }).then(res => {
            if (res.status == 200) {
                Swal.fire(
                    'Sucesso',
                    'Livro editado com sucesso',
                    'success'
                );
                $("#nome_livro_editar").val('')
                $("#codigo_livro_editar").val('')
                $("#id_livro").val('')

                $("#table").DataTable().destroy()
                getLivros()
                $('#modal_editar_livro').modal('hide')

            }
        }).catch(err => {

        })
    }


}