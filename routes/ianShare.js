var express = require('express');
var router = express.Router();
var path = require("path")
var fs = require("fs")


var connection = require("../databases/connection")




router.get("/iCloud", function (req, res, next) {
    if (req.session.login) {

        var path_name = path.join(path.dirname(__dirname), "public", "uploads", "iCloud")

        var files = fs.readdirSync(path_name)

        res.render('profile/ianShare/iCloud.ejs', { title: "iColud", user: req.session.user, files: files });
    } else {
        res.redirect("/")
    }
});


router.get("/publications", function (req, res, next) {
    if (req.session.login) {


        connection.query(`SELECT iCloud.nom_fichier FROM iCloud INNER JOIN user ON user.id = iCloud.id_user `, (err, result) => {
            if (err) {
                throw err
            }
            else {

                var path_name = path.join(path.dirname(__dirname), "public", "uploads", "iCloud")

                var files = fs.readdirSync(path_name)

                var own_files = []

                result.map((elt) => {
                    own_files.push(elt.nom_fichier)
                })

                files.filter(elt => elt in own_files)

                res.render('profile/ianShare/publications.ejs', { title: "Mes publications", user: req.session.user, files: files });
            }
        })
    } else {
        res.redirect("/")
    }

});






//  Les requetes POST

router.post("/publications/upload", function (req, res) {
    var file = req.files.file

    console.log(file)

    //	Enregistrement dans la base de données

    connection.query(`SELECT * FROM user WHERE email="${req.session.login}" `, (err, result) => {
        if (err) {
            throw err
        }
        else {
            connection.query("INSERT INTO iCloud SET ?", { id_user: result[0].id, nom_fichier: file.name }, (err, result) => {
                if (err) {
                    console.log(err)
                }
            })

        }
    })

    file.mv("./public/uploads/iCloud/" + file.name, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect(302, "/publications")
        }
    })
})






module.exports = router;
