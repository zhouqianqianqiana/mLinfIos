var vm = new Vue({
	el: '.view',
	data: {
		years:[],
		nowYear: new Date().getFullYear(),
		monthType: 'monTimes',
		extension:[],
		totalNum: 0,
		monthList: ['一','二','三','四','五','六','七','八','九','十','十一','十二']
	},
	filters: {
		upperCase: function (value) {
			if (!value) return 0;
	      	return vm.monthList[parseInt(value.toString().substring(5)) - 1];
		},
	}
});


var f7 = new Framework7();
var $ = Dom7;
onReady = function () {
	
	
	vm.monthType = api.pageParam.monthType || 'monTimes';
	vm.years = api.pageParam.years || new Date().getFullYear();
//	console.log(JSON.stringify(vm.years))
	
	loadData();
	
	var myPicker = f7.picker({
		    input: '#picker-year',
	    cols: [
	        {
	            textAlign: 'center',
	            values: vm.years
	        }
	    ],
	    onClose:function (picker) {
	    	loadData(picker.value[0]);
	    	$('.list-select').removeClass('active');
	    	
	    }
	});	
	
	$('.list-select').on('click', function() {
		$(this).addClass('active');
	})
}






function loadData(year) {
	
	if (vm.monthType == 'monTimes') {
		var Url = app.server.popularTimes;
	} else {
		var Url = app.server.popularMonthIncome;
	}
	app.ajax({
		url: Url,
		data: {
			merchantId: app.getStorage('merchantId'),
			year: year ? year : new Date().getFullYear()
		},
		beforeSend: function () {
			api.showProgress()
		},
		success: function (ret) {
//			console.log(JSON.stringify(ret))
			if (ret && ret.type == 1) {
				if (ret.result.monthlyEarnings) {
					vm.extension = ret.result.monthlyEarnings;
				} else if(ret.result.monthlyProfit) {
					vm.extension = ret.result.monthlyProfit;
				}
				vm.totalNum = ret.result.totalNum;
			}
		},
		complete: function () {
			api.hideProgress();
		}
	})
}
