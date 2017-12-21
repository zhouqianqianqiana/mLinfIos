var f7 = new Framework7();
var vm = new Vue({
	el: '.view',
	data: {
		income: 0,
		years: [],
		monthlyProfit: [],
	},
	methods: {
		statistics: function(type) {
			api.openWin({
				name: 'popularCount',
				url: '../popularCount/popularCount.html',
				pageParam: {
					monthType: type, years: vm.years
				}
			})
		}
	},
});

onReady = function () {
	//加载收益统计
	initIncome({
		merchantId: app.getStorage('merchantId'),
		year: new Date().getFullYear()
	}, function (ret) {
		if (ret.result.totalNum == 0) {
			api.toast({
				msg: '暂无收益',
				location: 'middle'
			});
			vm.years.push(new Date().getFullYear());
		} else {
			rendChart(ret.result)
			vm.years = ret.result.year;
			vm.income = ret.result.totalNum;
		}
//		console.log(JSON.stringify(ret))
		
	});
}

//收益统计
function initIncome(data, call) {
	app.ajax({
		url: app.server.popularIncome,
		data: data,
		success: function(ret) {
			if (ret) {
				call(ret)
			}
		}
	})
}


// 初始化表格宽度
var clientWidth = document.body.clientWidth;
document.querySelectorAll("canvas").forEach(function (el) {
    el.style.width = clientWidth + "px";
});

// 交易表格
function rendChart(ret) {
	if (ret.monthlyProfit) {
		
		for(i in ret.monthlyProfit) {
			vm.monthlyProfit.push({
				'x': ret.monthlyProfit[i].commercialMonth,
				'y': ret.monthlyProfit[i].commercialNum
			})
		}
		
		var chart = new GM.Chart({
			id: 'c1'
		});
		//逆序
		vm.monthlyProfit.reverse();
		chart.source(vm.monthlyProfit, {
			 x: {
		        tickCount: 12,
		        formatter: function (item) {
		            return parseInt(item.slice(-2));
		        },
		        range: [0, 1]
		    },
		    y: {
		        min: 0,
		        formatter: function (item) {
		            return  item;
		        }
		    }
		});
		chart.axis('y', cfgY);
		chart.axis('x', cfgX);
		chart.point().position('x*y').size(1).color("#3580ea");
	    chart.area().position('x*y').size(1).color("rgba(188,230,254,0.7)");
	    chart.line().position('x*y').size(1).color("#3580ea");
	    setTimeout(function () {
	    	 chart.render();
	    },300)
	}
}




