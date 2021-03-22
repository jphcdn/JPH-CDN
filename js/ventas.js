$(document).ready(function() {
    $('.sidebar-minify-btn').click();
    loadtableVentas();
});
if ($("#tablesearchlogs").length > 0) {
    loadLogsSearch();
}

$('.fechaA').datepicker({
    format: 'dd/mm/yyyy',
    language: 'es',
    todayHighlight: true,
    autoclose: true,
}).on('changeDate', function(e) {
    $('.fechaB').removeAttr('disabled');
    $('.fechaB').val('');
    $('.fechaB').removeData();
    var foo = $('.fechaA').val();

    $('.fechaB').datepicker({
        format: 'dd/mm/yyyy',
        language: 'es',
        startDate: foo,
        todayBtn: "linked",
        todayHighlight: true,
        autoclose: true,
    });
});
$("#buscarlogs").click(function(event) {
    var fechaA = $(".fechaA").val();
    var fechaB = $(".fechaB").val();

    var id = "tablesearchlogs"
    var url = './router/Router.php/Administrador/ListarLogsBusqueda';
    var headers = ['keyword', 'quantity', 'created_at'];
    var ajax = { fechaA: fechaA, fechaB: fechaB };
    datatableLogs(id, url, headers, ajax);

});

function loadtableVentas() {
    var id = "table_ventas"
    var url = './router/Router.php/Ventas/ListarVentasEstado';
    var headers = ['numero', 'fecha_transaccion', 'nombre_evento', 'fecha_evento', 'nombre_vendedor', 'nombre_comprador', 'ubicacion', 'fila', 'cantidad', 'precio_final', 'estado', 'email_comprador'];
    var ajax = { estado: '1' };

    datatableventas(id, url, headers, ajax, mostrarDatosEvento);
}

function loadLogsSearch() {
    var id = "tablesearchlogs"
    var url = './router/Router.php/Administrador/ListarLogsBusqueda';
    var headers = ['keyword', 'quantity', 'created_at'];
    var ajax = { estado: '1' };

    datatableLogs(id, url, headers, ajax);
}

function mostrarDatosEvento() {

}

function datatableLogs(id, url, headers, parameters_ajax) {
    var table = $("#" + id).DataTable();

    table.destroy();
    columns = [];

    headers.forEach(function(element) {
        columns.push({ data: element });
    });

    table = $('#' + id).DataTable({
        "searching": true,
        "ordering": false,
        "scrollCollapse": false,
        "scrollY": false,
        "processing": true,
        "bAutoWidth": false,
        "scrollX": false,
        "language": lan,
        "ajax": {
            "url": url,
            "type": "POST",
            "data": parameters_ajax,
        },
        "columns": columns

    });

}

