/**
 * Created by simonduan on 2016/10/11.
 */
function createLine() {
    var option = {
        title:{
            text:"版本周期bug变化趋势",
            link:"http://tapd.oa.com",
            x:"center",
            subtext:"版本bug类型变化趋势走势图"
        },
        tooltip:{
            trigger:"axis"
        },
        legend:{
            data:["功能bug","性能bug"],
            y:"bottom"
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true}, // 辅助线标志，上图icon左数1/2/3，分别是启用，删除上一条，删除全部
                dataView : {show: true, readOnly: false},// 数据视图，上图icon左数8，打开数据视图
                magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},// 图表类型切换，当前仅支持直角系下的折线图、柱状图转换，上图icon左数6/7，分别是切换折线图，切换柱形图
                restore : {show: true}, // 还原，复位原始图表，上图icon左数9，还原
                saveAsImage : {show: true} // 保存为图片，上图icon左数10，保存
            }
        },
        xAxis:[
            {
                type:"category",
                name:"时间",
                data:["9.10","9.11","9.12","9.13","9.14","9.15","9.16"]
            }
        ],
        yAxis:[
            {
                name:"数量",
                type:"value",
                splitArea:{show:true}
            }

        ],
        series: [
            {
                name: '功能bug',
                type: 'line',
                data: [20, 35, 57, 40, 21, 12, 4]
            },
            {
                name: '性能bug',
                type: 'line',
                data: [0, 0, 3, 6, 9, 12, 2]
            }
        ]
    };
    var divdata = echarts.init(document.getElementById("div2"))
    divdata.setOption(option)
}