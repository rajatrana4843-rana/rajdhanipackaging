document.addEventListener("DOMContentLoaded", function () {
    const footerContainer = document.getElementById("site-footer");

    if (!footerContainer) {
        return;
    }

    fetch("/includes/footer.html")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Footer file could not be loaded.");
            }

            return response.text();
        })
        .then(function (html) {
            footerContainer.innerHTML = html;
        })
        .catch(function (error) {
            console.error("Footer Error:", error);
        });
});