function datatableventas(id, url, headers, parameters_ajax, funcion) {

    var table = $("#" + id).DataTable();
    table.column(11).visible() === true ? '' : table.column(11).visible(true);
    table.destroy();

    columns = [];
    tempArray = [];
    combined = [];
    headers.forEach(function(element) {
        columns.push({ data: element });
    });
    tempArray.push({
        "data": "idtransaccion",
        "width": 150,
        render: function(data, type, row) {
            btncancelar = '';

            // if (row.estado == 'Generar etiqueta' || row.estado == 'En camino' || row.estado == 'Etiqueta impresa') 
            // {
            btncancelar = '&nbsp;<button class="btn btn-danger" id="cancelarventa" title="Rechazar" onclick="cancelarventa(\'' + row.id_transaccion + '\');"><i class="fa fa-times"></i></button>';

            if (row.estado == 'Procesando pago') {
                btncancelar = '&nbsp;<button class="btn btn-info" title="Pagado" onclick="estadoVenta(\'' + row.id_transaccion + '\',4);">Pagado</button>';
            }
            if (row.estado == 'Pendiente de pago') {
                btncancelar = '&nbsp;<button class="btn btn-info" title="Pagado" onclick="estadoVenta(\'' + row.id_transaccion + '\',3);">Procesando pago</button>';
            }
            if (row.estado == 'Enviada') {
                btncancelar = '&nbsp;<button class="btn btn-info" title="Payed" onclick="estadoVenta(\'' + row.id_transaccion + '\',10);">Payed</button>';
            }
            return '<button class="btn btn-info" data-nombrecomprador="' + row.nombre_comprador + '" data-telefonocomprador="' + row.telefono_comprador + '" data-ciudadenvio="' + row.ciudad_envio + '" data-codigopostal="' + row.codigo_postal_envio + '" data-provinciaenvio="' + row.provincia_envio + '" data-tipoticket="' + row.tipo_ticket + '" data-sector="' + row.sector + '" data-cantidad="' + row.cantidad + '" id="details" title="ver Detalles" data-evento="' + row.nombre_evento + '" data-idtransaccion="' + row.id_transaccion + '" data-fecha="' + row.fecha_evento + '" data-lugar="' + row.recinto + ' ' + row.ciudad + '"  onclick="detalles(this);"><i class="fa fa-clipboard-list"></i></button>' +
                btncancelar +
                '&nbsp;<button class="btn btn-default" id="comentarios" title="Comentar" onclick="comentarios(\'' + row.id_transaccion + '\');"><i class="fa fa-comment"></i></button>'
        }
    });


    //valor combinado entre columna 6 y 7
    headers.forEach(function(element) {
        columns.push({ data: element });
    });


    table = $('#' + id).DataTable({
        "searching": true,
        "ordering": false,
        "scrollCollapse": true,
        "scrollY": false,
        "processing": true,
        "bAutoWidth": false,
        "scrollX": false,
        "language": lan,
        "ajax": {
            "url": url,
            "type": "POST",
            "data": parameters_ajax,
        },
        "columns": [
            columns[0],
            columns[1],
            columns[2],
            columns[3],
            columns[4],
            columns[5],
            columns[6],
            columns[7],
            columns[8],
            columns[9],
            columns[10],
            columns[11],
            tempArray[0]
        ]
    });
    table.column(11).visible(false);


}

function estadoVenta(idtransaccion, estadov) {
    $.ajax({
        url: './router/Router.php/Ventas/EditarEstadoVenta',
        type: 'POST',
        data: { id_transaccion: idtransaccion, estado: estadov },
        beforeSend: function(response) {},
        success: function(response) {
            response = jQuery.parseJSON(response);
            if (!response.error) {
                $.gritter.add({
                    title: "<div class='row alertCorrecta'><div class='col-md-2'><i class='fa fa-check-circle alineado'></i></div><div class='col-md-10 d-flex'><div class='alineado'><h4>Guardado.</h4><span class='w-100'>Estado actualizado correctamente.</span></div></div></div>",
                    text: '',
                    time: 2000,
                    class_name: "gritter-light"
                });
                $('.botonCambiarEstado').hide();
                loadtableVentas();
            }
        }
    });
}

function cancelarventa(idtransaccion) {
    bootbox.confirm({
        message: "<h4>¿Seguro que quiere cancelar?</h4>",
        buttons: {
            confirm: {
                label: 'SI',
                className: 'btn-success'
            },
            cancel: {
                label: 'NO',
                className: 'btn-danger'
            }
        },
        callback: function(result) {
            if (result == true) {
                $.ajax({
                    url: './router/Router.php/Ventas/EditarEstadoVenta',
                    type: 'POST',
                    data: { id_transaccion: idtransaccion, estado: 12 },
                    beforeSend: function(response) {},
                    success: function(response) {
                        response = jQuery.parseJSON(response);
                        if (!response.error) {
                            loadtableVentas();
                        }
                    }
                });

            }
        }
    });
}

