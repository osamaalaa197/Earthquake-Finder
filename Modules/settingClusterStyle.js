function earthquakesClusterStyle(cluster, icon, sizeOfIcon, sizeOfText) {
  let allquakes = cluster.get("features");
  let maxMagnitude = Number.NEGATIVE_INFINITY;
  allquakes.forEach((feature) => {
    let mag = feature.get("mag");
    if (mag > maxMagnitude) {
      maxMagnitude = mag;
    }
  });
  let eachFeature = allquakes.find(
    (feature) => feature.get("mag") === maxMagnitude
  );

  if (eachFeature.get("mag") < 3.5) {
    console.log(eachFeature.get("mag"));
    icon = "1.png";
    sizeOfIcon = 0.12;
    sizeOfText = 1.2;
  } else if (eachFeature.get("mag") > 3.5 && eachFeature.get("mag") < 5) {
    console.log(eachFeature.get("mag"));
    icon = "2.png";
    sizeOfIcon = 0.15;
    sizeOfText = 1.4;
  } else {
    console.log(eachFeature.get("mag"));
    icon = "3.png";
    sizeOfIcon = 0.18;
    sizeOfText = 1.6;
  }
  let count = allquakes.length.toString();
  return new ol.style.Style({
    image: new ol.style.Icon({
      src: icon,
      scale: sizeOfIcon,
      opacity: 0.75,
    }),
    text: new ol.style.Text({
      text: count,
      fill: new ol.style.Fill({
        color: "black",
      }),
      stroke: new ol.style.Stroke({
        color: "white",
      }),
      font: "Comic Sans",
      scale: sizeOfText,
    }),
  });
}
export { earthquakesClusterStyle };
