import { gettingData } from "./Modules/GeocodingData.js";
import { DrawingMainCircle } from "./Modules/searchBoundry.js";
import { getSpecifiedDataOnEartgQuakes } from "./Modules/formattingEarthquakeData.js";
import { earthquakesClusterStyle } from "./Modules/settingClusterStyle.js";
import { createLegend } from "./Modules/interactiveLegend.js";
import { popupHandler } from "./Modules/popup.js";

let valSearch = document.querySelector("#geocode"); // input search bar

//#region opening and closing the list

let eachListElement = document.querySelector("ul");
window.addEventListener("click", removeList);
function removeList() {
  eachListElement.style.display = "none";
}

valSearch.addEventListener("input", addList);
function addList() {
  eachListElement.style.display = "block";
}
//#endregion

let searchTimer;
let listPlaces = document.querySelector("#places"); // ul of search results
let coord;

// create map and add base map
const map = new ol.Map({
  view: new ol.View({
    center: [0, 0],
    zoom: 3,
  }),
  layers: [],
  target: "map",
});

var fullscreenControl = new ol.control.FullScreen();
var attributeControl = new ol.control.Attribution();

const lightStabia = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png",
  }),
  layerName: "stadia",
  visible: true,
});

const stadia = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png",
  }),
  layerName: "stadia",
  visible: false,
});

map.addLayer(lightStabia);
map.addLayer(stadia);

map.addControl(attributeControl);
map.addControl(fullscreenControl);

//#region GeoCoding
let pin;
const pinLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
});
map.addLayer(pinLayer);

valSearch.addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    listPlaces.innerHTML = "";
    let dataPromise = gettingData(valSearch);
    dataPromise.then((data) => {
      data.features.forEach((f) => {
        let name = f.properties.display_name;
        let li = document.createElement("li");
        li.classList.add("dropdown-item");
        li.innerHTML = name;
        li.id = f.properties.osm_id;
        listPlaces.append(li);
        li.addEventListener("click", (e) => clickSearch(e, data.features));
      });
    });
  }, 1000);
});

function clickSearch(e, features) {
  let id = e.target.id;
  features.forEach((f) => {
    if (id == f.properties.osm_id) {
      pinLayer.getSource().removeFeature(pin);
      coord = ol.proj.transform(
        f.geometry.coordinates,
        "EPSG:4326",
        "EPSG:3857"
      );
      map.getView().animate({ center: coord }, { zoom: 6 });
      pin = new ol.Feature({
        geometry: new ol.geom.Point(coord),
      });
      pin.setStyle(
        new ol.style.Style({
          image: new ol.style.Icon({
            src: "pin.png",
            scale: 0.07,
          }),
        })
      );
      pinLayer.getSource().addFeature(pin);
    }
  });
}

let startingDate;
let endingDate;
let searchingRadius;
let maxradiuskm = document.getElementById("searchRadius");
let startDate = document.getElementById("startDate");
let endDate = document.getElementById("endDate");
let submitButton = document.getElementById("submitButton");
let mainCircleLayer;
let CenterCoord;
let vectorEarthquakes;
let mappingEarthQuakes;
let mapLegend = document.getElementById("legend");
let minMagnitude = false;
let avgMagnitude = false;
let maxMagnitude = false;
let earthquakesFormattedPlusInfo;

maxradiuskm.addEventListener("input", (e) => {
  searchingRadius = parseFloat(e.target.value);
});
startDate.addEventListener("input", (e) => {
  startingDate = e.target.value;
});
endDate.addEventListener("input", (e) => {
  endingDate = e.target.value;
});

let icon;
let sizeOfIcon;
let sizeOfText;

submitButton.addEventListener("click", (e) => {
  map.removeLayer(mappingEarthQuakes);
  console.log(coord);
  let coordPlusSeachBoundry = DrawingMainCircle(
    coord,
    CenterCoord,
    searchingRadius,
    mainCircleLayer,
    map
  );
  mainCircleLayer = coordPlusSeachBoundry[2];
  CenterCoord = coordPlusSeachBoundry[0];
  console.log(CenterCoord);
  let lat = CenterCoord[1];
  let lon = CenterCoord[0];
  fetch(
    `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startingDate}&endtime=${endingDate}&latitude=${lat}&longitude=${lon}&maxradiuskm=${searchingRadius}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      earthquakesFormattedPlusInfo = getSpecifiedDataOnEartgQuakes(
        data.features
      );
      minMagnitude = earthquakesFormattedPlusInfo[1];
      avgMagnitude = earthquakesFormattedPlusInfo[2];
      maxMagnitude = earthquakesFormattedPlusInfo[3];
      createLegend(
        earthquakesFormattedPlusInfo[0],
        mapLegend,
        minMagnitude,
        avgMagnitude,
        maxMagnitude
      );
      vectorEarthquakes = new ol.source.Vector({
        features: earthquakesFormattedPlusInfo[0],
      });
      let clusteringEarthquakes = new ol.source.Cluster({
        source: vectorEarthquakes,
        distance: 50,
        minDistance: 40,
      });
      mappingEarthQuakes = new ol.layer.Vector({
        source: clusteringEarthquakes,
        style: (cluster) =>
          earthquakesClusterStyle(cluster, icon, sizeOfIcon, sizeOfText),
      });
      mappingEarthQuakes.getSource().addFeature(coordPlusSeachBoundry[1]);
      map.addLayer(mappingEarthQuakes);
      popupHandler(map);
    });
  document.querySelector(".leg").style.display = "inline-block";
});

//#region // ////////////////darkmode/////////////////////////////////////////////
const toggleDarkMode = document.querySelector(".toggle-darkmode");
const toggleText = document.querySelector(".toggle-text");

let darkMode = 0;
let header = document.querySelector(".header");
// Set Dark Mode
const enableDarkMode = () => {
  document.body.classList.add("darkmode");
  toggleText.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-sun-fill" viewBox="0 0 16 16"><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>Light';
  darkMode = 1;
  toggleText.style.color = "#222831";
  toggleText.style.backgroundColor = "#eee";
  stadia.setVisible(true);
  lightStabia.setVisible(false);
  document.querySelector(".sub").style.color = "black";
  header.style.color = "black";
};

// Disable Dark Mode
const disableDarkMode = () => {
  document.body.classList.remove("darkmode");
  toggleText.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon-fill" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/></svg>Dark';
  darkMode = 0;
  toggleText.style.color = "#eee";
  toggleText.style.backgroundColor = "#222831";
  stadia.setVisible(false);
  lightStabia.setVisible(true);
  header.style.color = "white";
  document.querySelector(".sub").style.color = "white";
};

// Add Event Listener
toggleDarkMode.addEventListener("click", () => {
  if (darkMode !== 1) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});
//#endregion
