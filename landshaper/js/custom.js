"use strict"; // Start of use strict

function revolutionSliderActiver() {
    if ($('.rev_slider_wrapper .slider1').length) {
        var Self = $('.rev_slider_wrapper .slider1');
        var slideHeight = Self.data('height');
        jQuery(".slider1").revolution({
            sliderType: "standard",
            sliderLayout: "auto",
            delay: 5000,
            navigation: {
                arrows: { enable: true }
            },
            gridwidth: 1170,
            gridheight: slideHeight
        });
    };
}

function thmMailchimp() {
    if ($('.mailchimp-form').length) {
        $('.mailchimp-form').each(function() {
            var mailChimpWrapper = $(this);

            mailChimpWrapper.validate({ // initialize the plugin
                rules: {
                    email: {
                        required: true,
                        email: true
                    }
                },
                submitHandler: function(form) {
                    // sending value with ajax request
                    $.post($(form).attr('action'), $(form).serialize(), function(response) {
                        $(form).parent().find('.result').append(response);
                        $(form).find('input[type="text"]').val('');
                        $(form).find('input[type="email"]').val('');
                        $(form).find('textarea').val('');
                    });
                    return false;
                }
            });
        });
    };
}

function priceFilter() {
    if ($('.range-slider-price').length) {

        var priceRange = document.getElementById('range-slider-price');

        noUiSlider.create(priceRange, {
            start: [30, 150],
            limit: 200,
            behaviour: 'drag',
            connect: true,
            range: {
                'min': 10,
                'max': 200
            }
        });

        var limitFieldMin = document.getElementById('min-value-rangeslider');
        var limitFieldMax = document.getElementById('max-value-rangeslider');

        priceRange.noUiSlider.on('update', function(values, handle) {
            (handle ? $(limitFieldMax) : $(limitFieldMin)).text(values[handle]);
        });
    };
}

