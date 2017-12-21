var f7 = new Framework7();
var view1 = f7.addView('#view-1');
var view2 = f7.addView('#view-2');
var view3 = f7.addView('#view-3');

var date = new Date();
var vm = new Vue({
	el: '.views',
	data: {
		merchantName: '----',
		todayIncome: 0,
		todayAmount: 0,
		monthIncome: 0,
		imgUrl: app.server.imgUrl,
		merchantLogo: '--',
		level: ['A类商家', 'B类商家', 'C类商家'],
		merchantLevel: 'A类商家',
		telphone: '-------',
		balanceAmount: 0
	},
	methods: {
		// 今日单量
		openTodayAmount: function () {
			api.openWin({
				name: 'count',
		   		url: '../count/count.html',
		   		 pageParam: {
			        date: date.toJSON().split("T")[0]
			    }
			})
		},
		//本月收益
		openThisMonth: function () {
			api.openWin({
				name: 'count',
		   		url: '../count/count.html'
			})
		},
		//日收益
		openList: function () {
			api.openWin({
				name: 'countList',
		   		url: '../countList/countList.html',
		   		 pageParam: {
			        date: date.toJSON().split("T")[0]
			    }
			})

		},
		// 店铺二维码
		openQr: function () {
			if (app.getStorage('merchantId') == '' || app.getStorage('merchantId') == undefined) {
				api.toast({
					msg: '还没有加入门店',
					location: 'middle'
				})
			} else {
				api.openWin({
					name: 'qrcode',
					url: '../qrcode/qrcode.html'
				})
			}
		}
	}
})

onReady = function() {
	if (app.getStorage('isLogin')) {
		autoLogin();
	
	} else {
		openLogin();
	}
	api.setStatusBarStyle({
		style:"light"
	});
	
	
	api.addEventListener({
		name: 'paid'
	}, function (ret, err) {
		console.log(JSON.stringify(ret))
		if (ret && ret.value) {
			 //日统计
	            
	            getFinancial({
				 	merchantId: app.getStorage('merchantId'),
					date: date.toJSON().split("T")[0]
					}, function (ret) {
						vm.todayIncome = ret.amount;
		                vm.todayAmount = ret.num;
				});
			
				//月收益统计
				getFinancial({
				 	merchantId: app.getStorage('merchantId'),
					date: date.toJSON().split("T")[0].slice(0, -3)
				}, function (ret) {
	//				console.log(JSON.stringify(ret))
	                vm.monthIncome = ret.amount;
				});
		}
	})
}

//获取用户信息
function initData() {
	var jpush = new JPush();
//	console.log(jpush)
	getMemberInfo(function(ret) {
		if (ret && ret.type == 1) {
			app.setStorage('userInfo', ret.result);
			jpush.bindAliasAndTags({
                alias: ret.result.telephone,
                tags: []
            });
			//获取商户信息
			getMerchantInfo({
				ownerId: app.getStorage('userInfo')._id
			}, function(ret) {
				app.setStorage('merchantId', ret._id);
				
				vm.merchantName = ret.merchant_name;
	            vm.merchantLogo = ret.logo;
	            vm.merchantLevel = vm.level[ret.merchant_level];
	            vm.telphone = ret.telphone;
	            
	            //日统计
	            
	            getFinancial({
				 	merchantId: app.getStorage('merchantId'),
					date: date.toJSON().split("T")[0]
					}, function (ret) {
						vm.todayIncome = ret.amount;
		                vm.todayAmount = ret.num;
				});
			
				//月收益统计
				getFinancial({
				 	merchantId: app.getStorage('merchantId'),
					date: date.toJSON().split("T")[0].slice(0, -3)
				}, function (ret) {
	//				console.log(JSON.stringify(ret))
	                vm.monthIncome = ret.amount;
				});
//				
				// 加载余额
				initAmount({isWithdrawd: false},function (ret) {
		            vm.balanceAmount = ret;
				});
			});
			
		}
	})
}



function getMemberInfo (call) {
	app.ajax({
		url: app.server.memberInfo,
		success: function (ret) {
			call(ret)
		},
		error: function (err) {
			console.log(JSON.stringify(err))
			api.toast({
				msg: err.msg
			})
		}
	})
}
//加载账户余额
function initAmount(data, call) {
	app.ajax({
		url: app.server.accountAmount,
		data: data,
		success: function (ret) {
			if (ret.type == 1 && ret) {
				call(ret.result);
			}
		}
	});
}
//获取商户的全部信息
function getMerchantInfo(data, call) {
    app.ajax({
        url: app.server.merchantInfo,
        data: data,
        success: function (ret) {
//      	console.log(JSON.stringify(ret))
            if (ret.type == 1 && ret) {
                call(ret.result[0]);
            }
        },error: function (err) {
//      	console.log(JSON.stringify(err));
		}
    });
}


//自动登录
function autoLogin() {
    app.ajax({
        url: app.server.login,
        beforeSend: function () {
        	api.showProgress();
        },
        success: function (ret) {
            if (ret.type == 1 && ret) {
                app.setStorage('isLogin', true);
                initData();
            }
            else {
            	app.clearStorage();
            	openLogin();
            }
        },error: function (err) {
        	api.hideProgress();
            api.toast({
                location: 'middle',
                msg: err.msg,
                duration: 5000
                
            });
            openLogin();
		},
		complete: function () {
			api.hideProgress();
		}
    });
}

//获取财务信息
function getFinancial(data, call) {
	app.ajax({
		url: app.server.count,
		data: data,
		success: function (ret) {
//			console.log(JSON.stringify(ret))
			if (ret && ret.type == 1) {
				call(ret.result);
			}
		},
		error: function (err) {
//			console.log(JSON.stringify(err))
		}
	})
}

//消息列表
function getMessages(data, call) {
    app.ajax({
        url: app.server.messages,
        data: data,
        success: function (ret) {
            if (ret.code = 1000) {
                call(ret.result);
            }
        }, error: function (err) {
//          console.log(JSON.stringify(err));
        }
    });
}

// 打开登录页面
function openLogin() {
	api.openWin({
	    name: 'login',
	    url: '../login/login.html',
	    slidBackEnabled: false
	});
}
/* 切换到首页 */
function switchTab(tab) {
    f7.showTab(tab || "#tab-home");
}