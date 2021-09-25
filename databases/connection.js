
var mysql = require("mysql")

var connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "ian"
})

connection.connect( (err) => {
    if (err) {
        console.log("Erreur lors de la connexion : " + err.stack);
        return;
    }

})


module.exports = connection