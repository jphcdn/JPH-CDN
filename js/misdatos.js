$(document).ready(function() {
    FormSliderSwitcher.init();
});
$(document).on('keyup', '#filtro', function(e) {
    e.preventDefault();
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 14) {
        datos = {
            filtro: $(this).val()
        };
        miscompras(datos);
    }
});
$(document).on('change', '#pais', function() {
    idpais = $(this).val();
    $.ajax({
        url: './router/Router.php/Pais/ObtenerProvincias',
        type: 'POST',
        data: { idPais: idpais },
        success: function(response) {
            response = JSON.parse(response);
            $("#provincia").empty();
            $("#provincia").append("<option value=''>Seleccione...<option>");

            for (var i = 0; i < response.length; i++) {
                $("#provincia").append("<option value='" + response[i].id + "'>" + response[i].provincia + "<option>");
            }
        }
    });

});
$(document).on('submit', '.form_submit', function(e) {

    e.preventDefault();

    var quien = $(this).attr("id"); //identificador del formulario
    var formURL = $(this).attr("data-formURL"); //url donde seran enviado los datos
    var formData = new FormData($("#" + quien)[0]);
    continuar = true;
    if (quien == 'form_datospersonales') {

        continuar = validarPass();
    }
    if (continuar) {

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
                    bootbox.alert({
                        message: "<h4>Se guardaron los datos con exito</h4>",
                        className: 'modal-center',
                        closeButton: false
                    });
                    //limpiar todos los inputs dentro del formulario
                    //
                    if (quien == 'form_mis_direcciones' || quien == 'form_datos_facturacion' || quien == 'form_metodo_cobro') {
                        setTimeout(function() { location.reload(); }, 500);
                    } else {
                        $('#' + quien).trigger("reset");

                    }
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
    }
});
$(document).on('submit', '.form_submit_editusuario', function(e) {

    e.preventDefault();

    var quien = $(this).attr("id"); //identificador del formulario
    var formURL = $(this).attr("data-formURL"); //url donde seran enviado los datos
    var formData = new FormData($("#" + quien)[0]);

    $.ajax({
        url: formURL,
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(response) {
            response = jQuery.parseJSON(response);
            if (!response.error) {

                $.dialog({
                    title: false,
                    content: "<h4>Se guardaron los datos con exito</h4>",
                    buttons: false
                });
                jconfirm.instances[0].close();
                $('#' + quien).trigger("reset");


                return false;

            } else {
                jconfirm.instances[0].close();
                $.dialog({
                    title: false,
                    content: "<h4>Error al guardar los datos.</h4>",
                    buttons: false
                });
            }
        }

    }).always(function() {
        setTimeout(function() { location.reload(); }, 1000);
    });
});
$("#nuevo").click(function(event) {
    $("#formdireccion").removeClass('hidden');
    $('#limpiar').click();
    quitin = $('.collapse.in').attr('id');
    $("#" + quitin).removeClass('in')
});
$("#limpiar").click(function(event) {
    $("#id_direccion").val('');
    $("#nombre-quien-recibe").val('');
    $("#apellido-quien-recibe").val('');
    $("#direccion").val('');
    $("#ciudad").val('');
    $("#provincia").val('');
    $("#cp").val('');
    $("#pais").val('').trigger('change');
    $("#celular").val('');
    $("#info").val('');

    if ($('#principal').val() == 1) {
        $('#principal').val(0);
        $('#principal').click();
    }
});
$('#principal').change(function() {
    direccionPrincipal();
});

$(".editdirdata").click(function(event) {
    iddireccion = $(this).attr('data-iddireccion');
    section = $(this).attr('data-section');
    $("#formdireccion").removeClass('hidden');
    if ($("#" + section).hasClass('collapse in')) {
        $("#" + section).removeClass('in');
    }
    $.ajax({
        url: './router/Router.php/Usuario/DatosDireccion',
        type: 'POST',
        data: { id: iddireccion },
        success: function(response) {
            response = JSON.parse(response);
            $("#id_direccion").val(response[0].id);
            $("#nombre-quien-recibe").val(response[0].nombre_receptor);
            $("#apellido-quien-recibe").val(response[0].apellido_receptor);
            $("#direccion").val(response[0].direccion);
            $("#ciudad").val(response[0].ciudad);
            $("#cp").val(response[0].codigo_postal);
            $("#pais").val(Number(response[0].pais)).trigger('change');
            setTimeout(function() {
                $("#provincia").val(Number(response[0].provincia)).trigger('change');
            }, 500);
            $("#celular").val(response[0].telefono_receptor);
            $("#info").val(response[0].otra_informacion);

            if (response[0].principal != $('#principal').val()) {
                $('#principal').click();
            }

        }
    });

});


function selectTrue(indice, response) {

    $('#' + indice + ' > option[value="' + response + '"]').attr('selected', 'selected');

}

