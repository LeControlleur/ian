var express = require('express');
var router = express.Router();
var path = require("path")
var fs = require("fs")
var moment = require("moment")


var connection = require("../databases/connection")




//  Requêtes GET

router.get("/mesprojets", function (req, res, next) {
    if (req.session.login) {


        connection.query(`SELECT
		nom, prenoms, id_contact
        FROM contacts WHERE 
        id_user="${req.session.user.id}" 
        AND id_contact IS NOT NULL`, (err, result1) => {
            if (err) {
                res.send(["", false])
                console.log(err)
            }
            else {

                connection.query(`SELECT * FROM projectr WHERE membre1 ="${req.session.user.id}" OR membre2="${req.session.user.id}" OR membre3="${req.session.user.id}" OR membre4="${req.session.user.id}" OR membre5="${req.session.user.id}" OR membre6="${req.session.user.id}" OR membre7="${req.session.user.id}" OR membre8="${req.session.user.id}" OR membre9="${req.session.user.id}"`,
                    (err, result2) => {
                        if (err) {
                            res.send(["", false])
                            console.log(err)
                        }
                        else {

                            console.log("Res 1")
                            console.log(result1)

                            console.log("Res 2")
                            console.log(result2)

                            
                            
                            res.render('profile/ianWork/suiviProjet.ejs', { title: "Suivi de mes projets", user: req.session.user, contacts: result1, projets: result2, moment: moment});
                        }
                    })

            }
        })
    } else {
        res.redirect("/")
    }
});



router.get("/agenda", function (req, res, next) {
    if (req.session.login) {
        res.render('profile/ianWork/agenda.ejs', { title: "Mon Agenda", user: req.session.user });
    } else {
        res.redirect("/")
    }
});

router.get("/editeur", function (req, res, next) {
    if (req.session.login) {
        res.render('profile/ianWork/editeur.ejs', { title: "Mon Editeur", user: req.session.user });
    } else {
        res.redirect("/")
    }
});



router.get("/videoconference", function (req, res, next) {
    if (req.session.login) {
        res.render('profile/ianWork/videoconference.ejs', { title: "Ma videoconférence", user: req.session.user });
    } else {
        res.redirect("/")
    }
});

router.get("/messageriepublique", function (req, res, next) {
    if (req.session.login) {
        res.render('profile/ianWork/messageriePublique.ejs', { title: "Ma messagerie publique", user: req.session.user });
    } else {
        res.redirect("/")
    }
});

router.get("/messageriepv", function (req, res, next) {
    if (req.session.login) {




        connection.query(`SELECT contacts.nom, contacts.prenoms, contacts.id_contact, user.photo_profil, user.profession FROM user JOIN contacts ON user.id = contacts.id_user WHERE user.email="${req.session.login}" AND contacts.id_contact IS NOT NULL`, (err, result) => {
            if (err) {
                res.send(["", false])
                console.log(err)
            }
            else {
                connection.query(`SELECT * FROM mail_pv WHERE id_user_send = "${req.session.user.id}" OR id_user_rec="${req.session.user.id}"`, (err, result2) => {
                    if (err) {
                        res.send(["", false])
                        console.log(err)
                    }
                    else {

                        res.render('profile/ianWork/messageriepv.ejs', { title: "Ma messagerie privée", user: req.session.user, contacts: result, mails: result2 });

                    }
                })
            }
        })

    } else {
        res.redirect("/")
    }
});


router.get("/cloud", function (req, res, next) {

    if (req.session.login) {
        var path_name = path.join(path.dirname(__dirname), "public", "uploads", "cloud", req.session.login)

        console.log("Je dois afficher les fichiers")
        var files = fs.readdirSync(path_name)
        console.log(files)

        res.render('profile/ianWork/cloud.ejs', { title: "Mon cloud", user: req.session.user, files: files });
    } else {
        res.redirect("/")
    }
});







//	Requêtes POST

router.post("/new_project", function (req, res) {

    var data = req.body;

    data.echeance = new Date(data.echeance)

    Object.keys(data).map((v, i) => {
        if (/membre/.test(v)) {
            data[v] = parseInt(data[v])
        }
    })

    /*
    var n_taches = {}
 
    for (let i = 0; i < data["taches[]"].length; i++) {
        n_taches[i] = {
            tache: data["taches"]
            //duree: data["durees[]"]
        }
    }
 
    
    var new_data = {}
 
    delete data['taches[]']
    delete data['durees[]']
 
    */

    console.log(data)

    new_data = {
        ...data,
        "membre1": req.session.user.id
    }



    //  Enregistrement des nouvelles données dans la base de données
    if (new_data.length != 0) {
        connection.query(`INSERT INTO projectr SET ? `, new_data, (err, result) => {
            if (err) {
                console.log(err)
                res.send(["Une erreur d'est produite lors de l'enregistrement.", false])
            }
            else {
                res.send(["Votre projet a bien été ajouté", true])
            }
        })
    }

})





router.post("/cloud/upload", function (req, res) {
    var file = req.files.file

    console.log(file)

    file.mv("./public/uploads/cloud/" + req.session.login + "/" + file.name, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Nouveau fichier uploadé")
            res.redirect(302, "/cloud")
        }
    })
})



router.get("/cloud/download/:name", function (req, res) {
    if (req.session.login) {
        let name = path.join(path.dirname(__dirname), "public", "uploads", "cloud", req.session.login) + "/" + req.params.name
        res.download(name)
    } else {
        res.redirect("/")
    }
})







module.exports = router;
