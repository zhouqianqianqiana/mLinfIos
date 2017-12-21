var vm = new Vue({
	el: '.view',
	data: {
		merchantType: '',
		sort: '',
		merchantName: '', // 搜索
		commercialId: 0,
		popularType: '', // 广告或优惠券
		status: true, // 已投放，
		pageNum: 1,
		pageSize: 20,
		merchantList: [],
		imgUrl: app.server.imgUrl,
		merchantIds: [],
		check: false,
		loading: false
	},
	methods: {
		getList: function () {
			this.pageNum = 1;
			update();
		},
		addMerchant: function () {
			this.status = false;
			vm.pageNum = 1;
			f7.attachInfiniteScroll($('.infinite-scroll'));
			update();
		},
		formSubmit: function () {
			if (!vm.status && vm.check) {
				// 添加投放商家
				merchantPut(app.server.addMerchant, function (ret) {
					console.log(JSON.stringify(ret))
					if (ret && ret.type == 1) {
						api.toast({
							msg: '添加成功',
							location: 'middle'
						})
						update();
						// 判断是广告还是优惠券投放 
						loadData();
					} else {
						api.toast({
							msg: ret.msg
						})
					}
				})
				
			} else if (vm.status && vm.check) {
				// 删除投放商家
				merchantPut(app.server.delMerchant, function (ret) {
					console.log(JSON.stringify(ret))
					if (ret && ret.type == 1) {
						api.toast({
							msg: '删除成功',
							location: 'middle'
						})
						update();
						loadData();
					} else {
						api.toast({
							msg: ret.msg
						})
					}
				})
			}
		}
	},
	watch: {
		'merchantIds': function () {
			if (this.merchantIds.length > 0) {
				this.check = true;
			} else {
				this.check = false;
			}
		},
		'merchantType': function () {
			this.getList();
		},
		'sort': function () {
			this.getList();
		},
		'merchantName': function () {
			this.getList();
			console.log(this.merchantName)
		}
	}
})


var f7 = new Framework7();

// 下拉刷新
var ptrContent = $('.pull-to-refresh-content');
ptrContent.on('refresh', function (e) {
	vm.merchantList = [];
	vm.pageNum = 1;
	showMerchant(function (ret) {
		f7.pullToRefreshDone();
		f7.attachInfiniteScroll($('.infinite-scroll'));
		if (ret && ret.result) {
			if (ret.result.length>0) {
				vm.merchantList = ret.result;
			}
		}
		
	})
	
})

// 上拉加载
$('.infinite-scroll').on('infinite', function () {
	var that = this;

    if (vm.loading) return;
    vm.loading = true;
    vm.pageNum++;
    showMerchant(function (ret) {		
		if (ret.result.length>0) {
			vm.merchantList = vm.merchantList.concat(ret.result);
		} else {
			api.toast({
                msg: "没有更多数据了"
            });
            vm.pageNum--;
            f7.detachInfiniteScroll($(that));
            $(that).find('.infinite-scroll-preloader').hide();
		}
		vm.loading = false;
	})
});

var mySearchbar = f7.searchbar('.searchbar', {
    searchList: '.list-block-search',
    searchIn: '.item-title'
});



onReady = function () {
	vm.commercialId = api.pageParam.commercialId;
	vm.popularType = api.pageParam.popularType;
	
	// 显示商家
	update();
	
	
	
}



var update;
update = function () {
	vm.merchantList = [];
	vm.merchantIds = [];
	showMerchant(function (ret) {
		if (ret && ret.result) {
			if (ret.result.length>0) {
				vm.merchantList = ret.result;
			}
		}
		
	})
}


function loadData() {
	if (vm.popularType == 'adver') {
		api.execScript({
			name: 'popularAdv',
			script: 'initData()'
		});
		
	} else {
		api.execScript({
			name: 'popularCoupon',
			script: 'initData()'
		});
	}
	
	api.execScript({
		name: 'popularManage',
		script: 'initData()'
	});
}
// 显示投放商家
function showMerchant(call) {
	var param = {
		merchantId: app.getStorage('merchantId'),
		commercialId: vm.commercialId,
		status: vm.status,
		merchantType: vm.merchantType,
		sort: vm.sort,
		merchantName: "",
		pageNum: vm.pageNum,
		pageSize: vm.pageSize
	};
//	console.log(JSON.stringify(param))
	app.ajax({
		url:app.server.popularPutUrl,
		data: param,
		beforeSend: function() {
			f7.showIndicator();
		},
		success: function (ret) {
			call(ret);
			if (!ret.result) {
				api.toast({
					msg: '没有更多数据啦',
					location: 'middle'
				})
			}
		},
		complete: function () {
			f7.hideIndicator();
		}
	})
}


// 删除或添加投放商家
function merchantPut (url, call) {
	app.ajax({
		url: url,
		data: {
			merchantIds: vm.merchantIds,
			commercialId: vm.commercialId
		},
		beforeSend: function () {
			f7.showIndicator();
		}, 
		success: function (ret) {
			call(ret)
		},
		complete: function () {
			f7.hideIndicator();
		}
	})
}
