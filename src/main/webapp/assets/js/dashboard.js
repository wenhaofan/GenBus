!function ($) {
    "use strict";

    var Dashboard = function () {
    };


    //creates area chart
    Dashboard.prototype.createAreaChart = function (element, pointSize, lineWidth, data, xkey, ykeys, labels, lineColors) {
        Morris.Area({
            element: element,
            pointSize: 0,
            lineWidth: 0,
            data: data,
            xkey: xkey,
            ykeys: ykeys,
            labels: labels,
            resize: true,
            gridLineColor: '#eee',
            hideHover: 'auto',
            lineColors: lineColors,
            fillOpacity: .6,
            behaveLikeLine: true
        });
    },
        //creates Bar chart
        Dashboard.prototype.createBarChart = function (element, data, xkey, ykeys, labels, lineColors) {
            Morris.Bar({
                element: element,
                data: data,
                xkey: xkey,
                ykeys: ykeys,
                labels: labels,
                gridLineColor: '#eee',
                barSizeRatio: 0.4,
                resize: true,
                hideHover: 'auto',
                barColors: lineColors
            });
        },
        
         //creates Line chart
        Dashboard.prototype.createLineChart = function (element, data, xkey, ykeys, labels) {
            Morris.Line({
                element: element,
	            data: data,
	            xkey: xkey,
	            ykeys: ykeys,
	            labels: labels,
	             resize: true,
                hideHover: 'auto'
            });
        },

        //creates Donut chart
        Dashboard.prototype.createDonutChart = function (element, data, colors) {
            Morris.Donut({
                element: element,
                data: data,
                resize: true,
                colors: colors,
            });
        },

        Dashboard.prototype.init = function () {

            //creating line chart
            var $lineData = [
                {x: '2019-03-01', a:3400},
                {x: '2019-03-02', a: 3500},
                {x: '2019-03-03', a:  3460},
                {x: '2019-03-04', a: 4300},
                {x: '2019-03-05', a:  5000},
                {x: '2019-03-06', a:  6400},
                {x: '2019-03-07', a:  10000}
            ];
            this.createLineChart('morris-line',  $lineData, 'x', ['a'], ['用户量']);

            //creating bar chart
            var $barData = [
                { y: '1月', a: 100},
                { y: '2月', a: 750 },
                { y: '3月', a: 500},
                { y: '4月', a: 750},
                { y: '5月', a: 500 },
                { y: '6月', a: 750},
                { y: '7月', a: 1000}
            ];
            this.createBarChart('morris-bar', $barData, 'y', ['a'], ['销售额'], ['#4c84ff']);

            //creating donut chart
            var $donutData = [
                {label: "PC网站", value: 11},
                {label: "安卓手机APP", value: 14},
                 {label: "苹果手机APP", value: 15},
                {label: "微信公众号", value: 40},
                {label: "微信小程序", value: 200}
            ];
            this.createDonutChart('morris-donut', $donutData, ['#00a5a8', "#f43f5d", '#d1d337', '#10c888']);

        },
        //init
        $.Dashboard = new Dashboard, $.Dashboard.Constructor = Dashboard
}(window.jQuery),

//initializing
    function ($) {
        "use strict";
        $.Dashboard.init();
    }(window.jQuery);