function detalles(element) {

    var idTransaccion = $(element).attr('data-idtransaccion');
    var evento = $(element).attr('data-evento');
    var fecha = $(element).attr('data-fecha');
    var lugar = $(element).attr('data-lugar');

    var tipoticket = $(element).attr('data-tipoticket');
    var sector = $(element).attr('data-sector');
    var cantidad = $(element).attr('data-cantidad');

    var nombrecomprador = $(element).attr('data-nombrecomprador');
    var telefonocomprador = $(element).attr('data-telefonocomprador');
    var codigopostal = $(element).attr('data-codigopostal');
    var ciudadenvio = $(element).attr('data-ciudadenvio');
    var provinciaenvio = $(element).attr('data-provinciaenvio');

    $.confirm({
        columnClass: 'col-sm-12',
        containerFluid: true,
        title: false,
        theme: 'light',
        content: function() {
            var self = this;
            return $.ajax({
                url: './router/Router.php/Ventas/DetallesVenta',
                dataType: 'html',
                method: 'post',
                data: {
                    idtransaccion: idTransaccion,
                    fecha: fecha,
                    lugar: lugar,
                    nombre_evento: evento,
                    tipoticket: tipoticket,
                    sector: sector,
                    nombrecomprador: nombrecomprador,
                    telefonocomprador: telefonocomprador,
                    codigopostal: codigopostal,
                    ciudadenvio: ciudadenvio,
                    provinciaenvio: provinciaenvio
                }
            }).done(function(response) {
                self.setContent(response);
            }).fail(function() {
                self.setContent('Error al cargar contenido');
            });
        },
        buttons: false
    });
}

function comentarios(idtransaccion) {

    $.confirm({
        columnClass: 'col-md-6 col-md-offset-3 col-xs-6 col-xs-offset-3',
        containerFluid: true,
        title: false,
        content: function() {
            var self = this;
            return $.ajax({
                url: './router/Router.php/Ventas/ComentariosTransaccion',
                dataType: 'html',
                method: 'post',
                data: {
                    id_transaccion: idtransaccion,
                }
            }).done(function(response) {
                self.setContent(response);
            }).fail(function() {
                self.setContent('Error al cargar contenido');
            });
        },
        buttons: false
    });
}

function modalCambiarVendedor() {
    $.confirm({
        columnClass: 'col-md-6 col-md-offset-3 col-xs-6 col-xs-offset-3',
        containerFluid: true,
        title: false,
        content: function() {
            var self = this;
            return $.ajax({
                url: './router/Router.php/Ventas/CambiarVendedor',
                dataType: 'html',
                method: 'post',
                data: {
                    id_transaccion: 1,
                }
            }).done(function(response) {
                self.setContent(response);
            }).fail(function() {
                self.setContent('Error al cargar contenido');
            });
        },
        buttons: false

    });
}

function modalupstraking() {
    idtransaccion = $(this).attr('data-idtransaccion');
    $.confirm({
        columnClass: 'col-md-6 col-md-offset-3 col-xs-6 col-xs-offset-3',
        containerFluid: true,
        title: false,
        content: function() {
            var self = this;
            return $.ajax({
                url: './router/Router.php/Ventas/agregarupstrakingmodal',
                dataType: 'html',
                method: 'post',
                data: {
                    id_transaccion: idtransaccion,
                }
            }).done(function(response) {

                self.setContent(response);
            }).fail(function() {
                self.setContent('Error al cargar contenido');
            });
        },
        buttons: false
    });
}

function modalCambiarComprador() {
    idtransaccion = $(this).attr('data-idtransaccion');
    $.confirm({
        columnClass: 'col-md-6 col-md-offset-3 col-xs-6 col-xs-offset-3',
        containerFluid: true,
        title: false,
        content: function() {
            var self = this;
            return $.ajax({
                url: './router/Router.php/Ventas/CambiarComprador',
                dataType: 'html',
                method: 'post',
                data: {
                    id_transaccion: idtransaccion,
                }
            }).done(function(response) {

                self.setContent(response);
            }).fail(function() {
                self.setContent('Error al cargar contenido');
            });
        },
        buttons: {
            'REGISTRAR COMPRADOR': function() {
                jconfirm.instances[1].close();
                NuevoUsuario()
            },

        }
    });
}

