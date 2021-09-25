var express = require('express');
var router = express.Router();
var connection = require("../databases/connection")
var fs = require("fs")
var path = require("path")


var bodyParser = require("body-parser")
var urlencodedParser = bodyParser.urlencoded({ extended: false });





/* GET users listing. */


//	Routes pour les paramètres généraux


router.get('/', function (req, res) {
	res.redirect(302, "/users/accueil");
});




router.post("/register", urlencodedParser, function (req, res) {

	var new_data = {
		"email": req.body.email,
		"password": req.body.password
	}

	if (req.body.email != "" && req.body.password != "" && req.body.password == req.body.cpassword) {

		connection.query("INSERT INTO user SET ?", new_data, (err, result) => {
			if (err) {
				console.log(err)
				res.send(["Veuillez utiliser une autre adresse mail car celle-ci existe déjà dans la base de données!", false])
			}
			else {

				fs.mkdir(path.join(path.dirname(__dirname), "public", "uploads", "cloud", new_data.email), (err) => console.log(err))

				req.session.login = new_data.email
				res.send(["", true])
			}
		})
	}
	else {
		res.send("Veuillez entrer des valeurs correctes.", false)
	}
})



router.post("/login", urlencodedParser, function (req, res) {

	var data = req.body

	if (data.email != "" && data.password != "") {
		connection.query(`SELECT * FROM user WHERE email="${data.email}" `, (err, result) => {
			if (err) {
				throw err
			}
			else {
				if (result.length != 0) {
					if (result[0].password != data.password) {
						res.send(["Mot de passe incorrect!", false])
					}
					else {
						req.session.login = data.email
						res.send(["", true])
					}
				} else {
					res.send(["Adresse mail incorrect", false])
				}
			}
		})
	}
	else {
		res.send(["Veuillez entrer des valeurs correctes", false])
	}
})




router.get("/logout", function (req, res) {
	console.log("Deconnexion")
	req.session.destroy()
	res.redirect(301, "/")
})





router.post("/change_infos", urlencodedParser, function (req, res) {

	var new_data = req.body

	//  Enregistrement des nouvelles données dans la base de données
	if (new_data.length != 0) {
		connection.query(`UPDATE user SET ? WHERE email="${req.session.login}"`, new_data, (err, result) => {
			if (err) {
				console.log(err)
				res.send(["Une erreur d'est produite lors de l'enregistrement.", false])
			}
			else {
				res.send(["Vos informations ont bien été modifiées", true])
			}
		})
	}

})



router.post("/change_profile_image", function (req, res) {

	console.log("J'ai reçu la requête")

	if (req.files) {

		console.log("La requête contient un fichier")
		var file = req.files.avatar,
			filename = uniqid(),
			filetype = /\/jpeg|png|gif|svg/

		if (filetype.test(file.mimetype)) {

			console.log("Le type du fichier match")

			file.mv("./public/uploads/avatar/" + filename, function (err) {
				if (err) {
					console.log(err);
					console.log(req.session)
				} else {
					connection.query(`UPDATE user SET ? WHERE email="${req.session.login}"`, { "photo_profil": filename }, (err, result) => {
						if (err) {
							console.log(err)
						}
						else {
							console.log("Photo de profil changée")
							res.redirect("/users/monprofile/update")
						}
					})
				}
			})
		}
		else {
			console.log("Veuillez selectionner une image")
			res.redirect(302, "/monprofile")
		}
	}
})



router.get("/monprofile/update", function (req, res) {
	console.log("Je mets la session à jour")

	connection.query(`SELECT * FROM user WHERE email="${req.session.login}" `, (err, result) => {
		if (err) {
			throw err
		}
		else {
			req.session.user = result[0]
			res.redirect(302, "/monprofile")
		}
	})

});





//  Fonction pour attibuer un id unique
function uniqid(a = "", b = false) {
	var c = Date.now() / 1000;
	var d = c.toString(16).split(".").join("");
	while (d.length < 14) {
		d += "0";
	}
	var e = "";
	if (b) {
		e = ".";
		var f = Math.round(Math.random() * 100000000);
		e += f;
	}
	return a + d + e;
}






module.exports = router;
