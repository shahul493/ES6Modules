jQuery(document).ready(function($) {



 	

	//To top plugin
	$().UItoTop({ 
		easingType: 'easeOutQuart' 
	});

	//Tooltip
	$('.tooltips').tooltip(options)

	//Responsive video container with FitVids
	$('.video-placeholder').fitVids();
	
	//Index-1 specialist selector
	$('#doctor').selecter({
		defaultLabel: "Select specialization"
	});

	//Contact Center selector
	$('#clinic-center').selecter({
		defaultLabel: "Select Medical Center"
	});

	//Index-1 main slider
	$('.bx-slider').bxSlider({
		pager: false,
		controls: false,
		auto: true,
		mode: 'fade'
	});

	//Index-2 main slider
	$('.bx-slider-html').bxSlider({
		pager: false,
		auto: true,
		mode: 'fade'
	});
	//blog carousel
	$('.blog-carousel').bxSlider({
		slideWidth: 262,
		minSlides: 1,
		maxSlides: 4,
		moveSlides: 1,
		slideMargin: 30,
		pager: false,
		auto: true,
		nextSelector: '.next-carousel-1',
		prevSelector: '.prev-carousel-1',
		nextText: '<i class="icon-right-open-big"></i>',
		prevText: '<i class="icon-left-open-big"></i>',
		infiniteLoop: false
	});

	//small blog carousel
	$('.small-blog-carousel').bxSlider({
		minSlides: 2,
		maxSlides: 2,
		mode: 'vertical',
		moveSlides: 1,
		slideMargin: 30,
		pager: false,
		auto: true,
		nextSelector: '.next-carousel-news',
		prevSelector: '.prev-carousel-news',
		nextText: '<i class="icon-right-open-big"></i>',
		prevText: '<i class="icon-left-open-big"></i>',
		infiniteLoop: false
	});

	//doctors carousel
	$('.doctors-carousel').bxSlider({
		slideWidth: 262,
		minSlides: 1,
		maxSlides: 4,
		moveSlides: 1,
		slideMargin: 30,
		pager: false,
		auto: true,
		nextSelector: '.next-carousel-doctors',
		prevSelector: '.prev-carousel-doctors',
		nextText: '<i class="icon-right-open-big"></i>',
		prevText: '<i class="icon-left-open-big"></i>'
	});

	//company carousel
	$('.company-carousel').bxSlider({
		slideWidth: 262,
		minSlides: 1,
		maxSlides: 4,
		moveSlides: 1,
		slideMargin: 30,
		pager: false,
		auto: true,
		nextSelector: '.next-carousel-2',
		prevSelector: '.prev-carousel-2',
		nextText: '<i class="icon-right-open-big"></i>',
		prevText: '<i class="icon-left-open-big"></i>'
	});

	//profile carousel
	$('.profile-carousel').bxSlider({
		pager: false,
		auto: true,
		nextSelector: '.next-gallery',
		prevSelector: '.prev-gallery',
		nextText: '<i class="icon-right-open-big"></i>',
		prevText: '<i class="icon-left-open-big"></i>'
	});

	//=================================== Counter  ==============================//

   $('#event-one').countdown('2014/06/12', function(event) {
      var $this = $(this).html(event.strftime(''
      + '<span>%D <br> <small>days</small></span>  '
      + '<span>%H <br> <small>hr</small> </span>  '
      + '<span>%M <br> <small>min</small> </span>  '
      + '<span>%S <br> <small>sec</small></span> '));
   });

   $('#event-two').countdown('2014/09/10', function(event) {
      var $this = $(this).html(event.strftime(''
      + '<span>%D <br> <small>days</small></span>  '
      + '<span>%H <br> <small>hr</small> </span>  '
      + '<span>%M <br> <small>min</small> </span>  '
      + '<span>%S <br> <small>sec</small></span> '));
   });
   $('#event-three').countdown('2014/12/24', function(event) {
      var $this = $(this).html(event.strftime(''
      + '<span>%D <br> <small>days</small></span>  '
      + '<span>%H <br> <small>hr</small> </span>  '
      + '<span>%M <br> <small>min</small> </span>  '
      + '<span>%S <br> <small>sec</small></span> '));
   });

	//Validate forms
	//$('#index-appointment-form').validate();

	//Staff page Gallery filters
	var newSelection = "";
	$('.filter-list a').click(function(){
	    $('#og-grid').fadeTo(300, 0.10);
		$('.filter-list a').removeClass('current');
		$(this).addClass('current');
		newSelection = $(this).attr('data-rel');
		$('.all-departments').not('.'+newSelection).hide('slow');
		$('.'+newSelection).show('slow');
	    $("#og-grid").fadeTo(300, 1);
	});

	//Easy Pie Chart graphics
	if ($('.chart').length) {
		$('.chart').easyPieChart({
			animate: 2000,
			trackColor: "#ebebeb",
			barColor: "#0392ef",
			scaleColor: false,
			lineWidth: 11,
			lineCap: "square",
		});
	}

	//Chart
	if ($('#linear-chart').length) {
		//Get context with jQuery - using jQuery's .get() method.
		var ctx = $("#linear-chart").get(0).getContext("2d");
		//This will get the first returned node in the jQuery collection.
		var myNewChart = new Chart(ctx);
		var data = {
			labels : ["10AM","11AM","12AM","1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM"],
			datasets : [
				//Actitude
				{
					fillColor : "rgba(220,220,220,0)",
					strokeColor : "rgba(3,146,239,1)",
					pointColor : "rgba(3,146,239,1)",
					pointStrokeColor : "#fff",
					data : [5,3,3,5,7,8,6,6,9,8,10,12]
				},
				{
					fillColor : "rgba(220,220,220,0)",
					strokeColor : "rgba(0,47,105,1)",
					pointColor : "rgba(0,47,105,1)",
					pointStrokeColor : "#fff",
					data : [3,4,4,6,2,3,3,7,3,7,11,11]
				}
			]
		}
		var options = {
			//Boolean - If we show the scale above the chart data			
			scaleOverlay : false,
			//Boolean - If we want to override with a hard coded scale
			scaleOverride : true,
			//** Required if scaleOverride is true **
			//Number - The number of steps in a hard coded scale
			scaleSteps : 13,
			//Number - The value jump in the hard coded scale
			scaleStepWidth : 1,
			//Number - The scale starting value
			scaleStartValue : 1,
			//Boolean - Whether to show labels on the scale	
			scaleShowLabels : false,
			///Boolean - Whether grid lines are shown across the chart
			scaleShowGridLines : false,
			//Boolean - Whether the line is curved between points
			bezierCurve : false,
			//Number - Radius of each point dot in pixels
			pointDotRadius : 6
		}
		myNewChart.Line(data,options);
	}
 	
});
