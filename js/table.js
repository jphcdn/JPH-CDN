var lan = {
    "sProcessing": "Procesando...",
    "sLengthMenu": "Mostrar _MENU_ registros",
    "sZeroRecords": "No se encontraron resultados",
    "sEmptyTable": "Ningún dato disponible en esta tabla",
    "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix": "",
    "sSearch": "Buscar:",
    "sUrl": "",
    "sInfoThousands": ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Siguiente",
        "sPrevious": "Anterior"
    },
    "oAria": {
        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }
};


function datatable(id, url, headers, parameters_ajax, funcion) {
    //pasamos el id de la Tabla
    //url donde provienen los $datos
    //parameters_ajax datos a enviar mediante post que recibe el php
    //headers arreglo con el tamaño de las columnas que debe tener la Tabla
    //funcion acciones adicionales al realizar click sobre la tabla
    var table = $("#" + id).DataTable();


    table.destroy();


    columns = [];
    console.log(columns);
    headers.forEach(function(element) {
        columns.push({ data: element });
    });

    table = $('#' + id).DataTable({
        "searching": true,
        "ordering": false,
        "scrollCollapse": true,
        "scrollY": '400px',
        "processing": true,
        "scrollX": true,
        "language": lan,
        "ajax": {
            "url": url,
            "type": "POST",
            "data": parameters_ajax,
        },
        "columns": columns


    });



    $('#' + id + ' tbody').unbind('click');
    $('#' + id + ' tbody').on('click', 'tr', function() {
        var data = table.row(this).data();

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            if (funcion) {


                funcion(data);
            }
        }
    });


}

function datatableclick(id, url, headers, parameters_ajax, funcion) {

    var table = $("#" + id).DataTable();


    table.destroy();


    columns = [];

    headers.forEach(function(element) {
        columns.push({ data: element });
    });
    columns.push({
        "data": "idvalorevento",
        "defaultContent": "<button class='btn btn-info' id='edit' title='Editar evento'><i class='fa fa-pencil-alt'></i></button> &nbsp;<button class='btn btn-info' id='showfehas' title='Ver Fechas del Evento'><i class='fa fa-calendar'></i>",
        "targets": -1
    });

    table = $('#' + id).DataTable({
        "searching": true,
        "ordering": false,
        "scrollCollapse": true,
        "scrollY": '400px',
        "processing": true,
        "scrollX": true,
        "language": lan,
        "ajax": {
            "url": url,
            "type": "POST",
            "data": parameters_ajax,
        },
        "columns": columns,


    });
    table.column(4).visible(false);


    $('#' + id + ' tbody').unbind('click');
    $('#' + id + ' tbody').on('click', '#edit', function() {
        var data = table.row($(this).parents('tr')).data();

        idevento = data.id;
        estado = data.publicacion;

        if (estado == 1) {
            btn = {
                noclose: {
                    label: "Despublicar",
                    className: 'btn-danger',
                    callback: function() {

                        accioneEvento('false', idevento);
                    }
                }
            };
        } else {
            btn = {

                ok: {
                    label: "Publicar",
                    className: 'btn-success',
                    callback: function() {
                        accioneEvento('true', idevento);
                    }
                }

            };
        }



        bootbox.dialog({
            message: "<h4>Editar estado del evento</h4>",
            onEscape: true,
            backdrop: true,
            buttons: btn
        });
    });

    $('#' + id + ' tbody').on('click', '#showfehas', function() {
        var data = table.row($(this).parents('tr')).data();

        funcion(data)
    });



}

function datatableusuarios(id, url, headers, parameters_ajax) {

    var table = $("#" + id).DataTable();


    table.destroy();


    columns = [];

    headers.forEach(function(element) {
        columns.push({ data: element });
    });
    columns.push({
        "data": "idtransaccion",
        render: function(data, type, row) {

            return '<button class="btn btn-info" style="margin-left: 30%;" id="detailsuser title="ver Detalles"  onclick="detallesusuario(\'' + row.id + '\');">Detalles</button>'
        }
    });


    table = $('#' + id).DataTable({
        "destroy": true,
        "processing": false,


        "searching": true,
        "ordering": false,
        "scrollCollapse": true,
        "scrollY": '400px',
        "scrollX": true,
        "language": lan,
        "ajax": {
            "url": url,
            "async": true,
            "type": "POST",
            "data": parameters_ajax,
        },
        "columns": columns,


    });
    table.column(6).visible(false);

}