var input = $("input.custom-file-input")

input.change(function () {
    var file = input.val().substring(input.val().indexOf("fakepath") + 9)
    $(input.next()[0]).text(file)

    console.log(input = $("input.custom-file-input").val())
})