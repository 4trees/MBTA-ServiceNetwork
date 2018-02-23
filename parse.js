var promise, allData = {}

function getSeconds(str) {
    const strings = str.split(':')
    const seconds = (+strings[0]) * 3600 + (+strings[1]) * 60 + (+strings[2])
    return seconds
}

function parseStop_times(d) {
    return {
        arrival_time: getSeconds(d.arrival_time),
        stop_id: d.stop_id,
        trip_id: d.trip_id,
        service_id: d.service_id
    }
}

function parseTrips(d){
    if(d.shape_id == '')return
    return{
        route_id: d.route_id,
        service_id: d.service_id,
        trip_id: d.trip_id,
        trip_headsign: d.trip_headsign,
        direction_id: d.direction_id,
        shape_id: d.shape_id
    }
}

function parseRoute(d){
    if((+d.agency_id != 1) || (+d.route_type != 3))return

    return {
        route_id: d.route_id,
        route_short_name:d.route_short_name,
        route_color:d.route_color,
        route_text_color:d.route_text_color
    }
}