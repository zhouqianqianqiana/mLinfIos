(function (window) {
    var v = {};

    // 如果有匹配项返回第一个匹配结果，否则返回空字符串
    function exec(reg, val) {
        var value = (reg.exec(val)) && reg.exec(val)[0] || "";
        if (!value)
            console.warn("verify bad: ");
        return value;
    }

    v.couponNum = function (val) {
        return exec(/^[1-9]\d{0,3}/, val);
    };
    v.couponDiscount = function (val) {
        return exec(/^[1-9]\.\d?|^[1-9]/, val);
    };
    v.couponFull = function (val) {
        return exec(/^[1-9]\d{0,4}/, val);
    };

    v.verifyCode = function (val) {
        return exec(/^\d{0,4}/, val);
    };
    v.phone = function (val) {
        return exec(/^(13|14|15|18)[0-9]\d{8}/, val);
    };
    window.Verify = v;
})(window);