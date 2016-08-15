/**
 * Created by simonduan on 2016/7/23.
 */
$(function () {
    $("#inputSearch").focus(function () {
        $(this).addClass("focus")
        if($(this).val() == this.defaultValue){
            $(this).val("")
        }
    }).blur(function () {
        $(this).removeClass("focus");
        if($(this).val() == ""){
            $(this).val(this.defaultValue)
        }
    }).keyup(function (event) {
        if(event.which == 13){
            if($(this).val() == ""){
                alert("请输入您要搜索的商品")
            }else{
                alert("searh cgi start")
            }
        }
    })
})