function modalEditarDireccion() {
    $.confirm({
        columnClass: 'col-md-6 col-md-offset-3 col-xs-6 col-xs-offset-3',
        containerFluid: true,
        title: false,
        content: function() {
            var self = this;
            return $.ajax({
                url: './router/Router.php/Ventas/EditarDireccion',
                dataType: 'html',
                method: 'post',
                data: {
                    idPais: $('#paisComprador').attr('data-idpais'),
                    idDireccion: $("#idDireccionComprador").val()
                }
            }).done(function(response) {
                self.setContent(response);
            }).fail(function() {
                self.setContent('Error al cargar contenido');
            });
        },
        buttons: false
    });
}


function buscarVendedor(mail) {
    $("#datosVendedorModal").hide();
    $('#noExisteVendedor').hide();
    $('#spinner').show();
    $.ajax({
        url: "./router/Router.php/Ventas/BuscarUsuarioPorMail",
        type: 'POST',
        data: { mail: mail },
        success: function(response) {
            $('#spinner').hide();
            if ($.trim(response) != '') {
                response = jQuery.parseJSON(response);
                $('#idVendedor').val(response[0].id);
                $('#ddNombreVendedor').text(response[0].nombre);
                $('#ddEmail').text(response[0].email);
                $('#ddTelefono').text(response[0].celular);

                $('#spinner').hide();
                $("#datosVendedorModal").hide();
                $('#datosVendedorModal').slideDown("slow", function() {});
            } else {
                $('#noExisteVendedor').show();
            }

        },
        error: function() {

        }
    });

}

function buscarComprador(mail) {
    $("#datosCompradorModal").hide();
    $('#noExisteComprador').hide();
    $('#spinner').show();
    $.ajax({
        url: "./router/Router.php/Ventas/BuscarUsuarioPorMail",
        type: 'POST',
        data: { mail: mail },
        success: function(response) {

            $('#spinner').hide();
            if ($.trim(response) != '') {
                response = jQuery.parseJSON(response);
                $('#idComprador').val(response[0].id);
                $('#ddNombreComprador').text(response[0].nombre + ' ' + response[0].apellido);
                $('#ddEmail').text(response[0].email);
                $('#ddTelefono').text(response[0].celular);

                $("#datosCompradorModal").hide();
                $('#datosCompradorModal').slideDown("slow", function() {});
            } else {
                $('#noExisteComprador').show();
            }


        },
        error: function() {

        }
    });

}

function actualizarVendedor(idVendedor, idTransaccion) {

    $("#datosVendedorModal").hide();
    $('#spinner').show();
    $.ajax({
        url: "./router/Router.php/Ventas/ActualizarVendedor",
        type: 'POST',
        data: {
            idVendedor: idVendedor,
            idTransaccion: idTransaccion
        },
        success: function(response) {
            response = jQuery.parseJSON(response);
            if (!response.error) {
                $.alert({
                    title: false,
                    content: 'Vendedor actualizado correctamente',
                    autoClose: 'Ok|5000',
                    buttons: {
                        Ok: function() {
                            jconfirm.instances[1].close();
                        }
                    }

                });
            } else {
                $.alert({
                    title: false,
                    content: 'Error al actualizar vendedor',
                });
            }
        },
        error: function() {

        }
    });
}

function actualizarComprador(idComprador, idTransaccion) {

    $("#datosCompradorModal").hide();
    $('#spinner').show();
    $.ajax({
        url: "./router/Router.php/Ventas/ActualizarComprador",
        type: 'POST',
        data: {
            idComprador: idComprador,
            idTransaccion: idTransaccion
        },
        success: function(response) {
            response = jQuery.parseJSON(response);
            if (!response.error) {
                $.alert({
                    title: false,
                    content: 'Comprador actualizado correctamente',
                    autoClose: 'Ok|3000',
                    buttons: {
                        Ok: function() {
                            jconfirm.instances[1].close();
                            $("#nombrecompradordetalle").html($("#ddNombreComprador").text());
                            $("#emailcompradordetalle").html($("#ddEmail").text());
                            $("#tlfcompradordetalle").html($("#ddTelefono").text());
                        }
                    }

                });
                loadtableVentas()
            } else {
                $.alert({
                    title: false,
                    content: 'Error al actualizar comprador',
                });
            }
        },
        error: function() {

        }
    });
}

