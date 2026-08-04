
(function($) {
    "use strict";

    const delay = 350;
    $(window).on("load", function () {
        //===== Main Menu
        $(".preloader").delay(delay).fadeOut("slow");

       //===== AOS Animation
        var aosAnimation = function () {
            AOS.init({
                easing: "ease",
                duration: 1500,
                once: true,
                offset: 60,
                disable: "mobile"
            });
        }
        if ($(".preloader")) {
            setTimeout(() => {
                aosAnimation()
            }, delay);
        } else {
            aosAnimation();
        }
    })

    //===== Main Menu
    function mainMenu() {
        // Variables
        var var_window = $(window),
            navContainer = $(".header-navigation"),
            navbarToggler = $(".navbar-toggler"),
            navMenu = $(".nav-menu"),
            navMenuLi = $(".nav-menu ul li ul li"),
            closeIcon = $(".navbar-close");
        // navbar toggler
        navbarToggler.on("click", function() {
            navbarToggler.toggleClass("active");
            navMenu.toggleClass("menu-on");
        });
        // close icon
        closeIcon.on("click", function() {
            navMenu.removeClass("menu-on");
            navbarToggler.removeClass("active");
        });
        // adds toggle button to li items that have children
        navMenu.find("li a").each(function() {
            if ($(this).next().length > 0) {
                $(this).parent("li").append('<span class="dd-trigger"><i class="fas fa-angle-down"></i></span>');
            }
        });
        // expands the dropdown menu on each click
        navMenu.find("li .dd-trigger").on("click", function(e) {
            e.preventDefault();
            $(this).parent("li").children("ul").stop(true, true).slideToggle(350);
            $(this).parent("li").toggleClass("active");
        });
        // check browser width in real-time
        function breakpointCheck() {
            var windoWidth = window.innerWidth;
            if (windoWidth <= 1199) {
                navContainer.addClass("breakpoint-on");
            } else {
                navContainer.removeClass("breakpoint-on");
            }
        }
        breakpointCheck();
        var_window.on("resize", function() {
            breakpointCheck();
        });
    };

    //===== category-nav
    $(".category-nav").find("li a").on("click", function (e) {
        e.preventDefault();
        $(this).parent("li").children("ul").stop(true, true).slideToggle(350);
        $(this).parent("li").toggleClass("active");
    });

    //===== Document Ready
    $(document).ready(function() {
        mainMenu();
    });
    
    //===== Sticky
    $(window).on("scroll", function(event) {
        var scroll = $(window).scrollTop();
        if (scroll < 190) {
            $(".header-navigation").removeClass("sticky");
        } else {
            $(".header-navigation").addClass("sticky");
        }
    });

    //===== Back to top
    $(window).on("scroll", function(event) {
        if ($(this).scrollTop() > 600) {
            $(".back-to-top").fadeIn(200)
        } else {
            $(".back-to-top").fadeOut(200)
        }
    });
    $(".back-to-top").on("click", function(event) {
        event.preventDefault();
        $("html, body").animate({
            scrollTop: 0,
        }, 1500);
    });

    //===== Magnific-popup js
    $(".video-popup").magnificPopup({
        type: "iframe",
        removalDelay: 300,
        mainClass: "mfp-fade"
    });
    $(".img-popup").magnificPopup({
        type: "image",
         gallery: { 
          enabled: true 
        }
    });

    //===== Nice select js
    $("select").niceSelect();
    
    //===== Slick slider js
    $(".hero-slider-one").slick({
		dots: false,
		arrows: true,
        infinite: true,
		speed: 1200,
        fade: true,
        autoplay: false,
		slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow:'<span class="prev"><i class="far fa-angle-left"></i></span>',
		nextArrow:'<span class="next"><i class="far fa-angle-right"></i></span>'
    });

    $(".testimonial-slider-one").slick({
		dots: false,
		arrows: false,
        infinite: true,
		autoplaySpeed: 1500,
        autoplay: false,
		slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow:'<span class="prev"><i class="far fa-angle-left"></i></span>',
		nextArrow:'<span class="next"><i class="far fa-angle-right"></i></span>',
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
    var blogArrow = $(".blog-arrows-one");
    $(".blog-slider-one").slick({
		dots: false,
		arrows: true,
        infinite: true,
		autoplaySpeed: 1500,
        appendArrows: blogArrow,
        autoplay: false,
		slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow:'<span class="prev"><i class="far fa-angle-left"></i></span>',
		nextArrow:'<span class="next"><i class="far fa-angle-right"></i></span>',
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
    $(".sponsor-slider-one").slick({
		dots: false,
		arrows: false,
        infinite: true,
		autoplaySpeed: 1500,
        autoplay: false,
		slidesToShow: 5,
        slidesToScroll: 1,
        prevArrow:'<span class="prev"><i class="far fa-angle-left"></i></span>',
		nextArrow:'<span class="next"><i class="far fa-angle-right"></i></span>',
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
    $(".sponsor-slider-two").slick({
		dots: false,
		arrows: false,
        infinite: true,
		autoplaySpeed: 1500,
        autoplay: false,
		slidesToShow: 4,
        slidesToScroll: 1,
        prevArrow:'<span class="prev"><i class="far fa-angle-left"></i></span>',
		nextArrow:'<span class="next"><i class="far fa-angle-right"></i></span>',
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
    $(".products-big-slider").slick({
        dots: false,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 2500,
        asNavFor: ".products-thumb-slider",
        prevArrow:'<span class="prev"><i class="far fa-angle-left"></i></span>',
		nextArrow:'<span class="next"><i class="far fa-angle-right"></i></span>',
        slidesToShow: 1,
        slidesToScroll: 1
    });
    $(".products-thumb-slider").slick({
        dots: false,
        arrows: true,
        infinite: true,
        autoplay: false,
        autoplaySpeed: 2500,
        focusOnSelect: true,
        asNavFor: ".products-big-slider",
        prevArrow:'<span class="prev"><i class="far fa-angle-left"></i></span>',
		nextArrow:'<span class="next"><i class="far fa-angle-right"></i></span>',
        slidesToShow: 3,
        slidesToScroll: 1
    });
    var galleryDots = $(".equipment-gallery-arrow");
    $(".equipment-gallery-slider").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 6000,
        arrows: true,
        prevArrow:'<span class="prev"><i class="far fa-angle-left"></i></span>',
		nextArrow:'<span class="next"><i class="far fa-angle-right"></i></span>',
        dots: true,
        appendDots: galleryDots,
        customPaging: function (slick, index) {
            var portrait = $(slick.$slides[index]).data("thumb");
            return '<img src=" ' + portrait + ' "/>';
        },
    });

    //===== Price ranger
    $( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: 2000,
        values: [ 150, 1200 ],
        slide: function( event, ui ) {
          $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
        }
    });
    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
        " - $" + $( "#slider-range" ).slider( "values", 1 ) );
    
    $(".quantity-down").on("click", function(){
        var numProduct = Number($(this).next().val());
        if(numProduct > 0) $(this).next().val(numProduct - 1);
    });
    $(".quantity-up").on("click", function(){
        var numProduct = Number($(this).prev().val());
        $(this).prev().val(numProduct + 1);
    });

    //===== Counter
    $(".count").counterUp({
        delay: 10,
        time: 1200
    });

    //===== Timer
    function makeTimer() {
        var endTime = new Date("December 10, 2023 17:00:00 PDT");
        var endTime = (Date.parse(endTime)) / 1000;
        var now = new Date();
        var now = (Date.parse(now) / 1000);
        var timeLeft = endTime - now;
        var days = Math.floor(timeLeft / 86400);
        var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
        var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600)) / 60);
        var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));
        if (hours < "10") {
            hours = "0" + hours;
        }
        if (minutes < "10") {
            minutes = "0" + minutes;
        }
        if (seconds < "10") {
            seconds = "0" + seconds;
        }
        $("#days .h1").html(days);
        $("#hours .h1").html(hours);
        $("#minutes .h1").html(minutes);
        $("#seconds .h1").html(seconds);
    }
    setInterval(function(){
        makeTimer()
    }, 0);

})(window.jQuery);