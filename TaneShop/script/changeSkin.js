/**
 * Created by simonduan on 2016/7/24.
 */
$(function () {
    var $li = $("#skin li");
    $li.click(function () {
        // console.log(this.id)
        $("#"+this.id).addClass("selectd").siblings().removeClass("selectd");
        $("#cssfile").attr("href","styles/skin/"+this.id+".css");

    })
})