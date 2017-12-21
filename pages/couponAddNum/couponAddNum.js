onReady = function () {
	vm.id = api.pageParam.id;
	vm.merchantId = api.pageParam.merchantId;
}
var vm = new Vue({
	el: '.view',
	data: {
		num: null,
		id: 0,
		merchantId: 0
	},
	methods: {
		checkInput: function () {
			if (vm.num > 9999) {
				api.toast({
					msg: '数量不能超过10000张'
				})
				vm.num = 9999;
				return;
			}
		},
		addNum: function () {
			if (vm.num) {
				var param = {
					merchantId: vm.merchantId,
		            couponId: vm.id,
		            count: vm.num
				};
				app.ajax({
					url: app.server.couponEdit,
					data: param,
					beforeSend: function () {
						api.showProgress();
					},
					success: function (ret) {
						if (ret && ret.type == 1) {
							api.toast({
								msg: '添加数量成功',
								location: 'middle'
							});
							api.execScript({
								name: 'coupon',
								script: 'initData()'
							});
							setTimeout(function () {
								api.closeToWin({
									name: 'coupon'
								})
							}, 500);
						}
					},
					complete: function () {
						api.hideProgress();
					}
				})
			}
		}
	}
})

