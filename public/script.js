$(document).ready(function() {
	$(".btn-circle").click(function() {
		$(".reminder-list").hide();
		$(".add-menu").show();
	});

	$(".btn-cancel").click(function() {
		$(".reminder-list").show();
		$(".add-menu").hide();
		$(".alert-warning").hide();
	})
	$(".btn-add").click(function() {
		var name = $("#reminder-name").val();
		var day = $("#reminder-day").val();
		var alert = $("#reminder-alert").val();

		if(name && day) {
			$(".reminder-list").show();
			$(".add-menu").hide();
			$(".alert-warning").hide();
		}
		else {
			$(".alert-warning").show();
		}

	})
});