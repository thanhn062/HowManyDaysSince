// Get raw text from localStorage
var raw_reminder = localStorage.getItem("reminder");
// Parse it into an object array
var reminder = JSON.parse(raw_reminder);
// Make these variable global
$(document).ready(function() {
	// Load existing data into reminder
	// If reminder is null, make it into an array to avoid error at array.push
	if(!reminder)
		reminder = [];
	else {
		// Display data from localStorage
		// First loop through reminder
		for (var i in reminder) {
			// Calculate days since reminder start
			var dayStart_y = reminder[i].start.substring(0,4);
			var dayStart_m = reminder[i].start.substring(4,6);
			var dayStart_d = reminder[i].start.substring(6,8);

			var given = moment(dayStart_y + "-" + dayStart_m + "-" + dayStart_d, "YYYY-MM-DD");
			var current = moment().startOf('day');

			var daysAgo = Math.abs(Math.round(moment.duration(given.diff(current)).asDays()));
			// Find percentage value of current day count & maximum day count
			var percentage = Math.round((daysAgo/reminder[i].day)*100);
			// Display data from localStorage
			if (percentage < 25)
				var color = "";
			if (percentage >= 25)
				var color = "low";
			if (percentage >= 50)
				var color = "med";
			if (percentage >= 85)
				var color = "high";
			var item = `
			<div id="item-${i}" class="row">
				<div class="col-lg-12 reminder-item">
					<div class="row pt-3 pb-3">
						<div class="col-9 reminder-title">
							<span class="edit">
								<button type="button" onclick="edit(${i})" class="btn btn-primary">Edit</button>
								<button type="button" onclick="reset(${i})" class="btn btn-warning">Reset</button>
								<button type="button" onclick="del(${i})" class="btn btn-danger">Delete</button>
							</span>
							<span class="item">${reminder[i].name}</span>
						</div>
						<div class="col-3 reminder-count">
							<div class="c100 ${color} p${percentage}">
								<span class="edit cancel"style="display: none"><i class="fa fa-times fa-lg"></i></span>
								<span class="dayCount">${daysAgo}</span>
								<div class="slice">
									<div class="bar"></div>
									<div class="fill"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>`;
			$("#reminder-list").append(item);
	   		//console.log(reminder[i].name);
	  	}
	}

	$(".btn-circle").click(function() {
		$("#reminder-list").hide();
		$(".add-menu").show();
	});

	$(".btn-cancel").click(function() {
		$("#reminder-list").show();
		$(".add-menu").hide();
		$(".alert-warning").hide();
		// Empty fields
		$("#reminder-name").val("");
		$("#reminder-day").val("");
		$("#reminder-alert").val("");
	});

	$(".dayCount").click(function() {
		// Hide all edit menu
		$(".edit").hide();
		$(".item").show();
		$(".dayCount").show();

		$(this).closest(".row").find(".edit").show();
		$(this).closest(".row").find(".item").hide();
		$(this).parent().find(".dayCount").hide();
		$(this).parent().find(".cancel").show();
	});

	$(".cancel").click(function() {
		// Hide all edit menu
		$(".edit").hide();
		$(".item").show();
		$(".dayCount").show();

		$(this).find(".edit").show();
		$(this).find(".item").hide();
		$(this).parent().find(".dayCount").show();
		$(this).parent().find(".cancel").hide();
	});

	$(".btn-add").click(function() {
		var name = $("#reminder-name").val();
		var day = $("#reminder-day").val();
		var alert = $("#reminder-alert").val();

		if(name && day) {
			// Empty fields
			$("#reminder-name").val("");
			$("#reminder-day").val("");
			$("#reminder-alert").val("");
			var obj = {
				"name": name,
				"day": day,
				"alert": alert,
				"start": moment().format("YYYYMMDD")
			};
			// Push new reminder into the array
			reminder.push(obj);
			// Add into localStorage
			localStorage.setItem("reminder", JSON.stringify(reminder));
			// Add into reminder-list
			var item = `
			<div class="row">
				<div class="col-lg-12 reminder-item">
					<div class="row pt-3 pb-3">
						<div class="col-9 reminder-title">${name}</div>
						<div class="col-3 reminder-count">
							<div class="c100 p15">
								<span>${day}</span>
								<div class="slice">
									<div class="bar"></div>
									<div class="fill"></div>
								</div>
							</div></div>
					</div>
				</div>
			</div>`;
			$("#reminder-list").append(item);

			$("#reminder-list").show();
			$(".add-menu").hide();
			$(".alert-warning").hide();
		}
		else {
			$(".alert-warning").show();
		}
	});
});

function edit(id) {
 //console.log($("#item-" + id);
}
function reset(id) {

}
function del(id) {
	// Confirmation
	if (confirm("Are you sure you want to delete this reminder ?")) {
		// get data from local storage
		var data = getLocalStorage();
		if (id === 0)
			data.splice(0,1);
		else
			data.splice(id,id);
		// Delete in local storage
		localStorage.setItem("reminder", JSON.stringify(data));
		// Delete in reminder
		$("#item-" + id).remove();
  }
}
function addReminder(name, day, alert, date) {
	// Calculate days since reminder start
	var dayStart_y = date.substring(0,4);
	var dayStart_m = date.substring(4,6);
	var dayStart_d = date.substring(6,8);

	var given = moment(dayStart_y + "-" + dayStart_m + "-" + dayStart_d, "YYYY-MM-DD");
	var current = moment().startOf('day');

	var daysAgo = Math.abs(Math.round(moment.duration(given.diff(current)).asDays()));
	
}

function getLocalStorage() {
	// Get raw text from localStorage
	var raw_reminder = localStorage.getItem("reminder");
	// Parse it into an object array & return
	return JSON.parse(raw_reminder);
}
function load() {
// If reminder is null, make it into an array to avoid error at array.push
if(!reminder)
	reminder = [];
else {
	// Display data from localStorage

	// Loop through reminder
	for (var i in reminder) {
		// Calculate days since reminder start
		var dayStart_y = reminder[i].start.substring(0,4);
		var dayStart_m = reminder[i].start.substring(4,6);
		var dayStart_d = reminder[i].start.substring(6,8);

		var given = moment(dayStart_y + "-" + dayStart_m + "-" + dayStart_d, "YYYY-MM-DD");
		var current = moment().startOf('day');

		var daysAgo = Math.abs(Math.round(moment.duration(given.diff(current)).asDays()));
		console.log(daysAgo);
		var item = `
		<div class="row">
			<div class="col-lg-12 reminder-item">
				<div class="row pt-3 pb-3">
					<div class="col-9 reminder-title">${reminder[i].name}</div>
					<div class="col-3 reminder-count">${daysAgo}</div>
				</div>
			</div>
		</div>`;
		$("#reminder-list").append(item);
   		//console.log(reminder[i].name);
  	}
}
}
