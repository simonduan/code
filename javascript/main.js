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
                for(var i=0;i<data.length;i++){
                    console.log(data[i])
                    dataArr.push(data[i])
                };
                //开始制作饼图
                var divdata = echarts.init(document.getElementById("div1"));
                createPie(divdata,dataArr)
            }
        });

    })
});
//制做饼图函数
function createPie(divdata,piedata) {
    // var myChat = echarts.init(document.getElementById("div1"));
    var option = {
        title:{
            text:"缺陷类型分布",
            subtext:"当前版本缺陷类型总数占比",
            x:"center"
        },
        tooltip:{
            trigger:"item",
            formatter:"{a}<br/>{b}:{c}({d}%)"
        },
        legend:{
            orient:"auto",
            left:"left",
            data:["致命","严重","一般","低","建议"]
        },
        series:[
            {
                name:"bug类型",
                type:"pie",
                radius:"65%",
                center:["50%","60%"],
                data:piedata,
                itemStyle: {
                    normal: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.1)'
                    }
                }

            }
        ]
    };
    divdata.setOption(option)
}

