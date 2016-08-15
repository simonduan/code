/**
 * Created by simonduan on 2016/7/24.
 */
$(function () {
    $("#nav li").hover(function () {
        $(this).find(".jnNav").show()
    },function () {
        $(this).find(".jnNav").hide()
    })
    
})