$.validator.setDefaults({
	submitHandler: function() { alert("submitted!"); }
});

$().ready(function() {

	// validate signup form on keyup and submit
	$("#online-appointment-form").validate({
		rules: {
			fullname: "required",
			lastname: "required",
			phonenumber: "required",
			appointmentdate: "required",
			securitynumber: "required",
			emailaddress: {
				required: true,
				email: true
			},
		},
		messages: {
			fullname: "Please enter your name",
			lastname: "Please enter your lastname",
			phonenumber: "Please provide a phone number",
			appointmentdate: "Please select a date",
			emailaddress: "Please provide an email address",
			securitynumber: "Please enter your social security number"
		}
	});
});