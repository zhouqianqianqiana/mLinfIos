var vm = new Vue({
			el: '#app',
			data: {
				monthVip: 0,
				totalVip: 0,
				eachMonth:{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":2,"9":0,"10":0,"11":0,"12":0}
			}
		})
		
		
		
onReady = function () {
	var vipData = [
        {"number":0,"month":"1"},
        {"number":0,"month":"2"},
        {"number":0,"month":"3"},
        {"number":0,"month":"4"},
        {"number":0,"month":"5"},
        {"number":0,"month":"6"},
        {"number":0,"month":"7"},
        {"number":0,"month":"8"},
        {"number":0,"month":"9"},
        {"number":0,"month":"10"},
        {"number":0,"month":"11"},
        {"number":0,"month":"12"}
      ];
	getVip({
		merchantId: app.getStorage('merchantId')
	}, function (ret) {
		if (ret && ret.type == 1) {
			if (ret && ret.result) {
				var month = new Date().getMonth() + 1;
				vm.totalVip = ret.result.totalNum;
				vm.monthVip = ret.result.eachMonth[month];
				vm.eachMonth = ret.result.eachMonth;
				for (i = 1; i <= 12; i++) {
					vipData[i-1]['number'] = vm.eachMonth[i];
				}
				renderChart(vipData);
			}
		}
	});
}
		
		
function getVip(data, call) {
	app.ajax({
		url: app.server.vipCount,
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
		
//	var a = 10;
function renderChart(vipData) {
    GM.Global.pixelRatio = 2;
	GM.Global.colors = ["#f37b2b"];
      
      var chart = new GM.Chart({
        id: 'vip'
      });
      chart.source(vipData, {
        tem: {
          tickCount: 5
        }
      });
      //配置刻度文字大小，供PC端显示用(移动端可以使用默认值20px)
      chart.axis('month', {
        label:{
        	
          fontSize: 12 
        },
        "line": {
        	"stroke":"#fff",
        	"lineWidth":1
        },
        grid: null
      });
      chart.axis('number', {
        label:{
          fontSize: 12 
        }
      });
       
      chart.interval().position('month*number').color('month');
      chart.render();
     }