var baseUrl = window.location.pathname
zip.workerScriptsPath = `..${baseUrl}lib/zip/`;

const GTFSURL = 'https://www.mbta.com/uploadedfiles/MBTA_GTFS.zip'

fetch(GTFSURL).then(function(response) {
    return response.blob();
}).then(function(myBlob) {
    unzip(myBlob)
});

function unzip(blob) {
    // use a BlobReader to read the zip from a Blob object
    zip.createReader(new zip.BlobReader(blob), function(reader) {

        // get all entries from the zip
        reader.getEntries(function(entries) {
            console.log(entries)

            //get stop_times
            const stop_timesFile = entries.find(entry => entry.filename == 'stop_times.txt')

            stop_timesFile.getData(new zip.TextWriter(), function(stop_times) {

                allData.stop_times = d3.csvParse(stop_times, parseStop_times)
                allData.stopTimes_nestedBytrip = d3.nest()
                    .key(d => d.trip_id)
                    .rollup(leave => {
                        return {
                            // services:leave.map(e => e.service_id).filter((d, i, v) => v.indexOf(d) === i), 
                            arrivals: leave.map(e => e.arrival_time).filter((d, i, v) => v.indexOf(d) === i)
                        }
                    })
                    .entries(allData.stop_times);
                // console.log(allData.stopTimes_nestedBytrip)
                console.log('stop_times loaded')

                //get shapes
                const shapesFile = entries.find(entry => entry.filename == 'shapes.txt')
                shapesFile.getData(new zip.TextWriter(), function(shapes) {
                    allData.shapes = d3.nest()
                        .key(d => d.shape_id)
                        .rollup(d => d.map(e => [e.lat, e.lon]))
                        .entries(d3.csvParse(shapes, parseShape))
                    console.log('shapes loaded')

                    //get routes
                    const routesFile = entries.find(entry => entry.filename == 'routes.txt')
                    routesFile.getData(new zip.TextWriter(), function(routes) {

                        allData.routes = d3.csvParse(routes, parseRoute)
                        allData.routeIds = allData.routes.map(d => d.route_id)
                        console.log('routes loaded')

                        //get stops
                        const stopsFile = entries.find(entry => entry.filename == 'stops.txt')
                        stopsFile.getData(new zip.TextWriter(), function(stops) {

                            allData.stops = d3.csvParse(stops)
                            console.log('stops loaded')

                            //get trips
                            const tripsFile = entries.find(entry => entry.filename == 'trips.txt')
                            tripsFile.getData(new zip.TextWriter(), function(trips) {

                                allData.trips = d3.csvParse(trips, parseTrips)
                                console.log('trips loaded')

                                //get calendar
                                const calendarFile = entries.find(entry => entry.filename == 'calendar.txt')
                                calendarFile.getData(new zip.TextWriter(), function(calendar) {

                                    allData.calendar = d3.csvParse(calendar)
                                    allData.service = {
                                        monday: [],
                                        tuesday: [],
                                        wednesday: [],
                                        thursday: [],
                                        friday: [],
                                        saturday: [],
                                        sunday: []
                                    }
                                    allData.calendar.forEach(day => {
                                        if (day.monday == '1') allData.service.monday.push(day.service_id)
                                        if (day.tuesday == '1') allData.service.tuesday.push(day.service_id)
                                        if (day.wednesday == '1') allData.service.wednesday.push(day.service_id)
                                        if (day.thursday == '1') allData.service.thursday.push(day.service_id)
                                        if (day.friday == '1') allData.service.friday.push(day.service_id)
                                        if (day.saturday == '1') allData.service.saturday.push(day.service_id)
                                        if (day.sunday == '1') allData.service.sunday.push(day.service_id)
                                    })
                                    console.log('calendar loaded')
                                    console.log(allData)
                                    promise = Promise.resolve(allData)
                                    promise.then(function(value) {
                                        
                                        drawAllShapes()
                                        
                                    });


                                    // close the zip reader
                                    reader.close(function() {
                                        // onclose callback
                                    });

                                }, function(current, total) {
                                    // onprogress callback
                                });

                            }, function(current, total) {
                                // onprogress callback
                            });

                        }, function(current, total) {
                            // onprogress callback
                        });

                    }, function(current, total) {
                        // onprogress callback
                    });

                }, function(current, total) {
                    // onprogress callback
                });


            }, function(current, total) {
                // onprogress callback
            });


        });
    }, function(error) {
        // onerror callback
        console.log(error)
    });
}