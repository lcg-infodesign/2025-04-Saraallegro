let data;
let selected;

function preload() {
  data = loadTable("assets/vulcani.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight * 2);
  textFont("Futura");

  let params = getURLParams(); // vulcano: "NOME"

  // cerca nel CSV la riga con quel nome di vulcano
  if (params.vulcano) {
    selected = data.findRow(decodeURIComponent(params.vulcano), "Volcano Name");
  }
}

function draw() {
  background(30, 20, 15);

drawTitle();
drawVolcanoDetails();
}

function drawTitle() {
  push();
  fill(255, 240, 230)
  textSize(26);
  textAlign(CENTER, CENTER);

  if (selected) {
    text("VULCANI NEL MONDO: " + selected.getString("Volcano Name"), width / 2, 40);
  } else {
    text("VULCANO NON TROVATO", width / 2, 40);
  }
  pop();
}

// disegna tutte le informazioni del vulcano
function drawVolcanoDetails() {
  if (!selected) return; // esci se il vulcano non è stato trovato

  let country = selected.getString("Country");
  let type = selected.getString("Type");
  let elev = selected.getString("Elevation (m)");
  let status = selected.getString("Status");
  let erup = selected.getString("Last Known Eruption");
  let lat = selected.getString("Latitude");
  let lon = selected.getString("Longitude");

  push();
  fill(255, 245, 230);
  textSize(20);
  textAlign(LEFT, TOP);

  let startX = width / 2 - 200;
  let startY = 100;
  let lineHeight = 30;

  text(`Nome: ${selected.getString("Volcano Name")}`, startX, startY);
  text(`Paese: ${country}`, startX, startY + lineHeight);
  text(`Tipo: ${type}`, startX, startY + 2 * lineHeight);
  text(`Altitudine: ${elev} m`, startX, startY + 3 * lineHeight);
  text(`Stato: ${status}`, startX, startY + 4 * lineHeight);
  text(`Ultima eruzione: ${erup}`, startX, startY + 5 * lineHeight);
  text(`Latitudine: ${lat}`, startX, startY + 6 * lineHeight);
  text(`Longitudine: ${lon}`, startX, startY + 7 * lineHeight);

  pop();
}