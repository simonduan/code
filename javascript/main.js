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

                 titledata = data.title;
                 desc = data.desc;
                console.log(data)
                dataArr = [];
                legenddata = [];
                var bugdata = data.bugdata;
                for(var i=0;i<bugdata.length;i++){
                    console.log(bugdata[i].name)
                    dataArr.push(bugdata[i])
                    legenddata.push(bugdata[i].name)
                };
                //开始制作饼图
                var divdata = echarts.init(document.getElementById("div1"));
                createPie(divdata,dataArr,legenddata,titledata,desc)
            }
        });
        createLine()

    })
});
//制做饼图函数


