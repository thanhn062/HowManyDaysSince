// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: hourglass-half;

// Title: Date Hourglass
// todo color code , red, orange, green, ios tone
const moment = importModule("lib/moment");
// =========================
// WIDGET
// =========================
// declare canvas object and canvas setting
const canvSize = 282;
const canvTextSize = 40;
const canvas = new DrawContext();
canvas.opaque = false
// widget appearance
const widgetBGColor = new Color('222222'); //Widget background color
const circleTextColor = new Color('#fff'); //Widget text color
// Progres circle colors
const bgCircleColorFasting = new Color('00382c')
const bgCircleColoreatingEnd = new Color('382e00') // bg circle color, full circle 382e00
const progressCircleColoreatingEnd = new Color('24ffd7')
const progressCircleColorFasting = new Color('FFD723')

const argsParam = args.widgetParameter
const canvWidth = 15; // circle thickness
const canvRadius = 120; // circle radius

// Set canvas size & setting
canvas.size = new Size(canvSize, canvSize);
canvas.respectScreenScale = true;

// create widget object
let widget = new ListWidget();
widget.setPadding(0, 5, 1, 0);

// declare global vars
var data = [], id = -1;

// Determine if the user is using iCloud.
let files = FileManager.local()
const iCloudInUse = files.isFileStoredIniCloud(module.filename)

// If so, use an iCloud file manager.
files = iCloudInUse ? FileManager.iCloud() : files

// Set path for data file
const pathToCode = files.joinPath(files.documentsDirectory(), "dateHourglass.json")
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
// load widget
loadWidget();

widget.backgroundColor = widgetBGColor
widget.addImage(canvas.getImage())
Script.setWidget(widget);
Script.complete();

// Show table
loadTable();
// ========================
// Functions
// ========================
// Switch id of entries for reorganize
function moveCount(direction,targetId) {
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
    log("hi");
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
    log(data);

    // Save changes to file & reloadTable
    myJSON = JSON.stringify(data);
    files.writeString(pathToCode, myJSON);
    table.removeAllRows();
    loadTable();
    table.reload();
  }

}
// Create new table and add create button and header to the table
async function loadTable() {
  // View Widget Preview
  row = new UITableRow();
  row.height = 50;
  row.dismissOnSelect = dismissable;
  row.onSelect = () => {
    widget.presentSmall();
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
    let count = await createCount();
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
  id = -1;
  for (var i in data) {
    // Update id number from existing data
    id++;
    //let daysAgo = await getDaysAgo(data[i].date);
    addToTable(data[i]);
  }
  // Show table
  table.present();
}
// create Count Object
async function createCount() {
  let prompt = new Alert();
  // Prompt to get count's name
  prompt.title = "Item Title";
  prompt.message = "Limit 30 characters\n";
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
    // Update id number
    id++;
    // Ask for an image
    let img_dir = await DocumentPicker.openFile(["public.folder"]);
    // Create item object
    obj = {"id": "" + id + "", "name":input,"date":datePick,"expire":dateExpire,"img":img_dir};
    addToData(obj);
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
// add new entry object to data
function addToData(item) {
  toAdd =
      {
        "id": "" + id + "",
        "name": item.name,
        "date": item.date,
        "expire": item.expire,
        "img": item.img
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
// add new entry object to table
function addToTable(item) {
  // Make new row
  let row = new UITableRow();
  row.height = 80;
  row.dismissOnSelect = dismissable;
  row.onSelect = async () => {
    let alert = new Alert()
    //alert.title = "Test";
    //alert.message = "";
    alert.addAction("Reset");
    alert.addAction("Delete");
    alert.addAction("Move Up");
    alert.addAction("Move Down");
    alert.addAction("Cancel");
    let respond = await alert.presentAlert();
    if (respond == "0") // Reset
      resetCount(item.id);
    else if (respond == "1") // Delete
      deleteCount(item.id);
    else if (respond == "2") // Move up
      moveCount("up", item.id);
    else if (respond == "3") // Move down
      moveCount("down", item.id);
    else
      return;
   }
  // get days ago
  let daysAgo = getDaysAgo(item.date);
  // Display hourglass entry
  let cell;
  // get image
  //let image = files.readImage(files.documentsDirectory() + "/images/toothbrush.png")
  let image = files.readImage(item.img);

  cell = row.addImage(image);
  cell = row.addText(item.name + "");
  cell = row.addText(daysAgo + "/" + item.expire);
  cell.centerAligned();
  table.addRow(row);
  table.reload();
}
// reset count from entry by id
async function resetCount(id) {
  // Confirm
  let alert = new Alert();
  alert.title = "Confirmation";
  alert.message = "Are you sure ?";
  alert.addAction("Yes");
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
async function deleteCount(id) {
  // Confirm
  let alert = new Alert();
  alert.title = "Confirmation";
  alert.message = "Are you sure ?";
  alert.addAction("Yes");
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
function loadWidget() {
  // Get 4 center point of 4 quadrants
  let point = [];
  point[0] = new Point(canvSize / 4, canvSize / 4);
  point[1] = new Point(canvSize / 4*3, canvSize / 4);
  point[2] = new Point(canvSize / 4, canvSize / 4*3);
  point[3] = new Point(canvSize / 4*3, canvSize / 4*3);
  // Circle setting
  bgCircleColor = new Color('00382c');
  fbCircleColor = new Color('24ffd7');

  // circle dimension is 120px H and 120px W
  outerD = 120;

  // Create 4 circles on 4 quadrants -----------
  for (var i = 0; i < data.length; i++) {
    log(data[i]);
    quad_X = point[i].x - outerD/2;
    quad_Y = point[i].y - outerD/2;
    // Outer circle quadrant 1
    circle = new Rect(quad_X,quad_Y,outerD,outerD);
    canvas.setStrokeColor(bgCircleColor);
    canvas.setLineWidth(canvWidth);
    canvas.strokeEllipse(circle);
    // Inner progress circle quadrant 1
    canvas.setFillColor(fbCircleColor);
    // get daysAgo
    let daysAgo = getDaysAgo(data[i].date);
    // find percentage of daysAgo/expire
    let percentage = Math.ceil(daysAgo*100/data[i].expire);
    // Convert percentage into degree
    let degree = percentage*360/100;
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
    //let image = files.readImage(files.documentsDirectory() + "/images/toothbrush.png")
    //let image = files.readImage(files.documentsDirectory() + "/IMG_8546.jpg")
    let img_r = new Rect(point[i].x-35,point[i].y-35,70,70);
    canvas.drawImageInRect(image,img_r);
    // progress caption
    let txtColor = new Color('fff');
    const txtRect = new Rect(quad_X,quad_Y+105,120,120);
    canvas.setTextColor(txtColor);
    canvas.setFont(Font.boldSystemFont(18));
    canvas.setTextAlignedCenter();
    canvas.drawTextInRect(daysAgo + "/" + data[i].expire, txtRect);
    // Only load first 4 of the hourglass list
    if (i >= 4)
      break;
  }
}
function sinDeg(deg) {
    return Math.sin((deg * Math.PI) / 180);
}
function cosDeg(deg) {
    return Math.cos((deg * Math.PI) / 180);
}