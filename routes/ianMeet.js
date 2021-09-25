var express = require('express');
var router = express.Router();
var path = require("path")
var fs = require("fs")


var connection = require("../databases/connection")




//  Requêtes GET


router.get("/contacts", function (req, res, next) {
    if (req.session.login) {

        connection.query(`SELECT contacts.email, contacts.nom, contacts.prenoms FROM contacts JOIN user ON contacts.id_user=user.id WHERE user.email="${req.session.login}"`, (err, result) => {
            if (err) {
                console.log(err)
                throw err
            }
            else {
                console.log("Voici le résultat")
                console.log(result)
                res.render('profile/ianMeet/contacts.ejs', { title: "Mes contacts", user: req.session.user, contacts: result });
            }
        })

    } else {
        res.redirect("/")
    }
});

router.get("/forum", function (req, res, next) {
    if (req.session.login) {
        res.render('profile/ianMeet/forum', { title: "Mon forum", user: req.session.user });
    } else {
        res.redirect("/")
    }
});

router.get("/forumSubject", function (req, res, next) {
    if (req.session.login) {
    } else {
        res.redirect("/")
    }
    res.render('profile/ianMeet/forumSubject', { title: "Mon forum", user: req.session.user });
});

router.get("/annuaire", function (req, res, next) {
    if (req.session.login) {

        connection.query(`SELECT user.nom, user.prenoms, user.email, user.tel, user.id, user.photo_profil, user.profession FROM user WHERE user.email <> "${req.session.login}" AND user.nom IS NOT NULL AND user.prenoms IS NOT NULL`, (err, result1) => {
            if (err) {
                console.log(err)
                throw err
            }
            else {

                console.log(result1)

                connection.query(`SELECT id_contact FROM contacts WHERE id_user="${req.session.user.id}"`, (err, result2) => {
                    if (err) {
                        console.log(err)
                        throw err
                    }
                    else {

                        var lst = []

                        for (const i in result2) {
                            if (result2.hasOwnProperty(i)) {
                                lst.push(result2[i].id_user);
                            }
                        }
                        delete result2

                        result1.filter((v, i) => {
                            return v.id in lst == false
                        })

                        res.render('profile/ianMeet/annuaire.ejs', { title: "Mon annuaire", user: req.session.user, contacts: result1 });
                    }
                })
            }
        })

    } else {
        res.redirect("/")
    }
});






//	Requêtes post
router.post("/add_contact", function (req, res) {
    
    var data = req.body

	if ((data.nom != "" && (data.email != "" || data.telephone != "") || data.id_contact != "")) {

		console.log("Vous voulez ajouter un nouveau contact")
		console.log(data)


		connection.query(`SELECT * FROM user WHERE email="${req.session.login}" OR email="${data.email}"`, (err, result) => {
			if (err) {
				throw err
			}
			else {

				if (result.length > 1) {
					if (result[0].email == req.session.login) {
						data = {
							...data,
							id_user: result[0].id,
							id_contact: result[1].id
						}
					} else {
						data = {
							...data,
							id_user: result[1].id,
							id_contact: result[0].id
						}
					}
				} else {
					data = {
						...data,
						id_user: result[0].id
					}
				}

				connection.query("INSERT INTO contacts SET ?", data, (err, result) => {
					if (err) {
						console.log(err)
						res.send(["Une erreur s'est produite", false])
					}
					else {
						res.send(["Votre contact a bien été ajouté", true])
					}
				})


			}
		})


	} else {
		res.send(["Veuillez entrer des valeurs valides", false])
	}


})


router.post("/show_contact", function (req, res) {

		console.log("Vous voulez afficher les détails d'un nouveau contact")

		connection.query(`SELECT
		nom, prenoms, email, profession, tel, education, residence, aptitudes, notes, photo_profil
		FROM user WHERE email="${req.body.email}"`, (err, result) => {
			if (err) {
				res.send(["", false])
				console.log(err)
			}
			else {

				console.log(result)

				res.send([result, true])
			}
		})


})








module.exports = router;
