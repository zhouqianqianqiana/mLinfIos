var vm = new Vue({
	el: '.view',
	data: {
		merchantLogo: '--',
		merchantName: '--',
		merchantAddress: '--',
		telphone: '--',
		imgUrl: app.server.imgUrl
	},
	methods: {
		loginExit: function () {
			api.confirm({
				"title": "提醒",
		        "msg": "确定退出吗?",
		        "buttons": ["确定", "取消"]
			}, function (ret, err) {
				if (ret.buttonIndex == 1) {
					loginOut(function (ret) {
						if (ret && ret.type == 1) {
							app.clearStorage();
							api.toast({
								msg: '退出成功',
								location: 'middle'
							})
							
							api.openWin({
								name: 'login',
								url: '../login/login.html',
								slidBackEnabled: false
							});
						}
					})
				}
			})
		}
	}
});

onReady = function () {
	// 获取商家信息
	getMerchantInfo({
		ownerId: app.getStorage('userInfo')._id
	}, function (ret) {
		if (ret && ret.type == 1) {
			vm.merchantName = ret.result[0].merchant_name;
			vm.merchantLogo = ret.result[0].logo;
			vm.telphone = ret.result[0].telphone;
			vm.merchantAddress = ret.result[0].address;
		}
	});
}

//获取商户的全部信息
function getMerchantInfo(data, call) {
	app.ajax({
		url: app.server.merchantInfo,
		data: data,
		beforeSend: function() {
			api.showProgress();
		},
		success: function (ret) {
			api.hideProgress();
			if (ret) {
				call(ret);
			}
		},
		complete: function () {
			api.hideProgress();
		}
	})
		
}
		
//退出登录
function loginOut(call) {
	app.ajax({
		url: app.server.loginOut,
		beforeSend: function() {
			api.showProgress({
				text: '退出中...',
				location: 'middle'
			});
		},
		success: function (ret) {
			if (ret) {
				call(ret);
			}
		},
		complete: function () {
			api.hideProgress();
		}
	})
	
}