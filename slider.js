function getHourStr(num){
    let hour
    const trunc = Math.trunc(num)
    const deci = (num - trunc) == 0 ? '00' : '30'
    return (trunc < 10 ? ('0' + trunc) : trunc) + ':' + deci

}


$(function() {
    $("#slider-range-min").slider({
        // orientation: "vertical",
        range: "min",
        value: 06,
        min: 3,
        max: 28,
        step:.5,
        slide: function(event, ui) {
            $("#serviceHour").val(getHourStr(ui.value));
            updateBytime(getHourStr(ui.value))
        }
    });
    var data = $("#slider-range-min").slider("value")
    $("#serviceHour").val(getHourStr(data));
});

