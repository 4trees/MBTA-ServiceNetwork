function updateBytime(time) {
    const dayService = getDays()
    const timeValue = time * 3600
    updateShapes(timeValue, dayService)
}

function updateShapes(time, dayService) {
    // console.log(dayService)
    const countShapes = shapeMarkers.length
    for (i = 0; i < countShapes; i++) {
        const thisShape = shapeMarkers[i]
        const shows = thisShape.arrivals.some(d => d <= time) && thisShape.services.some(d => dayService.includes(d))
        const opacity = shows ? .2 : 0
        thisShape.marker.setStyle({ opacity: opacity })
    }
    loader.classList.add('sr-only')
}

function updateByDay() {
    const dayService = getDays()

    const time = document.querySelector('#serviceHour').value
    const timeValue = getSeconds(time + ':00')
    console.log(timeValue)
    updateShapes(timeValue, dayService)
}

function getDays() {
    const checkedDays = Array.from(document.querySelectorAll('input[name="day-filter"]:checked'))
    const dayService = checkedDays.length == 0 ? checkedDays : d3.merge(checkedDays.map(day => allData.service[day.id])).filter((d, i, v) => v.indexOf(d) === i)

    return dayService
}