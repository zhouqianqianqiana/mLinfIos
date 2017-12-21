//上传图片
function uploadImg(call) {
	weui.uploader('#uploaderCustom', {
	    url: app.server.couponAddImgUrl,
	    auto: true,
	    type: 'file', 
	    fileVal: 'fileVal', 
	    onQueued: function onQueued() {
	    }, 
	    onSuccess: function onSuccess (ret) {
	    	if (ret && ret.type == 1) {
	    		call(ret.result);
	    	} else {
	    		api.toast({
	    			msg: '上传失败，请重试！',
	    			location: 'middle'
	    		})
	    	}
	    }
	});
}

//检查表单
function checkForm() {
	if (!vm.advInfo.pic) {
		api.toast({
			msg: '请上传广告图片',
			location: 'middle'
		});
		return false;
	}
	if (!vm.advInfo.title) {
		api.toast({
			msg: '标题不能为空',
			location: 'middle'
		});
	}
	if (!vm.advInfo.content) {
		api.toast({
			msg: '内容不能为空',
			location: 'middle'
		});
		return false;
	}
	if (!vm.advInfo.link) {
		api.toast({
			msg: '链接不能为空',
			location: 'middle'
		});
		return false;
	}
	return true;
}

// 添加广告
function popularAdvAdd(data, call) {
	app.ajax({
		url: app.server.popularAdvAdd,
		data: data,
		beforeSend: function () {
			api.showProgress({
				text: '提交中...',
				modal: false
			});
		},
		success: function (ret) {
			api.hideProgress();
			if (ret && ret.type == 1) {
				call(ret);
			}
		},
		complete: function () {
			api.hideProgress();
		}
	})
}


// 修改广告
function popularAdvAdd111(data, call) {
	app.ajax({
		url: app.server.popularAdvEdit,
		data: data,
		beforeSend: function () {
			api.showProgress({
				text: '提交中...',
				modal: false
			});
		},
		success: function (ret) {
			api.hideProgress();
			if (ret && ret.type == 1) {
				call(ret);
			}
		},
		complete: function () {
			api.hideProgress();
		}
	})
}
