

var socket = io();

$().ready(function () {

    jQuery.validator.addMethod("unique", function (value, element) {

        var exist = true

        console.log("Tu es chez moi")

        socket.emit("exist", { email: value }
            , function (result) {
                console.log("Salut")
                if (result) {
                    console.log(result)
                    var exist = false
                }
            })

        return exist
    }, "Cette valeur existe déjà dans la base de données")



    $("#regForm").validate({
        rules: {
            "emailReg": {
                "required": true,
                "unique": true
            },
            "password": {
                "required": true,
                "minlength": 6
            },
            "cpassword": {
                "required": true,
                "equalTo": "#password"
            }
        }
    });


    $("#logForm").validate({
        rules: {
            "login": {
                "required": true,
            },
            "passwordLog": {
                "required": true,
            }
        }
    });



    jQuery.extend(jQuery.validator.messages, {
        required: "Veuillez remplir ce champ",
        email: "Veuillez entrer une adresse mail valide",
        equalTo: "Veuillez entrer la même valeur",
        minlength: jQuery.validator.format("Ce champ doit contenir au moins {0} caractères.")
    })



})
