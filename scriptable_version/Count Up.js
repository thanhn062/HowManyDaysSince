// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: calendar-alt;

const moment = importModule("lib/moment");
today = moment().format("YYYYMMDD");
today = today.replace(/-/g, "");

// Make new table
let table = new UITable();
let row, cell, count;
let dismissable = false && config.runsInApp;
table.showSeparators = true;

// Table header
row = new UITableRow();
row.isHeader = true;
row.height = 80;
table.addRow(row);
row.addText("Count Up").centerAligned();

// Create count list
// Add +
row = new UITableRow();
row.height = 80;
row.dismissOnSelect = dismissable;
row.onSelect = async () => {
  let count_1 = await createCount();
  let dayStart = count_1.date;
  let today = moment().startOf('day');
  let diff = today-dayStart;
  let daysAgo = await Math.round(moment.duration(diff).asDays())+1;
  if (daysAgo < 0) {
    let alert = new Alert()
    alert.title = "Error"
    alert.message = "You can't pick further than today."
    alert.addAction("Ok")
    await alert.presentAlert()
    return;
  }
  log(daysAgo);
}
row.addText("+").centerAligned();
table.addRow(row);
table.present();

// Functions
async function createCount() {
  let prompt = new Alert();
  prompt.title = "Count Title";
  prompt.message = "Limit 30 characters";
  prompt.addTextField();
  prompt.addAction("Ok");
  prompt.addCancelAction("Cancel");
  await prompt.presentAlert();
  input = prompt.textFieldValue();
  if (!input || input === "")
    return;
  let date = new DatePicker();
  let datePick = await date.pickDate();
  //let rawDate = formatDate(datePick);

  obj = {"name":input,"date":datePick};
  return obj;
}

// https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd/23593099#23593099
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join("");
}
/*
// Make new row
let row_1 = new UITableRow();
// Set row height to 80px
row_1.height = 80;
let cell;
cell = row_1.addButton("Add");
cell = row_1.addButton("2");
cell = row_1.addButton("3");
cell.centerAligned()

// Make 2nd row
let row_2 = new UITableRow();
row_2.height = 50;
cell = row_2.addText("hi");
cell.centerAligned();
// Add row into table
table.addRow(row_1);
table.addRow(row_2);*/
/*
let alert = new Alert()
alert.title = "My alert"
alert.message = "alert"
alert.addAction("Ok")
await alert.presentAlert()
*/
