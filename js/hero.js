/* =========================================================
   RAJDHANI PACKAGING
   HERO SLIDER
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =================================================
           ELEMENTS
        ================================================= */

        const slider =
            document.getElementById(
                "heroSlider"
            );


        const track =
            document.getElementById(
                "heroTrack"
            );


        const slides =
            document.querySelectorAll(
                ".hero-slide"
            );


        const previousButton =
            document.getElementById(
                "heroPrev"
            );


        const nextButton =
            document.getElementById(
                "heroNext"
            );


        const dots =
            document.querySelectorAll(
                ".hero-dot"
            );


        /* =================================================
           CHECK
        ================================================= */

        if (
            !slider ||
            !track ||
            slides.length < 4
        ) {

            return;

        }


        /*
           Actual slides = 3

           4th slide = first slide ka clone
        */

        const realSlides = 3;

        let currentSlide = 0;

        let autoplayTimer = null;

        let wheelLocked = false;


        /* =================================================
           DRAG VARIABLES
        ================================================= */

        let isDragging = false;

        let startX = 0;

        let currentX = 0;

        let dragDistance = 0;


        /* =================================================
           TOUCH VARIABLES
        ================================================= */

        let touchStartX = 0;

        let touchEndX = 0;


        /* =================================================
           UPDATE DOTS
        ================================================= */

        function updateDots() {

            dots.forEach(
                function (
                    dot,
                    index
                ) {

                    dot.classList.toggle(
                        "active",
                        index ===
                        (
                            currentSlide %
                            realSlides
                        )
                    );

                }
            );

        }


        /* =================================================
           MOVE SLIDER
        ================================================= */

        function moveSlider(
            index,
            animate = true
        ) {


            /*
               Animation ON
            */

            if (animate) {

                track.style.transition =
                    "transform 0.7s cubic-bezier(0.77,0,0.175,1)";

            }


            /*
               Animation OFF
            */

            else {

                track.style.transition =
                    "none";

            }


            /*
               Move to slide
            */

            track.style.transform =
                "translate3d(-" +
                (
                    index * 100
                ) +
                "%, 0, 0)";


            /*
               Save position
            */

            currentSlide = index;


            /*
               Update dots
            */

            updateDots();

        }


        /* =================================================
           NEXT SLIDE
        ================================================= */

        function nextSlide() {

            /*
               Move normally.

               0 -> 1
               1 -> 2
               2 -> clone(1)
            */

            currentSlide++;

            moveSlider(
                currentSlide,
                true
            );


            /*
               If clone is reached,
               wait for animation to finish,
               then silently jump to real slide 1.
            */

            if (
                currentSlide === realSlides
            ) {

                setTimeout(
                    function () {

                        currentSlide = 0;

                        moveSlider(
                            0,
                            false
                        );

                    },
                    720
                );

            }


            restartAutoplay();

        }


        /* =================================================
           PREVIOUS SLIDE
        ================================================= */

        function previousSlide() {


            /*
               If currently on first slide,
               first jump silently to clone.
            */

            if (
                currentSlide === 0
            ) {

                /*
                   Disable transition
                */

                track.style.transition =
                    "none";


                /*
                   Go to clone
                */

                currentSlide =
                    realSlides;


                track.style.transform =
                    "translate3d(-" +
                    (
                        currentSlide *
                        100
                    ) +
                    "%, 0, 0)";


                /*
                   Force browser reflow
                   before animated move.
                */

                track.offsetHeight;


                /*
                   Now move to slide 3
                */

                currentSlide =
                    realSlides - 1;


                track.style.transition =
                    "transform 0.7s cubic-bezier(0.77,0,0.175,1)";


                track.style.transform =
                    "translate3d(-" +
                    (
                        currentSlide *
                        100
                    ) +
                    "%, 0, 0)";


                updateDots();

            }

            else {

                currentSlide--;

                moveSlider(
                    currentSlide,
                    true
                );

            }


            restartAutoplay();

        }


        /* =================================================
           NEXT BUTTON
        ================================================= */

        if (nextButton) {

            nextButton.addEventListener(
                "click",
                function () {

                    nextSlide();

                }
            );

        }


        /* =================================================
           PREVIOUS BUTTON
        ================================================= */

        if (previousButton) {

            previousButton.addEventListener(
                "click",
                function () {

                    previousSlide();

                }
            );

        }


        /* =================================================
           DOTS
        ================================================= */

        dots.forEach(
            function (
                dot
            ) {

                dot.addEventListener(
                    "click",
                    function () {


                        const index =
                            parseInt(
                                dot.getAttribute(
                                    "data-slide"
                                )
                            );


                        if (
                            !isNaN(index)
                        ) {

                            currentSlide =
                                index;


                            moveSlider(
                                currentSlide,
                                true
                            );


                            restartAutoplay();

                        }

                    }
                );

            }
        );



        /* =================================================
           MOUSE DRAG START
        ================================================= */

        slider.addEventListener(
            "mousedown",
            function (
                event
            ) {


                if (
                    event.button !== 0
                ) {

                    return;

                }


                isDragging = true;


                startX =
                    event.clientX;


                currentX =
                    startX;


                dragDistance = 0;


                slider.classList.add(
                    "dragging"
                );


                stopAutoplay();

            }
        );


        /* =================================================
           MOUSE DRAG MOVE
        ================================================= */

        document.addEventListener(
            "mousemove",
            function (
                event
            ) {


                if (
                    !isDragging
                ) {

                    return;

                }


                currentX =
                    event.clientX;


                dragDistance =
                    currentX -
                    startX;


                /*
                   Convert pixel movement
                   to percentage.
                */

                const percentage =
                    (
                        dragDistance /
                        slider.offsetWidth
                    ) * 100;


                /*
                   Disable animation
                   while dragging.
                */

                track.style.transition =
                    "none";


                /*
                   Move track.
                */

                track.style.transform =
                    "translate3d(calc(-" +
                    (
                        currentSlide *
                        100
                    ) +
                    "% + " +
                    percentage +
                    "%), 0, 0)";


            }
        );


        /* =================================================
           MOUSE DRAG END
        ================================================= */

        document.addEventListener(
            "mouseup",
            function () {


                if (
                    !isDragging
                ) {

                    return;

                }


                isDragging = false;


                slider.classList.remove(
                    "dragging"
                );


                /*
                   Minimum drag distance
                */

                const minimumDrag =
                    slider.offsetWidth *
                    0.12;


                /*
                   Drag LEFT
                   = NEXT
                */

                if (
                    dragDistance <
                    -minimumDrag
                ) {

                    nextSlide();

                }


                /*
                   Drag RIGHT
                   = PREVIOUS
                */

                else if (
                    dragDistance >
                    minimumDrag
                ) {

                    previousSlide();

                }


                /*
                   Not enough drag
                */

                else {

                    moveSlider(
                        currentSlide,
                        true
                    );

                    restartAutoplay();

                }

            }
        );


        /* =================================================
           TOUCH START
        ================================================= */

        slider.addEventListener(
            "touchstart",
            function (
                event
            ) {


                if (
                    event.touches.length !== 1
                ) {

                    return;

                }


                touchStartX =
                    event.touches[0].clientX;


                touchEndX =
                    touchStartX;


                stopAutoplay();

            },
            {
                passive: true
            }
        );


        /* =================================================
           TOUCH MOVE
        ================================================= */

        slider.addEventListener(
            "touchmove",
            function (
                event
            ) {


                if (
                    event.touches.length !== 1
                ) {

                    return;

                }


                touchEndX =
                    event.touches[0].clientX;

            },
            {
                passive: true
            }
        );


        /* =================================================
           TOUCH END
        ================================================= */

        slider.addEventListener(
            "touchend",
            function () {


                const distance =
                    touchEndX -
                    touchStartX;


                const minimumSwipe =
                    slider.offsetWidth *
                    0.12;


                /*
                   Swipe LEFT
                */

                if (
                    distance <
                    -minimumSwipe
                ) {

                    nextSlide();

                }


                /*
                   Swipe RIGHT
                */

                else if (
                    distance >
                    minimumSwipe
                ) {

                    previousSlide();

                }


                else {

                    moveSlider(
                        currentSlide,
                        true
                    );

                    restartAutoplay();

                }

            },
            {
                passive: true
            }
        );


        /* =================================================
           KEYBOARD
        ================================================= */

        document.addEventListener(
            "keydown",
            function (
                event
            ) {


                const tag =
                    document.activeElement
                        ?.tagName;


                /*
                   Don't run inside form fields.
                */

                if (
                    tag === "INPUT" ||
                    tag === "TEXTAREA" ||
                    tag === "SELECT"
                ) {

                    return;

                }


                /*
                   RIGHT
                */

                if (
                    event.key ===
                    "ArrowRight"
                ) {

                    nextSlide();

                }


                /*
                   LEFT
                */

                if (
                    event.key ===
                    "ArrowLeft"
                ) {

                    previousSlide();

                }

            }
        );


        /* =================================================
           AUTOPLAY START
        ================================================= */

        function startAutoplay() {

            stopAutoplay();


            autoplayTimer =
                setInterval(
                    function () {

                        nextSlide();

                    },
                    5000
                );

        }


        /* =================================================
           AUTOPLAY STOP
        ================================================= */

        function stopAutoplay() {

            if (
                autoplayTimer
            ) {

                clearInterval(
                    autoplayTimer
                );

                autoplayTimer =
                    null;

            }

        }


        /* =================================================
           AUTOPLAY RESTART
        ================================================= */

        function restartAutoplay() {

            startAutoplay();

        }


        /* =================================================
           MOUSE ENTER
        ================================================= */

        slider.addEventListener(
            "mouseenter",
            function () {

                stopAutoplay();

            }
        );


        /* =================================================
           MOUSE LEAVE
        ================================================= */

        slider.addEventListener(
            "mouseleave",
            function () {


                if (
                    !isDragging
                ) {

                    startAutoplay();

                }

            }
        );


        /* =================================================
           INITIAL POSITION
        ================================================= */

        currentSlide = 0;


        moveSlider(
            0,
            false
        );


        /* =================================================
           START
        ================================================= */

        startAutoplay();


    }
);