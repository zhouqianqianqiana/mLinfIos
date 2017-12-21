/**
 * 微信支付
 * @param {Object} trade = {
 * 	id : '12342',// 商品ID
 * 	description : '', // 商品描述
 * 	fee : '1' // 商品总价
 * } 必填，商品信息
 * @param {Function} afterpay 可选，调用支付接口完成后的回调函数
 */
function wxpay(trade, afterpay){

	if(isEmpty(trade)) return;
	var wxPay = api.require('wxPay');
	wxPay.config({
	     apiKey: 'wx162a8601b561892a',
	     mchId: '1281535901',
	     partnerKey: 'E4D5093A9CC8D2B6768B384FFCCF5E85',
//	     notifyUrl: 'http://123.57.177.111:8080/app/login.do'
		 notifyUrl:'http://123.57.177.111:8080/web/admin/payOrder/backNotify.do'
	}, function(ret, err){
	     if(ret.status){
			wxPay.pay({
			     description: trade.description, //商品或支付订单简要描述
			     totalFee: trade.fee, //价格
			     tradeNo: trade.id, //订单号
			     spbillCreateIP: '',
			     deviceInfo: '',
			     detail: '',
			     attach: '',
			     feeType: 'CNY',
			     timeStart: '',
			     timeExpire: '',
			     goodsTag: '',
			     productId: '',
			     openId: ''
			},function(ret, err){
			     if(ret.status){
			         
			     }else{
			         if(err.code == -2){
			         	api.alert("取消支付！");
			         } else if(err.msg == 'NOTENOUGH'){
			         	api.alert("余额不足！");
			         } else if(err.msg == 'ORDERCLOSED'){
			         	api.alert("订单已关闭！");
			         } else {
			         	api.alert("支付失败！");
			         }
			     }
		         afterpay && afterpay(ret.status)
			});
	        
	     }else{
	           afterpay && afterpay(false);
	     }
	});
}