function actualizarDireccionComprador() {
    formData = $('#formActualizarDireccionComprador').serializeArray();
    formData.push({ name: 'idDireccionComprador', value: $('#idDireccionComprador').val() });

    $.ajax({
        type: 'POST',
        url: './router/Router.php/Ventas/ActualizarDireccionComprador',
        data: formData,
        success: function(response) {
            response = jQuery.parseJSON(response);
            if (!response.error) {
                $.alert({
                    title: false,
                    content: 'Datos actualizados correctamente.',
                    autoClose: 'Ok|3000',
                    buttons: {
                        Ok: function() {
                            jconfirm.instances[1].close();
                        }
                    }

                });


                $('#ciudadComprador').text($('#ciudadUpdate').val());
                $('#direccionComprador').text($('#direccionUpdate').val());
                $('#telefenoComprador').text($('#telefonoUpdate').val());
                $('#nombrecomprador').text($('#nombreUpdate').val());
                $('#codigoComprador').text($.trim($('#codigoPostal').val()));

                $('#paisComprador').attr('data-idpais', $("#paisCompradorUpdate").val());
                $('#paisComprador').text($("#paisCompradorUpdate option:selected").text());

                $('#provinciaComprador').attr('data-idpais', $("#provinciaCompradorUpdate").val());
                $('#provinciaComprador').text($("#provinciaCompradorUpdate option:selected").text());

            } else {
                $.alert({
                    title: false,
                    content: 'Error al actualizar dirección.',
                });
            }
        }
    });
}

function habilitarbotones(estado) {


    if (estado != 'Pendiente de aprobación') {
        $("#aprobarVenta").addClass('hidden');
    }

    if (estado == 'Ventas Pendientes' || estado == 'Pago Rechazado') {
        $("#aprobarVenta").removeClass('hidden');
    }
    if (estado == 'Pendiente de pago') {
        $("#entransito").removeClass('hidden');
        $("#procesandopago").removeClass('hidden');
    }
    if (estado == 'Generar etiqueta' || estado == 'Ventas Confirmadas') {
        $("#generaretiqueta").removeClass('hidden');
        $("#agregarups").removeClass('hidden');
        $("#btnrechazar").removeClass('hidden');
    }
    if (estado == 'En camino' || estado == 'En transito') {
        $("#apagar").removeClass('hidden');
    }
    if (estado == 'Procesando pago') {
        $("#pagado").removeClass('hidden');
        $("#apagar").removeClass('hidden');
    }
    if (estado == 'Pagado') {
        $("#deshacerpago").removeClass('hidden');
        $("#pagado").addClass('hidden');
    }
    if (estado == 'Etiqueta Generada') {
        $("#entransito").removeClass('hidden');
        $("#verticket").removeClass('hidden');

    }

    if (estado == 'Pago Rechazado') {
        $("#cancelAdmin").removeClass('hidden');
        //$("#verticket").removeClass('hidden');

    }



}

