var f7 = new Framework7();
var vm = new Vue({
	el: '.view',
	data: {
		bankInfo: {},
		isShop: '',
		bankType: '',
		isIdenty:false,
		bankImg: '',
		bankNo: '',
		hasCard: false
	},
	methods: {
		editBank: function () {
			api.openWin({
				name: 'bankHandle',
				url: '../bankHandle/bankHandle.html',
				pageParam: {
					bankInfo: vm.bankInfo
				}
			})
		},
		addCard: function () {
			if (vm.bankInfo.name) {
				api.toast({
					msg: '只能添加一张银行卡',
					duration: 1000,
		    		location: 'middle'
				});
				return;
			} else {
				api.openWin({
					name: 'bankHandle',
					url: '../bankHandle/bankHandle.html'
				})
			}
		}
	},
	filters: {
		hideBankNo: function (value) {
			if (value) {
				return value.slice(-4);
			}
		}
	}
})


/** 银行卡对应的名称**/

var bankNameList = [
	{name: "中国银行", icon: "zhongguo"},
    {name: "工商银行", icon: "gongshang"},
    {name: "农业银行", icon: "nongye"},
    {name: "建设银行", icon: "jianshe"},
    {name: "中信银行", icon: "zhongxin"},
    {name: "农村信用社", icon: "nongcun"},
    {name: "邮政银行", icon: "youzheng"},
    {name: "招商银行", icon: "zhaoshang"},
    {name: "民生银行", icon: "minsheng"},
    {name: "广发银行", icon: "guangfa"},
    {name: "成都银行", icon: "chengdu"},
    {name: "交通银行", icon: "jiaotong"},
    {name: "华夏银行", icon: "huaxia"}];
    
    
onReady = function () {
	getMerchantInfo();
}

//加载商户信息
function getMerchantInfo() {
	app.ajax({
		url: app.server.merchantInfo,
		data: {
			ownerId: app.getStorage('userInfo')._id
		},
		beforeSend: function () {
			api.showProgress();
		},
		success: function (ret) {
			if (ret && ret.type == 1) {
				var result = ret.result[0].bank;
				if (result && result.name) {
					vm.hasCard = true;
					vm.isIdenty = result.status == '1' ? true : false;
					vm.bankInfo = result;
					vm.bankNo = result.bank_no;
					var bankName = vm.bankType = result.name;
					for (var index in bankNameList) {
						if (bankName.indexOf(bankNameList[index].name) >= 0) {
							vm.bankImg = '../../image/bankIcon/' + bankNameList[index].icon + '.png';
							break;
						}
					}
				}
			}
		},
		complete: function () {
			api.hideProgress();
		}
	})
	
}
