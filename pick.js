// function pick(allData) {
//     let calendar = [0, 1, 2, 3, 4, 5, 6]
//     let time = getSeconds('23:59:59')
//     // let readyData

//     function filter() {
//         // readyData = allData
//         map.getPane('shapes').innerHTML = ''
//         // console.log(map.getPane('shapes'))
//         console.log('drawing...')
//         const validStoptimes = allData.stop_times.filter(d => d.arrival_time <= time)
//         // const validStoptimes_nestedBytrip = d3.nest()
//         //     .key(d => d.trip_id)
//         //     .entries(validStoptimes);
//         // const validTripList = validStoptimes_nestedBytrip.map(d => d.key)
//         // const validTrips = allData.trips.filter(d => (d.shape_id != '') && validTripList.includes(d.trip_id) && allData.routeIds.includes(d.route_id) )
//         // const validShapeList = validTrips.map(d => d.shape_id).filter((d, i, v) => v.indexOf(d) === i)
//         // console.log(validTrips,validShapeList)

//         // validShapeList.forEach(shapeId => {
//         //     drawShape(shapeId)
//         // })
//         console.log('done')
//         // return readyData
//     }
//     filter.calendar = function(numArray) {
//         calendar = numArray;
//         return this;
//     }
//     filter.time = function(str) {
//         time = getSeconds(str);
//         return this;
//     }
//     return filter
// }

function updateBytime(time) {
    const timeValue = time * 3600
    updateShapes(timeValue)
}
function updateShapes(time){
    const countShapes = shapeMarkers.length
    for(i = 0; i < countShapes; i++){
        const thisShape = shapeMarkers[i]
        const opacity = thisShape.arrivals.some(d => d <= time) ? .2 : 0
        thisShape.marker.setStyle({opacity:opacity})
    }
    loader.classList.add('sr-only')
}

function drawAllShapes() {
    // loader.querySelector('p').innerHTML = 'Preparing map'
    const tripList = allData.stopTimes_nestedBytrip.map(d => d.key)
    const validTrips = allData.trips.filter(d => tripList.includes(d.trip_id) && allData.routeIds.includes(d.route_id))

    // const shapeList = validTrips.map(d => d.shape_id).filter((d, i, v) => v.indexOf(d) === i)
    const validShapes = d3.nest()
        .key(d => d.shape_id)
        .entries(validTrips);
    // console.log(validTrips, validShapes)

    validShapes.forEach(shape => {
        drawShape(shape)
    })
    updateBytime(6)
    // console.log(shapeMarkers)
}