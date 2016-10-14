/**
 * Created by simonduan on 2016/10/11.
 */
//  制作饼图
function createPie(divdata,piedata,legenddata,title,desc) {
    // 需要传递三个参数：
    //1.divdata 要插入图表的div元素  2.piedata 要构建饼图的数据  3.legenddata图例配置的基本数据 4.饼图标题 5.饼图描述
    var option = {
        title:{
            text:title,
            subtext:desc,
            link:"http://tapd.oa.com/",
            x:"center"
        },
        tooltip:{
            trigger:"items",
            formatter:"{a}<br/>{b}:{c}({d}%)"
        },
        legend:{
            orient:"auto",
            left:"left",
            data:legenddata,
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
//制作折线图
function createLine(divdata,title,title_link,legenddata,timedata,linedata) {
    var option = {
        title:{
            text:title,
            link:title_link,
            x:"center",
            subtext:"版本bug类型变化趋势走势图"
        },
        tooltip:{
            trigger:"axis"
        },
        legend:{
            // data:["功能bug","性能bug"],
            data:legenddata,
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
                data:timedata
            }
        ],
        // xAxis:xdata,
        yAxis:[
            {
                name:"数量",
                type:"value",
                splitArea:{show:true}
            }

        ],
        // yAxis:ydata,
        // series: [
        //     {
        //         name: '功能bug',
        //         type: 'line',
        //         data: [20, 35, 57, 40, 21, 12, 4]
        //     },
        //     {
        //         name: '性能bug',
        //         type: 'line',
        //         data: [0, 0, 3, 6, 9, 12, 2]
        //     }
        // ]
        series:linedata
    };
    divdata.setOption(option)
}