function thmOwlCarousel() {
    if ($('.related-project-carousel').length) {
        $('.related-project-carousel').owlCarousel({
            loop: true,
            margin: 30,
            nav: true,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
            ],
            dots: false,
            autoWidth: false,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            responsive: {
                0: {
                    items: 1,
                    autoWidth: false
                },
                480: {
                    items: 2,
                    autoWidth: false
                },
                600: {
                    items: 2,
                    autoWidth: false
                },
                1000: {
                    items: 3,
                    autoWidth: false
                },
                1200: {
                    items: 3,
                    autoWidth: false
                },
                1400: {
                    items: 3,
                    autoWidth: false
                }
            }
        });
    };
    if ($('.latest-project-carousel').length) {
        $('.latest-project-carousel').owlCarousel({
            loop: true,
            margin: 0,
            nav: true,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
            ],
            dots: false,
            autoWidth: false,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            responsive: {
                0: {
                    items: 1,
                    autoWidth: false
                },
                480: {
                    items: 1,
                    autoWidth: false
                },
                600: {
                    items: 2,
                    autoWidth: false
                },
                768: {
                    items: 3,
                    autoWidth: false
                },
                1000: {
                    items: 4,
                    autoWidth: false
                },
                1200: {
                    items: 4,
                    autoWidth: false
                },
                1400: {
                    items: 5,
                    autoWidth: false
                }
            }
        });
    };
    if ($('.client-testimonial-carousel').length) {
        $('.client-testimonial-carousel').owlCarousel({
            loop: true,
            margin: 30,
            nav: false,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
            ],
            dots: true,
            autoWidth: false,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            responsive: {
                0: {
                    items: 1,
                    autoWidth: false
                },
                480: {
                    items: 1,
                    autoWidth: false
                },
                600: {
                    items: 2,
                    autoWidth: false
                },
                1000: {
                    items: 2,
                    autoWidth: false
                }
            }
        });
    };
    if ($('.highlight-wrapper .owl-carousel').length) {
        $('.highlight-wrapper .owl-carousel').owlCarousel({
            loop: true,
            margin: 30,
            nav: false,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
            ],
            dots: true,
            autoWidth: false,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            responsive: {
                0: {
                    items: 1,
                    autoWidth: false
                },
                480: {
                    items: 1,
                    autoWidth: false
                },
                600: {
                    items: 2,
                    autoWidth: false
                },
                1000: {
                    items: 3,
                    autoWidth: false
                },
                1200: {
                    items: 4,
                    autoWidth: false
                }
            }
        });
    };
    if ($('.area-content.owl-carousel').length) {
        $('.area-content.owl-carousel').owlCarousel({
            loop: true,
            margin: 0,
            nav: true,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
            ],
            dots: false,
            autoWidth: false,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            responsive: {
                0: {
                    items: 1,
                    autoWidth: false
                },
                480: {
                    items: 2,
                    autoWidth: false
                },
                600: {
                    items: 3,
                    autoWidth: false
                },
                1000: {
                    items: 3,
                    autoWidth: false
                }
            }
        });
    };
    if ($('.single-service-feature-carousel').length) {
        $('.single-service-feature-carousel').owlCarousel({
            loop: true,
            margin: 0,
            nav: false,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
            ],
            dots: true,
            autoWidth: false,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            responsive: {
                0: {
                    items: 1,
                    autoWidth: false
                },
                480: {
                    items: 1,
                    autoWidth: false
                },
                600: {
                    items: 1,
                    autoWidth: false
                },
                1000: {
                    items: 1,
                    autoWidth: false
                }
            }
        });
    };

    if ($('.single-service-img-carousel').length) {
        $('.single-service-img-carousel').owlCarousel({
            loop: true,
            margin: 0,
            nav: false,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
            ],
            dots: true,
            autoWidth: false,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            responsive: {
                0: {
                    items: 1,
                    autoWidth: false
                },
                480: {
                    items: 1,
                    autoWidth: false
                },
                600: {
                    items: 1,
                    autoWidth: false
                },
                1000: {
                    items: 1,
                    autoWidth: false
                }
            }
        });
    };
    if ($('.testimonial-widget-carousel').length) {
        $('.testimonial-widget-carousel').owlCarousel({
            loop: true,
            margin: 0,
            nav: false,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
            ],
            dots: true,
            autoWidth: false,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            responsive: {
                0: {
                    items: 1,
                    autoWidth: false
                },
                480: {
                    items: 1,
                    autoWidth: false
                },
                600: {
                    items: 1,
                    autoWidth: false
                },
                1000: {
                    items: 1,
                    autoWidth: false
                }
            }
        });
    };
    if ($('.client-carousel').length) {
        $('.client-carousel').owlCarousel({
            loop: true,
            margin: 30,
            nav: false,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
            ],
            dots: false,
            autoWidth: false,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            responsive: {
                0: {
                    items: 2,
                    autoWidth: false
                },
                480: {
                    items: 3,
                    autoWidth: false
                },
                600: {
                    items: 4,
                    autoWidth: false
                },
                1000: {
                    items: 5,
                    autoWidth: false
                }
            }
        });
    };
    if ($('.footer-contact-info-carousel').length) {
        $('.footer-contact-info-carousel').owlCarousel({
            loop: true,
            margin: 0,
            nav: false,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
            ],
            dots: true,
            autoWidth: false,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            responsive: {
                0: {
                    items: 1,
                    autoWidth: false
                },
                480: {
                    items: 1,
                    autoWidth: false
                },
                600: {
                    items: 1,
                    autoWidth: false
                },
                1000: {
                    items: 1,
                    autoWidth: false
                }
            }
        });
    };
    if ($('.featured-product-carousel').length) {
        $('.featured-product-carousel').owlCarousel({
            loop: true,
            margin: 30,
            nav: true,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
            ],
            dots: false,
            autoWidth: false,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            responsive: {
                0: {
                    items: 1,
                    autoWidth: false
                },
                480: {
                    items: 2,
                    autoWidth: false
                },
                768: {
                    items: 2,
                    autoWidth: false
                },
                1000: {
                    items: 3,
                    autoWidth: false
                },
				1100: {
                    items: 4,
                    autoWidth: false
                }
            }
        });
    };
    if ($('.single-service-carousel').length) {
        $('.single-service-carousel').owlCarousel({
            loop: true,
            margin: 10,
            nav: true,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
            ],
            dots: false,
            autoWidth: true,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            responsive: {
                0: {
                    items: 2                    
                },
                480: {
                    items: 2                    
                },
                600: {
                    items: 2                    
                },
                1000: {
                    items: 2                    
                }
            }
        });
    };
    if ($('.service-gallery-carousel').length) {
        $('.service-gallery-carousel').owlCarousel({
            loop: true,
            margin: 30,
            nav: true,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
            ],
            dots: false,
            autoWidth: false,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            responsive: {
                0: {
                    items: 1                    
                },
                480: {
                    items: 1                    
                },
                600: {
                    items: 2                    
                },
                1000: {
                    items: 2                    
                }
            }
        });
    };
        if ($('.single-product-carousel-content-box').length && $('.single-product-carousel-thumbnail-box').length) {

        var $sync1 = $(".single-product-carousel-content-box"),
            $sync2 = $(".single-product-carousel-thumbnail-box"),
            flag = false,
            duration = 1000;

        $sync1
            .owlCarousel({
                items: 1,
                margin: 0,
                nav: false,
                dots: false
            })
            .on('changed.owl.carousel', function(e) {
                if (!flag) {
                    flag = true;
                    $sync2.trigger('to.owl.carousel', [e.item.index, duration, true]);
                    flag = false;
                }
            });

        $sync2
            .owlCarousel({
                margin: 10,
                items: 2,
                nav: false,
                dots: false,
                navText: [
                    '<i class="fa fa-angle-left"></i>',
                    '<i class="fa fa-angle-right"></i>'
                ],
                center: false,
                responsive: {
                    0: {
                        items: 1,
                        autoWidth: false
                    },
                    480: {
                        items: 2,
                        center: false,
                        autoWidth: false
                    },
                    600: {
                        items: 4,
                        autoWidth: false
                    },
                    1000: {
                        items: 4,
                        autoWidth: true
                    }
                },
            })
            .on('click', '.owl-item', function() {
                $sync1.trigger('to.owl.carousel', [$(this).index(), duration, true]);

            })
            .on('changed.owl.carousel', function(e) {
                if (!flag) {
                    flag = true;
                    $sync1.trigger('to.owl.carousel', [e.item.index, duration, true]);
                    flag = false;
                }
            });

    };
}

