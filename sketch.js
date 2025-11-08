let data;
let margin = 60;
let chartW, chartH;
let continents = ["AMERICA", "EUROPA", "AFRICA", "ASIA", "OCEANIA"];
let hoveredVolcano = null;
let volcanoPoints = []; //contiene tutti i punti dei vulcani

function preload() {
  data = loadTable("assets/vulcani.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight * 2);
  textFont("Futura");
  chartW = width * 0.9;
  chartH = 220; 
  buildVolcanoPoints(); // inizializza i punti dei vulcani
}

function draw() {
  background(30, 20, 15);
  fill(255, 240, 230);
  textSize(26);
  textAlign(CENTER, CENTER);
  text("VULCANI NEL MONDO", width / 2, margin - 10);

  // disegna legenda
  drawLegend();

  // disegna i 5 riquadri verticali
  let startY = margin + 150;
  for (let i = 0; i < continents.length; i++) {
    let x = margin;
    let y = startY + i * (chartH + 60);
    drawContinentBox(continents[i], x, y, chartW, chartH);
  }

  // se il mouse è sopra un vulcano, mostra il box info
  if (hoveredVolcano) showVolcanoInfo(hoveredVolcano);
}

// costruisce tutti i punti dei vulcani
function buildVolcanoPoints() {
  let startY = margin + 150;

   // posiziona i punti nel riquadro del continente
   for (let c = 0; c < continents.length; c++) {
    let continent = continents[c];
    let x0 = margin;
    let y0 = startY + c * (chartH + 60);
    let w = chartW;
    let h = chartH;

   // raccogli coordinate valide per calcolare min/max
    let allLat = [];
    let allLon = [];
    for (let i = 0; i < data.getRowCount(); i++) {
      let lat = parseFloat(data.getString(i, "Latitude"));
      let lon = parseFloat(data.getString(i, "Longitude"));
      if (!isNaN(lat) && !isNaN(lon) && getContinent(lat, lon) === continent) { //per capire a quale continente appartiene
        allLat.push(lat);
        allLon.push(lon);
      }
    }
    if (allLat.length === 0) continue;

    // valori estremi continenti paragonati ai singoli
    let minLat = min(allLat);
    let maxLat = max(allLat);
    let minLon = min(allLon);
    let maxLon = max(allLon);

    // costruisci i punti dei vulcani
    for (let i = 0; i < data.getRowCount(); i++) {
      let lat = parseFloat(data.getString(i, "Latitude"));
      let lon = parseFloat(data.getString(i, "Longitude"));
      if (isNaN(lat) || isNaN(lon)) continue;
      if (getContinent(lat, lon) !== continent) continue;

      let x = map(lon, minLon, maxLon, x0 + 20, x0 + w - 20);
      let y = map(lat, minLat, maxLat, y0 + h - 20, y0 + 40);

      volcanoPoints.push({
        x: x,
        y: y,
        row: i // memorizza la riga del CSV
      });
    }
  }
}

// disegna un singolo riquadro continente
function drawContinentBox(continent, x0, y0, w, h) {
  noFill();
  stroke(180, 120, 120);
  strokeWeight(1);
  rect(x0, y0, w, h);

  fill(255, 220, 200);
  noStroke();
  textSize(18);
  textAlign(LEFT, CENTER);
  text(continent, x0 + 10, y0 + 25);

  // disegna i vulcani all'interno del riquadro
  for (let v of volcanoPoints) {
    let lat = parseFloat(data.getString(v.row, "Latitude"));
    let lon = parseFloat(data.getString(v.row, "Longitude"));
    if (getContinent(lat, lon) !== continent) continue;

    let elev = parseFloat(data.getString(v.row, "Elevation (m)"));
    let x = v.x;
    let y = v.y;

    // colore dei puntini gradiente in base all'altitudine
    let t = map(elev, -6000, 7000, 0, 1);
    let col = lerpColor(color(245, 230, 220), color(255, 150, 150), constrain(t, 0, 1));
    col = lerpColor(col, color(200, 50, 50), constrain(t, 0, 1) * 0.5);

    // hover: se il mouse è vicino al puntino, coloralo di rosso e memorizza
    let d = dist(mouseX, mouseY, x, y);
    if (d < 6) {
      fill("red");
      hoveredVolcano = {
        x: x,
        y: y,
        row: v.row // memorizza la riga del CSV per poter leggere i dati
      };
    } else {
      fill(col);
    }

    // costruzione puntini
    noStroke();
    ellipse(x, y, 6);
  }
}

// hover box info vulcano
function showVolcanoInfo(v) {
  let i = v.row;
  let name = data.getString(i, "Volcano Name");
  let country = data.getString(i, "Country");
  let type = data.getString(i, "Type");
  let elev = data.getString(i, "Elevation (m)");
  let status = data.getString(i, "Status");
  let erup = data.getString(i, "Last Known Eruption");
  let lat = data.getString(i, "Latitude");
  let lon = data.getString(i, "Longitude");

  // per non sovrapporre le info al punto
  let infoX = v.x + 15;
  let infoY = v.y - 10;

  // creo il rettangolo per le informazioni
  fill(50, 200);
  stroke(200, 50, 50);
  strokeWeight(1);
  rect(infoX, infoY, 250, 130, 8);

  // metto il testo dentro il box
  noStroke();
  fill(255, 245, 230);
  textSize(12);
  textAlign(LEFT, TOP);
  text(
    `${name}\n${country}\nType: ${type}\nElevation: ${elev} m\nStatus: ${status}\nLast eruption: ${erup}\nLat: ${lat}, Lon: ${lon}`,
    infoX + 10,
    infoY + 10
  );
}

// funzione per stimare continente (in base alla longitudine e latitudine)
function getContinent(lat, lon) {
  if (lon < -30) return "AMERICA";
  if (lat > 35 && lon >= -30 && lon <= 60) return "EUROPA";
  if (lat < 35 && lon >= -30 && lon <= 60) return "AFRICA";
  if (lon > 60 && lon <= 150) return "ASIA";
  if (lon > 110 && lat < 0) return "OCEANIA";
}

// legenda
function drawLegend() {
  let legendW = chartW * 0.6;
  let legendH = 30;
  let legendX = width / 2 - legendW / 2;
  let legendY = margin + 50; // più spazio dal titolo

  // riquadro
  noFill();
  stroke(200, 150, 150);
  strokeWeight(1);
  rect(legendX, legendY, legendW, legendH);

  // barra gradiente
  for (let i = 0; i <= legendW; i++) {
    let inter = i / legendW;
    let c = lerpColor(color(245, 230, 220), color(255, 150, 150), inter);
    c = lerpColor(c, color(200, 50, 50), inter * 0.5);
    stroke(c);
    line(legendX + i, legendY + 3, legendX + i, legendY + legendH - 3);
  }

  // etichette
  noStroke();
  fill("white");
  textSize(12);
  textAlign(LEFT, CENTER);
  text("-6000 m", legendX, legendY + legendH + 12);
  textAlign(RIGHT, CENTER);
  text("+7000 m", legendX + legendW, legendY + legendH + 12);
}

// click sul puntino: apre page.html con il nome del vulcano
function mousePressed() {
  if (!hoveredVolcano) return; // niente se non c’è un puntino sotto il mouse

  // prendi il nome del vulcano dalla riga del CSV
  let vulcanoName = data.getString(hoveredVolcano.row, "Volcano Name");

  // costruisci l'URL
  let newURL = "page.html?vulcano=" + encodeURIComponent(vulcanoName);

  // redirect nella stessa scheda
  window.location.href = newURL;
}
