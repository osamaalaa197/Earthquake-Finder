function DrawingMainCircle(
  coord,
  CenterCoord,
  searchingRadius,
  mainCircleLayer,
  map
) {
  map.removeLayer(mainCircleLayer);
  CenterCoord = ol.proj.transform(coord, "EPSG:3857", "EPSG:4326");
  console.log(CenterCoord);
  let mainCircleCenter = ol.proj.fromLonLat(CenterCoord);
  console.log(mainCircleCenter);
  let mainCircle = new ol.Feature(
    new ol.geom.Circle(mainCircleCenter, searchingRadius * 2000)
  );
  mainCircleLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [mainCircle],
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "blue",
        width: 5,
      }),
      fill: new ol.style.Fill({
        color: "rgba(0, 0, 255, 0.05)",
      }),
    }),
  });
  map.addLayer(mainCircleLayer);
  return [CenterCoord, mainCircle, mainCircleLayer];
}

export { DrawingMainCircle };
