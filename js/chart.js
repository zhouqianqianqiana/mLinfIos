(function (window) {
    if (window.GM) {
        GM.Global.setTheme({pixelRatio: 2});
        window.Chart = function (option) {
            var clientWidth = document.body.clientWidth;
            var el = document.getElementById(option.id);
            el.style.width = clientWidth + "px";
            var chart = new GM.Chart({
                id: option.id
            });
            if (typeof option.source == "object") {

                if (typeof option.source.data == "object" && typeof option.source.defs == "object") {
                    chart.source(option.source.data, option.source.defs);
                } else if (typeof option.source.data == "object") {
                    chart.source(option.source.data);
                } else {
                    console.warn("Chart.source need 'data'")
                }
            }


            if (typeof option.axis == "object") {
                for (i in option.axis) {
                    chart.axis(i, option.axis[i]);
                }
            }

            if (typeof option.onClick == "function") {
                el.onclick = function (event) {
                    var box = el.getBoundingClientRect();
                    var click = {
                        x: event.clientX - box.left,
                        y: event.clientY - box.top
                    };
                    var data = chart.getSnapRecords(click)[0]._origin;
                    var position = chart.getPosition(data);
                    option.onClick({
                        click: click,
                        data: data,
                        position: position
                    })
                    ;
                };
            }
            return chart;
        }
    }
    else {
        console.log("not find chart.");
    }
})(window);