/**
 * Created by simonduan on 2016/7/24.
 */
$(function () {
    var index = 0
    var $div_a = $("#jnImageroll div a")
    $div_a.mouseenter(function () {
        index = ($div_a.index(this))
        console.log(index)
        showImg(index)
    }).eq(index).mouseover();


})

function showImg(index) {
    var $rollobj = $("#jnImageroll");
    var $rolllist = $rollobj.find("div a");
    var newhref = $rolllist.eq(index).attr("href");
    $("#JS_imgWarp").attr("href",newhref).find("img").eq(index).fadeIn().siblings().fadeOut();
    // $rolllist.removeClass("chos").css("opacity","0.7").eq(index).addClass("chos").css("opacity","1")
    $rolllist.eq(index).addClass("chos").css("opacity","1").siblings().removeClass("chos").css("opacity","0.7")
}
function showig() {
    
}