// set currentEditID as global value for easy passing current editing reminder item
var currentEditID;
$(document).ready(function() {
	init();
	$(".btn-circle").click(function() {
		$("#reminder-list").hide();
		// Default date as today
		$("#reminder-date").attr("placeholder",moment().format("YYYY-MM-DD"));
		$(".add-menu").show();
	});
	$(".btn-cancel").click(function() {
		// Hide all edit menu
		$(".edit").hide();
		$(".item").show();
		$(".dayCount").show();

		$("#reminder-list").show();
		$(".add-menu").hide();
		$(".edit-menu").hide();
		$(".alert-warning").hide();
		// Empty fields
		$("#reminder-name").val("");
		$("#reminder-day").val("");
		$("#reminder-date").val("");
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
		var date = $("#reminder-date").val();
		// if date is empty, use today
		if (!date)
			date = moment().format("YYYYMMDD");
		else
			// remove dash for raw date
			date = date.replace(/-/g, "");
		// Field validation
		if(name && day) {
			// Empty fields
			$("#reminder-name").val("");
			$("#reminder-day").val("");
			$("#reminder-date").val("");
			var obj = {
				"name": name,
				"day": day,
				"date": date
			};
			// Load local storage into data
			var data = getLocalStorage();
			// Push new reminder into the array
			data.push(obj);
			// Add into localStorage
			localStorage.setItem("reminder", JSON.stringify(data));
			// Refresh reminder list
			// Delete all existing content
			$("#reminder-list").empty();
			// reload data from local storage
			load();

			// Show reminder list & hide add menu
			$("#reminder-list").show();
			$(".add-menu").hide();
			$(".alert-warning").hide();
		}
		else
			$(".alert-warning").show();
	});
	$(".btn-edit").click(function() {
		// Get input values
		var name = $("#reminder-name-edit").val();
		var day = $("#reminder-day-edit").val();
		var date = $("#reminder-date-edit").val();
		// remove dash for raw date
		date = date.replace(/-/g, "");
		console.log(date);
		// input validation
		if (name && day && date) {
			// get local storage data
			var data = getLocalStorage();
			// modify reminder data
			data[currentEditID].name = name;
			data[currentEditID].day = day;
			data[currentEditID].date = date;
			// modify local storage
			localStorage.setItem("reminder", JSON.stringify(data));
			// Refresh reminder list
			// Delete all existing content
			$("#reminder-list").empty();
			// reload data from local storage
			load();
			// Show reminder list & hide add menu
			$("#reminder-list").show();
			$(".edit-menu").hide();
			$(".alert-warning").hide();
		}
		else
			$(".alert-warning").show();
	});
});
// Delegation for newly added remind item
$(document).on("click",".dayCount",function() {
	// Hide all edit menu
	$(".edit").hide();
	$(".item").show();
	$(".dayCount").show();

	$(this).closest(".row").find(".edit").show();
	$(this).closest(".row").find(".item").hide();
	$(this).parent().find(".dayCount").hide();
	$(this).parent().find(".cancel").show();
});
$(document).on("click",".cancel",function() {
	// Hide all edit menu
	$(".edit").hide();
	$(".item").show();
	$(".dayCount").show();

	$(this).find(".edit").show();
	$(this).find(".item").hide();
	$(this).parent().find(".dayCount").show();
	$(this).parent().find(".cancel").hide();
});
// Edit menu functions
function edit(id) {
	// Show add menu
	$("#reminder-list").hide();
	$(".edit-menu").show();
	// Get data from local storage
	var data = getLocalStorage();
	// Set edit menu input fields to current reminder's data
	$("#reminder-name-edit").val(data[id].name);
	$("#reminder-day-edit").val(data[id].day);
	// reformat date
	var year = data[id].date.substring(0,4);
	var month = data[id].date.substring(4,6);
	var day = data[id].date.substring(6,8);
	var date = `${year}-${month}-${day}`;
	$("#reminder-date-edit").val(date);
	currentEditID = id;
}
function reset(id) {
	// Confirmation
	if (confirm("Reset confirmation, press OK to proceed.")) {
		// Get data from local storage
		var data = getLocalStorage();
		// Edit date array data to today
		data[id].date = moment().format("YYYYMMDD");
		// Make changes in local storage
		localStorage.setItem("reminder", JSON.stringify(data));
		// Refresh reminder list
		// Delete all existing content
		$("#reminder-list").empty();
		// reload data from local storage
		load();
		// Show reminder list & hide add menu
		$("#reminder-list").show();
		$(".add-menu").hide();
		$(".alert-warning").hide();
	}
}
function del(id) {
	// Confirmation
	if (confirm("Delete confirmation, press OK to proceed.")) {
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
// Main functions
function getLocalStorage() {
	// Get raw text from localStorage
	var raw_reminder = localStorage.getItem("reminder");
	// Parse it into an object array & return
	return JSON.parse(raw_reminder);
}
function load() {
	// Get data from localStorage
	var data = getLocalStorage();
	// First loop through data
	for (var i in data) {
		// Calculate days since reminder start
		var dayStart_y = data[i].date.substring(0,4);
		var dayStart_m = data[i].date.substring(4,6);
		var dayStart_d = data[i].date.substring(6,8);

		var given = moment(dayStart_y + "-" + dayStart_m + "-" + dayStart_d, "YYYY-MM-DD");
		var current = moment().startOf('day');

		var daysAgo = Math.abs(Math.round(moment.duration(given.diff(current)).asDays()));
		// Find percentage value of current day count & maximum day count
		var percentage = Math.round((daysAgo/data[i].day)*100);
		if (percentage > 100)
			percentage = 100;
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
						<span class="item">${data[i].name}</span>
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
	}
}
function init() {
	// Get data from local storage
	var data = getLocalStorage();
	// If data is null, make it into an empty array to avoid error at array.push
	if(!data)
		data = [];
	else
		load();
}
