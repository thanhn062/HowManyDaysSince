// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: hourglass-half;

// Title: Date Hourglass
// change refresh rate to 12:01am everyday

const moment = importModule("lib/moment");
// =========================
// WIDGET
// =========================
// declare canvas object and canvas setting
const canvSize = 282;
const canvTextSize = 40;

// widget appearance
const widgetBGColor = new Color('222222'); //Widget background color
const circleTextColor = new Color('#fff'); //Widget text color
// Progres circle colors
// Background color
bgCircleColor = new Color('48484A');
// Foreground color
// Green
fgCircleColor_low = new Color('30D158');
// Orange ( if > 70% )
fgCircleColor_medium = new Color('FF9F0A');
// Red ( if > 90% )
fgCircleColor_high = new Color('FF453A');

const canvWidth = 15; // circle thickness
// ==========================

// declare global vars
var data = [], id = -1, fileName = "dateList_1.json";

// Determine if the user is using iCloud.
let files = FileManager.local()
const iCloudInUse = files.isFileStoredIniCloud(module.filename)

// If so, use an iCloud file manager.
files = iCloudInUse ? FileManager.iCloud() : files

// Set path for data file
const pathToCode = files.joinPath(files.documentsDirectory(), fileName)
let content = files.readString(pathToCode);
if (content == null)
  content = "[]";

// Fill data[] with file's content & parse it into an array
data = JSON.parse(content);

// Make new table, variables and table's setting
let table = new UITable();
let row, cell;
let dismissable = false && config.runsInApp;
table.showSeparators = true;

// Notification
notif = new Notification();
notif.title = "Date Hourglass";
notif.body = "";
notif.openURL = URLScheme.forRunningScript();
notif.scriptName = Script.name();
notif.sound = "default";
notif.threadIdentifier = Script.name();
// Send notification when # of days left is less than or equal this number
daysToAlert = 3;

// get today date & time
let today = new Date();
let tmr = new Date(today);
log(today);
// Set up next notification check for tomorrow morning at 7 AM
tmr.setDate(today.getDate()+1);
tmr.setHours(7);
tmr.setMinutes(0);
tmr.setSeconds(0);
notif.setTriggerDate(tmr);
/*
// Test
tmr.setSeconds(today.getSeconds()+20);
notif.setTriggerDate(tmr);
*/
log(tmr);

// Remove all pending noti of this script before schedule so it wont pop up twice
Notification.removePending(
  (await Notification.allPending())
    .filter(notif =>
      notif.threadIdentifier === Script.name()
    )
    .map(notif => notif.identifier)
);

// find hourglass that have sand amount of 3 days or less
for (var i in data) {
  // get daysAgo
  let daysAgo = getDaysAgo(data[i].date);
  let daysLeft = data[i].expire-daysAgo;

  if (daysAgo == data[i].expire)
    notif.body = "The sands have ran out for ⌛" + data[i].name;
  else if (daysLeft <= daysToAlert)
    notif.body = "The sands are running out in " + daysLeft + " days for ⏳" + data[i].name + "!";
  else if (daysAgo > data[i].expire) // ignore if hourglass ran out of sand
    return;
}
if (notif.body !== "")
  notif.schedule();

// load widget
loadWidget();
// Show table
loadTable();

// ========================
// Functions
// ========================

