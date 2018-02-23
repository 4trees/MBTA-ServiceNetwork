$(function() {
    $("#slider-range-min").slider({
        // orientation: "vertical",
        range: "min",
        value: 06,
        min: 3,
        max: 28,
        slide: function(event, ui) {
            $("#serviceHour").val(ui.value < 10 ? ('0' + ui.value + ':00') : (ui.value + ':00'));
            // console.log(ui.value)
            updateBytime(ui.value)
        }
    });
    var data = $("#slider-range-min").slider("value")
    $("#serviceHour").val(data < 10 ? ('0' + data + ':00') : (data + ':00'));
});
