/**
 * Created by simonduan on 2016/10/11.
 */
$(function () {
    divdata = echarts.init(document.getElementById("div2_2"))
    Histogram(divdata)
})
function Histogram(divdata) {
    var option = {
        title:{
            text:"xxxxx",
            subtext:"xxxx1",
            link:"http://tapd.oa.com/",
            x:"center"
        },
        legend:{
            orient:"auto",
            left:"left",
            data:["4.5.0","4.6.0"]
        },
        // color: ['#3398DB'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'  鼠标hover时阴影的效果用于柱状图用shadow
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : ["CPU","MEM","Power","Network"],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'4.5.0',
                type:'bar',
                barWidth: '20%',
                data:["2","4","3","5"]
            },
            {

                name:'4.6.0',
                type:'bar',
                barWidth: '20%',
                data:["3","7","2","1"]
            }
        ]
    };
    divdata.setOption(option)
}