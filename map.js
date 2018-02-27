var map = L.map('mapid');
map.setView(new L.LatLng(42.351486, -71.066829), 11);
// L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png').addTo(map);
// L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png').addTo(map);
// L.tileLayer('https://cartocdn_{s}.global.ssl.fastly.net/base-eco/{z}/{x}/{y}.png').addTo(map);
L.tileLayer('https://cartocdn_{s}.global.ssl.fastly.net/base-midnight/{z}/{x}/{y}.png').addTo(map);
// L.tileLayer('https://cartocdn_{s}.global.ssl.fastly.net/base-light-nolabels/{z}/{x}/{y}.png').addTo(map);
// L.tileLayer('https://cartocdn_{s}.global.ssl.fastly.net/base-antique/{z}/{x}/{y}.png').addTo(map);

//create panes for shapes
var shapePanes = map.createPane('shapes');
shapePanes.style.zIndex = 410;
shapePanes.style.pointerEvents = 'none';

var loader = document.querySelector('#drawingLoader')

var shapeMarkers = []
function drawShape(shape) {
    // console.log(shape)
    const shapeData = allData.shapes.find(d => d.key == shape.key)
    const routeId = shape.values[0].route_id
    
    const color = allData.routeMap.get(routeId).route_color || '#333'

    const shapeMarker = L.polyline(shapeData.value, {color:color,weight:2,opacity:.2,pane:'shapes'})
        .addTo(map);

    const serviceIds = shape.values.map(d => d.service_id)

    const tripList = shape.values.map(d => d.trip_id)
    const arrivals = d3.merge(allData.stopTimes_nestedBytrip
    	.filter(d => tripList.includes(d.key)).map(d => d.value.arrivals)
    	.filter((d, i, v) => v.indexOf(d) === i))

    const directionId = shape.values[0].direction_id

    shapeMarkers.push({id:`shape${shape.key}`,services:serviceIds,arrivals:arrivals,direction:directionId, marker:shapeMarker})
}

function drawAllShapes() {
	createDayFilter()

    const tripList = allData.stopTimes_nestedBytrip.map(d => d.key)
    const validTrips = allData.trips.filter(d => tripList.includes(d.trip_id) && allData.routeIds.includes(d.route_id))

    const validShapes = d3.nest()
        .key(d => d.shape_id)
        .entries(validTrips);
    // console.log(validTrips, validShapes)

    validShapes.forEach(shape => {
        drawShape(shape)
    })
    updateBytime('06:00')
    // console.log(shapeMarkers)
}