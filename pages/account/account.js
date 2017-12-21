var vm = new Vue({
	el: '.view',
	data: {
		amount: [],
		pageSize: 20,
		pageNum: 1,
		balanceAmount: 0   //账户余额
	},
	//日期转换格式
	filters: {
		 formatDate:function (input) {
	       return new Date(input).toJSON().replace('T', ' ').slice(0,19);
	   }
	}
})
onReady = function () {
	getChangeList({
		json: {
			pageNum: vm.pageNum,
			pageSize: vm.pageSize
		}
	}, function (ret) {
		if (ret.result) {
			vm.amount = ret.result;
		}
		
	});
	
	
	initAmount({
		isWithdrawd: false
	}, function (ret) {
		vm.balanceAmount = ret.result;
	});
}

//余额变化
function getChangeList(data, call) {
	app.ajax({
        url: app.server.accountChange,
        data: data,
        success: function (ret) {
            if (ret) {
                call(ret)
            }
        },error: function (err) {
            api.toast({
                location: 'middle',
                msg: err.msg
            });
		}
    });
	
}

//加载账户余额
function initAmount(data, call) {
	app.ajax({
        url: app.server.accountAmount,
        data: data,
        beforeSend: function () {
        	api.showProgress();
        },
        success: function (ret) {
            if (ret.type == 1 && ret) {
                call(ret)
            }
        },
        complete: function () {
        	api.hideProgress();
        }
    });
	
}
