/**
 * Created by simonduan on 2016/10/11.
 */
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