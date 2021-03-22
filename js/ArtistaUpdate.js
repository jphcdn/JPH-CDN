function actualizarArtistaForm()
{

   var formData = new FormData($("#formRegistroArtista")[0]);


   var imperdible = ($('#imperdible').is(":checked")) ? 1 : 0;
   var disponible = ($('#disponible').is(":checked")) ? 1 : 0;
   var QuitarVideo = ($('#QuitarVideo').is(":checked")) ? 1 : 0;
   
    formData.append('imperdible',imperdible);
    formData.append('disponible',disponible);
    formData.append('QuitarVideo',QuitarVideo);

    $.ajax({
        type: 'POST',
        url: './router/Router.php/Artista/ActualizarArtista',
        data:  formData,
           cache: false,
            contentType: false,
            processData: false,
        success: function (response) {
            response = jQuery.parseJSON(response);
            if(!response.error)
            {
                var id = "table_artista"
                var url = './router/Router.php/Artista/obtenerArtistas';
                var headers = ['nombre','descripcion'];
                var ajax = { accion: 'get_all' };
                
                datatable(id,url,headers,ajax,mostrarDatosArtistas);

                
                bootbox.alert({
                    message: "<h4>Artista actualizado correctamente.</h4>",
                    className: 'modal-center',
                    closeButton: false
                });


            }else 
            {
                bootbox.alert({
                    message: "<h4>Error al actualizar el Artista.</h4>",
                    className: 'modal-center',
                    closeButton: false
                });
            }
        }
    });
}

function actualizarArtista()
{     
    $('#ArtistaUpdate').click(function() {       
            actualizarArtistaForm();        
    });
}


function actualizarPosicionArtista(array,tipo)
{
    $.ajax({
        type: 'POST',
        url: './router/Router.php/Artista/actualizarPosiciones',
        data: { datos : array},
        success: function (response) {
           

        }
    });
}
