let data;
let selected;
let backButton = {}; // oggetto per memorizzare le coordinate del pulsante

function preload() {
  data = loadTable("assets/vulcani.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Futura");

  let params = getURLParams();
  if (params.vulcano) {
    selected = data.findRow(decodeURIComponent(params.vulcano), "Volcano Name");
  }
}

function draw() {
  background(30, 20, 15);
  drawTitle();
  drawVolcanoDetails();
  drawBackButton();
}

function drawTitle() {
  push();
  fill(255, 240, 230);
  textSize(28);
  textAlign(CENTER, CENTER);
  if (selected) {
    text("VULCANO: " + selected.getString("Volcano Name"), width / 2, 60);
  } else {
    text("VULCANO NON TROVATO", width / 2, 60);
  }
  pop();
}

function drawVolcanoDetails() {
  if (!selected) return;

  // palette e dati
  let details = [
    { label: "NOME", value: selected.getString("Volcano Name"), color: color(255, 190, 160) },
    { label: "PAESE", value: selected.getString("Country"), color: color(245, 160, 130) },
    { label: "TIPO", value: selected.getString("Type"), color: color(220, 140, 110) },
    { label: "ALTITUDINE", value: selected.getString("Elevation (m)") + " m", color: color(200, 120, 90) },
    { label: "STATO", value: selected.getString("Status"), color: color(235, 180, 150) },
    { label: "ULTIMA ERUZIONE", value: selected.getString("Last Known Eruption"), color: color(210, 150, 120) },
    { label: "LATITUDINE", value: selected.getString("Latitude"), color: color(245, 210, 190) },
    { label: "LONGITUDINE", value: selected.getString("Longitude"), color: color(250, 220, 200) }
  ];

  let cols = 4;
  let rows = 2;
  let boxW = width / cols - 60;
  let boxH = 150;
  let spacingX = 30;
  let spacingY = 70;
  let leftMargin = (width - (cols * boxW + (cols - 1) * spacingX)) / 2;
  let topMargin = 160;

  push();
  textAlign(CENTER, CENTER);
  noStroke();

  for (let i = 0; i < details.length; i++) {
    let d = details[i];
    let col = i % cols;
    let row = floor(i / cols);

    let x = leftMargin + col * (boxW + spacingX);
    let y = topMargin + row * (boxH + spacingY);

    // rettangolo
    fill(d.color);
    rect(x, y, boxW, boxH, 14);

    // testo dentro il rettangolo
    fill(30, 20, 15);
    textSize(16);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text(d.label, x + boxW / 2, y + 25);

    textSize(14);
    textStyle(NORMAL);
    textAlign(CENTER, TOP);
    textWrap(WORD);
    text(d.value, x + boxW / 35, y + 70, boxW - 10);
  }

  pop();
}

function drawBackButton() {
  let w = 250;
  let h = 50;
  let x = width / 2 - w / 2;
  let y = height - 100;

  stroke(200, 150, 150);
  noFill();
  strokeWeight(2);
  rect(x, y, w, h, 10);

  fill(255, 240, 230);
  noStroke();
  textSize(18);
  textAlign(CENTER, CENTER);
  text("TORNA AI VULCANI", x + w / 2, y + h / 2);

  // salva coordinate per il click
  backButton = { x: x, y: y, w: w, h: h };
}

function mousePressed() {
  // se clicchi il bottone torna alla pagina principale
  if (
    mouseX > backButton.x &&
    mouseX < backButton.x + backButton.w &&
    mouseY > backButton.y &&
    mouseY < backButton.y + backButton.h
  ) {
    window.location.href = "index.html";
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
