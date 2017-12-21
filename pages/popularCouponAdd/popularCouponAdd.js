
var vm = new Vue({
	el: '.view',
	data: {
		eTime: '',
		bTime: '',
		couponData:{
			typeCode: "commercial_food_coupon",
            startTime: "",
            endTime: "",
            discount: "",
            fullAmount: "",
            minusAmount: "",
			couponImg: "",
            description: "",
            discount_area: "0",
            count: "",
            store_limit_des: "",
            nextDayUse: true,
            auto_push: true,
            share_title: "",
            share_content: ""
		},
		type: {'commercial_food_coupon': '菜品', 'commercial_discount': '折扣', 'commercial_full_minus': '满减'},
		discount: [{val: "0", text: "无限制"}],
		type_code: 'commercial_food_coupon',
		agree: true,
		timeErr: true,

	},
	methods: {
		time: function () {
			//防止用户清楚时间
			if (vm.couponData.startTime == '' || vm.couponData.endTime == '') {
				vm.bTime = vm.eTime = vm.couponData.startTime = vm.couponData.endTime = getDateStr();
				return;
			}
			//不能小于当前时间
			if (vm.couponData.startTime < getDateStr() || vm.couponData.endTime < getDateStr()) {
				api.toast({
					msg: '选择时间不能小于当前时间',
					location: 'middle'
				})
				vm.bTime = vm.eTime = vm.couponData.endTime = vm.couponData.startTime = getDateStr();
				return;
			}
			if (vm.couponData.startTime > vm.couponData.endTime) {
				api.toast({
					msg: '开始时间不能大于结束时间',
					location: 'middle'
				})
				vm.couponData.endTime = vm.couponData.startTime;
				vm.bTime = vm.eTime = vm.couponData.startTime;
				return;
			}
			vm.bTime = vm.couponData.startTime;
			vm.eTime = vm.couponData.endTime;
		},
		discountInput: function () {
			vm.couponData.discount = Verify.couponDiscount(vm.couponData.discount);
		},
		fullAmount: function () {
			vm.couponData.fullAmount = Verify.couponFull(vm.couponData.fullAmount);
			this.changeAmount();
			
		},
		minusAmount: function () {
			vm.couponData.minusAmount = Verify.couponFull(vm.couponData.minusAmount);
			this.changeAmount();
		},
		changeAmount: function () {
			if (~~vm.couponData.minusAmount >= ~~vm.couponData.fullAmount) {
				api.toast({
					msg: '请输入正确的满减信息',
					location: 'middle'
				})
				vm.couponData.minusAmount = 0;
			}
		},
		numInput: function () {
			vm.couponData.count = Verify.couponNum(vm.couponData.count);
		},
		submit: function () {
			if (checkForm()) {
				var param = vm.couponData;
				param.merchantId = app.getStorage('merchantId');
				submitCoupon(param, function (ret) {
					api.toast({
						msg: '添加成功',
						location: 'middle'
					})
					api.execScript({
						name: 'popularCoupon',
						script: 'initData()'
					});
					setTimeout(function (){
						api.closeToWin({
							name: 'popularCoupon'
						});
					}, 1000);
					
				})
				
			}
		}
	}
});
initDate();
onReady = function () {
	vm.type_code = vm.couponData.typeCode = api.pageParam.type || 'commercial_discount';
}

//提交表单
function submitCoupon(data, call) {
	app.ajax({
		url: app.server.popularCouponAdd,
		data: data,
		beforeSend: function () {
			api.showProgress({
				text: '努力提交中...',
			    modal: false
			});
		},
		success: function (ret) {
			if (ret && ret.type == 1) {
				api.hideProgress();
				call(ret)
			} else{
				api.toast({
					msg: ret.msg,
					location: 'middle'
				})
			}
		},
		error: function (err) {
			console.log(JSON.stringify(err))
		},
		complete: function () {
			api.hideProgress();
		}
	})
}

//表单检查
function checkForm() {
	if (vm.type_code == 'commercial_fullMinus') {
		if(!vm.couponData.fullAmount && !vm.couponData.minusAmount) {
			api.toast({
				msg: '请输入满减信息',
				location: 'middle'
			});
			return false;
		}
	} else if (vm.type_code == 'commercial_discount') {
		if (!vm.couponData.discount) {
			api.toast({
				msg: '请输入折扣信息',
				location: 'middle'
			});
			return false;
		}
	}
	if (!vm.couponData.count && vm.couponData.count<=0) {
		api.toast({
			msg: '请输入发放数量',
			location: 'middle'
		});
		return false;
	}
	if (!vm.agree) {
		api.toast({
			msg: '请勾选已阅读',
			location: 'middle'
		});
		return false;
	}

	return true;
}

 if (vm.type_code == 'commercial_food_coupon') {
 	initUpdate();
 }
function initUpdate() {

    /* 图片自动上传 */
    var uploadCount = 0,
        uploadList = [];
    var uploadCountDom = document.getElementById("uploadCount");
    weui.uploader('#uploaderCustom', {
        url: app.server.couponAddImgUrl,
        auto: true,
        type: 'file',
        fileVal: 'fileVal',
        onBeforeQueued: function onBeforeQueued(files) {
            if (["image/jpg", "image/jpeg", "image/png", "image/gif"].indexOf(this.type) < 0) {
                weui.alert('请上传图片');
                return false;
            }
            if (this.size > 10 * 1024 * 1024) {
                weui.alert('请上传不超过10M的图片');
                return false;
            }
            if (files.length > 1) {
                // 防止一下子选择多张图片
                return false;
            }
            ++uploadCount;
            document.querySelector(".weui-uploader__input-box").style.display = "none";
            uploadCountDom.innerHTML = uploadCount;
            console.log(files)
        },
        onQueued: function onQueued() {
            uploadList.push(this);
            console.log(this)
        },
        onSuccess: function onSuccess(ret) {
            console.log(JSON.stringify(ret));
            vm.couponData.couponImg = ret.result || '';
        },
        onError: function onError(err) {
            console.log(this, err);
        }
    });

// 缩略图预览
document.querySelector('#uploaderCustomFiles').addEventListener('click', function (e) {
	    var target = e.target;

	    while (!target.classList.contains('weui-uploader__file') && target) {
	        target = target.parentNode;
	    }
	    if (!target) return;
	    var url = target.getAttribute('style') || '';
	    var id = target.getAttribute('data-id');
	    if (url) {
	        url = url.match(/url\((.*?)\)/)[1].replace(/"/g, '');
	    }
	    var gallery = weui.gallery(url, {
	        onDelete: function onDelete() {
	            weui.confirm('确定删除该图片？', function () {
	            	--uploadCount;
	            	document.querySelector(".weui-uploader__input-box").style.display = "block";
	                uploadCountDom.innerHTML = uploadCount;
	                var index;
	                for (var i = 0, len = uploadList.length; i < len; ++i) {
	                    var file = uploadList[i];
	                    if (file.id == id) {
	                        index = i;
	                        break;
	                    }
	                }
	                if (index) uploadList.splice(index, 1);
					vm.couponData.couponImg = '';
	                target.remove();
	                gallery.hide();
	            });
	        }
	    });
	});
  }



//获取日期字符串
function getDateStr() {
    var date = new Date();
    return [date.getFullYear(), ("0" + (date.getMonth() + 1)).slice(-2), ("0" + date.getDate()).slice(-2)].join("-");
}
// 初始化时间
function initDate() {
    var dateStr = getDateStr();
    vm.bTime = vm.eTime = vm.couponData.startTime = vm.couponData.endTime =  dateStr;
}
