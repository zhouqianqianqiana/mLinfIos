var vm = new Vue({
	el: '.view',
	data: {
		telphone: '',
		pwd: '',
		kaptcha: '',
		showCaptcha: false,
		userNames:[],
	},
	methods: {
		submit: function () {
			if (checkForom()) {
				login({
					username: vm.telphone,
			        password: vm.pwd,
			        captcha: vm.showCaptcha,
			        type: "1"
				}, function (ret) {
					if (ret && ret.type == 1) {
						api.toast({
							msg: '登录成功',
							location: 'middle'
						});
						app.setStorage('isLogin', true);
						// 将首页切换至 tab-home
					    api.execScript({
					        name: 'root',
					        script: "switchTab('#view-1')"
					    });
						api.execScript({
							name: 'root',
							script: 'initData()'
						})
						setTimeout(function () {
							api.openWin({
								name: 'root',
								url: '../main/home.html',
								slidBackEnabled: false
							})
						},500);
					} else {
						api.toast({
							msg: ret.msg,
							location: 'middle'
						})
					}
				});
			}
		},
		inputOk: function () {
			if (this.telphone.length == 11 && this.pwd.length >= 6) {
				$('.login-disable').addClass('login-btn');
			} else {
				$('.login-disable').removeClass('login-btn');
			}
		}
			
			
	}
})
var f7 = new Framework7();
var $ = Dom7;
onReady = function () {
	
}


//登录
function login(data, call) {
	app.ajax({
        url: app.server.login,
        data: data,
        beforeSend: function () {
        	api.showProgress({
        		text: '登陆中...'
        	});
        },
        success: function (ret) {
        	api.hideProgress();
            call(ret);
        },
        complete: function () {
        	api.hideProgress();
        },
        error: function (err) {
//      	console.log(JSON.stringify(err))
            api.toast({
                location: 'middle',
                msg: err.msg
            });
		}
    });
}

//表单验证
function checkForom() {
	//电话号码正则
	var reg = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$/;
		if (!vm.telphone) {
			api.toast({msg: '请输入手机号！'});
			return false;
		}
		if (!vm.pwd) {
			api.toast({msg: '请输入密码！'});
			return false;
		}
		if (vm.pwd.length <6) {
			api.toast({msg: '请输入6-12位密码！'});
			return false;
		}
		if (!reg.test(vm.telphone)) {
			api.toast({msg: '号码错误！'});
			return false;
		}
		if (vm.telphone && vm.pwd) {
			return true;
		}
}



