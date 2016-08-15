/**
 * Created by simonduan on 2016/7/24.
 */
$(function () {
    var $tab_a = $("#jnBrandTab ul li a");
    $tab_a.click(function (event) {
        $(this).parent().addClass("chos").siblings().removeClass("chos")
        idx = $tab_a.index(this);
        showBrandList(idx)
        // event.preventDefault();  阻止事件冒泡第二种写法
        return false
    }).eq(0).click()

})

function showBrandList(idx) {
    var rollobj = $("#jnBrandList")
    var li_width = $("#jnBrandList").find("li").outerWidth();
    var rollWidth = li_width * 4 //一排宽度
    rollobj.stop(true,false).animate({left:-rollWidth *idx},1000)

}