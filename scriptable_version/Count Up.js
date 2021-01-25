// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: calendar-alt;
// DAY COUNT SCRIPT
const moment = importModule("lib/moment");
let data = [];
/*
today = moment().format("YYYYMMDD");
today = today.replace(/-/g, "");
*/
// Determine if the user is using iCloud.
let files = FileManager.local()
const iCloudInUse = files.isFileStoredIniCloud(module.filename)
// If so, use an iCloud file manager.
files = iCloudInUse ? FileManager.iCloud() : files
// Set path
const pathToCode = files.joinPath(files.documentsDirectory(), "countUp.json")
// Read existing data
let content = files.readString(pathToCode);
// Fill data[] with read file's data
data = JSON.parse(content);
loadTable(data);
//log(content);
//files.writeString(pathToCode, "Test1");
//if (!files.fileExists(pathToCode))
//  files.writeString(pathToCode, "Test1");
//else {
  // read the file duhj
//}
// Make new table
let table = new UITable();
let row, cell;
let dismissable = false && config.runsInApp;
table.showSeparators = true;
loadTable()
t

// Functions
function updateTable() {

}
async function loadTable() {
  // Create count button
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

  // Create table header
  row = new UITableRow();
  row.isHeader = true;
  row.height = 80;
  cell = row.addText("Name");
  cell = row.addText("day(s) ago");
  cell = row.addText("Expire in");
  cell.centerAligned();
  table.addRow(row);
  // Show table
  able.present();
}
function addData(item) {
  toAdd =
      {
        "name": item.name,
        "date": item.date,
        "expire": item.expire,
      };
  data.push(toAdd);
  // Write to file (TESTING)
  myJSON = JSON.stringify(data);
  files.writeString(pathToCode, myJSON);
}
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
  row.onSelect = async () => {
    let alert = new Alert()
    alert.title = "Test";
    alert.addAction("Ok");
    alert.message = item.name;
    alert.presentAlert();
  }
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
  // Push new count items to data[] array and write it into a file
  addData(item);
}
async function createCount() {
  let prompt = new Alert();
  // Prompt to get count's name
  prompt.title = "Item Title";
  prompt.message = "Limit 30 characters\n And then pick the start date for this count up";
  prompt.addTextField();
  prompt.addAction("Ok");
  await prompt.presentAlert();
  input = prompt.textFieldValue();
  // Data validation
  if (!input || input === "")
    return;
  // Pick date
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
    await prompt.presentAlert();
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
