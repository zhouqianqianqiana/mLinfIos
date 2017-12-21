
var vm = new Vue({
	el: '#app',
	data: {
		amountChange: [{
			remark:'--',
			tran_amount: 0,
			create_date: '----'
		}],
		unWithdraw: [{
			nickname: '',
			platProfit:{
				merAmt: '0',
				profitAmt: '0'
			},
			payTime: '----',
			original_amount: '0',
			amount: 0
		}],
		Withdraw: [{
			nickname: '',
			platProfit:{
				merAmt: '0',
				profitAmt: '0'
			},
			payTime: '----',
			original_amount: '0',
			amount: 0
		}],
		amountPageNum: 1,
		unPageNum: 1,
		hasPageNum: 1,
		pageSize: 20,
		unAmount: 0,
		hasAmount: 0
	},
	//日期转换格式
	filters: {
		 formatDate:function (input) {
	       var d = new Date(input);
	       var year = d.getFullYear();
	       var month = d.getMonth() + 1;
	       var day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate();
	       var hour = d.getHours();
	       var minutes = d.getMinutes();
	       var seconds = d.getSeconds();
	       return  year+ '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
	   }
	}
});

var f7 = new Framework7();
var ptrContent = $('.pull-to-refresh-content');

//下拉刷新
ptrContent.on('refresh', function (e) {
	var _id = $(this).attr('id');
	if (_id == 'tab1') {
		changeLoading = true;
		vm.amountPageNum = 1;
		getChangeList({
			pageNum: 1,
			pageSize: vm.pageSize
		}, function (ret) {
			vm.amountChange = ret.result;
		});
	} else if(_id == 'tab2') {
		vm.unPageNum = 1;
		noWithLoading = true;
		getMoney({
			isWithdrawd: false,
			pageNum: 1,
			pageSize: vm.pageSize
		}, function (ret) {
//			console.log(JSON.stringify(ret))
			vm.unWithdraw = ret.result;
		});
		
		getAmount({
			isWithdrawd: false
		}, function (ret) {
//			console.log(JSON.stringify(ret))
			vm.notAmount = ret.result;
		});
	} else {
		vm.hasPageNum = 1;
		withLoading = true;
		getMoney({
			isWithdrawd: true,
			pageNum: 1,
			pageSize: vm.pageSize
		}, function (ret) {
			vm.Withdraw = ret.result;
		});
		getAmount({
			isWithdrawd: true
		}, function (ret) {
			vm.hasAmount = ret.result;
		});
	}
	setTimeout(function () {
		f7.pullToRefreshDone();
	},1000);
});

//上拉加载更多
var changeLoading = true;
var noWithLoading = true;
var withLoading = true;
$('.infinite-scroll').on('infinite', function () {
	var _id = $(this).attr('id');
	if (changeLoading && _id == 'tab1') {
//		console.log(vm.amountPageNum)
		api.showProgress();
		vm.amountPageNum++;
		changeLoading = false;
		getChangeList({
			json: {
				pageNum: vm.amountPageNum,
				pageSize: vm.pageSize
			}
		}, function (ret) {
			api.hideProgress();
			if (ret.result.length == 0) {
	            vm.amountPageNum--;
	            changeLoading = false;
	            api.toast({
	            	msg: '没有更多数据啦',
	            	location: 'middle'
	            })
			} else {
				vm.amountChange = vm.amountChange.concat(ret.result);
				changeLoading = true;
			}
		});
		
	} else if (noWithLoading && _id == 'tab2'){
//		console.log(vm.unPageNum)
		vm.unPageNum++;
		noWithLoading = false;
		getMoney({
			isWithdrawd: false,
			pageNum: vm.unPageNum,
			pageSize: vm.pageSize
		}, function (ret) {
//			console.log(JSON.stringify(ret))
			if (ret.result && ret.result.result.length >0) {
				vm.unWithdraw = vm.unWithdraw.concat(ret.result.result);
				noWithLoading = true;
			} else {
	            vm.unPageNum--;
	            noWithLoading = false;
	            api.toast({
	            	msg: '没有更多数据啦',
	            	location: 'middle'
	            })
			}
		});
	}else if (withLoading && _id == 'tab3'){
		withLoading = false;
		api.showProgress();
		vm.hasPageNum++;
		getMoney({
			isWithdrawd: true,
			pageNum: vm.hasPageNum,
			pageSize: vm.pageSize
		}, function (ret) {
//			console.log(JSON.stringify(ret))
			api.hideProgress();
			if (ret.result && ret.result.result.length >0) {
				vm.Withdraw = vm.Withdraw.concat(ret.result.result);
				withLoading = true;
			} else {
	            vm.hasPageNum--;
	            withLoading = false;
	            api.toast({
	            	msg: '没有更多数据啦',
	            	location: 'middle'
	            })
			}
		});
	}
});

onReady = function () {
	
	// 余额变化
	getChangeList({
		json: {
			pageNum: 1,
			pageSize: vm.pageSize
		}
	}, function (ret) {
		vm.amountChange = [];
		if (ret.result) {
			vm.amountChange = ret.result;
		}
		
	});
	// 未提现
	getMoney({
		isWithdrawd: false,
		pageNum: 1,
		pageSize: vm.pageSize
	}, function (ret) {
		vm.unWithdraw = [];
		if (ret.result) {
			vm.unWithdraw = ret.result.result;
		}
		
	});
	// 已提现
	getMoney({
		isWithdrawd: true,
		pageNum: 1,
		pageSize: vm.pageSize
	}, function (ret) {
		vm.Withdraw = [];
		if (ret.result) {
			vm.Withdraw = ret.result.result;
		}
	});
	
	// 未提现和已提现的金额
	getAmount({
		isWithdrawd: false
	}, function (ret) {
		vm.unAmount = ret.result;
	});
	getAmount({
		isWithdrawd: true
	}, function (ret) {
		vm.hasAmount = ret.result;
	});
}

//余额变化
function getChangeList(data, call) {
	app.ajax({
        url: app.server.accountChange,
        data: data,
        beforeSend: function () {
        	api.showProgress();
        },
        success: function (ret) {
            if (ret) {
                call(ret)
            }
        },
        complete: function () {
        	api.hideProgress();
        },
        error: function (err) {
            api.toast({
                location: 'middle',
                msg: err.msg
            });
		}
    });
	
}

//未提现, 已提现
function getMoney(data, call) {
	app.ajax({
        url: app.server.accountWithdraw,
        data: data,
        beforeSend: function () {
        	api.showProgress();
        },
        success: function (ret) {
//      	console.log(JSON.stringify(ret))
            if (ret) {
                call(ret)
            }
        },
        complete: function () {
        	api.hideProgress();
        },
        error: function (err) {
            api.toast({
                location: 'middle',
                msg: err.msg
            });
		}
    });
    
}

//获取已提现和未提现的总金额
function getAmount(data, call) {
	app.ajax({
        url: app.server.accountAmount,
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
