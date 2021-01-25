// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: calendar-alt;

const moment = importModule("lib/moment");
today = moment().format("YYYYMMDD");
today = today.replace(/-/g, "");
// Make new table
let table = new UITable();
let row, cell;
let dismissable = false && config.runsInApp;
table.showSeparators = true;

// Create count item button
// +
row = new UITableRow();
row.height = 80;
row.dismissOnSelect = dismissable;
row.onSelect = async () => {
  // Create count item object
  let count = await createCount();
  // Dsiplay count item to table
  addToTable(count);
  if (daysAgo < 0) {
    alert = new Alert()
    alert.title = "Error";
    alert.addAction("Ok");
    alert.message = "You can't pick further than today.";
    await alert.presentAlert();
    return;
  }
}
row.addText("+").centerAligned();
table.addRow(row);

// Table header
row = new UITableRow();
row.isHeader = true;
row.height = 80;
cell = row.addText("Name");
cell = row.addText("day(s) ago");
cell = row.addText("Expire in");
cell.centerAligned();
table.addRow(row);

// Show table
table.present();

// Functions
function getDaysAgo(date) {
  // Calculate how many days ago from today
  let dayStart = date;
  let today = moment().startOf('day');
  let diff = today-dayStart;
  let daysAgo = Math.round(moment.duration(diff).asDays())+1;

  return daysAgo
}
function addToTable(item) {
  // Make new row
  let row = new UITableRow();
  row.height = 80;
  row.dismissOnSelect = dismissable;
  // get days ago
  let daysAgo = getDaysAgo(item.date);
  let cell;
  cell = row.addText(item.name);
  cell = row.addText(daysAgo + "");
  cell.centerAligned();
  cell = row.addText((item.expire-daysAgo) + "");
  cell.centerAligned();
  table.addRow(row);
  table.reload();
}
async function createCount() {
  let prompt = new Alert();
  // Prompt to get count's name
  prompt.title = "Item Title";
  prompt.message = "Limit 30 characters";
  prompt.addTextField();
  prompt.addAction("Ok");
  await prompt.presentAlert();
  input = prompt.textFieldValue();
  // Data validation
  if (!input || input === "")
    return;
  // Prompt to pick date
  prompt = new Alert();
  prompt.title = "Start Date";
  prompt.message = "Pick the start date for this count up";
  prompt.addAction("Ok");
  await prompt.presentAlert();
  let date = new DatePicker();
  let datePick = await date.pickDate();
  // Prompt to get expire date
  prompt = new Alert();
  prompt.title = "Expiration Date";
  prompt.message = "Pick how many days for this count up to expire\n---\nThe counter will still count when it gets past the expiration date\n\nThis is mainly for visual display of the counter and showing your count progression";
  prompt.addAction("Ok");
  prompt.addTextField();
  await prompt.presentAlert();
  dateExpire = prompt.textFieldValue();
  // Data validation
  if (isNumeric(dateExpire))
    obj = {"name":input,"date":datePick,"expire":dateExpire};
  else{
    prompt = new Alert();
    prompt.title = "Error";
    prompt.message = "Expiration date needs to be a number";
    prompt.addAction("Ok");
    return;
  }
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

// https://stackoverflow.com/questions/9716468/pure-javascript-a-function-like-jquerys-isnumeric
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
