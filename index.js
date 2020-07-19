let allData;
const dataURL = 'gtfs/alldata.json'

fetchData = (url) => {
    // console.log(url)
    return new Promise((resolve, reject) => {
        d3.json(url, (err, data) => {
            // console.log(url)
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }

        })
    })
}

Promise.all([fetchData(dataURL)])
    .then(([alldata]) => {
        
        allData = alldata
        allData.routeMap = d3.map(allData.routes, d => d.route_id)
        console.log(alldata)
        drawAllShapes()
    })


