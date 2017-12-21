onReady = function () {
    var vm = new Vue({
        el: ".view",
        data: {
            beginText: "--",
            endText: "--",
            openTime: "",
            closeTime: "",
            merchantInfo: "111",
            uploads: [],
            imgUrl: app.server.imgUrl,
            delList: []
        },
        methods: {
            changeTime: function () {
                if (this.openTime == "" || this.closeTime == "") {
                    this.openTime = this.beginText;
                    this.closeTime = this.endText.slice(-5);
                    return;
                }
                this.beginText = this.openTime;
                this.endText = this.closeTime;
                if (this.openTime >= this.closeTime) {
                    this.endText = "次日 " + this.closeTime;
                }
            },
            getInfo: function () {
                var that = this;
                app.ajax({
                    url: app.server.storeInfo,
                    data: {
                        merchantId: app.getStorage("merchantId")
                    },
                    beforeSend: function () {
                        api.showProgress();
                    },
                    success: function (ret) {
//                      console.log(JSON.stringify(ret.result));
                        if (ret.code == 1000) {
                            ret = ret.result;
                            that.beginText = ret.open_time||"09:00";
                            that.endText = ret.close_time||"10:00";
                            that.merchantInfo = ret.merchant_info || "";
                            that.changeTime();
                            var imgs = ret.img_merchant;
                            uploadCount = uploadCountDom.innerText = imgs.length;
                            if (uploadCount >= 5) {
								document.querySelector(".weui-uploader__input-box").style.display = "none";
							}
                            var uploaderFiles = document.querySelector("#uploaderFiles");
                            for (var i = 0; i < imgs.length; i++) {
                                var dom = document.createElement("li");
                                dom.className = "weui-uploader__file";
                                dom.style.backgroundImage = "url("+ that.imgUrl + imgs[i] + ")";
                                dom.setAttribute("data-id", i+100);
                                uploaderFiles.appendChild(dom);
                                var img = {
                                    id: i + 100,
                                    url: imgs[i]
                                };
                                uploadList.push(img);
                                that.uploads.push(img);
                            }
                        }
                    },
                    complete: function () {
                        api.hideProgress();
                    }
                });
            },
            save: function () {
                var that = this;
                var imgs = [];
                for (var i = 0, len = that.uploads.length; i < len; ++i) {
                    var url = that.uploads[i].url;
                    imgs.push(url);
                }
                app.ajax({
                    url: app.server.storeUpdate,
                    data: {
                        merchantId: app.getStorage("merchantId"),
                        openTime: that.openTime,
                        closeTime: that.closeTime,
                        merchantInfo: that.merchantInfo,
                        imgMerchant: imgs,
                        deleteImg: that.delList
                    },
                    beforeSend: function () {
                        api.showProgress();
                    },
                    success: function (ret) {
                        if (ret.code == 1000) {
                            api.toast({
                                msg: "保存成功"
                            });
                        } else {
                            api.toast({
                                msg: "保存失败,请稍后尝试"
                            });
                        }
                    },
                    complete: function () {
                        api.hideProgress();
                    }
                });
            }
        }
    });

    vm.getInfo();
    initUpload();

    var uploadCount = 0,
        uploadList = [];
    var uploadCountDom = document.querySelector("#uploadCount");
	
    /* 初始化上传图片 */
    function initUpload() {

        /* 图片自动上传 */
        weui.uploader('#uploader', {
            url: app.server.couponAddImgUrl,
            auto: true,
            type: 'file',
            fileVal: 'fileVal',
            onBeforeQueued: function onBeforeQueued(files) {
                if (["image/jpg", "image/jpeg", "image/png", "image/gif"].indexOf(this.type) < 0) {
                    alert('请选择图片');
                    return false;
                }
                if (this.size > 10 * 1024 * 1024) {
                    alert('请上传不超过10M的图片');
                    return false;
                }
                if (files.length > 5) {
                    // 防止一下子选择多张图片
                    alert("最多选择5张图片");
                    return false;
                }
                
                ++uploadCount;
                uploadCountDom.innerHTML = uploadCount;
            },
            onQueued: function onQueued() {
            	if (uploadCount >= 5) {
                    document.querySelector(".weui-uploader__input-box").style.display = "none";
                    return false;
                }
//          	console.log(JSON.stringify(this))
                uploadList.push(this);
            },
            onSuccess: function onSuccess(ret) {
//          	console.log(JSON.stringify(ret))
                var that = this;
                vm.uploads.push({
                    id: that.id,
                    url: ret.result
                });
                
//              console.log(JSON.stringify(vm.uploads))
            },onError: function onError(err) {
            	
            }
        });


        // 缩略图预览
        document.querySelector('#uploaderFiles').addEventListener('click', function (e) {
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
                className: 'custom-name',
                onDelete: function onDelete() {
                    weui.confirm('确定删除该图片？', function () {
                        --uploadCount;
                        document.querySelector(".weui-uploader__input-box").style.display = "block";
                        uploadCountDom.innerHTML = uploadCount;

                        for (var i = 0, len = uploadList.length; i < len; ++i) {
                            var file = uploadList[i];
                            if (file.id == id) {
                                // 如果是weui选择的图片的图片
                                (typeof file.stop == "function") && file.stop();
                                break;
                            }
                        }
                        target.remove();
                        gallery.hide();

                        // 删除页面图片同时删除上传图片
                        for (var i = 0, len = vm.uploads.length; i < len; ++i) {
                            var file = vm.uploads[i];
                            // 上传图片与页面图片对应
                            if (file.id == id) {
                                // 删除图片
                                vm.uploads.splice(i, 1);
                                vm.delList.push(file.url);
                                break;
                                
                            }
                        }
                    });
                }
            });
        });
    }
};

var f7 = new Framework7();

$("textarea").click(function () {
    var that = this;
    setTimeout(function () {
        that.scrollIntoViewIfNeeded();
    }, 400)

});