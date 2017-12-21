
var vm = new Vue({
	el: '.view',
	data: {
		imgUrl: '../../image/coupon/grant_',
		expiredUrl: '../../image/coupon/overdue_',
		png: '.png',
		typeImg: {'commercial_food_coupon': 'food', 'commercial_full_minus': 'fullminus', 'commercial_discount': 'discount'},
		type:{'commercial_food_coupon': '菜品券', 'commercial_full_minus': '满减券','commercial_discount': '折扣券'},
		couponData: {
			type: '',
			store_limit_des: '',
			couponImg: '',
			next_day_use: true,
			limit_amount: 0,
			count: 0,
			except_holiday: true,
			sold_count: 0,
			share_content: '',
			auto_push: true,
			type_code: 'commercial_food_coupon',
			share_title: '',
			start_time: '',
			end_time: '',
			description: '',
			discount: 0,
			full_amount: 0,
			minus_amount: 0
		}
	},
	methods: {
		addNum: function (_id,merchant_id) {
			api.openWin({
				name: 'popularCouponAddNum',
				url:'../popularCouponAddNum/popularCouponAddNum.html',
				pageParam: {
					id: _id, 
					merchantId: merchant_id
				}
			})
		},
		edit: function (data) {
			api.openWin({
				name: 'popularCouponEdit',
				url:'../popularCouponEdit/popularCouponEdit.html',
				pageParam: {
					couponInfo: data
				}
			})
		},
		//投放点编辑
		MerchantSelect: function (commercialId) {
			api.openWin({
				name: 'popularPut',
				url:'../popularPut/popularPut.html',
				pageParam: {
					commercialId: commercialId,
					popularType: 'coupon'
				}
			})
		},
		stop: function (_id) {
			f7.modal({
				title: '温馨提示',
				text: '优惠券停用后将无法启用，请您确认后停用该优惠券。',
				buttons:[
					{
						text: '让我想想'
					},
					{
						text: '停用',
						onClick: function () {
							var param = {
						        couponId: _id,
						        stop: true
						    };
							stopOrStart(param, function (res) {
								if (res) {
									api.execScript({
										name: 'popularCoupon',
										script: 'initData()'
									});
									setTimeout(function () {
										api.closeToWin({
											name: 'popularCoupon'
										})
									}, 1000);
								}
							});
						}
					}
				]
			})
		},
		start: function (_id) {
			f7.modal({
				title: '启用该优惠券',
				text: '是否启用该优惠券？启用后可在发放中查看优惠券',
				buttons:[
					{
						text: '让我想想'
					},
					{
						text: '启用',
						onClick: function () {
							var param = {
						        couponId: _id,
						        stop: false
						    };
							stopOrStart(param, function (res) {
								if (res) {
									api.execScript({
										name: 'popularCoupon',
										script: 'initData()'
									});
									setTimeout(function () {
										api.closeToWin({
											name: 'popularCoupon'
										})
									}, 1000);
								}
							});
						}
					}
				]
			})
		}
	}
});
var f7 = new Framework7();
var $ = Dom7;

onReady = function () {
	vm.couponData = api.pageParam.couponInfo;
//	console.log(JSON.stringify(vm.couponData))
}
