function createDayFilter(){
	document.querySelector('#days').innerHTML = Object.keys(allData.service)
	.map(day => {
    return `
        <div class="col-1" title="${day.toLocaleUpperCase()}">
        <input type="checkbox" name="day-filter" id='${day}' onclick="updateByDay()" readonly checked><label for="${day}">${day.substr(0,1).toUpperCase()}</label>
        </div>`
	}).join('')
}