/**
 * Created by simonduan on 2016/10/8.
 */
//页面初始化后获取指定终端版本号
$(function () {
    var checkProduct = $("#product").val().toLocaleLowerCase();

    $.ajax({
        type:"get",
        url:"./testData/tsconfig.json",
        // url:"http://10.30.106.80:8080/version",
        data:{
            product:checkProduct
        },
        dataType:"jsonp",
        jsonp:"callback",
        jsonpCallback:"jsonp1",
        success:function (data) {
            // console.log(data)
            $("#version").empty()
            $.each(data,function (name,value) {
                
                var newVersion = "<option value=" +name+">" +value+"</option>"
                $("#version").append(newVersion)
            })
        }
    })
})
//产品版本号联动
$(function () {
    $("#product").change(function () {
        var checkProduct = $("#product").val().toLocaleLowerCase();
        // console.log(checkProduct)
        $.ajax({
            type:"get",
            url:"http://10.30.106.80:8080/version",
            data:{
                product:checkProduct
            },
            dataType:"jsonp",
            jsonp:"callback",
            jsonpCallback:"jsonp1",
            success:function (data) {
                // console.log(data)
                $("#version").empty()
                $.each(data,function (name,value) {
                    console.log(name+":"+value)
                    var newVersion = "<option value=" +name+">" +value+"</option>"
                    $("#version").append(newVersion)
                })
            }
        })
    })
})