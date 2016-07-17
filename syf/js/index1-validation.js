$.validator.setDefaults({
	submitHandler: function() { alert("submitted!"); }
});

$().ready(function() {

	// validate signup form on keyup and submit
	$("#index-appointment-form").validate({
		rules: {
			fullname: "required",
			phonenumber: "required",
			appointmentdate: "required",
			number: "required",
			emailaddress: {
				required: true,
				email: true
			},
		},
		messages: {
			fullname: "Please enter your fullname",
			phonenumber: "Please provide a phone number",
			appointmentdate: "Please select a date",
			emailaddress: "Please provide an email address",
			number: "Pick a number"
		}
	});
});