function direccionPrincipal() {

    if ($('#principal').val() == 1) {
        $('#principal').val(0);
    } else {
        $('#principal').val(1);
    }
}

function miscompras(datos) {

    $.ajax({
        url: './router/Router.php/Administrador/filtromisCompras',
        type: 'POST',
        data: datos,
        beforeSend: function() {

        },
        success: function(response) {
            if (response.trim() != "") {
                response = JSON.parse(response);

                $("#divmiscompras").empty();

                for (var i = 0; i < response.length; i++) {

                    compras = '<div class="ancho-ticket col-md-6 col-sm-12 col-xs-12 mt-5">' +
                        '<div class="card cards animated fadeIn slow">' +
                        '<div class="card-body cards-body">' +
                        '<div class="d-block row">' +
                        '<div class="col-md-3 col-xs-3 troquelado">' +
                        '<div class="dates d-flex">' +
                        '<div class="w-100 my-auto">' +
                        '<div class="text-center"> ' + response[i].fecha_evento + '</div>' +
                        '<h2 class="text-center">' + response[i].dia_evento + '</h2>' +
                        '<span class="col-md-12 text-center">' + response[i].dia_nombre + '</span>' +
                        '</div>' +
                        '</div>' +
                        '<div style="display:none; background: rgba(0, 0, 0, 0) url(\'' + response[i].imagen + '\');width: 100%;height: 172px;background-repeat: no-repeat;background-size: cover;background-position: center;" class="principales-image-format"> </div>' +
                        '</div>' +
                        '<div class="col-md-9 col-xs-9 px-60 margen-menosdiez">' +
                        '<div class="d-flex dates">' +
                        '<div class="my-auto w-100">' +
                        '<h4>' + response[i].nombre_evento + '</h4>' +
                        '<span class="mt-1 bajada d-block lugar"><span class="fa fa-ticket mr-2"></span>Número de orden: ' + response[i].numero + '</span>' +
                        '<span class="mt-1 bajada d-block lugar"><span class="fa fa-ticket mr-2"></span>' + response[i].ciudad + ' ' + response[i].direccion + '</span>' +
                        '<span class="mt-1 bajada d-block lugar"><span class="fa fa-ticket mr-2"></span>Cantidad: ' + response[i].cantidad + '</span>  ' +
                        '<span class="mt-1 bajada d-block lugar"><span class="fa fa-ticket mr-2"></span>Ubicación: ' + response[i].nombre_ticket + '</span>  ';

                    if (response[i].sector_ticket != '-' && response[i].sector_ticket != '--') {
                        compras += '<span class="mt-1 bajada d-block lugar"><span class="fa fa-ticket mr-2"></span>Sector: ' + response[i].sector_ticket + '</span> ';
                    }


                    compras += '<span class="mt-1 bajada d-block enviada"><span class="fa fa-ticket mr-2"></span> ' + response[i].estado + '</span>  ' +
                        '</div>' +
                        '</div> ' +
                        '</div>' +
                        '<div style="display:none;" class="col-md-3 col-xs-3 data py-3 flex-info">' +
                        '<p>Datos de compra</p>' +
                        '<span class="mt-1 bajada d-block"><span class="fa fa-calendar mr-2"></span> ' + response[i].fecha_transaccion + '</span>' +
                        '<span class="mt-1 bajada d-block lugar"><span class="fa fa-paperclip mr-2"></span> &gt;</span>' +
                        '</div>' +
                        '</div>' +
                        ' </div>' +
                        '</div>' +
                        '</div>';



                    $("#divmiscompras").append(compras);
                }
            } else {
                $("#divmiscompras").empty();
                $('#noExistenAnuncios').show();
            }
        }

    });

}

function validarPass() {
    pass1 = $("#password").val();
    pass2 = $("#confirm-password").val();
    if (pass2 == pass1) {
        return true;
    } else {
        $.dialog({
            title: false,
            content: "<h4>Las contraseña de Confirmaci&oacute;n no coinciden</h4>",
            buttons: false
        });
        return false;
    }

}

function filtrarEmail() {
    var email = $("#emailVendor").val();
    if (email != '') {
        var id = "table_usuarios";
        var url = './router/Router.php/Usuario/obtenerUsuarios';
        var headers = ['email', 'nombre', 'fecha_creacion', 'bloqueo', 'valido', 'confirmado', 'id'];
        var ajax = { email: email };

        datatableusuarios(id, url, headers, ajax);
    }
}

function filtrarEmail() {
    var email = $("#emailVendor").val();
    if (email != '') {
        var id = "table_usuarios";
        var url = './router/Router.php/Usuario/obtenerUsuarios';
        var headers = ['email', 'nombre', 'fecha_creacion', 'bloqueo', 'valido', 'confirmado', 'id'];
        var ajax = { email: email };

        datatableusuarios(id, url, headers, ajax);
    }
}