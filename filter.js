function createDayFilter(){
	document.querySelector('#days').innerHTML = Object.keys(allData.service)
	.map(day => {
    return `
        <div class="col-1" title="${day.toLocaleUpperCase()}">
        <input type="checkbox" name="day-filter" id='${day}' onclick="updateByDay()" readonly checked><label for="${day}"><i class="fa fa-circle" aria-hidden="true"></i></label>
        </div>`
	}).join('')
}