
//  Created by Simon on 16/10/8.
//
// $(function () {
//     $(".sumbit").click(function () {
//         var productVal = $("#product").val();
//         var versionVal = $("#version option:selected").text();
//         $.ajax({
//             type:"get",
//             url:"./testData/package.json",
//
//             data:{
//                 product:productVal,
//                 version:versionVal
//             },
//             dataType:"jsonp",
//             jsonp:"callback",
//             jsonpCallback:"jsonp1",
//             success:function (data) {
//                 var datalength = data.datainfo.length
//                 console.log(datalength)
//                 $(".echart").hide().filter(".echart:lt("+datalength+")").show()
//
//
//             },
//             error:function (e) {
//                 console.log(e)
//             }
//         });
//
//
//     })
// });
//制做饼图函数

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
            error: function (e) {
                console.log(e)
            }
    },0)
    });
})

function modifyDom(data) {
    var datalength = data.datainfo.length;
    $(".echart").hide().filter(".echart:lt(" + datalength + ")").show()
    for(var i=0;i<datalength;i++){
        //判断是否为饼图&&制作饼图
        if(data.datainfo[i].type == "pie"){
            //获取标题，描述
            var pietitle = data.datainfo[i].title;
            var piedesc = data.datainfo[i].desc;
            //获取要构建饼图的数据
            var dataArry = data.datainfo[i].data;
            //获取图例配置的基本数据
            var legenddata = []
            for(var i=0;i<dataArry.length;i++){
                legenddata.push(dataArry[i].name)
            };
            //抓取页面容器，初始化图表容器DIV
            var divdata = echarts.init(document.getElementById("div1"))
            createPie(divdata,dataArry,legenddata,pietitle,piedesc)
            console.log(legenddata)
        }
    };


}
