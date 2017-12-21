var vm = new Vue({
	el: '.page',
	data: {
		tel: '',
		code: '',
		newPwd: '',
		confirmPwd: '',
		isClick: true,
		localTel: ''
	},
	methods: {
		submit: function () {
			if (checkForm()) {
				updatePwd({
					telephone : vm.tel,
					password : vm.newPwd,
					msgCode : vm.code
				}, function (ret) {
					if (ret && ret.type == 1) {
						api.toast({
							msg: '修改成功',
							location: 'middle',
							duration: 2000
						});
						if (vm.tel == vm.localTel) {
							app.clearStorage();
							setTimeout( function () {
								api.openWin({
									name: 'login',
									url: '../login/login.html',
									slidBackEnabled: false
								});
							}, 300);
							setTimeout(function () {
                                api.closeWin();
                            }, 1000);
						} else {
							setTimeout(function () {
								api.closeWin();
							}, 500)
						}
						
					}
				})
			}
		},
		
	}
})
onReady = function () {
	if (app.getStorage('userInfo')) {
		vm.localTel = app.getStorage('userInfo').telephone;
	}
	vm.tel = vm.localTel;
}

var f7  = new Framework7();
var $ = Dom7;
// 表单验证
function checkForm () {
	if (!vm.tel) {
		api.toast({
			msg: '请输入电话号码',
			location: 'middle'
		})
		return false;
	}
	if (!vm.code) {
		api.toast({
			msg: '请输入验证码',
			location: 'middle'
		})
		return false;
	}
	if (!vm.newPwd) {
		api.toast({
			msg: '请输入新密码',
			location: 'middle'
		})
		return false;
	}
	if (!vm.confirmPwd) {
		api.toast({
			msg: '请输入确认密码',
			location: 'middle'
		})
		return false;
	}
	if (vm.newPwd !== vm.confirmPwd) {
		api.toast({
			msg: '新密码与确认密码不一致！',
			location: 'middle'
		})
		return false;
	}
	if (vm.newPwd.length < 6 || vm.newPwd.length > 16) {
		api.toast({
			msg: '请输入6-12位密码',
			location: 'middle'
		})
		return false;
	}
	return true;
}

function checkPhone() {
	var reg = /^1[3|4|5|7|8][0-9]{9}$/;
	if (!(reg.test(vm.tel))) {
		api.toast({
			msg: '请输入有效的手机号！',
			location: 'middle'
		})
		return false;
	}
	return true;
}


// 获取验证码
$('.get-code').on('click', function () {
	if (vm.isClick && checkPhone()) {
		
		
		app.ajax({
			url: app.server.getCode,
			data: {
				json : {
		        	telephone: vm.tel
			    },
		    	sendToExist : true
			},
			success: function (ret) {
				console.log(JSON.stringify(ret))
				if (ret && ret.type == 1) {
					api.toast({
						msg: '验证码已发送至您的手机',
						location: 'middle'
					});
					
					vm.isClick = false;
					$('.get-code').css('background', '#ccc');
					count = 60;
					var timer = setInterval(function () {
						count--;
						$('.get-code').text(count + 's后重试');
						if (count == 0) {
							clearInterval(timer);
							$('.get-code').css('background', '#4cd964');
							$('.get-code').text('获取验证码');
							vm.isClick = true;
						}
					}, 1000);
				} else {
					api.toast({
						msg: ret.msg,
						location: 'middle'
					});
				}
			},
			error: function (err) {
				api.toast({
					msg: err.msg || '获取验证码失败，请稍后重试',
					location: 'middle',
					duration: 2000
				})
			}
		})
		
		
		
	}
})


// 修改密码
function updatePwd(data, call) {
	app.ajax({
		url: app.server.resetPwd,
		data: data,
		beforeSend: function () {
			api.showProgress();
		},
		success: function (ret) {
			call(ret);
			console.log(JSON.stringify(ret))
		},
		error: function (err) {
			if (err && err.statusCode == 500) {
				api.toast({
					msg: '验证码错误！',
					location: 'middle'
				})
			}
		},
		complete: function () {
			api.hideProgress();
		}
	})
}
