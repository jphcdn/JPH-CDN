function createFileVideo(object){
     fileinput = object, initPlugin = function() {
        fileinput.fileinput({
            showRemove :false,
            language: "es", 
           'showPreview':false,
           allowedFileExtensions: ["mp4"],
        });
    };  

    initPlugin();

    return fileinput;
}
function createFile(object)
{
    var fileinput = null;

    fileinput = object, initPlugin = function() {
        fileinput.fileinput({
            showRemove :false,
            language: "es", 
            showRemove : true,//boton remover
            allowedFileExtensions: ["png","jpg","jpeg","gif"],
        });
    };  

    initPlugin();

    return fileinput;
}

function reloadFileInput(object,img,fileinput)
{   

    destroyFile(fileinput);
    datos = JSON.stringify(fileinput);
    datos = JSON.parse(datos);

    selector = datos.selector
    selector =  selector.replace("#","");
    
     
    fileinput = object, initPlugin = function() {
        fileinput.fileinput({
                language: "es",
                overwriteInitial: false,
                validateInitialCount: false,
                initialPreview: [
                    "<img class='kv-preview-data file-preview-image' src='"+img+"'>",
                ]
            
        }).on('filebeforedelete', function() {
        var aborted = !window.confirm('Are you sure you want to delete this file?');
        if (aborted) {
            window.alert('File deletion was aborted! ' + krajeeGetCount( selector ));
        };
        return aborted;
    }).on('filedeleted', function() {
        setTimeout(function() {
            window.alert('File deletion was successful! ' + krajeeGetCount( selector ));
        }, 900);
    });
    };

    initPlugin();
}

function refreshFileInput(object,fileinput)
{
    fileinput.fileinput('refresh');
}

function destroyFile(fileinput)
{
    
        if (fileinput.data('fileinput')) {
            fileinput.fileinput('destroy');
        }
    
}