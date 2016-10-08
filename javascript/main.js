/**
 * Created by Simon on 16/10/8.
 */
$(function () {
    var myChat = echarts.init(document.getElementById("div1"));
    var option = {
        title:{
            text:"缺陷类型分布",
            subtext:"当前版本缺陷类型总数占比",
            x:"center"
        },
        tooltip:{
            trigger:"item",
            formatter:"{a}<br/>{b}:{c}({%d})"
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
                radius:"55%",
                center:["50%","60%"],
                data:[
                    {value:12,name:"严重"},
                    {value:1,name:"致命"},
                    {value:45,name:"一般"},
                    {value:13,name:"低"},
                    {value:20,name:"建议"}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }

            }
        ]
    };
    myChat.setOption(option)
});