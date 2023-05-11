function getSpecifiedDataOnEartgQuakes(
  earthquakes,
  minMagnitude,
  avgMagnitude,
  maxMagnitude
) {
  let allEarthQuakes = [];
  minMagnitude = false;
  avgMagnitude = false;
  maxMagnitude = false;
  earthquakes.forEach((quake) => {
    let lon = quake.geometry.coordinates[0];
    let lat = quake.geometry.coordinates[1];
    let mag = quake.properties.mag;
    if (mag <= 3.5) {
      minMagnitude = true;
    } else if (mag > 3.5 && mag <= 5) {
      avgMagnitude = true;
    } else if (mag > 5) {
      maxMagnitude = true;
    }
    let id = quake.id;
    let title = quake.properties.title;
    let myquake = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857")
      ),
      mag,
      id,
      title,
    });
    allEarthQuakes.push(myquake);
  });
  return [allEarthQuakes, minMagnitude, avgMagnitude, maxMagnitude];
}

export { getSpecifiedDataOnEartgQuakes };
