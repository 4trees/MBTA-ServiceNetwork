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
            entries[9].getData(new zip.TextWriter(), function(stop_times) {
                // loader.querySelector('p').innerHTML = 'Preparing GTFS file'
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
                entries[8].getData(new zip.TextWriter(), function(shapes) {
                    // loader.querySelector('p').innerHTML = 'Loading shapes file'
                    // allData.shapes = d3.csvParse(shapes)
                    allData.shapes = d3.nest()
                        .key(d => d.shape_id)
                        .rollup(d => d.map(e => [e.shape_pt_lat, e.shape_pt_lon]))
                        .entries(d3.csvParse(shapes))
                    console.log('shapes loaded')

                    //get routes
                    entries[7].getData(new zip.TextWriter(), function(routes) {
                        // loader.querySelector('p').innerHTML = 'Loading routes file'
                        allData.routes = d3.csvParse(routes, parseRoute)
                        allData.routeIds = allData.routes.map(d => d.route_id)
                        console.log('routes loaded')

                        //get stops
                        entries[10].getData(new zip.TextWriter(), function(stops) {
                            // loader.querySelector('p').innerHTML = 'Loading stops file'
                            allData.stops = d3.csvParse(stops)
                            console.log('stops loaded')

                            //get trips
                            entries[12].getData(new zip.TextWriter(), function(trips) {
                                // loader.querySelector('p').innerHTML = 'Loading trips file'
                                allData.trips = d3.csvParse(trips, parseTrips)
                                console.log('trips loaded')

                                //get calendar
                                entries[1].getData(new zip.TextWriter(), function(calendar) {
                                    // loader.querySelector('p').innerHTML = 'Loading calendar file'
                                    allData.calendar = d3.csvParse(calendar)
                                    console.log('calendar loaded')
                                    console.log(allData)
                                    promise = Promise.resolve(allData)
                                    promise.then(function(value) {
                                        // pick(value).time('06:00:00')()
                                        // pick(value)()
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
    });
}