// create new table and add button + and headers to the table
async function loadTable() {
  // View Widget Preview
  row = new UITableRow();
  row.height = 50;
  row.dismissOnSelect = dismissable;
  row.onSelect = () => {
    loadWidget(1);
  }
  row.addText("View Widget Preview").centerAligned();
  table.addRow(row);
  // Create count button
  // +
  row = new UITableRow();
  row.isHeader = true;
  row.height = 80;
  row.dismissOnSelect = dismissable;
  row.onSelect = async () => {
    // Create count item object
    let count = await createEntry();
    // Display count item to table
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
  row.height = 70;
  cell = row.addText("Icon");
  cell = row.addText("Name");
  cell = row.addText("Days");
  cell.centerAligned();
  table.addRow(row);
  // load existing items from countUp.js
  // Loop through data array
  // id = -1;
  for (var i in data) {
    // Update id number from existing data
    id == i;
    addToTable(data[i]);
  }
  // Show table
  table.present();
}
// create hourglass Object
async function createEntry() {
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
  // Pick date
  let date = new DatePicker();
  let datePick = await date.pickDate();
  datePick = formatDate(datePick);
  // Prompt to get expire date
  prompt = new Alert();
  prompt.title = "Expiration Date";
  prompt.message = "Pick the sand amount (in days) for this hourglass";
  prompt.addAction("Ok");
  prompt.addTextField();
  await prompt.presentAlert();
  dateExpire = prompt.textFieldValue();
  // Data validation
  if (isNumeric(dateExpire)) {
    // Ask for an image
    let img_dir = await DocumentPicker.openFile(["public.folder"]);
    // Create item object
    obj = {"id": "" + id + "", "name":input,"date":datePick,"expire":dateExpire,"img":img_dir};
    toAdd =
        {
          "id": "" + id + "",
          "name": obj.name,
          "date": obj.date,
          "expire": obj.expire,
          "img": obj.img
        };
    data.push(toAdd);
    // Loop through and reassign id of data[] elements
    for (var i in data) {
      data[i].id = i;
    }
    // Write to file
    myJSON = JSON.stringify(data);
    files.writeString(pathToCode, myJSON);
  }
  else{
    prompt = new Alert();
    prompt.title = "Error";
    prompt.message = "Expiration date need to be a number";
    prompt.addAction("Ok");
    await prompt.presentAlert();
    return;
  }
  return obj;
}
// edit entry expiration date
async function editEntry(id) {
  let prompt = new Alert();
  prompt.title = "Edit Expiration";
  prompt.addTextField(data[id].expire);
  prompt.addAction("Ok");
  await prompt.presentAlert();
  input = prompt.textFieldValue();
  // Data validation
  if (!input || input === "")
  return;
  // Data validation
  if (isNumeric(input)) {
    // Change data
    data[id].expire = input;

    // Write to file
    myJSON = JSON.stringify(data);
    files.writeString(pathToCode, myJSON);

    // Display new data
    table.removeAllRows();
    loadTable();
  }
  else {
    prompt = new Alert();
    prompt.title = "Error";
    prompt.message = "Expiration date need to be a number";
    prompt.addAction("Ok");
    await prompt.presentAlert();
    return;
  }
}
// reset count from entry by id
async function resetEntry(id) {
  // Confirm
  let alert = new Alert();
  alert.title = "Confirmation";
  alert.message = "Are you sure ?";
  alert.addDestructiveAction("Yes");
  alert.addAction("No");
  let respond = await alert.presentAlert();
  if (respond == "1")
    return;
  // get today Date object
  let today = moment().startOf('day');
  // Reformat Date object to string for storing
  today = formatDate(today);
  // Reset count date to today
  data[id].date = today;
  // update changes to file
  myJSON = await JSON.stringify(data);
  files.writeString(pathToCode, myJSON);
  // remove all from table
  table.removeAllRows()
  // recreate the table
  loadTable(data);
  table.reload();
}
// delete count from entry by id
async function deleteEntry(id) {
  // Confirm
  let alert = new Alert();
  alert.title = "Confirmation";
  alert.message = "Are you sure ?";
  alert.addDestructiveAction("Yes");
  alert.addAction("No");
  let respond = await alert.presentAlert();
  if (respond == "1")
    return;
  // remove item with id matched with id from data[]
  data = await data.filter(item => item.id !== id);
  // Loop through and reassign id of data[] elements
  for (var i in data) {
    data[i].id = await i;
  }
  // update changes to file
  myJSON = await JSON.stringify(data);
  files.writeString(pathToCode, myJSON);
  // remove all from table
  table.removeAllRows()
  // recreate the table
  loadTable(data);
  table.reload();
}
// move entries up and down
function moveEntry(direction,targetId) {
  // Convert string to number
  targetId = parseInt(targetId);

  if (direction == "up") {
    // If at top
    if (targetId == 0) {
      let alert = new Alert();
      alert.title = "Error";
      alert.addAction("OK");
      alert.presentAlert();
      return;
    }
    let temp = data[targetId-1];
    data[targetId-1] = data[targetId];
    data[targetId] = temp;
    // Reorganize id
    for (var i in data) {
      data[i].id = i;
    }
    // Save changes to file & reloadTable
    myJSON = JSON.stringify(data);
    files.writeString(pathToCode, myJSON);
    table.removeAllRows();
    loadTable();
    table.reload();
  }
  else if (direction == "down") {
    // If at bottom
    if (targetId == data.length-1) {
      let alert = new Alert();
      alert.title = "Error";
      alert.addAction("OK");
      alert.presentAlert();
      return;
    }
    let temp = data[targetId+1];
    data[targetId+1] = data[targetId];
    data[targetId] = temp;
    // Reorganize id
    for (var i in data) {
      data[i].id = i;
    }

    // Save changes to file & reloadTable
    myJSON = JSON.stringify(data);
    files.writeString(pathToCode, myJSON);
    table.removeAllRows();
    loadTable();
    table.reload();
  }

}
// add new entry to tabel & data
function addToTable(item) {
  // Make new row
  let row = new UITableRow();
  row.height = 80;
  row.dismissOnSelect = dismissable;
  row.onSelect = async () => {
    let alert = new Alert()
    alert.addAction("Reset");
    alert.addAction("Delete");
    alert.addAction("Edit Expiration");
    alert.addAction("Move Up");
    alert.addAction("Move Down");
    alert.addAction("Cancel");
    let respond = await alert.presentAlert();
    if (respond == "0") // Reset
      resetEntry(item.id);
    else if (respond == "1") // Delete
      deleteEntry(item.id);
    else if (respond == "2") // Edit Expiration
      editEntry(item.id);
    else if (respond == "3") // Move up
      moveEntry("up", item.id);
    else if (respond == "4") // Move down
      moveEntry("down", item.id);
    else
      return;
  }
  // get days ago
  let daysAgo = getDaysAgo(item.date);
  // get image
  let image = files.readImage(item.img);

  let cell;
  cell = row.addImage(image);
  cell = row.addText(item.name);
  let daysLeft = item.expire-daysAgo;
  if (daysLeft > 0)
    cell = row.addText(daysAgo + "/" + item.expire, daysLeft + " days left");
  else
    cell = row.addText(daysAgo + "/" + item.expire, "" + Math.abs(daysLeft) + " days past");
  cell.centerAligned();
  table.addRow(row);
  table.reload();
}

// calculate days ago from today given the date
function getDaysAgo(date) {
  // Calculate how many days ago from today
  let dayStart = moment(date, "YYYY-MM-DD");
  let today = moment().startOf('day');
  let diff = today-dayStart;
  let daysAgo = Math.round(moment.duration(diff).asDays());
  return daysAgo
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

    return [year, month, day].join("-");
}
// https://stackoverflow.com/questions/9716468/pure-javascript-a-function-like-jquerys-isnumeric
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
// =======================
// Widget functions
// =======================
// Load basic display of count up widget
function loadWidget(preview = 0) {
  // Set canvas size & setting
  const canvas = new DrawContext();
  canvas.opaque = false
  canvas.size = new Size(canvSize, canvSize);
  canvas.respectScreenScale = true;

  // create widget object
  let widget = new ListWidget();
  widget.setPadding(0, 8, 1, 0);
  // Set refresh rate
  let nextRefresh = Date.now() + 1000*60; // add 60 second to now
  widget.refreshAfterDate = new Date(nextRefresh);

  // Get 4 center point of 4 quadrants
  let point = [];
  point[0] = new Point(canvSize / 4, canvSize / 4);
  point[1] = new Point(canvSize / 4*3, canvSize / 4);
  point[2] = new Point(canvSize / 4, canvSize / 4*3);
  point[3] = new Point(canvSize / 4*3, canvSize / 4*3);

  // circle dimension is 120px H and 120px W
  outerD = 120;

  // Create 4 circles on 4 quadrants -----------
  for (var i = 0; i < data.length; i++) {
    // Only load first 4 of the hourglass list
    if (i >= 4)
      break;

    // Get top left corner coordiate of circle box
    quad_X = point[i].x - outerD/2;
    quad_Y = point[i].y - outerD/2;
    // Background circle
    circle = new Rect(quad_X,quad_Y,outerD,outerD);
    canvas.setStrokeColor(bgCircleColor);
    canvas.setLineWidth(canvWidth);
    canvas.strokeEllipse(circle);
    // get daysAgo
    let daysAgo = getDaysAgo(data[i].date);
    // find percentage of daysAgo/expire
    let percentage = Math.ceil(daysAgo*100/data[i].expire);
    // Convert percentage into degree
    let degree = percentage*360/100;

    // Foreground progress circle
    // Display color of progress circle based on percentage of hourglass
    if (percentage >= 90)
      canvas.setFillColor(fgCircleColor_high);
    else if (percentage >= 70)
      canvas.setFillColor(fgCircleColor_medium);
    else
      canvas.setFillColor(fgCircleColor_low);

    for (t = 0; t < degree; t++) {
      prog_x = point[i].x + (60) * sinDeg(t) - canvWidth / 2;
      prog_y = point[i].y - (60) * cosDeg(t) - canvWidth / 2;
      prog_r = new Rect(
          prog_x,
          prog_y,
          canvWidth,
          canvWidth
        );
        canvas.fillEllipse(prog_r);
    }
    // Text
    /*
    // Emoji symbol (text base)
    let txtColor = new Color('fff');
    const txtRect = new Rect(
        quad_X+40,
        quad_Y+40,
        120,
        120
    );
    // Show Symbol
    canvas.setTextColor(txtColor);
    canvas.setFont(Font.boldSystemFont(40));
    canvas.setTextAlignedLeft();
    canvas.drawTextInRect("🌹", txtRect);
    */
    // Image symbol
    let files = FileManager.iCloud();
    let image = files.readImage(data[i].img);
    let img_r = new Rect(point[i].x-35,point[i].y-35,70,70);
    canvas.drawImageInRect(image,img_r);
    // progress caption
    let txtColor = new Color('fff');
    const txtRect = new Rect(quad_X,quad_Y+108,120,120);
    canvas.setTextColor(txtColor);
    canvas.setFont(Font.boldSystemFont(18));
    canvas.setTextAlignedCenter();
    canvas.drawTextInRect(daysAgo + "/" + data[i].expire, txtRect);
  }
  widget.backgroundColor = widgetBGColor
  widget.addImage(canvas.getImage())
  Script.setWidget(widget);
  Script.complete();
  if (preview == 1)
    widget.presentSmall();
}
function sinDeg(deg) {
    return Math.sin((deg * Math.PI) / 180);
}
function cosDeg(deg) {
    return Math.cos((deg * Math.PI) / 180);
}
