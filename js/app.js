(function (window) {
    var app = {};

    /* Server */
//  var host = "http://test.mlinf.com/app/",
    var	host = "http://192.168.0.118:8080/app/",	
//	var host = "http://192.168.0.129:8080/app/",
        imgUrl = "http://imgtest.mlinf.com/";
    app.server = {
        host: host, // 服务器
        imgUrl: imgUrl, // 图片地址
        login: host + "login.do", // 登录
        loginOut: host + "logout.do", // 退出登录
        memberInfo: host + "member/self/memberInfo.do", // 商户信息
        merchantInfo: host + "merchant/owner/merchants", // 店铺
        storeInfo: host + "merchant/detail", // 店铺设置
        storeUpdate: host + "merchant/info/update", // 修改店铺信息
        count: host + "merchant/order/find/numAndAmount", // 财务统计
        messages: host + "message/show", // 消息
        accountChange: host + "PayOrder/history/get", // 账户明细-余额变化
        accountWithdraw: host + "withdraw/find/orderlist", // 账户明细-已提现／未提现
        accountAmount: host + "withdraw/find/totalAmt", // 加载账户余额
        couponList: host + "merchant/coupon/list", // 优惠券列表
        couponEdit: host + "merchant/coupon/edit", // 优惠券编辑
        couponAdd: host + "merchant/coupon/add", // 添加优惠券
        couponAddImgUrl: host + "weixin/file/uploadFile.do?merchant_id=XX&file_type=coupon", // 菜品优惠券添加图片
        vipCount: host + "merchant/vip/count", // 会员数量
        vipList: host + "merchant/vip/list", // 会员列表
        bankEdit: host + "merchant/bank/edit", // 银行卡编辑和添加
        popularIncome: host + 'merchant/commercial/push/profit.do', // 异业推广获取年份和收益
        popularTimes: host + "merchant/commercial/month/push/num.do", // 异业推广推广统计
        popularMonthIncome: host + "merchant/commercial/push/profit.do", //异业推广收益统计
        popularGetCouponTimes: host + "merchant/commercial/find/push/Statistics.do", // 获取投放次数、领券次数、到店消费
        popularCouponList: host + "merchant/commercial/find/commercial/status.do", // 异业推广优惠券列表
        popularCouponAdd: host + "merchant/commercial/addCoupon", // 异业推广优惠券添加
        popularPutUrl: host + "merchant/commercial/find/push/merchant", // 商家投放
        popularAdvAndCoupon: host + "merchant/commercial/find/couponAndAdvertisement.do", // 显示正在投放的优惠券和广告
        addMerchant: host + "merchant/commercial/push/batchPublish.do", // 添加投放点
        delMerchant: host + "merchant/commercial/push/batchCancel.do", // 删除投放点
        popularAdvAdd: host + "merchant/commercial/addCommerial", // 添加广告
        popularAdvEdit: host + "merchant/commercial/update/commercialOrCoupon.do", // 修改广告
        popularAdvDel: host + "merchant/commercial/delete/advertisement.do", // 删除广告
        popularAdvList: host + "merchant/commonCommercial/page.do", // 获取广告列表
        getCode: host + "member/vcode.do", // 获取验证码
        resetPwd: host + "member/anon/password/modify", // 重置密码
        qrcode: host + "merchant/band/qrcode", // 绑定二维码
        popularNum: host + "merchant/commercial/find/month/pushNum", // 获取点数

    };



    var isAndroid = (/android/gi).test(navigator.appVersion);

    /* Storage */
    var uzStorage = function () {
        var ls = window.localStorage;
        if (isAndroid) {
            ls = os.localStorage();
        }
        return ls;
    };
    app.getStorage = function (key) {
        var ls = uzStorage();
        if (ls) {
            var v = ls.getItem(key);
            if (!v) {
                return;
            }
            if (v.indexOf('obj-') === 0) {
                v = v.slice(4);
                return JSON.parse(v);
            } else if (v.indexOf('str-') === 0) {
                return v.slice(4);
            }
        }
    };
    app.setStorage = function (key, value) {
        if (arguments.length === 2) {
            var v = value;
            if (typeof v == 'object') {
                v = JSON.stringify(v);
                v = 'obj-' + v;
            } else {
                v = 'str-' + v;
            }
            var ls = uzStorage();
            if (ls) {
                ls.setItem(key, v);
            }
        }
    };
    app.rmStorage = function (key) {
        var ls = uzStorage();
        if (ls && key) {
            ls.removeItem(key);
        }
    };
    app.clearStorage = function () {
        var ls = uzStorage();
        if (ls) {
            ls.clear();
        }
    };


    /* onReady */
    onReady = function () {
    };
    apiready = function () {

        /* Ajax */
        app.ajax = function (options) {
            if (typeof options != "object") return;

            var params = {
                url: "",
                method: "post",
                timeout: 10,
                dataType: "json",
                data: {
                    values: {}
                }
            };

            params.url = options.url || "";
            params.method = options.type || "post";
            params.dataType = options.dataType || "json";
            params.data.values = options.data || {};
            params.timeout = options.timeout / 1000 || 10;


            (typeof options.beforeSend == "function") && options.beforeSend();
            api.ajax(params, function (ret, err) {
                if (ret) {
                    (typeof options.success == "function") && options.success(ret);
                } else {
                    (typeof options.error == "function") && options.error(err);
                    console.warn(JSON.stringify(err));
                }
                (typeof options.complete == "function") && options.complete();
            });
        };

        if (typeof onReady == "function") {
            onReady();
        }

        var back = document.querySelectorAll("[close]");
        if (back) {
            for (var i = 0; i < back.length; i++) {
                back[i].addEventListener("click", function () {
                    api.closeWin();
                });
            }
        }

        var open = document.querySelectorAll("[open-name][open-href]");
        if (open) {
            for (var i = 0; i < open.length; i++) {
                open[i].addEventListener("click", function () {
                    api.openWin({
                        name: this.getAttribute("open-name"),
                        url: this.getAttribute("open-href"),
                        delay: 100
                    });
                });
            }
        }

    };

    app.ajax = function () {
        console.warn("ajax not ready");
    };

    /* Dom7 */
    if (typeof Dom7 == "function") {
        window.$ = Dom7;
    }


    window.app = app;
    return app;
})(window);
// 获取dom元素
	function getDom(el, selector) {
	    if (arguments.length === 1 && typeof arguments[0] == 'string') {
	        if (startWith(el, '#')) {
	            return document.getElementById(el.substring(1));
	        }
	        if (startWith(el, '.')) {
	            return document.getElementsByClassName(el.substring(1));
	        } else if (document.querySelector) {
	            return document.querySelector(arguments[0]);
	        }
	    } else if (arguments.length === 2) {
	        if (el.querySelector) {
	            return el.querySelector(selector);
	        }
	    }
	}


	function startWith(str, regexp) {
    if (regexp instanceof RegExp) {
        return !!str.match(regexp);
    } else if (typeof regexp == 'string') {
        try {
            if (str.substring(0, regexp.length) == regexp) {
                return true;
            }
        } catch (e) {
            return false;
        }
    }
    return false;
}

function extend(parent, obj) {
    obj = obj || {};
    for (var pro in parent) {
        obj[pro] = obj[pro] || parent[pro];
    }
    return obj;
}

function append(el, html) {
    if (!isElement(el)) {
        console.warn('common.append Function need el param, el param must be DOM Element');
        return;
    }
    if (typeof html == 'string') {
        el.insertAdjacentHTML('beforeend', html);
    } else {
        el.appendChild(html);
    }
    return el;
}

//判断obj是否是dom元素
function isElement(obj) {
    return !!(obj && obj.nodeType == 1);
}
