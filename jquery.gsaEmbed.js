(function( $ ) {
    function get_query_param_for(name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.search);
	if (results == null) {
	    return "";
	}
	else {
	    return decodeURIComponent(results[1].replace(/\+/g, " "));
	}
    }

    function embed_google_custom_search(target) {
	var cx = '007709233595758735141:3o0hyksuzdc';
	var gcse = document.createElement('script'); gcse.type = 'text/javascript'; gcse.async = true;
	gcse.src = (document.location.protocol == 'https' ? 'https:' : 'http:') +
	    '//www.google.com/cse/cse.js?cx=' + cx;
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gcse, s);
	target.html('<gcse:search queryParameterName="query"></gcse:search>');
    }

    var methods = {
	init: function(options) {
	    var target = $(this);
	    var defaults = {
		resultsPerPage: 10,
		resultsPageNum: 1,
		searchUrls: 'http://www.med.upenn.edu',
		searchUrlOptions: null
	    };
	    var settings = $.extend(defaults, options);
	    results_per_page = get_query_param_for('resultsPerPage') ? get_query_param_for('resultsPerPage') : settings['resultsPerPage'];
	    results_page_num = get_query_param_for('resultsPageNum') ? get_query_param_for('resultsPageNum') : settings['resultsPageNum'];
	    search_urls = get_query_param_for('searchUrls');
        if (!search_urls) {
            search_urls = get_query_param_for('search')
            if (!search_urls) {
                search_urls = settings['searchUrls'];
            }
        }
  	    search_url_options = get_query_param_for('searchUrlOptions') ? get_query_param_for('searchUrlOptions') : settings['searchUrlOptions'];
	    var custom_search_url = 'http://search.med.upenn.edu/custom_search.php';
	    data = {
		query: get_query_param_for('query'),
		resultsPerPage: results_per_page,
		resultsPageNum: results_page_num,
		search: search_urls,
		searchUrlOptions: search_url_options,
		referrer: window.location.href
	    }

	    if ($.browser.msie && window.XDomainRequest) {
		var xdr = new XDomainRequest();
		xdr.open("get", custom_search_url + '?' + $.param(data));
		xdr.onload = function() {
		    if (xdr.responseText == "GSA is not available.") {
			embed_google_custom_search(target);
		    }
		    else {
			target.html(xdr.responseText);
		    }
		};
		xdr.send();
	    }
	    else {
		$.ajax({
		    url: custom_search_url,
		    data: data,
		    success: function(data, status) {
			if (data == "GSA is not available.") {
			    embed_google_custom_search(target);
			}
			else {
			    target.html(data);
			}
		    }
		});
	    }
	}
    };

    $.fn.gsaEmbed = function(method, options) {
	if (methods[method]) {
	    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
	} else if (typeof method == 'object' || !method) {
	    return methods.init.apply(this, arguments);
	} else {
	    $.error('Method ' + method + ' does not exist on jQuery.gsaEmbed');
	}
    };
})( jQuery );