

function show_error_box(message) {


    if ($("#show_box").length == 0) {
        var modal = "<div class='modal fade' id = 'show_box' tabindex = '-1' role='dialog' aria-labelledby='exampleModalCenterTitle' aria-hidden='true'><div class='modal-dialog modal-dialog-centered' role='document'><div class='modal-content' style='background-color:red'><div class='modal-body' style='display:flex; flex-direction:row; align-items:center; text-align:center; vertical-align: middle'><div><i class='nav-icon fas fa-exclamation-circle fa-3x' style='color:white'></i></div><h2 style='color:white; margin:3%'>" + message + "</h2></div></div></div></div>";

        $("body").append(modal);

    }

    $("#show_box").modal("show")
    setTimeout(function() {
        $("#show_box").modal("hide")
    }, 4000)


}



function show_success_box(message) {


    if ($("#show_box").length == 0) {
        var modal = "<div class='modal fade' id = 'show_box' tabindex = '-1' role='dialog' aria-labelledby='exampleModalCenterTitle' aria-hidden='true'><div class='modal-dialog modal-dialog-centered' role='document'><div class='modal-content' style='background-color:green'><div class='modal-body' style='display:flex; flex-direction:row; align-items:center; text-align:center; vertical-align: middle'><div><i class='nav-icon fas fa-check-circle fa-3x' style='color:white'></i></div><h2 style='color:white; margin:3%'>" + message + "</h2></div></div></div></div>";

        $("body").append(modal);

    }

    $("#show_box").modal("show")
    setTimeout(function() {
        $("#show_box").modal("hide")
    }, 4000)


}