var f7 = new Framework7();
onReady = function() {
	api.pageParam.bankInfo && (vm.bankInfo = api.pageParam.bankInfo)
	if (vm.bankInfo.telephone) {
		vm.isEdit = vm.bankInfo.status == '0' ? false : true;
		if (!vm.isEdit) {
			api.toast({
				msg: '审核中，不允许编辑',
			    duration: 3000,
			    location: 'middle'
			})
		}
	}
}

var vm = new Vue({
	el: '.view',
	data: {
		bankInfo:{
			account_name: '',
			telephone: '',
			bank_no: '',
			name: '中国银行'
		},
		isEdit: true,
		bankNameList:['中国银行','北京银行','成都银行','工商银行','广发银行','华夏银行','建设银行','交通银行','民生银行','农业银行','邮政银行','招商银行','中信银行']
	},
	methods: {
		submit: function () {
			if (checkFrom() && vm.isEdit) {
				addBank();
			}
		}
	}
})


//添加完成，提交表单
function addBank() {
	app.ajax({
		url: app.server.bankEdit,
		data: {
			account: vm.bankInfo.account_name,
			bankName: vm.bankInfo.name,
			bankNo: vm.bankInfo.bank_no,
			telephone: vm.bankInfo.telephone,
			merchantId: app.getStorage('merchantId')
		},
		beforeSend: function () {
			api.showProgress();
		},
		success: function (ret) {
			if (ret && ret.state == 'success') {
				api.toast({
					msg: '提交成功'
				});
				api.execScript({
					name: 'bankCard',
					script: 'getMerchantInfo()'
				});
				
				setTimeout(function () {
					api.closeToWin({
						name: 'bankCard'
					});
				},1000);
			}
		},
		complete: function () {
			api.hideProgress();
		},
		error: function (err) {
			api.toast({
				msg: err,
				location: 'middle'
			})
		}
	})
}

//表单检查
function checkFrom() {
	var telReg = /^1[3|4|5|7|8][0-9]{9}$/;
	var cardReg = /^(\d{16}|\d{19})$/;
	if (!vm.bankInfo.account_name) {
		api.toast({
			msg: '请输入预留名',
		    duration: 1000,
		    location: 'middle'
		});
		return false;
	}
	if (!telReg.test(vm.bankInfo.telephone)) {
		api.toast({
			msg: '请输入正确的电话号码',
		    duration: 1000,
		    location: 'middle'
		});
		return false;
	}
	if (!cardReg.test(vm.bankInfo.bank_no)) {
		api.toast({
			msg: '请输入正确的卡号',
		    duration: 1000,
		    location: 'middle'
		});
		return false;
	}
	return true;
}
