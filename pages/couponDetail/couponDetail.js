
var vm = new Vue({
	el: '.view',
	data: {
		imgUrl: '../../image/coupon/grant_',
		expiredUrl: '../../image/coupon/overdue_',
		png: '.png',
		typeImg: {'food_coupon': 'food', 'full_minus': 'fullminus', 'discount': 'discount'},
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
			type_code: 'food_coupon',
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
				name: 'couponAddNum',
				url: '../couponAddNum/couponAddNum.html',
				pageParam: {
					id: _id,
					merchantId: merchant_id
				}
			});
		},
		edit: function (data) {
			api.openWin({
				name: 'couponEdit',
				url: '../couponEdit/couponEdit.html',
				pageParam: {
					couponInfo: data
				}
			})
		},
		stop: function (_id) {
			f7.modal({
				title: '停用该优惠券',
				text: '是否停用该优惠券？停用后可在已停用中的优惠券中启用',
				buttons:[
					{
						text: '让我想想'
					},
					{
						text: '停用',
						onClick: function () {
							stopOrStart({
								couponId: _id,
								stop: true
							},function (res) {
								if (res) {
									api.toast({
										msg: '停用成功',
										location: 'middle'
									})
									api.execScript({
										name: 'coupon',
										script: 'initData()'
									});
									setTimeout(function () {
										api.closeToWin({
											name: 'coupon'
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
						text: '不用了'
					},
					{
						text: '启用',
						onClick: function () {
							stopOrStart({
								couponId: _id,
								stop: false
							},function (res) {
								if (res) {
									api.toast({
										msg: '启用成功',
										location: 'middle'
									})
									api.execScript({
										name: 'coupon',
										script: 'initData()'
									});
									setTimeout(function () {
										api.closeToWin({
											name: 'coupon'
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
}
