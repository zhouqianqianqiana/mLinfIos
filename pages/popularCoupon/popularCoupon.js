onReady = function() {
	initData();
}

var vm = new Vue({
	el: '.view',
	data: {
		isStop: false,
		isPutting: [], //投放中
		hasHalt: [], //已停止
		pageSize: 20,
		pageNum: 1,
		imgUrl: '../../image/coupon/grant_',
		png: '.png',
		typeImg: {
			'commercial_food_coupon': 'food',
			'commercial_full_minus': 'fullminus',
			'commercial_discount': 'discount'
		}
	},
	methods: {
		openDetail: function(el) {
			api.openWin({
				name: 'popularCouponDetail',
				url: '../popularCouponDetail/popularCouponDetail.html',
				pageParam: {
					couponInfo: el
				}
			})
		}
	}
})

var f7 = new Framework7();
var $ = Dom7;
var ptrContent = $('.pull-to-refresh-content');
var inSroll = $('.infinite-scroll');
// 下拉刷新
ptrContent.on('refresh', function(e) {
		var _id = $(this).attr('id');
		switch(_id) {
			case 'tab1':
				getCouponList({
					merchantId: app.getStorage('merchantId'),
					isStop: true,
					pageNum: 1,
					pageSize: 10
				}, function(ret) {
					vm.isPutting = ret.result;
					setTimeout(function() {
							f7.pullToRefreshDone();
						}, 1000)
						//		console.log(JSON.stringify(ret))
				});
				break;
			case 'tab2':
				getCouponList({
					merchantId: app.getStorage('merchantId'),
					isStop: false,
					pageNum: 1,
					pageSize: 10
				}, function(ret) {
					vm.hasHalt = ret.result;
					setTimeout(function() {
							f7.pullToRefreshDone();
						}, 1000)
						//		console.log(JSON.stringify(ret))
				});
				break;
			default:
				break;

		}
	})
	// 上拉加载更多
var isLoading = false;
inSroll.on('infinite', function() {

	var that = this;
	var _id = $(this).attr('id');
	switch(_id) {
		case 'tab2':
			if(isLoading) return;
			isLoading = true;
			vm.pageNum++;
			getCouponList({
				merchantId: app.getStorage('merchantId'),
				isStop: false,
				pageNum: vm.pageNum,
				pageSize: 10
			}, function(ret) {
				if(ret.result.length == 0) {
					isLoading = true;
					vm.pageNum--;
					f7.detachInfiniteScroll($(this));
					api.toast({
						msg: '没有更多数据啦',
						location: 'middle'
					})
				} else {
					isLoading = false;
					vm.hasHalt = vm.hasHalt.concat(ret.result);
				}
			});
			break;
		default:
			break;
	}
})

function initData() {
	getCouponList({
		merchantId: app.getStorage('merchantId'),
		isStop: true,
		pageNum: 1,
		pageSize: 10
	}, function(ret) {
		vm.isPutting = ret.result;
	});

	getCouponList({
		merchantId: app.getStorage('merchantId'),
		isStop: false,
		pageNum: 1,
		pageSize: 10
	}, function(ret) {
		vm.hasHalt = ret.result;
	});

}
//获取优惠券列表
function getCouponList(data, call) {
	app.ajax({
		url: app.server.popularCouponList,
		data: data,
		beforeSend: function() {
			api.showProgress();
		},
		success: function(ret) {
//			console.log(JSON.stringify(ret))
			if(ret && ret.type == 1) {
				call(ret)
			}
		},
		complete: function() {
			api.hideProgress();
		}

	})

}
