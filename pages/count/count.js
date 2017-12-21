var f7 = new Framework7({
//	modalCloseByOutside: true
});

var vm = new Vue({
		el: '.view',
		data: {
			num: 0,
			money: 0,
			totalNum: 0,
			totalMoney: 0
		},
		methods: {
			openList: function () {
				api.openWin({
					name: 'countList',
					url: '../countList/countList.html',
					pageParam: {
						date: myDate.getDate()
					}
				});
			}
		}
	})
	var myDate;
	onReady = function () {
		
		
		var dateStr = api.pageParam.date;
		myDate = new mDate(document.querySelector("#mDate"), {
	        monthChange: function () {
	        	getFinancial({
	        		merchantId: app.getStorage('merchantId'),
					date: myDate.getDate()
	        	});
	        },
	        dayChoose: function () { // ret 返回选择的日期
	            f7.showProgressbar(document.querySelector("body"));
	            setTimeout(function () {
	                api.hideProgress();
	            },2000);
	            getFinancial({
	        		merchantId: app.getStorage('merchantId'),
					date: myDate.getDate()
	        	});
	        },
	        mDateOnReady: function (mDate) {
	        	getFinancial({
	        		merchantId: app.getStorage('merchantId'),
					date: mDate.getDate()
	        	}, function (ret) {
	        		if (ret) {
                        if (dateStr) {
                            mDate.setDate(dateStr);
                        }
                    }
	        	})
	
	        }
	    });
	 }   
	
	
	//获取订单信息
	function getFinancial(data, callback) {
		app.ajax({
			url: app.server.count,
			data: data,
			beforeSend: function () {
				api.showProgress();
			},
			success: function (ret) {
				if(ret) {
//					console.log(JSON.stringify(ret))
					callback && callback(true);
					var result = ret.result;
					vm.num = result.num;
					vm.money = result.amount;
					if (result.allNum) { // 返回当月每天订单数量
	                    allNum(result.allNum);
	                    renderChart(result);
	                    vm.totalMoney = result.amount;
	                    vm.totalNum = result.num;
	                    
	                } else {
	                    if (vm.num == 0) {
	                        var arr = data.date.split("-");
	                        if (arr.length == 3) { // 如果是按天查询
	                            api.toast({
	                                msg: "当天无订单"
	                            });
	                        }
	
	                    }
	                
					}
				}
			},
			complete: function () {
				api.hideProgress();
			},
			error: function (err) {
//				console.log(JSON.stringify(err))
			}
		})
		
	}
	
	/**
     * 按月查询时初始化数据
     */
    function allNum(data) {
        var arr = document.querySelectorAll(".swiper-slide-active span:not(.gap)");
        for (var i = 0; i < data.length; i++) {
            arr[i].className += !data[i] ? " idle" : " have";
            if (arr[i].className.indexOf("md-today") >= 0) {
                break;
            }
        }
    }
function renderChart(ret) {
	var amount = [];
	var money = []
	for(i in ret.amountList) {
		money.push({
			"time": i,
			"tem": ret.amountList[i]
		})
	}
	for(i in ret.allNum) {
		amount.push({
			"time": i,
			"tem": ret.allNum[i]
		})
	}
	
	var chartMoney = new GM.Chart({
		id: 'c1'
	});
	var chartAmount = new GM.Chart({
		id: 'c2'
	});
	chartMoney.source(money, defs2);
	chartMoney.axis('tem', cfgY);
	chartMoney.axis('time', cfgX);
	chartMoney.point().position('time*tem').size(1).color("#3580ea");
    chartMoney.area().position('time*tem').size(1).color("rgba(188,230,254,0.7)");
    chartMoney.line().position('time*tem').size(1).color("#3580ea");
    setTimeout(function () {
    	 chartMoney.render();
    },300)
	
	chartAmount.source(amount, defs2);
	chartAmount.axis('tem', cfgY);
	chartAmount.axis('time', cfgX);
	chartAmount.point().position('time*tem').size(1).color("#f37928");
    chartAmount.area().position('time*tem').size(1).color("rgba(255,239,229,0.7)");
    chartAmount.line().position('time*tem').size(1).color("#f37928");
    setTimeout(function () {
    	 chartAmount.render();
    },300)
}
