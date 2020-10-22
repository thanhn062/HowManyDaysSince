// Get raw text from localStorage
var raw_reminder = localStorage.getItem("reminder");
// Parse it into an object array
var reminder = JSON.parse(raw_reminder);
// Make these variable global
$(document).ready(function() {
	//$("#nav-reminder").toggleClass("activeNav");
	var dayStart = "20200930";
	var dayStart_d = dayStart.substring(6,8);
	var dayStart_m = dayStart.substring(4,6);
	var dayStart_y = dayStart.substring(0,4);

	var given = moment(dayStart_y + "-" + dayStart_m + "-" + dayStart_d, "YYYY-MM-DD");
	var current = moment().startOf('day');

	//Difference in number of days
	var daysAgo = Math.abs(Math.round(moment.duration(given.diff(current)).asDays()));
	console.log(daysAgo);

	// Load existing data into reminder
	// If reminder is null, make it into an array to avoid error at array.push
	if(!reminder)
		reminder = [];
	else {
		// Display data from localStorage

		// Loop through reminder
		for (var i in reminder) {
			var item = `
			<div class="row">
				<div class="col-lg-12 reminder-item">
					<div class="row pt-3 pb-3">
						<div class="col-9 reminder-title">${reminder[i].name}</div>
						<div class="col-3 reminder-count">
							<div class="c100 p15">
								<span>${reminder[i].day}</span>
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

function load() {
// If reminder is null, make it into an array to avoid error at array.push
if(!reminder)
	reminder = [];
else {
	// Display data from localStorage

	// Loop through reminder
	for (var i in reminder) {
		var item = `
		<div class="row">
			<div class="col-lg-12 reminder-item">
				<div class="row pt-3 pb-3">
					<div class="col-9 reminder-title">${reminder[i].name}</div>
					<div class="col-3 reminder-count">${reminder[i].day}</div>
				</div>
			</div>
		</div>`;
		$("#reminder-list").append(item);
   		//console.log(reminder[i].name);
  	}
}
}
