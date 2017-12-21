
var vm = new Vue({
	el: '.view',
	data: {
		hasDraw: [],
		notDraw: [],
		date: '',
		notPageNum: 1,
		hasPageNum: 1,
		pageSize: 20,
		isWithdrawd: true,
		notisLoading: false,
		hasisLoading: false
	}
})

var f7 = new Framework7();
var $ = Dom7;
var ptrContent = $('.pull-to-refresh-content');
ptrContent.on('refresh', function (e) {
	var _id = $(this).attr('id');
	switch(_id) {
		case 'tab1': 
			vm.notPageNum = 1;
			getList({
				isWithdrawd: false,
	            pageNum: vm.notPageNum,
	            pageSize: vm.pageSize,
	            date: pageDate
			}, function (ret) {
				if (ret && ret.type == 1) {
					f7.pullToRefreshDone();
					if (ret.result) {
	                    vm.notDraw = ret.result.result;
	               	}
				}
				
			})
		break;
		case 'tab2':
			vm.hasPageNum = 1;
			getList({
				isWithdrawd: true,
	            pageNum: vm.hasPageNum,
	            pageSize: vm.pageSize,
	            date: pageDate
			}, function (ret) {
				if (ret && ret.type == 1) {
					f7.pullToRefreshDone();
					if (ret.result) {
	                    vm.hasDraw = ret.result.result;
	               	}
				}
				
			})
		break;
		default: break;
	}
});

$('.infinite-scroll').on('infinite', function () {
	var that = this;
	var _id = $(this).attr('id');
	
	switch(_id) {
		case 'tab1':
			if (vm.notisLoading) return;
			vm.notisLoading = true;
			vm.notPageNum++;
			console.log(vm.notPageNum)
			getList({
				isWithdrawd: false,
	            pageNum: vm.notPageNum,
	            pageSize: vm.pageSize,
	            date: pageDate
			}, function (ret) {
				
				if (ret && ret.type == 1) {
					if (ret.result.result == 0) {
						api.toast({
							msg: '没有更多数据啦',
							location: 'middle'
						});
					} else {
						vm.notDraw = vm.notDraw.concat(ret.result.result);
						vm.notisLoading = false;
					}
				}
			})
			
		break;
		case 'tab2':
			if (vm.hasisLoading) return;
			vm.hasisLoading = true;
			vm.hasPageNum++;
			
			getList({
				isWithdrawd: true,
	            pageNum: vm.hasPageNum,
	            pageSize: vm.pageSize,
	            date: pageDate
			}, function (ret) {
				
				if (ret && ret.type == 1) {
					if (ret.result.result == 0) {
						api.toast({
							msg: '没有更多数据啦',
							location: 'middle'
						});
					} else {
						vm.hasDraw = vm.hasDraw.concat(ret.result.result);
						vm.hasisLoading = false;
					}
				}
			})
			
		break;
		 default: break;
	}
});


onReady = function () {
	vm.date = api.pageParam.date.replace(/-/g, ".");
	pageDate = api.pageParam.date;
	
	// 已提现
	getList({
		date: pageDate,
        pageNum: vm.hasPageNum,
        pageSize: vm.pageSize,
        isWithdrawd: true
	}, function (ret) {
		if (ret.result) {
			vm.hasDraw = ret.result.result;
		}
		
	});
	//未提现
	getList({
		date: pageDate,
        pageNum: vm.notPageNum,
        pageSize: vm.pageSize,
        isWithdrawd: false
	}, function (ret) {
		if (ret.result) {
			vm.notDraw = ret.result.result;
		}
	});
}

//明细列表
function getList(data, call) {
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
        }
    });
	
}
