/**
 * Created by simonduan on 2016/10/11.
 */
//  制作饼图
function createPie(divdata,piedata,legenddata,title,desc) {title
    // 需要传递三个参数：
    //1.divdata 要插入图表的div元素  2.piedata 要构建饼图的数据  3.legenddata图例配置的基本数据 4.饼图标题 5.饼图描述
    var option = {
        title:{
            text:title,
            subtext:desc,
            link:"http://tapd.oa.com/",
            x:"center",

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
    //参数  1.DOMID 2.图表题 3.标题跳转链接 4.图例数据 5.X轴数据 6.制图数据
    var option = {
        title:{
            text:title,
            link:title_link,
            x:"center",
            subtext:"版本bug类型变化趋势走势图",
            textStyle:{
                fontSize:12
            },
            textAlign:"left"
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
                name:"场景",//需要动态读取
                data:timedata
            }
        ],
        // xAxis:xdata,
        yAxis:[
            {
                name:"CPU占用率",
                type:"value",
                splitArea:{show:true}
            }

        ],

        series:linedata
    };
    divdata.setOption(option)
}
// <<<<<<< HEAD
// function enter() {
//     alert(1)
// }
// module.exports = {
//     createLine: createLine,
//     createPie: createPie,
//     enter:enter
// };
// =======

//制作柱状图
function Histogram(divdata,title,desc,title_link,Xdata,legenddata,bardata) {
    //传参 1.DomId 2.图表标题 3.标题跳转链接 4.x轴数据 5.图例数据 6.制图数据
    var option = {
        title:{
            text:desc,
            subtext:title,
            link:title_link,
            x:"center"
        },
        legend:{
            orient:"buttom",
            left:"left",
            data:legenddata,
            // y:"bottom"
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
                data : Xdata,
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

        series:bardata
    };
    divdata.setOption(option);

}
//
// module.exports = {
//     createLine: createLine,
//     createPie: createPie,
//     Histogram:Histogram
// };
//制作表格
function creatTable(divdata) {
    divdata.dataTable({
        "sScrollX": "100%",
        "sScrollXInner": "70%",
        "bScrollCollapse": true,
        "bFilter": false,
        bPaginate:false,
        "bInfo": false,
        "oLanguage": {
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": "抱歉， 没有找到",
            "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
            "sInfoEmpty": "没有数据",
            "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "前一页",
                "sNext": "后一页",
                "sLast": "尾页"
            },
            "sZeroRecords": "没有更多数据",
        },
        styling:{
            "stripe":""
        }

    })
}
