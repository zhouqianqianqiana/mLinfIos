var vm = new Vue({
	el: '.view',
	data: {
		vipList:[],
		totalNum: 0,
		pageSize: 20,
		pageNum: 1,
		timer: '',
		imgUrl: app.server.imgUrl,
		defaultImg: '../../../image/me/vip.png'
	}
});
		
	var f7 = new Framework7();
	var $ = Dom7;
	var ptrContent = $('.pull-to-refresh-content');
	//下拉刷新
	ptrContent.on('refresh', function (e) {
		isLoading = true;
		vm.pageNum = 1;
		getList({
			merchantId: app.getStorage('merchantId'),
			pageNum: vm.pageNum,
	        pageSize: vm.pageSize,
	        date : vm.timer
		}, function (ret) {
			if (ret && ret.type == 1) {
				vm.vipList = ret.result.list;
				vm.totalNum = ret.result.total;
			}
		});
		
		setTimeout(function () {
			f7.pullToRefreshDone();
		},1000);
	});
	
	
	//上拉加载更多
	var isLoading = true;
	$('.infinite-scroll').on('infinite', function () {
		if (isLoading) {
			isLoading = false;
			vm.pageNum++;
			getList({
				merchantId: app.getStorage('merchantId'),
				pageNum: vm.pageNum,
		        pageSize: vm.pageSize,
		        date : vm.timer
			}, function (ret) {
				if (ret && ret.type == 1) {
					console.log(vm.pageNum)
					if (ret.result.list == 0) {
						isLoading = false;
						vm.pageNum--;
						api.toast({
							msg: '没有更多数据啦',
							location: 'middle'
						});
					} else {
						isLoading = true;
						vm.vipList = vm.vipList.concat(ret.result.list);
					}
				}
			});
			
		}
	});
		
		
		
		onReady = function () {
			getList({
				merchantId: app.getStorage('merchantId'),
				pageNum: vm.pageNum,
		        pageSize: vm.pageSize,
		        date : vm.timer
			}, function (ret) {
				if (ret && ret.type == 1) {
					vm.vipList = ret.result.list;
					vm.totalNum = ret.result.total;
				}
			});
		}
		//获取会员列表
		function getList(data, call) {
			app.ajax({
				url: app.server.vipList,
				data: data,
				beforeSend: function () {
					api.showProgress();
				},
				success: function (ret) {
					call(ret)
				},
				complete: function () {
					api.hideProgress();
				}
			})
			
		}