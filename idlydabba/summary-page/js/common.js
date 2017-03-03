(function($) {
 "use strict"
	// scroll up
	jQuery(window).on("scroll", function(){
		if (jQuery(this).scrollTop() > 1) {
			jQuery('.scrollup').css({bottom:"25px"});
		} else {
			jQuery('.scrollup').css({bottom:"-100px"});
		}
	});
	jQuery('.scrollup').on("click", function() {
		jQuery('html, body').animate({scrollTop: '0px'}, 800);
		return false;
	});
	
	// Page Preloader
	$(window).on("load", function() {
		$(".loader").delay(300).fadeOut();
		$(".animationload").delay(600).fadeOut("slow");
	});    
    $('.accordion').find('.accordion-toggle').click(function() {
        $(this).next().slideToggle('600');
        $(".accordion-content").not($(this).next()).slideUp('600');
	});
	$('.accordion-toggle').on('click', function() {
		$(this).toggleClass('active').siblings().removeClass('active');
	});
	var d = new Date();
    document.getElementById("date").innerHTML = d.toDateString();    

})(jQuery);


google.charts.load('current', { 'packages': ['corechart'] });


function datepickertext()
{
    var dte = new Date();
    var defautlDate = dte.toDateString("dd/mm/yyyy");
    //$("#car-time").html(defautlDate);
    //document.getElementById('time').html = defautlDate;
    $("#from").val(defautlDate);
    $("#to").val(defautlDate);
    $("#from").datepicker({
        defaultDate: defautlDate,
        changeMonth: true,
        numberOfMonths: 3,
        format: 'dd/mm/yyyy',

        todayHighlight: true,
        onClose: function (selectedDate) {
            $("#to").datepicker("option", "minDate", selectedDate);
        }
    });
    $("#to").datepicker({
        defaultDate: defautlDate,
        changeMonth: true,

        todayHighlight: true,
        format: 'dd/mm/yyyy',
        numberOfMonths: 3,
        onClose: function (selectedDate) {
            $("#from").datepicker("option", "maxDate", selectedDate);
        }
    });
}


$(function(){

    var iconOpen = 'fa fa-minus-circle';
    
    var iconClose = 'fa fa-plus-circle';

    $(document).on('show.bs.collapse hide.bs.collapse', '#faq-accordion', function (e) {
        var $target = $(e.target)
        $target.siblings('.accordion-heading')
        .find('em').toggleClass(iconOpen + ' ' + iconClose);
        if (e.type == 'show')
            $target.prev('.accordion-heading').find('.accordion-toggle').addClass('active');
        if (e.type == 'hide')
            $(this).find('.accordion-toggle').not($target).removeClass('active');
    });
});