const rectangularPopup = document.querySelector(".popup");

const earthquakeBrief = new ol.Overlay({
  element: rectangularPopup,
  offset: [0, 10],
});

const selectInteraction = new ol.interaction.Select();

function popupHandler(map) {
  selectInteraction.on("select", function (event) {
    map.removeOverlay(earthquakeBrief);
    let selectedFeature = event.selected;
    let earthquakInfo = selectedFeature[0].values_.features[0].values_;
    let long = Math.ceil(earthquakInfo.geometry.flatCoordinates[0]);
    let lat = Math.ceil(earthquakInfo.geometry.flatCoordinates[1]);
    rectangularPopup.innerHTML = `
  <div style="text-align: center; font-weight: bold;">Earthquake Details</div>
  <ul style="list-style-type: none; padding: 0;">
    <li style="margin-bottom: 5px;">Name: ${earthquakInfo.title}</li>
    <li style="margin-bottom: 5px;">Epicenter: <br> Longtitude :${long} <br> Lattitude :${lat}</li>
    <li style="margin-bottom: 5px;">Magnitude: ${earthquakInfo.mag}</li>
  </ul>
`;
    map.addOverlay(earthquakeBrief);
    earthquakeBrief.setPosition(event.mapBrowserEvent.coordinate);
  });
  map.addInteraction(selectInteraction);
}

export { popupHandler };
