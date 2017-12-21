onReady = function () {
	uploadImg(function (ret) {
		vm.advInfo.pic = ret;
	});
}

var vm = new Vue({
	el: '.view',
	data: {
		imgUrl: app.server.imgUrl,
		isClick: false,
		advInfo: {
			title: '',
			content: '',
			link: '',
			pic: '',
			description: '',
		},
		isClick: false
	},
	methods: {
		save: function () {
			if (checkForm()) {
				var param = vm.advInfo;
				var reg = /^http/g;
				if (!vm.isClick) {
					if (!reg.test(param.link)){
						param.link = 'http://' + param.link;
					}
					
					vm.isClick = true;
					document.getElementById('advLink').innerHTML = '';
				}
				param.merchantId = app.getStorage('merchantId');
				
				popularAdvAdd(param, function (ret) {
					api.toast({
						msg: '添加成功',
						location: 'middle'
					});
					api.execScript({
						name: 'popularAdv',
						script: 'initData()'
					});
					setTimeout(function () {
						api.closeToWin({
							name: 'popularAdv'
						})
					}, 1000);
//					console.log(JSON.stringify(ret))
				})
			}
		}
	}
})





