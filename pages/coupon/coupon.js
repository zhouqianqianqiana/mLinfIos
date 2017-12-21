
var vm = new Vue({
	el: '.view',
	data: {
		status: ['selling', 'sold_out', 'expired', 'stopped'],
		imgUrl: '../../image/coupon/grant_',
		png: '.png',
		selling: [],
		sold_out: [],
		expired: [],
		stopped: [],
		typeImg: {'food_coupon': 'food', 'full_minus': 'fullminus', 'discount': 'discount'},
		type:{'food_coupon': '菜品券', 'full_minus': '满减券','discount': '折扣券'}
	},
	methods: {
		openCouponDetail: function (el) {
			api.openWin({
				name: 'couponDetail',
				url: '../couponDetail/couponDetail.html',
				pageParam: {
					couponInfo: el
				}
			});
		}
	}
})




onReady = function () {
var f7 = new Framework7();
var $ = Dom7;
var ptrContent = $('.pull-to-refresh-content');
	ptrContent.on('refresh', function (e) {
		var _id = $(this).attr('id');
		switch(_id) {
			case 'tab1':
			getList(vm.status[0], 
				function (ret) {
				vm.selling = ret.result.result;
			}); 
			break;
			case 'tab2':
			getList(vm.status[1], function (ret) {
				vm.sold_out = ret.result.result;
			});
			break;
			case 'tab3':
			getList(vm.status[2], function (ret) {
				vm.expired = ret.result.result;
			});
			break;
			case 'tab4':
			getList(vm.status[3], function (ret) {
				vm.stopped = ret.result.result;
			}); 
			break;
			default:
			break;
		}
		setTimeout(function () {
			f7.pullToRefreshDone();
		},1000)

	});
	initData();
}

function initData() {
	api.showProgress();
	// 发放中
	getList(vm.status[0], function (ret) {
		if (ret.result.result) {
			vm.selling = ret.result.result;
		}
	});
	// 已领完
	getList(vm.status[1], function (ret) {
		if (ret.result.result) {
			vm.sold_out = ret.result.result;
		}
	})
	// 已过期
	getList(vm.status[2], function (ret) {
		if (ret.result.result) {
			vm.expired = ret.result.result;
		}
	})
	// 已停用
	getList(vm.status[3], function (ret) {
		if (ret.result.result) {
			vm.stopped = ret.result.result;
		}
	})
	api.hideProgress();
}
//获取优惠券列表
function getList(status, call) {
	app.ajax({
		url: app.server.couponList,
		data: {
			merchantId: app.getStorage('merchantId'),
			status: status
		},
		success: function (ret) {
			if (ret) {
				call(ret);
			}
		}
	})
}