function cartTouchSpin() {
    if ($('.quantity-spinner').length) {
        $("input.quantity-spinner").TouchSpin({
            verticalbuttons: true
        });
    }
}


function galleryMasonaryLayout() {
    if ($('.masonary-layout').length) {
        $('.masonary-layout').isotope({
            layoutMode: 'masonry'
        });
    }

    if ($('.post-filter').length) {
        $('.post-filter li').children('span').on('click', function() {
            var Self = $(this);
            var selector = Self.parent().attr('data-filter');
            $('.post-filter li').children('span').parent().removeClass('active');
            Self.parent().addClass('active');


            $('.filter-layout').isotope({
                filter: selector,
                animationOptions: {
                    duration: 500,
                    easing: 'linear',
                    queue: false
                }
            });
            return false;
        });
    }

    if ($('.post-filter.has-dynamic-filter-counter').length) {
        // var allItem = $('.single-filter-item').length;

        var activeFilterItem = $('.post-filter.has-dynamic-filter-counter').find('li');

        activeFilterItem.each(function() {
            var filterElement = $(this).data('filter');
            console.log(filterElement);
            var count = $('.gallery-content').find(filterElement).length;

            $(this).children('span').append('<span class="count"><b>' + count + '</b></span>');
        });
    };
}


function thmbxSlider() {
    if ($('.feature-carousel-box').length) {
        $('.feature-carousel-box').bxSlider({
            mode: 'vertical',
            auto: true,
            autoControls: false,
            controls: false,
            pause: 3000,
            slideMargin: 0
        });
    }
}


function thmHalfChart() {
    if ($('.circle').length) {
        $('.circle').circleProgress({
            value: 0.5,
            size: 163,
            thickness: 30,
            fill: { color: '#60B044' }
        });
    };
}
thmHalfChart();

function doughnutChartBox() {
    if ($('#doughnut-chartBox').length) {
        var ctx = $("#doughnut-chartBox");
        Chart.defaults.global.legend.display = false;
        var myDoughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [
                    "77%",
                    "23%"
                ],
                datasets: [{
                    data: [200, 70],
                    backgroundColor: [
                        "#FF7F0E",
                        "#3563A9"
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB"
                    ],
                    hoverBorderColor: [
                        "#fff",
                        "#fff"
                    ]
                }]
            },
            option: {
                position: "left",
                responsive: true,
            }
        });
    };
}

function pieChartBox() {
    if ($('#pie-chartBox').length) {
        var ctx = $("#pie-chartBox");
        Chart.defaults.global.legend.display = false;
        var myPieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [
                    "77%",
                    "23%"
                ],
                datasets: [{
                    data: [200, 70],
                    backgroundColor: [
                        "#FF7F0E",
                        "#3563A9"
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB"
                    ],
                    hoverBorderColor: [
                        "#fff",
                        "#fff"
                    ]
                }]
            },
            option: {
                position: "left",
                responsive: true,
            }
        });
    };
}

