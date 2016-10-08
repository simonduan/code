/**
 * Created by simonduan on 2016/10/8.
 */
//页面初始化后获取指定终端版本号
$(function () {
    var checkProduct = $("#product").val();
    // console.log(checkProduct)
    $.ajax({
        type:"get",
        url:"./testData/package.json",
        data:{
            product:checkProduct
        },
        dataType:"json",
        success:function (data) {
            console.log(data)
            $("#version").empty()
            $.each(data,function (name,value) {
                console.log(name+":"+value)
                var newVersion = "<option value=" +name+">" +value+"</option>"
                $("#version").append(newVersion)
            })
        }
    })
})
//产品版本号联动
$(function () {
    $("#product").change(function () {
        var checkProduct = $("#product").val();
        console.log(checkProduct)
        // $("#version").empty();
        $.ajax({
            type:"get",
            url:"./testData/tsconfig.json",
            data:{
                product:checkProduct
            },
            dataType:"json",
            success:function (data) {
                console.log(data)
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