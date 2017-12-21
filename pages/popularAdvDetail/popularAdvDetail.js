onReady = function () {
	vm.advInfo = api.pageParam.advInfo;
	uploadImg(function (ret) {
		vm.advInfo.pic = ret;
	})
}
var f7 = new Framework7();
var vm = new Vue({
	el: '.view',
	data: {
		imgUrl: app.server.imgUrl,
		advInfo: {
			title: '',
			pic: '',
			content: '',
			link: '',
		}
	},
	methods: {
		save: function () {
			if (checkForm()) {
				var param = vm.advInfo;
				popularAdvEdit({data: param, type: 1}, function (ret) {
					if (ret && ret.type == 1) {
						api.toast({
							msg: '编辑成功！',
							location: 'middle'
						});
						api.execScript({
							name: 'popularAdv',
							script: 'initData()'
						})
						api.execScript({
							name: 'popularManage',
							script: 'initData()'
						})
						setTimeout(function () {
							api.closeWin();
						}, 500);
					}
				})
			}
			
		},
		MerchantSelect: function (id) {
			api.openWin({
				name: 'popularPut',
				url: '../popularPut/popularPut.html',
				pageParam: {
					commercialId: id,
					popularType: 'adver'
				}
			});
		},
		deleteAdv: function (id) {
			f7.modal({
				title: '删除广告',
				text: '您是否确认删除该条广告，（删除成功后将无法复原）',
				buttons: [
					{
						text: '再想想',
						onClick: function () {
							
						}
					},
					{
						text: '是的',
						onClick: function () {
							app.ajax({
								url: app.server.popularAdvDel,
								data: {
									commercialId: id
								}, 
								beforeSend: function () {
									api.showProgress();
								},
								success: function (ret) {
//									console.log(JSON.stringify(ret))
									if (ret && ret.type == 1) {
										api.toast({
											msg: '删除成功！',
											location: 'middle'
										});
										api.execScript({
											name: 'popularAdv',
											script: 'initData()'
										});
										api.execScript({
											name: 'popularManage',
											script: 'getList()'
										});
										setTimeout(function () {
											api.closeToWin({
												name: 'popularAdv'
											})
										}, 500);
									}
								},
								error: function (err) {
									api.toast({
											msg: err.msg,
											location: 'middle'
										});
								},
								complete: function () {
									api.hideProgress();
								}
							})
						}
					}
				]
			})
		}
	}
})