function thmMasterSliderStaff() {
    if ($('.testimonial-about-carousel').length) {
        var slider = new MasterSlider();
        slider.setup('masterslider', {
            loop: true,
            width: 80,
            height: 80,
            speed: 20,
            view: 'fadeBasic',
            preload: 'all',
            space: 20,
            wheel: true
        });
        slider.control('arrows');
        slider.control('slideinfo', { insertTo: '#staff-info' });
    };
}
thmMasterSliderStaff();

function stickyHeader() {
    if ($('.stricky').length) {
        var strickyScrollPos = 100;
        if ($(window).scrollTop() > strickyScrollPos) {
            $('.stricky').addClass('stricky-fixed');
            $('.scroll-to-top').fadeIn(500);
        } else if ($(this).scrollTop() <= strickyScrollPos) {
            $('.stricky').removeClass('stricky-fixed');
            $('.scroll-to-top').fadeOut(500);
        }
    };
}

function morrisLineSingleServiceChart() {
    if ($('#morris-line-single-service-chart').length) {
        Morris.Line({
            element: 'morris-line-single-service-chart',
            data: [
                { y: '2006', a: 100, b: 90, c: 70 },
                { y: '2007', a: 75, b: 75, c: 55 },
                { y: '2008', a: 50, b: 30, c: 90 },
                { y: '2009', a: 75, b: 45, c: 60 },
                { y: '2010', a: 50, b: 55, c: 45 },
                { y: '2011', a: 75, b: 95, c: 35 },
                { y: '2012', a: 100, b: 65, c: 85 }
            ],
            xkey: 'y',
            ykeys: ['a', 'b', 'c'],
            pointSize: [7, 7, 7],
            lineColors: ['#D50953', '#3563A9', '#FF7F0E'],
            pointFillColors: ['#ffffff', '#ffffff', '#ffffff'],
            pointStrokeColors: ['#D50953', '#3563A9', '#FF7F0E'],
            hideHover: 'always',
            gridTextSize: 14,
            gridTextColor: '#333333',
            gridTextFamily: 'Montserrat-Regular',
            labels: [' ', ' ', ' ']
        });
    };
}
morrisLineSingleServiceChart();

function morrisAreaLightSingleServiceChart() {
    if ($('#morris-area-light-single-service-chart').length) {
        Morris.Area({
            element: 'morris-area-light-single-service-chart',
            data: [
                { y: '2009', a: 70 },
                { y: '2010', a: 50 },
                { y: '2011', a: 65 },
                { y: '2012', a: 56 },
                { y: '2013', a: 80 },
                { y: '2014', a: 65 },
                { y: '2015', a: 45 },
                { y: '2016', a: 70 }
            ],
            xkey: 'y',
            ykeys: ['a', ],
            pointSize: [7],
            lineColors: ['#264EB7'],
            lineWidth: [2],
            pointFillColors: ['#ffffff'],
            pointStrokeColors: ['#ffffff'],
            hideHover: 'always',
            fillOpacity: 1,
            behaveLikeLine: true,
            labels: [' '],
            grid: false,
            gridTextSize: 14,
            gridTextColor: '#ffffff',
            gridTextFamily: 'Montserrat-Regular'
        });
    };
}
morrisAreaLightSingleServiceChart();

function morrisAreaDarkSingleServiceChart() {
    if ($('#morris-area-dark-single-service-chart').length) {
        Morris.Area({
            element: 'morris-area-dark-single-service-chart',
            data: [
                { y: '2010', a: 30 },
                { y: '2011', a: 40 },
                { y: '2012', a: 32 },
                { y: '2013', a: 44 },
                { y: '2014', a: 50 },
                { y: '2015', a: 45 },
                { y: '2016', a: 40 }
            ],
            xkey: 'y',
            ykeys: ['a'],
            pointSize: [7],
            lineColors: ['#3563A9'],
            lineWidth: [2],
            pointFillColors: ['#F7F7F7'],
            pointStrokeColors: ['#F7F7F7'],
            hideHover: 'always',
            fillOpacity: 1,
            behaveLikeLine: true,
            labels: [' '],
            gridTextSize: 14,
            gridTextColor: '#333',
            gridTextFamily: 'Montserrat-Regular'
        });
    };
}
morrisAreaDarkSingleServiceChart();

function thmLightBox() {
    if ($('.img-popup').length) {
        var groups = {};
        $('.img-popup').each(function() {
            var id = parseInt($(this).attr('data-group'), 10);

            if (!groups[id]) {
                groups[id] = [];
            }

            groups[id].push(this);
        });


        $.each(groups, function() {

            $(this).magnificPopup({
                type: 'image',
                closeOnContentClick: true,
                closeBtnInside: false,
                gallery: { enabled: true }
            });

        });

    };
}

