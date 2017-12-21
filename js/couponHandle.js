var f7 = new Framework7();
// 停用或启用优惠券
function stopOrStart(data, call) {
	app.ajax({
		url: app.server.couponEdit,
		data: data,
		beforeSend: function (){
			api.showProgress();
		},
		success: function (ret) {
			console.log(JSON.stringify(ret))
			if (ret && ret.type == 1) {
//				api.showProgress();
				call(ret)
			} else {
				api.toast({
					msg: ret.msg,
					location: 'middle'
				})
			}
		},
		error: function (err) {
			
//			console.log(JSON.stringify(err))
		},
		complete: function (){
			api.hideProgress();
		},
	})
}


//添加数量
function couponAddNum(data, call) {
	
	app.ajax({
		url:app.server.couponEdit,
		data: data,
		beforeSend: function (){
			api.showProgress();
		},
		success: function (ret) {
			if (ret && ret.type == 1) {
				api.hideProgress();
				call(ret)
			}
		},
		complete: function (){
			api.hideProgress();
		},
	})
}

//显示已投放或未投放的商家
function showMerchant(call) {
	var param = {
		merchantId: app.getStorage('merchantId'),
		commercialId: vm.commercialId,
		status: vm.status,
		merchantType: vm.selectType,
		sort: vm.selectSort,
		merchantName: vm.searchInput,
		pageNum: vm.pageNum,
		pageSize: vm.pageSize
	};
	
	console.log(JSON.stringify(param))
	app.ajax({
		url:app.server.popularPutUrl,
		data: param,
		beforeSend: function() {
			api.showProgress();
		},
		success: function (ret) {
			console.log(JSON.stringify(ret))
			if (ret && ret.result) {
				
				call(ret);
			} else {
				api.toast({
					msg: '没有更多数据啦',
					location: 'middle'
				})
			}
		},
		complete: function () {
			api.hideProgress();
		}
	})
}

//删除或添加投放的商家
function merchantOperate(Url, data, call) {
	app.ajax({
		url: Url,
		data: data,
		beforeSend: function () {
			api.showProgress();
		},
		success: function (ret) {
			if (ret) {
				call(ret);
				api.hideProgress();
			}
		},
		error: function (err) {
			if (err) {
				api.toast({
					msg: '请求失败'
				});
			}
		},
		complete: function () {
			api.hideProgress();
		}
	});	
}