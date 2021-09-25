var express = require('express');
var router = express.Router();
var path = require("path")
var fs = require("fs")


var connection = require("../databases/connection")


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index.ejs');
});

router.get("/monprofile", function (req, res, next) {
    console.log("Tu es sur ton profile")
    console.log(req.session)
    if (req.session.login) {
        console.log("Je rends ton dû")
        res.render('profile/monProfile.ejs', { title: "Mon profil", user: req.session.user });
    } else {
        res.redirect("/")
    }
});

router.get("/accueil", function (req, res, next) {
    if (req.session.login) {

        if (!req.session.user) {
            console.log("J'ai pas de session user");
            connection.query(`SELECT * FROM user WHERE email="${req.session.login}" `, (err, result) => {
                if (err) {
                    throw err
                }
                else {
                    req.session.user = result[0]

                    console.log(req.session.user)

                    res.render('profile/accueil.ejs', { title: "Mon tableau de bord", user: req.session.user });
                }
            })
        }
        else {
            res.render('profile/accueil.ejs', { title: "Mon tableau de bord", user: req.session.user });
        }
    } else {
        res.redirect("/")
    }
});







module.exports = router;