/* =========================================================
   FEATURED PRODUCTS - INFINITE + FREE MOUSE DRAG CAROUSEL
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const track =
        document.getElementById("featuredTrack");

    const viewport =
        document.getElementById("featuredViewport");

    const prevButton =
        document.getElementById("featuredPrev");

    const nextButton =
        document.getElementById("featuredNext");


    if (
        !track ||
        !viewport ||
        !prevButton ||
        !nextButton
    ) {
        return;
    }


    /* =====================================================
       ORIGINAL PRODUCTS
    ===================================================== */

    const originalCards =
        Array.from(
            track.querySelectorAll(
                ".featured-product-card"
            )
        );


    if (!originalCards.length) {
        return;
    }


    const totalProducts =
        originalCards.length;


    let cardStep = 0;

    let visibleCards = 4;

    let cloneCount = 4;


    /* =====================================================
       CURRENT POSITION

       This is now a PIXEL position,
       not a product index.

       Therefore mouse can move carousel
       any distance.
    ===================================================== */

    let currentPosition = 0;

    let isDragging = false;

    let dragStartX = 0;

    let dragStartPosition = 0;

    let hasDragged = false;


    /* =====================================================
       CALCULATE VALUES
    ===================================================== */

    function calculateValues() {

        const card =
            track.querySelector(
                ".featured-product-card"
            );


        if (!card) {
            return;
        }


        const trackStyle =
            window.getComputedStyle(track);


        const gap =
            parseFloat(
                trackStyle.gap
            ) || 0;


        const cardWidth =
            card.getBoundingClientRect().width;


        cardStep =
            cardWidth + gap;


        const viewportWidth =
            viewport.getBoundingClientRect().width;


        visibleCards =
            Math.max(
                1,
                Math.floor(
                    (viewportWidth + gap) /
                    cardStep
                )
            );


        cloneCount =
            Math.min(
                totalProducts,
                Math.max(
                    visibleCards + 1,
                    2
                )
            );

    }


    /* =====================================================
       CREATE CLONES
    ===================================================== */

    function createClones() {

        /*
         * Remove old clones
         */

        track
            .querySelectorAll(
                ".featured-clone"
            )
            .forEach(
                function (clone) {

                    clone.remove();

                }
            );


        const originals =
            Array.from(
                track.querySelectorAll(
                    ".featured-product-card:not(.featured-clone)"
                )
            );


        /*
         * LEFT CLONES
         */

        const leftClones =
            originals
                .slice(-cloneCount)
                .map(
                    function (card) {

                        const clone =
                            card.cloneNode(true);

                        clone.classList.add(
                            "featured-clone"
                        );

                        clone.setAttribute(
                            "aria-hidden",
                            "true"
                        );

                        return clone;

                    }
                );


        /*
         * RIGHT CLONES
         */

        const rightClones =
            originals
                .slice(0, cloneCount)
                .map(
                    function (card) {

                        const clone =
                            card.cloneNode(true);

                        clone.classList.add(
                            "featured-clone"
                        );

                        clone.setAttribute(
                            "aria-hidden",
                            "true"
                        );

                        return clone;

                    }
                );


        /*
         * Add left clones
         */

        leftClones
            .reverse()
            .forEach(
                function (clone) {

                    track.prepend(clone);

                }
            );


        /*
         * Add right clones
         */

        rightClones
            .forEach(
                function (clone) {

                    track.append(clone);

                }
            );

    }


    /* =====================================================
       GET FIRST ORIGINAL POSITION
    ===================================================== */

    function getOriginalStart() {

        return (
            cloneCount *
            cardStep
        );

    }


    /* =====================================================
       GET MINIMUM POSITION
    ===================================================== */

    function getMinimumPosition() {

        return 0;

    }


    /* =====================================================
       GET MAXIMUM POSITION
    ===================================================== */

    function getMaximumPosition() {

        const totalCards =
            track.querySelectorAll(
                ".featured-product-card"
            ).length;


        const trackWidth =
            totalCards *
            cardStep;


        const viewportWidth =
            viewport.clientWidth;


        return Math.max(
            0,
            trackWidth -
            viewportWidth
        );

    }


    /* =====================================================
       MOVE TRACK
    ===================================================== */

    function moveTrack(
        animate = true
    ) {

        if (animate) {

            track.style.transition =
                "transform 0.35s ease";

        } else {

            track.style.transition =
                "none";

        }


        track.style.transform =
            `translate3d(-${currentPosition}px, 0, 0)`;

    }


    /* =====================================================
       INITIAL POSITION
    ===================================================== */

    function setInitialPosition() {

        currentPosition =
            getOriginalStart();


        moveTrack(false);

    }


    /* =====================================================
       INFINITE LOOP CHECK
    ===================================================== */

    function checkInfiniteLoop() {

        const originalStart =
            getOriginalStart();


        const originalEnd =
            originalStart +
            (
                totalProducts *
                cardStep
            );


        /*
         * Too far RIGHT
         */

        if (
            currentPosition >=
            originalEnd
        ) {

            currentPosition -=
                totalProducts *
                cardStep;


            moveTrack(false);

        }


        /*
         * Too far LEFT
         */

        else if (
            currentPosition <
            originalStart
        ) {

            currentPosition +=
                totalProducts *
                cardStep;


            moveTrack(false);

        }

    }


    /* =====================================================
       ARROW NEXT
    ===================================================== */

    function nextSlide() {

        currentPosition +=
            cardStep;


        moveTrack(true);


        setTimeout(
            checkInfiniteLoop,
            360
        );

    }


    /* =====================================================
       ARROW PREVIOUS
    ===================================================== */

    function previousSlide() {

        currentPosition -=
            cardStep;


        moveTrack(true);


        setTimeout(
            checkInfiniteLoop,
            360
        );

    }


    /* =====================================================
       NEXT BUTTON
    ===================================================== */

    nextButton.addEventListener(
        "click",
        function () {

            nextSlide();

        }
    );


    /* =====================================================
       PREVIOUS BUTTON
    ===================================================== */

    prevButton.addEventListener(
        "click",
        function () {

            previousSlide();

        }
    );


    /* =====================================================
       MOUSE DOWN
    ===================================================== */

    viewport.addEventListener(
        "mousedown",
        function (event) {

            /*
             * Only left mouse button
             */

            if (
                event.button !== 0
            ) {
                return;
            }


            isDragging = true;

            hasDragged = false;


            dragStartX =
                event.clientX;


            dragStartPosition =
                currentPosition;


            track.style.transition =
                "none";


            viewport.style.cursor =
                "grabbing";


            /*
             * Prevent text selection
             */

            document.body.style.userSelect =
                "none";

        }
    );


    /* =====================================================
       MOUSE MOVE

       IMPORTANT:

       This moves according to the exact
       mouse distance.

       100px mouse movement =
       100px carousel movement.
    ===================================================== */

    window.addEventListener(
        "mousemove",
        function (event) {

            if (!isDragging) {
                return;
            }


            const mouseDistance =
                event.clientX -
                dragStartX;


            /*
             * Mark as drag
             */

            if (
                Math.abs(mouseDistance) >
                5
            ) {

                hasDragged = true;

            }


            /*
             * Mouse LEFT
             *
             * Carousel moves LEFT
             */

            currentPosition =
                dragStartPosition -
                mouseDistance;


            /*
             * Keep track within
             * reasonable boundaries.
             *
             * Infinite loop will be
             * checked below.
             */

            moveTrack(false);


            /*
             * If user drags very far,
             * immediately reposition.
             */

            const originalStart =
                getOriginalStart();


            const originalEnd =
                originalStart +
                (
                    totalProducts *
                    cardStep
                );


            if (
                currentPosition >
                originalEnd +
                cardStep
            ) {

                currentPosition -=
                    totalProducts *
                    cardStep;


                dragStartPosition =
                    currentPosition;

                dragStartX =
                    event.clientX;

            }


            if (
                currentPosition <
                originalStart -
                cardStep
            ) {

                currentPosition +=
                    totalProducts *
                    cardStep;


                dragStartPosition =
                    currentPosition;

                dragStartX =
                    event.clientX;

            }

        }
    );


    /* =====================================================
       MOUSE UP
    ===================================================== */

    window.addEventListener(
        "mouseup",
        function () {

            if (!isDragging) {
                return;
            }


            isDragging = false;


            viewport.style.cursor =
                "grab";


            document.body.style.userSelect =
                "";


            /*
             * Keep exact mouse position.
             *
             * NO snapping to one product.
             */

            track.style.transition =
                "none";


            moveTrack(false);


            /*
             * Check loop
             */

            checkInfiniteLoop();

        }
    );


    /* =====================================================
       TOUCH SUPPORT
    ===================================================== */

    let touchStartX = 0;

    let touchStartPosition = 0;


    viewport.addEventListener(
        "touchstart",
        function (event) {

            touchStartX =
                event.touches[0].clientX;


            touchStartPosition =
                currentPosition;


            track.style.transition =
                "none";

        },
        {
            passive: true
        }
    );


    viewport.addEventListener(
        "touchmove",
        function (event) {

            const touchX =
                event.touches[0].clientX;


            const distance =
                touchX -
                touchStartX;


            currentPosition =
                touchStartPosition -
                distance;


            moveTrack(false);

        },
        {
            passive: true
        }
    );


    viewport.addEventListener(
        "touchend",
        function () {

            checkInfiniteLoop();

        },
        {
            passive: true
        }
    );


    /* =====================================================
       PREVENT IMAGE DRAG
    ===================================================== */

    track
        .querySelectorAll("img")
        .forEach(
            function (image) {

                image.addEventListener(
                    "dragstart",
                    function (event) {

                        event.preventDefault();

                    }
                );

            }
        );


    /* =====================================================
       RESIZE
    ===================================================== */

    let resizeTimer;


    window.addEventListener(
        "resize",
        function () {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    function () {

                        calculateValues();

                        createClones();

                        setInitialPosition();

                    },
                    150
                );

        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    calculateValues();

    createClones();

    setInitialPosition();


});