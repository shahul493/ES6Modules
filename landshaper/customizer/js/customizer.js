"use strict"; // Start of use strict

if ( $('.customizer-box button.toggler').length ) {
	$('.customizer-box button.toggler').on('click', function () {
		$('.customizer-box').toggleClass('off on');
	});
};


// function for style switcher
function swithcerMenu () {
  if ($('.customizer-box').length) {

    $('.pattern-box').on('click', function () {
        $('.pattern-box').each(function () {
            $('html').removeClass( $(this).data('pattern-name') );
        });
        var className = $(this).data('pattern-name');
        $('html').addClass(className);
        console.log(className);
    });
    $(".customizer-box .navigation-switch").on('click', function(){
        var checker = $(this).find('input');
        if (checker.is(':checked')) {
            $('.header .stricky').removeClass('stricky-fixed');    
            $('.header .stricky').addClass('static');    
        }else {
            $('.header .stricky').addClass('stricky-fixed');    
            $('.header .stricky').removeClass('static');    
        };
        
    });

    $(".customizer-box #boxed").on('click', function(){
        Cookies.remove('boxed-layout');
        Cookies.set('boxed-layout', 'boxed', { expires: 365, path: '/' });
        $('body').removeClass('full-width');
        $('body').addClass('boxed');
    });
    $(".customizer-box #full-box").on('click', function(){
        Cookies.remove('boxed-layout');
        $('body').removeClass('boxed');
        $('body').addClass('full-width');
        Cookies.set('boxed-layout', 'full-width', { expires: 365, path: '/' });
    });

    $('#styleOptions').styleSwitcher({
    	hasPreview: false,
        fullPath: 'css/skin/',
         cookie: {
          expires: 999,
          isManagingLoad: true
        }
    });
    

    // chnage the theme related img/logo
    $('#styleOptions .color1').on('click',function() {      
        
        Cookies.remove('logo-img-light');
        Cookies.remove('logo-img-dark');
        Cookies.remove('map-skin');

        Cookies.set('logo-img-light', 'skin/color1/img/logo-light.png', { expires: 365, path: '/' });
        Cookies.set('logo-img-dark', 'skin/color1/img/logo.png', { expires: 365, path: '/' });
        Cookies.set('map-skin','skin-1', { expires: 365, path: '/' });
    });

    // chnage the theme related img/logo
    $('#styleOptions .color2').on('click',function() {      
        
        Cookies.remove('logo-img-light');
        Cookies.remove('logo-img-dark');
        Cookies.remove('map-skin');
        
        Cookies.set('logo-img-light', 'skin/color2/img/logo-light.png', { expires: 365, path: '/' });
        Cookies.set('logo-img-dark', 'skin/color2/img/logo.png', { expires: 365, path: '/' });
        Cookies.set('map-skin','skin-2', { expires: 365, path: '/' });
    });
    // chnage the theme related img/logo
    $('#styleOptions .color3').on('click',function() {      
        
        Cookies.remove('logo-img-light');
        Cookies.remove('logo-img-dark');
        Cookies.remove('map-skin');

        Cookies.set('logo-img-light', 'skin/color3/img/logo-light.png', { expires: 365, path: '/' });
        Cookies.set('logo-img-dark', 'skin/color3/img/logo.png', { expires: 365, path: '/' });
        Cookies.set('map-skin','skin-3', { expires: 365, path: '/' });
    });
    // chnage the theme related img/logo
    $('#styleOptions .color4').on('click',function() {    	
    	
    	Cookies.remove('logo-img-light');
        Cookies.remove('logo-img-dark');
    	Cookies.remove('map-skin');

        Cookies.set('logo-img-light', 'skin/color4/img/logo-light.png', { expires: 365, path: '/' });
    	Cookies.set('logo-img-dark', 'skin/color4/img/logo.png', { expires: 365, path: '/' });
    	Cookies.set('map-skin','skin-4', { expires: 365, path: '/' });
    });

     // var $imgsrc = $.cookie('mycookieimg');    
    // $('.header .menuzord-brand img').attr('src', Cookies.get('logo-img-light'));
    $('.site-header .container .navbar-brand img').attr('src', Cookies.get('logo-img-dark'));
    $('.site-header .container .navbar-brand.light-logo img').attr('src', Cookies.get('logo-img-light'));
    $('.footer-widget.about-widget a img').attr('src', Cookies.get('logo-img-light'));
    $('body').addClass(Cookies.get('boxed-layout'));
	$('.google-map').addClass(Cookies.get('map-skin'));
	console.log(Cookies.get());

  };
}
swithcerMenu();