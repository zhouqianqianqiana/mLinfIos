var vm = new Vue({
	el: '.view',
	data: {
		imgUrl: '../../image/coupon/grant_',
		hostImgUrl: app.server.imgUrl,
		png: '.png',
		isPutting: [],
		totalNum: 0,
		residueNum: 0,
		getCoupon: 0,
		typeImg: {
			'commercial_food_coupon': 'food',
			'commercial_full_minus': 'fullminus',
			'commercial_discount': 'discount'
		},
		type: {
			'commercial_food_coupon': '菜品券',
			'commercial_full_minus': '满减券',
			'commercial_discount': '折扣券'
		}
	},
	methods: {
		openDetail: function(el) {
			if(el.type) {
				api.openWin({
					name: 'popularAdvDetail',
					url: '../popularAdvDetail/popularAdvDetail.html',
					pageParam: {
						advInfo: el.commercial_detail
					}
				})
			} else {
				api.openWin({
					name: 'popularCouponDetail',
					url: '../popularCouponDetail/popularCouponDetail.html',
					pageParam: {
						couponInfo: el.coupon
					}
				})
			}

		}
	}

})
onReady = function() {
	var f7 = new Framework7();
	initData();
}

function initData() {
	app.ajax({
		url: app.server.popularAdvAndCoupon,
		data: {
			merchantId: app.getStorage('merchantId')
		},
		beforeSend: function() {
			api.showProgress();
		},
		success: function(ret) {
			if(ret && ret.type == 1) {
				vm.isPutting = ret.result;
			}
		},
		error: function(err) {
		},
		complete: function() {
			api.hideProgress();
		}
	});

	app.ajax({
		url: app.server.popularNum,
		data: {
			merchantId: app.getStorage('merchantId')
		},
		beforeSend: function() {
			api.showProgress();
		},
		success: function(ret) {
			//			receiveYear 优惠劵领取年份， receiveNum 优惠劵领取总量 ， monthNum 优惠劵每月领取量
			if (ret) {
				vm.getCoupon = ret.receiveNum;
				vm.residueNum = Math.abs(ret.pointCount);
				vm.totalNum = ret.allNum;
			}
			
//			console.log(JSON.stringify(ret))
		},
		complete: function() {
			api.hideProgress();
		}

	})
}