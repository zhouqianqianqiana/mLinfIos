onReady = function () {
	var couponInfo = api.pageParam.couponInfo;
	vm.couponData.couponId = couponInfo._id;
	vm.couponData.num = couponInfo.count;
	vm.couponData.end_time = couponInfo.end_time;
	vm.couponData.start_time = couponInfo.start_time;
	vm.couponData.share_title = couponInfo.share_title;
	vm.couponData.share_content = couponInfo.share_content;
	vm.couponData.store_limit_des = couponInfo.store_limit_des;
	vm.count = couponInfo.count;
	initDate();
	
}


var vm = new Vue({
	el: '.view',
	data: {
		bTime: '',
		eTime: '',
		couponData:{
			couponId: "",
            end_time: "--",
            store_limit_des: "",
            share_title: "",
            share_content: "",
            num: 0
		},
		count: 0,
		discount: [{val: "0", text: "无限制"}],
		agree: true,
		timeErr: true,
		imgUrl: app.server.imgUrl
	},
	methods: {
		changeTime: function () {
			if (vm.couponData.end_time == '') {
				vm.couponData.end_time = vm.eTime;
			}
			if (vm.couponData.end_time < vm.couponData.start_time) {
				api.toast({
					msg: '结束时间不能小于开始时间！',
					location: 'middle'
				});
				vm.couponData.end_time = vm.eTime;
			}
			
			vm.eTime = vm.couponData.end_time;
		},
		numInput: function () {
			if (vm.couponData.num >= 10000) {
				api.toast({
					msg: '数量不能超过10000',
					location: 'middle'
				})
				vm.couponData.num = 9999;
			}
		},
		submit: function () {
			if (checkForm()) {
				editSubmit(vm.couponData, function (ret) {
					api.toast({
						msg: '修改成功',
						location: 'middle'
					});
					api.execScript({
						name: 'popularCoupon',
						script: 'initData()'
					});
					api.execScript({
						name: 'popularManage',
						script: 'initData()'
					});
					setTimeout(function() {
						api.closeToWin({
							name: 'popularCoupon'
						})	
					},500);
				});
			} 
		}
	}
})



//编辑提交
function editSubmit(data, call) {
	app.ajax({
		url: app.server.couponEdit,
		data: data,
		beforeSend: function () {
			api.showProgress({
				text: '提交中...'
			});
		},
		success: function (ret) {
			api.hideProgress();
			if (ret && ret.state == 'success') {
				call(ret)
			}
		},
		error: function (err) {
			if (err) {
				api.toast({
					msg: err
				})
			}
		},
		complete: function () {
			api.hideProgress();
		}
	})
}

//表单检查
function checkForm() {

	if (!vm.couponData.num && vm.couponData.num<=0) {
		api.toast({
			msg: '请输入发放数量',
			location: 'middle'
		});
		return false;
	}
	if (vm.couponData.num < vm.count) {
		api.toast({
			msg: '发放数量不能小于现有数量',
			location: 'middle'
		});
		return false;
	}

	return true;
}
//获取日期字符串
function getDateStr() {
    var date = new Date();
    return [date.getFullYear(), ("0" + (date.getMonth() + 1)).slice(-2), ("0" + date.getDate()).slice(-2)].join("-");
}
// 初始化时间
function initDate() {
    vm.bTime = vm.couponData.start_time;
    vm.eTime = vm.couponData.end_time;	
}