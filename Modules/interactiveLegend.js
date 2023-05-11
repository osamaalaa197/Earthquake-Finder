let pinDesc = document.createElement("label");
let minDesc = document.createElement("label");
let avgDesc = document.createElement("label");
let highDesc = document.createElement("label");
let pinLegend = document.createElement("img");
let minQuake = document.createElement("img");
let avgQuake = document.createElement("img");
let maxQuake = document.createElement("img");

function removeLegend() {
  if (pinDesc) {
    pinDesc.remove();
    pinLegend.remove();
  }
  if (minDesc) {
    minDesc.remove();
    minQuake.remove();
  }
  if (avgDesc) {
    avgDesc.remove();
    avgQuake.remove();
  }
  if (highDesc) {
    highDesc.remove();
    maxQuake.remove();
  }
}

function createLegend(
  features,
  mapLegend,
  minMagnitude,
  avgMagnitude,
  maxMagnitude
) {
  removeLegend();
  pinDesc.innerHTML = "";
  minDesc.innerHTML = "";
  avgDesc.innerHTML = "";
  highDesc.innerHTML = "";

  if (features.length === 0) {
    pinLegend.id = "pin-legend";
    pinLegend.src = "pin.png";
    pinDesc.innerHTML = "Chosen place <br>";
    mapLegend.appendChild(pinLegend);
    mapLegend.appendChild(pinDesc);
  } else {
    pinLegend.id = "pin-legend";
    pinLegend.src = "pin.png";
    pinDesc.innerHTML = "Chosen place <br>";
    mapLegend.appendChild(pinLegend);
    mapLegend.appendChild(pinDesc);
    if (minMagnitude === true) {
      minQuake.id = "min-legend";
      minQuake.src = "1.png";

      minDesc.innerHTML = "Low magnitude <3.5 <br>";
      mapLegend.appendChild(minQuake);
      mapLegend.appendChild(minDesc);
    } else if (mapLegend.contains(minQuake) && minMagnitude == false) {
      mapLegend.removeChild(minQuake);
    }
    if (avgMagnitude === true) {
      avgQuake.id = "avg-legend";
      avgQuake.src = "2.png";

      avgDesc.innerHTML = "Average magnitude 3.5:5 <br>";
      mapLegend.appendChild(avgQuake);
      mapLegend.appendChild(avgDesc);
    } else if (mapLegend.contains(avgQuake) && avgMagnitude == false) {
      mapLegend.removeChild(avgQuake);
    }
    if (maxMagnitude === true) {
      maxQuake.id = "max-legend";
      maxQuake.src = "3.png";

      highDesc.innerHTML = "High magnitude >5 <br>";
      mapLegend.appendChild(maxQuake);
      mapLegend.appendChild(highDesc);
    } else if (mapLegend.contains(maxQuake) && maxMagnitude == false) {
      mapLegend.removeChild(maxQuake);
    }
  }
}

export { createLegend };
