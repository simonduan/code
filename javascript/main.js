/**
 * Created by Simon on 16/10/8.
 */
$(function () {
    $(".sumbit").click(function () {
        var productVal = $("#product").val();
        var versionVal = $("#version option:selected").text();
        $.ajax({
            type:"get",
            url:"./testData/package.json",
            // url:"http://10.30.106.80:8080/version",
            data:{
                product:productVal,
                version:versionVal
            },
            dataType:"jsonp",
            jsonp:"callback",
            jsonpCallback:"jsonp1",
            success:function (data) {
                //解析返回数据作为饼图的数据
                dataArr = [];
                legenddata = [];
                for(var i=0;i<data.length;i++){
                    console.log(data[i].name)
                    dataArr.push(data[i])
                    legenddata.push(data[i].name)
                };
                //开始制作饼图
                var divdata = echarts.init(document.getElementById("div1"));
                createPie(divdata,dataArr,legenddata)
            }
        });
        createLine()

    })
});
//制做饼图函数