function filtrarVentas() {

    var estado = $('#estado').val();
    var artista = $('#select2-artista-container').text();
    if (artista == 'Filtrar por Artista') { var artista = '' }
    var evento = $('#select2-FiltroEvento-container').text();
    if (evento == 'Filtrar por Evento') { var evento = '' }
    var vendedor = $('#select2-FiltroVendedor-container').text();
    if (vendedor == 'Filtrar por Vendedor') { var vendedor = '' }
    var orden = $('#numerOrden').val();
    var ups = $("#numerUPS").val();
    var mpg = $("#numerMPG").val();
    var apellido = $("#apellido").val();
    var dni = $("#numerDNI").val()
    if (estado == '' && artista == '' && evento == '' && vendedor == '' && orden == '' && ups == '' && mpg == '' && apellido == '' && dni == '') {
        loadtableVentas()
        return false;
    }

    var id = "table_ventas"
    var url = './router/Router.php/Ventas/filtrarOrdenVentas';
    var headers = ['numero', 'fecha_transaccion', 'nombre_evento', 'fecha_evento', 'nombre_vendedor', 'nombre_comprador', 'ubicacion', 'fila', 'cantidad', 'precio_final', 'estado', 'id_transaccion', 'email_comprador'];
    var ajax = { estado: estado, artista: artista, evento: evento, vendedor: vendedor, orden: orden, ups: ups, mpg: mpg, dni: dni, apellido: apellido };
    console.log(ajax);
    datatableventas(id, url, headers, ajax, mostrarDatosEvento);
}

//$("#estado").on('change', function() {

//    var estado = event.target.value;

//  $.ajax({
//    url: "./router/Router.php/Ventas/obtenerArtistasXEstado",
//  type: 'POST',
//data: { estado: estado },
//success: function(response) {
//  filtrarVentas();

//response = jQuery.parseJSON(response);
//var opciones = '<option value="">Filtrar por Artista</option>';

//$.each(response, function(i, item) {
//  opciones += '<option value="' + item.nombre_artista + '">' + item.nombre_artista + '</option>';
//});

//$('#artista')
//   .find('option')
//  .remove()
// .end()
//.append(opciones)
//.val('');
//}

//})
//})

$("#artista").on('change', function() {

    var artista = event.target.value;
    console.log(artista);

    $.ajax({
        url: "./router/Router.php/Ventas/obtenerEventosxArtistasSelect",
        type: 'POST',
        data: { artista: artista },
        success: function(response) {
            filtrarVentas();


            response = jQuery.parseJSON(response);
            console.log(response)
            var opciones = '<option value="">Filtrar por Vendedor</option>';

            $.each(response, function(i, item) {
                opciones += '<option value="' + item.nombre_vendedor + '">' + item.nombre_vendedor + '</option>';
            });

            $('#artista')
                .find('option')
                .remove()
                .end()
                .append(opciones)
                .val('');
        }

    })
})


$("#FiltroEvento").on('change', function() {

    var evento = event.target.value;
    console.log(evento);

    $.ajax({
        url: "./router/Router.php/Ventas/obtenerEventosSelect",
        type: 'POST',
        data: { evento: evento },
        success: function(response) {
            filtrarVentas();


            response = jQuery.parseJSON(response);
            console.log(response)
            var opciones = '<option value="">Filtrar por Vendedor</option>';

            $.each(response, function(i, item) {
                opciones += '<option value="' + item.nombre_vendedor + '">' + item.nombre_vendedor + '</option>';
            });

            $('#FiltroEvento')
                .find('option')
                .remove()
                .end()
                .append(opciones)
                .val('');
        }

    })
})


$("#FiltroVendedor").on('change', function() {

    var vendedor = event.target.value;
    console.log(vendedor);

    $.ajax({
        url: "./router/Router.php/Ventas/obtenerEventosxArtistasSelect",
        type: 'POST',
        data: { vendedor: vendedor },
        success: function(response) {
            filtrarVentas();


            response = jQuery.parseJSON(response);
            console.log(response)
            var opciones = '<option value="">Filtrar por Vendedor</option>';

            $.each(response, function(i, item) {
                opciones += '<option value="' + item.nombre_vendedor + '">' + item.nombre_vendedor + '</option>';
            });

            $('#FiltroVendedor')
                .find('option')
                .remove()
                .end()
                .append(opciones)
                .val('');
        }

    })
})


$("#numerOrden").keypress(function(e) {

    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) {
        filtrarVentas();
    }
})

$('#numerUPS').keypress(function(e) {

    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) {
        filtrarVentas();
    }
})
$("#numerMPG").keypress(function(e) {

    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) {
        filtrarVentas();
    }
})

