$(document).ready(function() {
	$(".btn-circle").click(function() {
		$(".reminder-list").hide();
		$(".add-menu").show();
	});

	$(".btn-cancel").click(function() {
		$(".reminder-list").show();
		$(".add-menu").hide();
	})
	$(".btn-add").click(function() {
		
		$(".reminder-list").show();
		$(".add-menu").hide();
	})
});