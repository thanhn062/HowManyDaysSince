// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: calendar-alt;

// DAY COUNT SCRIPT
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
const widgetBGColor = new Color('000'); //Widget background color
const circleTextColor = new Color('#fff'); //Widget text color
// Progres circle colors
const bgCircleColorFasting = new Color('00382c')
const bgCircleColoreatingEnd = new Color('382e00') // bg circle color, full circle 382e00
const progressCircleColoreatingEnd = new Color('24ffd7')
const progressCircleColorFasting = new Color('FFD723')

const argsParam = args.widgetParameter
const fields = argsParam ? argsParam.split(',') : []
const time = fields[1] ? fields[1].split(':') : '13:00'

const device = Device
const lang = device.language()

const canvWidth = 15; // circle thickness
const canvRadius = 120; // circle radius

// Set canvas size & setting
canvas.size = new Size(canvSize, canvSize);
canvas.respectScreenScale = true;

// create widget object
let widget = new ListWidget();

widget.setPadding(0, 5, 1, 0);
loadWidget();
/*
let dayRadiusOffset = 60;

makeCircle(dayRadiusOffset,
    bgCircleColorFasting,
    progressCircleColoreatingEnd,
    Math.floor(50),
    circleTextColor)

drawText(
    'Fastenzeit endet in',
    circleTextColor,
    20, 22
)
drawText(
    "🧹",
    circleTextColor,
    140, 40
)

drawText(
    '3 / 10',
    circleTextColor,
    195, 22
)*/

//widget.backgroundColor = widgetBGColor
widget.addImage(canvas.getImage())
Script.setWidget(widget);
widget.presentSmall();
Script.complete();

// =========================
// declare global vars
let data = [], id = 0;

// Determine if the user is using iCloud.
let files = FileManager.local()
const iCloudInUse = files.isFileStoredIniCloud(module.filename)

// If so, use an iCloud file manager.
files = iCloudInUse ? FileManager.iCloud() : files

// Set path for data file
const pathToCode = files.joinPath(files.documentsDirectory(), "countUp.json")

// Read existing data
let content = files.readString(pathToCode);

// Fill data[] with file's content & parse it into an array
data = JSON.parse(content);

// Make new table, variables and table's setting
let table = new UITable();
let row, cell;
let dismissable = false && config.runsInApp;
table.showSeparators = true;

// Show table
loadTable();

// ========================
// Functions
// ========================

// Create new table and add create button and header to the table
async function loadTable() {
  // Create count button
  // +
  row = new UITableRow();
  row.isHeader = true;
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
  cell = row.addText("Day(s)");
  cell = row.addText("Expire in");
  cell.centerAligned();
  table.addRow(row);
  // load existing items from countUp.js
  // Loop through data array
  for (var i in data) {
    // Update id number from existing data
    id++;
    let daysAgo = await getDaysAgo(data[i].date);
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
  datePick = formatDate(datePick);
  // Prompt to get expire date
  prompt = new Alert();
  prompt.title = "Expiration Date";
  prompt.message = "Pick how many days for this count up to expire\n---\nThe counter will still count when it gets past the expiration date\n\nThis is mainly for visual display of the counter and showing your count progression";
  prompt.addAction("Ok");
  prompt.addTextField();
  await prompt.presentAlert();
  dateExpire = prompt.textFieldValue();
  // Data validation
  if (isNumeric(dateExpire)) {
    // Update id number
    id++;
    // Create item object
    obj = {"id": "" + id + "", "name":input,"date":datePick,"expire":dateExpire};
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
      };
  data.push(toAdd);
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
    alert.addAction("Cancel");
    let respond = await alert.presentAlert();
    if (respond == "0")
      resetCount(item.id);
    else if (respond == "1")
      deleteCount(item.id);
    else
      return

   }
  // get days ago
  let daysAgo = getDaysAgo(item.date);
  let cell;
  cell = row.addText(item.name + "");
  cell = row.addText(daysAgo + "");
  cell = row.addText((item.expire-daysAgo) + "");
  cell.centerAligned();
  table.addRow(row);
  table.reload();
}
// reset count from entry by id
function resetCount(id) {
  let today = moment().startOf('day');
  // Reformat Date object to string for storing
  today = formatDate(today);
  // Reset count date to today
  data[id-1].date = today;

  // update changes to file
  myJSON = JSON.stringify(data);
  files.writeString(pathToCode, myJSON);
  // remove all from table
  table.removeAllRows()
  // recreate the table
  loadTable(data);
  table.reload();
}
// delete count from entry by id
function deleteCount(id) {
  // remove item with id matched with id from data[]
  data = data.filter(item => item.id !== id);
  // Loop through and reassign id of data[] elements
  for (var i in data) {
    log(i);
    data[i].id = i;
  }
  // update changes to file
  myJSON = JSON.stringify(data);
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
  log(point[0]);
  // Circle setting
  bgCircleColor = new Color('00382c');
  fbCircleColor = new Color('24ffd7');

  // circle dimension is 120px H and 120px W
  outerD = 120;

  // Create 4 circles on 4 quadrants -----------
  for (var i = 0; i < 4; i++) {
    quad_X = point[i].x - outerD/2;
    quad_Y = point[i].y - outerD/2;
    // Outer circle quadrant 1
    circle = new Rect(quad_X,quad_Y,outerD,outerD);
    canvas.setStrokeColor(bgCircleColor);
    canvas.setLineWidth(canvWidth);
    canvas.strokeEllipse(circle);
    degree = 80;
    // Inner progress circle quadrant 1
    canvas.setFillColor(fbCircleColor);
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
  }

}
/*
function makeCircle(radiusOffset, bgCircleColor, fgCircleColor, degree, txtColor) {
    let ctr = new Point(canvSize / 2, canvSize / 2)
    // Outer circle
    CoordOffset = -90
    RadiusOffset = -90
    bgx = ctr.x - (canvRadius - radiusOffset) + 16;
    bgy = ctr.y - (canvRadius - radiusOffset) + 20;
    bgd = 2 * (canvRadius - radiusOffset);
    bgr = new Rect(
        bgx + CoordOffset,
        bgy + CoordOffset + 20,
        bgd,
        bgd
    );

    canvas.setStrokeColor(bgCircleColor);
    canvas.setLineWidth(canvWidth);
    canvas.strokeEllipse(bgr);

    // Inner circle
    canvas.setFillColor(fgCircleColor);
    for (t = 0; t < degree; t++) {
        rect_x = ctr.x + (canvRadius - radiusOffset) * sinDeg(t) - canvWidth / 2;
        rect_y = ctr.y - (canvRadius - radiusOffset) * cosDeg(t) - canvWidth / 2;
        rect_r = new Rect(
            rect_x - 72,
            rect_y - 50,
            canvWidth,
            canvWidth
        );
        canvas.fillEllipse(rect_r);
    }
}*/

function drawText(txt, txtColor, txtOffset, fontSize) {
    const txtRect = new Rect(
        canvTextSize / 2 + 25,
        txtOffset - canvTextSize / 2 - 65,
        canvSize,
        canvTextSize
    );
    canvas.setTextColor(txtColor);
    canvas.setFont(Font.boldSystemFont(fontSize));
    canvas.setTextAlignedLeft()
    canvas.drawTextInRect(txt, txtRect)
}

function sinDeg(deg) {
    return Math.sin((deg * Math.PI) / 180);
}

function cosDeg(deg) {
    return Math.cos((deg * Math.PI) / 180);
}

function pad(num) {
    return ("0" + parseInt(num)).substr(-2);
}