$("#apellido").keypress(function(e) {

    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) {
        filtrarVentas();
    }
})
$("#numerDNI").keypress(function(e) {

    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) {
        filtrarVentas();
    }
})

function editarcomentario(id) {
    $('#comentario' + id + '').hide();
    $('#update' + id + '').show().focus();
    $('#bt' + id + '').show();

}

function modificarComentario(id) {
    var comentario = $('#update' + id + '').val();
    var id = id;

    $.ajax({
        url: "./router/Router.php/Ventas/modificarComentario",
        type: 'POST',
        data: { id: id, comentario: comentario },
        success: function(response) {
            $('#update' + id + '').hide();

            $('#bt' + id + '').hide();
            $('#comentario' + id + '').text(comentario).show();

        }


    });

}

function eliminarComentario(id) {
    $.confirm({
        title: 'Confirm!',
        content: 'Simple confirm!',
        buttons: {
            confirm: function() {
                $.ajax({
                    url: "./router/Router.php/Ventas/eliminarComentario",
                    type: 'POST',
                    data: { id: id },
                    success: function(response) {
                        $('#div' + id + '').remove();
                        $('#class' + id + '').remove();
                    }
                });
            },
            cancel: function() {

            },

        }
    });


}

function NuevoUsuario() {

    $.confirm({
        columnClass: 'col-md-6 col-md-offset-3 col-xs-6 col-xs-offset-3',
        containerFluid: true,
        title: false,
        content: function() {
            var self = this;
            return $.ajax({
                url: './router/Router.php/Ventas/NuevoComprador',
                dataType: 'html',
                method: 'post',
                data: {
                    id_transaccion: 1,
                }
            }).done(function(response) {
                self.setContent(response);
            }).fail(function() {
                self.setContent('Error al cargar contenido');
            });
        },
        buttons: false
    });

}

$(document).on('submit', '.form_session', function(e) {
    var idTransaccion = $("#idTransaccionSeleccionada").val();
    $("#id_trans").val(idTransaccion);

    var nombre = $("#nombreNuevo").val();
    var apellido = $("#apellidoNuevo").val();
    var telef = $("#telefNuevo").val();
    var idTrans = $("#idTransaccionSeleccionada").val()
    e.preventDefault();

    var quien = $(this).attr("id"); //identificador del formulario
    var formURL = $(this).attr("data-formURL"); //url donde seran enviado los datos
    var formData = new FormData($("#" + quien)[0]);

    if (quien == 'form_register') {
        var clave = $("#pass1").val();
        var clave2 = $("#pass2").val();

        if (clave != clave2) {
            $.alert({
                title: 'Las contraseñas no conciden!',
                content: 'por favor intentelo nuevamente!',
            });

            $("#pass1").val("");
            $("#pass2").val("");
            return false;
        }

    }

    $.ajax({
        url: formURL,
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        beforeSend: function() {

        },
        success: function(response) {

            if ($.trim(response) != '') {
                response = jQuery.parseJSON(response);
                var idUsuari = response.lastId;
                if (quien == 'form_register') {
                    if (!response.error) {
                        $.confirm({
                            title: 'Se cambiado de comprador con exito!',
                            content: 'Desea agregar una direccion para ' + nombre + ' ' + apellido + '?',
                            buttons: {
                                Si: function() {
                                    AgregarDireccion(nombre, apellido, telef, idTrans, idUsuari);
                                },
                                No: function() {
                                    $.alert('Canceled!');
                                },

                            }
                        });

                        $("#nombrecompradordetalle").html(nombre);
                        $("#emailcompradordetalle").html(apellido);
                        $("#tlfcompradordetalle").html(telef);
                        //   alert("Se realizo el registro con exito");


                        //frm.reset();  //limpiar todos los inputs dentro del formulario
                        jconfirm.instances[1].close();


                        return false;

                    } else {
                        bootbox.alert({
                            message: "<h4>Error al realizar el registro.</h4>",
                            className: 'modal-center',
                            closeButton: false
                        });
                    }
                }
                if (quien == 'form_login') {

                    $("#mensajelogin").html(response.mensaje);
                    $("#divalertlogin").addClass('show');


                    if (response.status == 200) {
                        Partials.navbar();
                        $("#loginmodal").modal('hide');
                        $('.modal-backdrop').remove()
                        $("body").removeClass('modal-open')
                        $("body").addClass('p-0')
                        if ($("#divenvio")) {
                            setTimeout(function() { Partials.pasoenvio(); }, 600);
                        }



                    } else {
                        $("#mensajelogin").html(response.mensaje);

                    }
                }

            }
        }

    });
});

