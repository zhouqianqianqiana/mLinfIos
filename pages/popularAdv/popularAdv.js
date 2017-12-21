onReady = function() {
	initData();
}

var vm = new Vue({
	el: '.view',
	data: {
		imgUrl: app.server.imgUrl,
		isPutting: [],
		notPutting: []
	},
	methods: {
		editAdv: function(el) {
			api.openWin({
				name: 'popularAdvDetail',
				url: '../popularAdvDetail/popularAdvDetail.html',
				pageParam: {
					advInfo: el
				}
			});
		},
		addAdver: function () {
			if (vm.isPutting.length + vm.notPutting.length >= 5) {
				api.alert({
				    msg: '最多只能添加5张，请删除不必要的广告再进行添加！',
				})
			} else {
				api.openWin({
					name: 'popularAdvAdd',
					url: '../popularAdvAdd/popularAdvAdd.html'
				})
			}
		}
	}
})

function initData() {
	vm.isPutting = [];
	vm.notPutting = [];
	showAdvList({
		merchant_id: app.getStorage('merchantId'),
		pageNum: 1,
		pageSize: 5,
		push: true
	}, function(ret) {
		console.log(JSON.stringify(ret))
		if (ret && ret.result) {
			if (ret.result.result) {
				vm.isPutting = ret.result.result;
			}
		}
	})

	showAdvList({
		merchant_id: app.getStorage('merchantId'),
		pageNum: 1,
		pageSize: 5,
		push: false
	}, function(ret) {
		if (ret && ret.result) {
			if (ret.result.result) {
				vm.notPutting = ret.result.result;
			}
		}
	})
}