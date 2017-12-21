function getPoint(canvas, x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left,
        y: y - bbox.top
    };
    console.log(x-bbox.left)
}


//var app = new Framework7({});
GM.Global.setTheme({pixelRatio: 2}); // 设为双精度

var defs1 = {
    time: {
        tickCount: 12,
        formatter: function (item) {
            return item;
        },
        range: [0, 1]
    },
    tem: {
        min: 0,
        formatter: function (item) {
            return "¥" + item;
        }
    }
}, defs2 = {
    time: {
        tickCount: 3,
        formatter: function (item) {
            return parseInt(item) + 1;
        },
        range: [0, 1]
    },
    tem: {
        min: 0,
        formatter: function (item) {
            return item;
        }
    }
}, cfgX = {
    line: null,
    grid: null,
    label: {
        fill: "#b2b2b2",
        fontSize: 10
    }
}, cfgY = {
    line: null,
    label: {
        fill: "#b2b2b2",
        fontSize: 10
    }
};
