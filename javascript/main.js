//  Created by Simon on 16/10/8.
//

// var createPie = require("./create").createPie;
// var createLine = require("./create").createLine;
//
// var echarts = require("./echarts");
// var $ = require("./jquery2.1.4.min");
// require("./getProductVersion")()

var createPie = require("./create").createPie;
var createLine = require("./create").createLine;

require("./getProductVersion")()


//页面初始化时 动态加载DOM，并展现默认数据
$(function () {
	setTimeout(function () {
		var productVal = $("#product").val();
		var versionVal = $("#version option:selected").text();
		$.ajax({
			type: "get", 
			url: "./testData/package.json",
			data: {
				product: productVal,
				version: versionVal
			},
			dataType: "jsonp",
			jsonpCallback: "jsonp1",
			success: modifyDom,
			// error: function (e) {
			// 	console.log(e)
			// }
		}, 3000)
	});
})
//绑定点击按钮事件
$(function () {
	$(".sumbit").click(function () {
		var productVal = $("#product").val();
		var versionVal = $("#version option:selected").text();
		$.ajax({
			type: "get",
			url: "./testData/package.json",

			data: {
				product: productVal,
				version: versionVal
			},
			dataType: "jsonp",
			jsonp: "callback",
			jsonpCallback: "jsonp1",
			success: modifyDom
			// error: function (e) {
			// 	console.log(e)
			// }
		});


	})
});
//动态解析数据
function modifyDom(data) {
    var datalength = data.datainfo.length;

    // $(".echart").hide().filter(".echart:lt(" + datalength + ")").show()
    for (var i = 0; i < datalength; i++) {
        //判断是否为饼图&&制作饼图
        if (data.datainfo[i].type == "pie" && data.datainfo[i].modules == "aaa") {

            var pietitle = data.datainfo[i].title;
            var piedesc = data.datainfo[i].desc;

            var dataArry = data.datainfo[i].data;

            var legenddata = []
            for (var j = 0; j < dataArry.length; j++) {
                legenddata.push(dataArry[j].name)
            }
            ;

            var divdata = echarts.init(document.getElementById("div1"));
            createPie(divdata, dataArry, legenddata, pietitle, piedesc)

        };
    };


	for (var i = 0; i < datalength; i++) {
        //判断是否为折线图&&制作折线图
        if (data.datainfo[i].type == "line" && data.datainfo[i].modules == "CPU") {
            linetitle = data.datainfo[i].title;
            linelink = data.datainfo[i].link;
            timedata = data.datainfo[i].time;
            linedata = data.datainfo[i].data;
            legenddata = [];
            for (var j = 0; j < linedata.length; j++) {
                legenddata.push(linedata[j].name)
            }
            var divdata = echarts.init(document.getElementById("div3_1"))
            createLine(divdata, linetitle, linelink, legenddata, timedata, linedata)
        };
        if(data.datainfo[i].type == "line" && data.datainfo[i].modules == "MEM"){
            linetitle = data.datainfo[i].title;
            linelink = data.datainfo[i].link;
            timedata = data.datainfo[i].time;
            linedata = data.datainfo[i].data;
            legenddata = [];
            for (var j = 0; j < linedata.length; j++) {
                legenddata.push(linedata[j].name)
            }
            var divdata = echarts.init(document.getElementById("div3_2"))
            createLine(divdata, linetitle, linelink, legenddata, timedata, linedata)
        };
        if(data.datainfo[i].type == "line" && data.datainfo[i].modules == "FPS"){
            linetitle = data.datainfo[i].title;
            linelink = data.datainfo[i].link;
            timedata = data.datainfo[i].time;
            linedata = data.datainfo[i].data;
            legenddata = [];
            for (var j = 0; j < linedata.length; j++) {
                legenddata.push(linedata[j].name)
            }
            var divdata = echarts.init(document.getElementById("div3_3"))
            createLine(divdata, linetitle, linelink, legenddata, timedata, linedata)
        }
    }


	for (var i = 0; i < datalength; i++) {
		//判断是否为柱状图
		if (data.datainfo[i].type == "bar" && data.datainfo[i].modules == "Special") {

			title = data.datainfo[i].title;

			title_link = data.datainfo[i].link;
			Xdata = data.datainfo[i].Xdata;
			bardata= data.datainfo[i].data;
			desc = data.datainfo[i].desc
			legenddata = [];
            for (var j = 0; j < bardata.length; j++) {
                legenddata.push(bardata[j].name)
            }
            console.log(legenddata)
			var divdata = echarts.init(document.getElementById("div2_2"))
			Histogram(divdata,desc,title,title_link,Xdata,legenddata,bardata)

		}
        if (data.datainfo[i].type == "bar" && data.datainfo[i].modules == "CPU") {

            title = data.datainfo[i].title;

            title_link = data.datainfo[i].link;
            Xdata = data.datainfo[i].Xdata;
            bardata= data.datainfo[i].data;
            desc = data.datainfo[i].desc
            legenddata = [];
            for (var j = 0; j < bardata.length; j++) {
                legenddata.push(bardata[j].name)
            }
            console.log(legenddata)
            var divdata = echarts.init(document.getElementById("div4_1"))
            Histogram(divdata,desc,title,title_link,Xdata,legenddata,bardata)

        }
        if (data.datainfo[i].type == "bar" && data.datainfo[i].modules == "MEM") {

            title = data.datainfo[i].title;

            title_link = data.datainfo[i].link;
            Xdata = data.datainfo[i].Xdata;
            bardata= data.datainfo[i].data;
            desc = data.datainfo[i].desc
            legenddata = [];
            for (var j = 0; j < bardata.length; j++) {
                legenddata.push(bardata[j].name)
            }
            console.log(legenddata)
            var divdata = echarts.init(document.getElementById("div4_2"))
            Histogram(divdata,desc,title,title_link,Xdata,legenddata,bardata)

        };
        if (data.datainfo[i].type == "bar" && data.datainfo[i].modules == "FPS") {

            title = data.datainfo[i].title;

            title_link = data.datainfo[i].link;
            Xdata = data.datainfo[i].Xdata;
            bardata= data.datainfo[i].data;
            desc = data.datainfo[i].desc
            legenddata = [];
            for (var j = 0; j < bardata.length; j++) {
                legenddata.push(bardata[j].name)
            }
            console.log(legenddata)
            var divdata = echarts.init(document.getElementById("div4_3"))
            Histogram(divdata,desc,title,title_link,Xdata,legenddata,bardata)

        };
        if (data.datainfo[i].type == "bar" && data.datainfo[i].modules == "Starttime") {

            title = data.datainfo[i].title;

            title_link = data.datainfo[i].link;
            Xdata = data.datainfo[i].Xdata;
            bardata= data.datainfo[i].data;
            desc = data.datainfo[i].desc
            legenddata = [];
            for (var j = 0; j < bardata.length; j++) {
                legenddata.push(bardata[j].name)
            }
            console.log(legenddata)
            var divdata = echarts.init(document.getElementById("div5_1"))
            Histogram(divdata,desc,title,title_link,Xdata,legenddata,bardata)

        };

	}
}

