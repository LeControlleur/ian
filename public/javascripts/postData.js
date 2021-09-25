
//  Fonction qui permettra d'envoyer des données via l'api fetch

function postData(link = "", data = {}) {

    var url = window.location.href
    if (url.indexOf("#") != -1) {
        url = url.substring(0, url.indexOf("#"))
    }
    url += "users/" + link

    return fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "default",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        redirect: "follow",
        referrer: "no-referrer",
        body: JSON.stringify(data)
    })
}