var map = L.map('mapid');
map.setView(new L.LatLng(42.351486, -71.066829), 11);
// L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png').addTo(map);
// L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png').addTo(map);
// L.tileLayer('https://cartocdn_{s}.global.ssl.fastly.net/base-eco/{z}/{x}/{y}.png').addTo(map);
L.tileLayer('https://cartocdn_{s}.global.ssl.fastly.net/base-antique/{z}/{x}/{y}.png').addTo(map);

//create panes for shapes
var shapePanes = map.createPane('shapes');
shapePanes.style.zIndex = 410;
shapePanes.style.pointerEvents = 'none';


var shapeMarkers = []
function drawShape(shape) {
    // console.log(shape)
    const shapeData = allData.shapes.find(d => d.key == shape.key)

    const shapeMarker = L.polyline(shapeData.value, {color:'#333',weight:2,opacity:.2,pane:'shapes'})
        .addTo(map);

    const serviceIds = shape.values.map(d => d.service_id)
    const tripList = shape.values.map(d => d.trip_id)
    const arrivals = d3.merge(allData.stopTimes_nestedBytrip.filter(d => tripList.includes(d.key)).map(d => d.value.arrivals).filter((d, i, v) => v.indexOf(d) === i))
    shapeMarkers.push({id:`shape${shape.key}`,service:serviceIds,arrivals:arrivals, marker:shapeMarker})
}