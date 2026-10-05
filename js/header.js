/* =========================================================
   RAJDHANI PACKAGING - HEADER JS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* -----------------------------------------------------
       HEADER LOAD
    ----------------------------------------------------- */

    const headerContainer = document.getElementById("site-header");

    if (!headerContainer) {
        console.error("Header container not found.");
        return;
    }


    fetch("/includes/header.html")
        .then(function (response) {

            if (!response.ok) {
                throw new Error("Header file could not be loaded.");
            }

            return response.text();

        })

        .then(function (html) {

            headerContainer.innerHTML = html;

            initializeHeader();

        })

        .catch(function (error) {

            console.error("Header Error:", error);

        });


    /* -----------------------------------------------------
       HEADER FUNCTIONS
    ----------------------------------------------------- */

    function initializeHeader() {

        const siteHeader =
            document.getElementById("siteHeader");

        const mobileMenuBtn =
            document.getElementById("mobileMenuBtn");

        const mobileNavigation =
            document.getElementById("mobileNavigation");


        /* -------------------------------------------------
           MOBILE MENU
        ------------------------------------------------- */

        if (mobileMenuBtn && mobileNavigation) {

            mobileMenuBtn.addEventListener("click", function () {

                mobileMenuBtn.classList.toggle("active");

                mobileNavigation.classList.toggle("open");

            });

        }


        /* -------------------------------------------------
           MOBILE PRODUCTS DROPDOWN
        ------------------------------------------------- */

        const mobileProductsToggle =
            document.querySelector(".mobile-products-toggle");

        const mobileDropdown =
            document.querySelector(".mobile-dropdown");


        if (mobileProductsToggle && mobileDropdown) {

            mobileProductsToggle.addEventListener("click", function (event) {

                event.preventDefault();

                mobileDropdown.classList.toggle("open");

            });

        }


        /* -------------------------------------------------
           ACTIVE MENU
        ------------------------------------------------- */

        setActiveMenu();


        /* -------------------------------------------------
           STICKY HEADER
        ------------------------------------------------- */

        window.addEventListener("scroll", function () {

            if (!siteHeader) {
                return;
            }

            if (window.scrollY > 80) {

                siteHeader.classList.add("sticky");

            } else {

                siteHeader.classList.remove("sticky");

            }

        });


        /* -------------------------------------------------
           CLOSE MOBILE MENU WHEN LINK IS CLICKED
        ------------------------------------------------- */

        const mobileLinks =
            document.querySelectorAll(
                ".mobile-navigation a"
            );


        mobileLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                const href = link.getAttribute("href");

                if (
                    href &&
                    href !== "#" &&
                    !link.classList.contains("mobile-products-toggle")
                ) {

                    mobileMenuBtn.classList.remove("active");

                    mobileNavigation.classList.remove("open");

                }

            });

        });


        /* -------------------------------------------------
           CLOSE MOBILE MENU ON OUTSIDE CLICK
        ------------------------------------------------- */

        document.addEventListener("click", function (event) {

            if (
                mobileNavigation &&
                mobileMenuBtn &&
                !mobileNavigation.contains(event.target) &&
                !mobileMenuBtn.contains(event.target)
            ) {

                mobileNavigation.classList.remove("open");

                mobileMenuBtn.classList.remove("active");

            }

        });

    }


    /* =====================================================
       ACTIVE PAGE FUNCTION
    ===================================================== */

    function setActiveMenu() {

        const currentPage =
            window.location.pathname;


        const allLinks =
            document.querySelectorAll(
                "[data-page]"
            );


        allLinks.forEach(function (link) {

            const page =
                link.getAttribute("data-page");


            if (page === currentPage) {

                link.classList.add("active");

            }

        });

    }

});