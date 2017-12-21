
var vm = new Vue({
	el: '.view',
	data: {
		haveCode: false,
		qrId: '',
		src: 'http://test.mlinf.com/app/merchant/download/merchantqrcode?merchantId=' + app.getStorage('merchantId')
	},
	methods: {
		bindCode: function () {
			FNScanner.openView({
			}, function(ret, err) {
			    if (ret) {
			    	console.log(JSON.stringify(ret))
			       	api.openFrame({
			       		name: 'qrFrame',
			       		url: 'qrFrame.html'
			       	})
			       	api.bringFrameToFront({
                        from: 'qrFrame'
                    });
                    if (ret.eventType == 'success') {
                    	closeScanner();
                    	bindQRcode(ret);
                    }
			    } else {
//			        alert(JSON.stringify(err));
			    }
			});
		},
		
	}
})
onReady = function () {
	
	if (app.getStorage('haveCode')) {
		vm.haveCode = true;
		
	} else {
		app.ajax({
			url: app.server.merchantInfo,
			data: {
				ownerId: app.getStorage('userInfo')._id
			},
			beforeSend: function () {
				api.showProgress();
			},
			success: function (ret) {
				console.log(JSON.stringify(ret))
				if (ret && ret.type == 1) {
					if (ret.result[0].qr_code) {
						vm.haveCode = true;
						app.setStorage('haveCode', true);
						vm.qrId = ret.result[0].qr_code;
					}
				}
			},
			complete: function () {
				api.hideProgress();
			}
		});
	}
	
	FNScanner = api.require('FNScanner');
	api.addEventListener({
        name: 'resume'
    }, function (ret, err) {
        FNScanner.onResume();
    });

    api.addEventListener({
        name: 'pause'
    }, function (ret, err) {
        FNScanner.onPause();
    });
}
// 关闭扫描窗口
	function closeScanner () {
		FNScanner.closeView();
		api.closeFrame({
			name: 'qrFrame'
		})
	}

// 绑定二维码
 function bindQRcode(data) {
//      console.log(JSON.stringify(data));
        var url = data.content || "";
        if (/mlinf.com/.test(url)) {
            if (!/qrId/.test(url)) {
                api.toast({
                    msg: "获取信息失败,请稍后重试"
                });
                closeScanner();
                return;
            }
            var qrId = url.replace(/.*qrId=(\d+).*/, "$1");
            app.ajax({
            	url: app.server.qrcode,
            	data: {
            		merchant_id: app.getStorage('merchantId'),
                	qr_code: qrId
            	},
            	beforeSend: function () {
            		api.showProgress();
            	},
            	success: function (ret) {
            		 console.log(JSON.stringify(ret));
            		if (ret && ret.type == 1) {
	                    if (ret.code == 1000) {
	                        api.toast({
	                            msg: "绑定成功"
	                        });
	                        renderQRcode();
	                    }
	                } else {
	                    api.toast({
	                        msg: "绑定失败，请稍后重试"
	                    })
	                }
            	},
            	error: function(err) {
            		console.log(JSON.stringify(err))
            	},
            	complete: function () {
            		api.hideProgress();
            	}
            })
            
        } else {
            alert("请扫描美邻二维码");
            closeScanner();
        }


    }


//保存图片
function saveQrcode() {
	var privacy = api.require('privacy');
	privacy.photos(function(ret, err) {
	    if (!ret.status) {
		    api.alert({
		    	msg:'没有权限访问相册。'
	        });
	        return;
	    }
	});
	var merchantId = app.getStorage("merchantId");
	var url = app.server.host + "merchant/download/qrcode?merchantId=" + merchantId;
	var savePath = api.fsDir + "/images/" + merchantId + ".png"; 
	api.download({
	    url: url,
	    savePath: savePath,
	    report: true,
	    cache: true,
	    allowResume: true
	}, function(ret, err) {
		console.log(JSON.stringify(ret))
		api.hideProgress();
		api.showProgress({title: '已下载' + ret.percent + "%", modal: false});
	    if (ret.state == 1) {
	    	var url = ret.savePath;
	    	api.saveMediaToAlbum({
			    path: url
			}, function(ret, err) {
				if(ret && ret.status){
					api.alert({
		                msg:'二维码已保存至手机相册。'
	                });
				}
				api.hideProgress();
			});
	    } else if(ret.state==2) {
	    	api.alert({
                msg:'保存失败，请稍后重试。'
            });
	    	api.hideProgress();
	    }
	});
}
