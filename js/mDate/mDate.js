/**
 * Created by O_o_Vampire on 2017/2/7.
 */
(function () {
    var mDate = function (container, params) {

        // 默认设置
        var defaults = {
            sysYear: new Date().getFullYear(),
            sysMonth: new Date().getMonth(),
            sysDay: new Date().getDate(),
            weeks: ["一", "二", "三", "四", "五", "六", "日"],
            swiper: {
                autoHeight: true,
                longSwipesRatio: 0, // 滑动所需拖动最小距离
                followFinger: false, // 释放手指后滑动
                initialSlide: 0,
                onSlideChangeStart: function () { // 切换过程中禁止用户再次切换,以免切换到未来月份
                    if (swiper) {
                        swiper.disableTouchControl();
                        m.setDate(defaults.sysYear + "-" + (1 + swiper.activeIndex));
                        swiper.enableTouchControl();
                    }
                }
            }
        };
        var m = this; // mDate
        var date;
        m.getDate = function () {
            return date.join("-");
        };
        m.setDate = function (dateStr) {
            dateStr = formatDate(dateStr).split("-");

            if (dateStr[1] != date[1]) {
                var act = document.querySelector(".md-month .active"),
                    actNode = document.querySelector(".md-month span:nth-child(" + (dateStr[1]) + ")");
                act.className = act.className.replace("active", "");
                actNode.className += " active";
                date[1] = dateStr[1];
                date = [date[0], date[1]];
                monthChange();
            }

            if (dateStr[2]) {
                if (date[2] && dateStr[2] != date[2]) {
                    date[2] = dateStr[2]
                    dayChange();
                } else {
                    date[2] = dateStr[2];
                    dayChange();
                }
            }
        };

        params = params || {};
        m.params = params;

        // 格式化时间
        function formatDate(date) {
            var arr = date.split("-");
            for (var i = 0; i < arr.length; i++) {
                arr[i] = ("0" + arr[i]).slice(i == 0 ? -4 : -2);
            }
            return arr.join("-");
        }

        // 初始化时间
        function initDate() {
            if (m.params.date) {
                var arr = formatDate(m.params.date).split("-");
                date = arr;

            } else {
                date = formatDate(defaults.sysYear + "-" + (defaults.sysMonth + 1)).split("-");
            }
        }


        // 判断当前年是否为闰年( 是闰年返回1,否则返回0 )
        function isLeap(year) {
            var year = year || defaults.sysYear;
            return year % 4 == 0 ? (year % 100 != 0 ? 1 : (year % 400 == 0 ? 1 : 0)) : 0;
        }

        // 当前年每月天数( 返回当前年每月天数的一个数组 [1月天数, ... , 12月天数] );
        function days_per_month(year) {
            return new Array(31, 28 + isLeap(year || defaults.sysYear), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        }

        // 判断当前月第一天是星期几( 返回 [0-6] 中的一个,0 代表星期天,1 代表星期一，以此类推 )
        function firstDay(month) {
            var y = defaults.sysYear,
                m = typeof month == "undefined" && defaults.sysMonth || month;
            return new Date(y, m, 1).getDay();
        }

        // 创建日历 head
        function createHead() {
            var n = document.createElement("div"),
                n1 = document.createElement("div"),
                n2 = document.createElement("div");
            n.className = "md-month";
            n2.className = "md-day";

            // 创建月份
            var i = 0, span;
            do {
                span = document.createElement("span");
                span.setAttribute("data-num", i);
                span.innerText = i + 1 + "月";
                n1.appendChild(span);
                i++;
            } while (i < 12);
            n1.childNodes[defaults.sysMonth].className = "md-toMonth";
            // 创建星期几
            i = 0;
            do {
                span = document.createElement("span");
                span.innerText = defaults.weeks[i];
                n2.appendChild(span);
                i++
            } while (i < 7);
            n.appendChild(n1);
            container.appendChild(n);
            container.appendChild(n2);
            var mBtns = document.querySelectorAll(".md-month span");
            for (var i = 0; i <= defaults.sysMonth; i++) { // 实际可切换月份
                mBtns[i].addEventListener("click", (function (i) {
                    return function () {
                        swiper && swiper.slideTo(i);
                    };
                })(i));
            }
        }

        // 创建日历 body
        function createBody() {
            var swiperContainer = document.createElement("div"),
                swiperWrapper = document.createElement("div");
            swiperContainer.className = "swiper-container";
            swiperWrapper.className = "swiper-wrapper";
            var perMonth = days_per_month(defaults.sysYear), // 当前年每月天数
                fDay, // 每月第一天是星期几
                span;
            for (var i = 0; i < 12; i++) {
                swiperSlide = document.createElement("div");
                swiperSlide.className = "md-days swiper-slide";
                // 每月日期开始的空白节点
                fDay = firstDay(i), fDay = fDay && fDay - 1 || 6;
                for (var j = 0; j < fDay % 7; j++) {
                    span = document.createElement("span");
                    span.className = "gap"
                    swiperSlide.appendChild(span);
                }
                // 每月日期
                for (var k = 1; k <= perMonth[i]; k++) {
                    span = document.createElement("span");
                    span.innerText = k;
                    if (i == defaults.sysMonth && k == defaults.sysDay) {
                        span.className = "md-today"
                    }
                    span.style.display = "inline-block";
                    swiperSlide.appendChild(span);
                }
                swiperWrapper.appendChild(swiperSlide);
            }
            swiperContainer.appendChild(swiperWrapper);
            for (var i = 0; i < defaults.sysMonth + 1; i++) { // 当月之前的日期点击事件
                var spans = swiperWrapper.childNodes[i].querySelectorAll("span:not(.gap)");
                for (var j = 0; j < spans.length; j++) {
                    if (j == defaults.sysDay && i == defaults.sysMonth) { // 实际可选择的日期
                        break;
                    }
                    spans[j].addEventListener("click", function () {
                        if (swiper) {
                            m.setDate(defaults.sysYear + "-" + (1 + swiper.activeIndex) + "-" + this.innerText);
                        }
                    });

                }

            }
            container.appendChild(swiperContainer);
            createFinish();
        }

        // 月份改变
        function monthChange() {
            if (swiper) {
                swiperLosk();
                var actDay = document.querySelector(".md-days .active");
                (actDay) && (actDay.className = actDay.className.replace("active", ""));
                monthScroll();
                (typeof m.params.monthChange == "function") && m.params.monthChange(date.join("-"));
            }
        }

        // 日期改变
        function dayChange() {
            var actDay = document.querySelector(".md-days .active");
            (actDay) && (actDay.className = actDay.className.replace("active", ""));

            document.querySelector(".md-days:nth-child(" + date[1] + ")").querySelectorAll("span:not(.gap)")[date[2] - 1].className += " active";
            (typeof params.dayChoose == "function") && params.dayChoose(date.join("-"));
        }

        // 日历锁定 解锁
        function swiperLosk() {
            if (document.querySelector(".md-month span:nth-child(" + (swiper.activeIndex + 1) + ")").className.indexOf("md-toMonth") >= 0) {
                swiper.lockSwipeToNext();
            } else {
                swiper.unlockSwipeToNext()
            }
        }

        function monthScroll() {
            // 切换选择月份
            var actNode = document.querySelector(".md-month span.active"),
                monthNode = document.querySelector(".md-month");

            // 选择的月份超出可见区域时的动画效果
            if (monthNode.scrollLeft > actNode.offsetLeft) {
                var n = monthNode.scrollLeft - actNode.offsetLeft;
                var s = setInterval(function () {
                    monthNode.scrollLeft -= (n / 10) < 1 ? 1 : (n / 10);
                    if (monthNode.scrollLeft - 1 <= actNode.offsetLeft)
                        clearInterval(s);
                }, 10);
            } else if (monthNode.scrollLeft < actNode.offsetLeft + actNode.offsetWidth - document.documentElement.clientWidth) {
                var n = actNode.offsetLeft + actNode.offsetWidth - document.documentElement.clientWidth - monthNode.scrollLeft;
                var s = setInterval(function () {
                    monthNode.scrollLeft += (n / 10) < 1 ? 1 : (n / 10);
                    if (monthNode.scrollLeft + 1 >= actNode.offsetLeft + actNode.offsetWidth - document.documentElement.clientWidth)
                        clearInterval(s);
                }, 10);
            }
        }

        var swiper = null;

        // 创建完成
        function createFinish() {
            initDate();
            document.querySelectorAll(".md-month span")[date[1] - 1].className += " active";
            monthScroll();
            defaults.swiper.initialSlide = date[1] - 1;
            swiper = new Swiper(".swiper-container", defaults.swiper);
            swiper.lockSwipeToNext();
            // 依赖 swiper
            (typeof m.params.mDateOnReady == "function") && m.params.mDateOnReady(m);
        }

        // 初始化mDate
        m.init = function () {
            createHead();
            createBody();
        };
        m.init();
        return m;
    };
    window.mDate = mDate;
})();
