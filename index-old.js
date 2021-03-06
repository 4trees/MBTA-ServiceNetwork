//change zip to api.mbtace.com real-time api
//promise
//factory function
//canvas


// this part is to make alldata.json format
const path = window.location.href + 'gtfs/'
var [stop_times, trips, calendar, routes, shapes, stops] = [
    path + "stop_times.txt",
    path + "trips.txt",
    path + "calendar.txt",
    path + "routes.txt",
    path + "shapes.txt",
    path + "stops.txt"
]

fetchCsv = (url, parse) => {
    // console.log(url)
    return new Promise((resolve, reject) => {
        d3.csv(url, parse, (err, data) => {
            // console.log(url)
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }

        })
    })
}
var allData = {}
Promise.all([
    fetchCsv(stop_times, parseStop_times),
    fetchCsv(trips, parseTrips),
    fetchCsv(routes, parseRoute),
    fetchCsv(shapes, parseShape),
    fetchCsv(stops, parseStop),

]).then(([stopTimesData, tripData, routeData, shapeData, stopData]) => {

    allData.stop_times = stopTimesData
    allData.stopTimes_nestedBytrip = d3.nest()
        .key(d => d.trip_id)
        .rollup(leave => {
            return {
                // services:leave.map(e => e.service_id).filter((d, i, v) => v.indexOf(d) === i), 
                arrivals: leave.map(e => e.arrival_time).filter((d, i, v) => v.indexOf(d) === i)
            }
        })
        .entries(allData.stop_times);
    allData.shapes = d3.nest()
        .key(d => d.shape_id)
        .rollup(d => d.map(e => [e.lat, e.lon]))
        .entries(shapeData)
    allData.routes = routeData
    allData.routeIds = allData.routes.map(d => d.route_id)
    // allData.routeMap = d3.map(allData.routes, d => d.route_id)
    allData.stops = stopData
    // allData.trips = tripData

    //this part is to improve the alldata.json 
    const tripList = allData.stopTimes_nestedBytrip.map(d => d.key)
    const validTrips = tripData.filter(d => tripList.includes(d.trip_id) && allData.routeIds.includes(d.route_id))

    allData.validShapes = d3.nest()
        .key(d => d.shape_id)
        .entries(validTrips);
    //end: this part is to improve the alldata.json 

    allData.service = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
    }

    return allData
}).then(data => {
    fetchCsv(calendar, parseCalendar).then(calendarData => {

        allData.calendar = calendarData

        function download(content, fileName, contentType) {
            var a = document.createElement("a");
            var file = new Blob([JSON.stringify(content, null, 2)], { type: contentType });
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
        }
        download({
            service:allData.service,
            stopTimes_nestedBytrip: allData.stopTimes_nestedBytrip,
            validShapes: allData.validShapes,
            routes: allData.routes,
            shapes:allData.shapes,
            }, 'data.txt', 'text/plain');

        drawAllShapes()
    })

})
// end - this part is to make alldata.json format


// function unzip(blob) {
//     // use a BlobReader to read the zip from a Blob object
//     zip.createReader(new zip.BlobReader(blob), function(reader) {

//         // get all entries from the zip
//         reader.getEntries(function(entries) {
//             console.log(entries)

//             //get stop_times
//             const stop_timesFile = entries.find(entry => entry.filename == 'stop_times.txt')

//             stop_timesFile.getData(new zip.TextWriter(), function(stop_times) {

//                 allData.stop_times = d3.csvParse(stop_times, parseStop_times)
//                 allData.stopTimes_nestedBytrip = d3.nest()
//                     .key(d => d.trip_id)
//                     .rollup(leave => {
//                         return {
//                             // services:leave.map(e => e.service_id).filter((d, i, v) => v.indexOf(d) === i), 
//                             arrivals: leave.map(e => e.arrival_time).filter((d, i, v) => v.indexOf(d) === i)
//                         }
//                     })
//                     .entries(allData.stop_times);
//                 // console.log(allData.stopTimes_nestedBytrip)
//                 console.log('stop_times loaded')

//                 //get shapes
//                 const shapesFile = entries.find(entry => entry.filename == 'shapes.txt')
//                 shapesFile.getData(new zip.TextWriter(), function(shapes) {
//                     allData.shapes = d3.nest()
//                         .key(d => d.shape_id)
//                         .rollup(d => d.map(e => [e.lat, e.lon]))
//                         .entries(d3.csvParse(shapes, parseShape))
//                     console.log('shapes loaded')

//                     //get routes
//                     const routesFile = entries.find(entry => entry.filename == 'routes.txt')
//                     routesFile.getData(new zip.TextWriter(), function(routes) {

//                         allData.routes = d3.csvParse(routes, parseRoute)
//                         allData.routeIds = allData.routes.map(d => d.route_id)
//                         allData.routeMap = d3.map(allData.routes, d => d.route_id)
//                         console.log('routes loaded')

//                         //get stops
//                         const stopsFile = entries.find(entry => entry.filename == 'stops.txt')
//                         stopsFile.getData(new zip.TextWriter(), function(stops) {

//                             allData.stops = d3.csvParse(stops)
//                             console.log('stops loaded')

//                             //get trips
//                             const tripsFile = entries.find(entry => entry.filename == 'trips.txt')
//                             tripsFile.getData(new zip.TextWriter(), function(trips) {

//                                 allData.trips = d3.csvParse(trips, parseTrips)
//                                 console.log('trips loaded')

//                                 //get calendar
//                                 const calendarFile = entries.find(entry => entry.filename == 'calendar.txt')
//                                 calendarFile.getData(new zip.TextWriter(), function(calendar) {

//                                     allData.service = {
//                                         monday: [],
//                                         tuesday: [],
//                                         wednesday: [],
//                                         thursday: [],
//                                         friday: [],
//                                         saturday: [],
//                                         sunday: []
//                                     }
//                                     allData.calendar = d3.csvParse(calendar, parseCalendar)

//                                     console.log('calendar loaded')
//                                     console.log(allData)
//                                     promise = Promise.resolve(allData)
//                                     promise.then(function(value) {

//                                         drawAllShapes()

//                                     });


//                                     // close the zip reader
//                                     reader.close(function() {
//                                         // onclose callback
//                                     });

//                                 }, function(current, total) {
//                                     // onprogress callback
//                                 });

//                             }, function(current, total) {
//                                 // onprogress callback
//                             });

//                         }, function(current, total) {
//                             // onprogress callback
//                         });

//                     }, function(current, total) {
//                         // onprogress callback
//                     });

//                 }, function(current, total) {
//                     // onprogress callback
//                 });


//             }, function(current, total) {
//                 // onprogress callback
//             });


//         });
//     }, function(error) {
//         // onerror callback
//         console.log(error)
//     });
// }