function thmCounter() {
    if ($('.counter').length) {
        $('.counter').counterUp({
            delay: 10,
            time: 3000
        });
    };
}

function thmScrollAnim() {
    if ($('.wow').length) {
        var wow = new WOW({
            mobile: false
        });
        wow.init();
    };
}

function contactFormValidation() {
    if ($('.contact-form').length) {
        $('.contact-form').validate({ // initialize the plugin
            rules: {
                name: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                message: {
                    required: true
                },
                subject: {
                    required: true
                }
            },
            submitHandler: function(form) {
                // sending value with ajax request
                $.post($(form).attr('action'), $(form).serialize(), function(response) {
                    $(form).find('.form-result').append(response);
                    $(form).find('input[type="text"]').val('');
                    $(form).find('input[type="email"]').val('');
                    $(form).find('textarea').val('');
                    console.log(response);
                });
                return false;
            }
        });
    }
}

function thmVideoPopup() {
    if ($('.video-popup').length) {
        $('.video-popup').magnificPopup({
            disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: true,

            fixedContentPos: false
        });
    };
}

function scrollToTarget() {
    if ($('.scroll-to-target').length) {
        $(".scroll-to-target").on('click', function() {
            var target = $(this).attr('data-target');
            // animate
            $('html, body').animate({
                scrollTop: $(target).offset().top
            }, 1000);

        });
    }
}

function mobileNavToggle() {
    if ($('.site-header .navbar-nav .sub-menu').length) {
        $('.site-header .navbar-nav .sub-menu').parent('li').children('a').append(function() {
            return '<button class="sub-nav-toggler"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button>';
        });
        $('.site-header .navbar-nav .sub-nav-toggler').on('click', function() {
            var Self = $(this);
            Self.parent().parent().children('.sub-menu').slideToggle();
            return false;
        });

    };
}

function backgroundSlider() {
    if ($('.background-slider').length) {
        $('.background-slider').each(function() {
            var Self = $(this);
            
            // grabing via data attr
            var slides = Self.data('slides');
            var duration = Self.data('duration');
            var fade = Self.data('fade');
            
            
            // globals
            if ( slides === undefined ) {
                slides = ["http://dl.dropbox.com/u/515046/www/outside.jpg", "http://dl.dropbox.com/u/515046/www/garfield-interior.jpg", "http://dl.dropbox.com/u/515046/www/cheers.jpg"];
            };

            if ( duration === undefined ) {duration = 3000; };

            if ( fade === undefined ) {fade = 750; };                        

            if (slides.length > 1 ) {
                // init the function
                Self.backstretch(slides, { duration: 3000, fade: 750 });
            }else {
                Self.css({
                    'background' : 'url('+slides+') no-repeat center center',
                    'background-size' : 'cover'
                });
            };

        });
    };
}

function languageSwitcher () {
    if ($("#polyglot-language-options").length) {
            $('#polyglotLanguageSwitcher').polyglotLanguageSwitcher({
                effect: 'fade',
                testMode: true,
                onChange: function(evt){
                    alert("The selected language is: "+evt.selectedItem);
                }
            });
    };
}


// Map Area Address  
function mapAddress () {
  if($('.map_address').length) {
    $('.map_address').owlCarousel({
        loop:true,
        margin:5,
        nav:true,
        navText:false,
        dots:false,
        autoplay:true,
        autoplayTimeout:3500,
        autoplaySpeed:1500,
        lazyLoad:true,
        singleItem:true,
        items:1,
    });
  }
}



// instance of fuction while Document ready event   
jQuery(document).on('ready', function() {
    (function($) {
        revolutionSliderActiver();
        thmMailchimp();
        priceFilter();
        thmOwlCarousel();
        cartTouchSpin();
        doughnutChartBox();
        pieChartBox();
        thmLightBox();
        thmCounter();
        thmScrollAnim();
        contactFormValidation();
        scrollToTarget();
        thmVideoPopup();
        mobileNavToggle();
        backgroundSlider();
        languageSwitcher();
		mapAddress ();
    })(jQuery);
});

// instance of fuction while Window Load event
jQuery(window).on('load', function() {
    (function($) {
        thmbxSlider();
        galleryMasonaryLayout();
    })(jQuery);
});

// instance of fuction while Window Scroll event
jQuery(window).on('scroll', function() {
    (function($) {
        stickyHeader();
    })(jQuery);
});
