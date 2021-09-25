
$(function () {
    function animateDownloadButton() {

        Object.keys($(".downloadButton")).map((index) => {
            $($(".downloadButton")[index]).animate({ bottom: '+=8' }, "fast")
                .animate({ bottom: '-=8' }, "fast")
        })
    }
    setInterval(animateDownloadButton, 1000)

})