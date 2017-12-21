(function (window) {
    function jpush() {
        if (typeof api == "object") {
            var jpush = api.require('ajpush');


            // 应用回到前台
            api.addEventListener({name: 'resume'}, function () {
                jpush.onResume();
                // 恢复推送
                if (app.getStorage("isLogin"))
                    jpush.resumePush();

            });

            // 应用进入后台
            api.addEventListener({name: 'pause'}, function () {
                jpush.onPause();
            });

            // 停止推送
            api.addEventListener({name: 'stopJPush'}, function () {
                // jpush.stopPush();

                // 使用stop resume的机制会导致切换用户时收到上个用户的通知所以设置别名为stop确保用户切换时正常接收通知
                jpush.bindAliasAndTags({
                    alias: "stop",
                    tags: []
                }, function (ret) {
                    console.log(JSON.stringify(ret));
                });

            });

            // 设置消息监听，若iOS应用在前台运行，此时收到推送后也通过此方法回调
            jpush.setListener(
                function (ret) {
                    console.log(JSON.stringify(ret));
                    
                    var ext = ret.extra;
                    message(ext);
                    
                    // 付款消息
                    if (ext.orderAmount) {
                        var speechRecognizer = api.require('speechRecognizer');
                        speechRecognizer.read({
                            readStr: '美邻到账：' + ext.orderAmount + '元',
                            //readStr: '收到消息：' + message.content,
                            volume: 100,
                            voice: 'vixy'
                        });
                    }
                }
            );

            return jpush;
        } else {
            console.warn("请在onReady之后初始化");
            return null;
        }
    }

    window.JPush = jpush;
})(window);



function message(msg) {
	if (msg.pushSource == 'sys_msg') {
		api.sendEvent({
        	name: 'paid',
        	extra: {
        		ext: msg
        	}
        });
	}
}
