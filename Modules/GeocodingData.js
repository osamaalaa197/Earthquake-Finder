function gettingData(valSearch) {
  return fetch(
    `https://nominatim.openstreetmap.org/search?q=${valSearch.value}&format=geojson`
  )
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
}

function clickSearch(
  e,
  features,
  locationPin,
  locationPinLayer,
  coordinates,
  map
) {
  let id = e.target.id;
  features.forEach((f) => {
    if (id == f.properties.osm_id) {
      locationPinLayer.getSource().removeFeature(locationPin);
      coordinates = ol.proj.transform(
        f.geometry.coordinates,
        "EPSG:4326",
        "EPSG:3857"
      );
      map.getView().animate({ center: coordinates }, { zoom: 6 });
      locationPin = new ol.Feature({
        geometry: new ol.geom.Point(coordinates),
      });
      locationPin.setStyle(
        new ol.style.Style({
          image: new ol.style.Icon({
            src: "pin.png",
            scale: 0.07,
          }),
        })
      );
      locationPinLayer.getSource().addFeature(locationPin);
    }
  });
}

export { gettingData, clickSearch };