function AgregarDireccion(nombre, apellido, telef, trans, idUsuari) {
    console.log(trans);
    $.confirm({
        columnClass: 'col-md-6 col-md-offset-3 col-xs-6 col-xs-offset-3',
        containerFluid: true,
        title: false,
        content: function() {
            var self = this;
            return $.ajax({
                url: './router/Router.php/Ventas/direccionNuevoComprador',
                dataType: 'html',
                method: 'post',
                data: { nombre: nombre, apellido: apellido, telefono: telef, idTransaccion: trans, idUsuario: idUsuari, principal: 1 }
            }).done(function(response) {
                self.setContent(response);
            }).fail(function() {
                self.setContent('Error al cargar contenido');
            });
        },
        buttons: false
    });

}
$(document).on('submit', '.form_submitDireccion', function(e) {

    var provincia = $("#provincia").val();
    var ciudad = $("ciudaddirec").val();
    var direccion = $("#direcciondirec").val();
    var telef = $("#celular").val();
    var cp = $("cpdirec").val();
    var nombre = $("#nombredirecc").val();
    var pais = $("#paisdirec").val();


    e.preventDefault();

    var quien = $(this).attr("id"); //identificador del formulario
    var formURL = $(this).attr("data-formURL"); //url donde seran enviado los datos
    var formData = new FormData($("#" + quien)[0]);
    var token = 1;
    $('#guardarDireccion').text('REGISTRANDO DIRECCIÓN...');
    $('#guardarDireccion').attr('disabled', 'disabled');

    $.ajax({
        url: formURL,
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        beforeSend: function() {

        },
        success: function(response) {
            response = jQuery.parseJSON(response);
            if (!response.error) {
                console.log(nombre)
                $("#provinciaComprador").html(provincia);
                $("#ciudadComprador").html(ciudad);
                $("#direccionComprador").html(direccion);
                $("#telefenoComprador").html(telef);
                $("#codigoComprador").html(cp);
                $("#paisComprador").html(pais);


                jconfirm.instances[1].close();
                return false;

            } else {
                bootbox.alert({
                    message: "<h4>Error al guardar los datos.</h4>",
                    className: 'modal-center',
                    closeButton: false
                });
            }
        }

    });

});

function tablaexcelAdmin() {

    var estado = $('#estado').val();
    var artista = $('#artista').val();
    var evento = $('#FiltroEvento').val();
    var vendedor = $('#FiltroVendedor').val();
    var apellido = $('#apellido').val();
    var numerOrden = $('#numerOrden').val();
    var numerUPS = $('#numerUPS').val();
    var numerMPG = $('#numerMPG').val();
    var numerDNI = $('#numerDNI').val();

    window.open('generarExcel.php?estado=' + estado + '&artista=' + artista + '&evento=' + evento + '&apellido=' + apellido + '&numerOrden=' + numerOrden + '&numerUPS=' + numerUPS + '&numerMPG=' + numerMPG + '&numerDNI=' + numerDNI + '&token=' + 1 + '&vendedor=' + vendedor);
}
$(function() {
    $('#login').popover({
            trigger: 'focus',
            placement: 'bottom',
            title: 'Popover Form',
            html: true,
            content: $('#modalhistoricoprecios').html()
        })
        /* $('.popover-dismiss').popover({
           trigger: 'focus'
         })*/
})