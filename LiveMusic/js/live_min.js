/**
 * Created by simonduan on 2016/8/4.
 */
$(function () {
    var mad = Date.now()
    // debugger
    $.ajax({
        type: "get",
        url: "http://data.v.qq.com/live/v2/api/live/info",
        data: {
            pid: "3154",
            reqsrc: "h5_new_concert",
            "":mad
        },
            cache:true,
            jsonpCallback: "vingjsonp",
            dataType: "jsonp",
            success: function (live_msg) {
                //-----------------------****精选MV****----------------------------------------------------
                $(".mod.mod_v_list.mod_related>div:eq(1) section div").remove()
                var $mv_msg = live_msg.data.live.related_mvs.data;
                var mv_title = live_msg.data.live.fans["0"].title;
                $(".mod.mod_v_list.mod_related .mod_hd .title_inner span").text(mv_title + "MV")
                $.each($mv_msg, function (index, msg) {
                    var $newdiv =
                        "<div class='video_item'>" +
                        "<div class='pic'>" +
                        "<img src=" + msg.pic["1"] + ">" +
                        "</div>" +
                        "<a href='#' class='m_title'>" + msg.title +
                        "</a>" +
                        "</div>"
                    $(".mod.mod_v_list.mod_related .mod_bd section").append($newdiv);
                })
                // ------------------------***live  music  回顾***----------------------------------------------
                $(".mod.mod_v_list.mod_preview>div:eq(1)  section div").remove()
                var $mv_msg = live_msg.data.live.related_videos.data;
                var mv_title = live_msg.data.live.related_videos.desc;
                $(".mod.mod_v_list.mod_preview .mod_hd .title_inner span").text(mv_title)
                $.each($mv_msg, function (index, msg) {
                    var $newdiv =
                        "<div class='video_item'>" +
                        "<div class='pic'>" +
                        "<img src=" + msg.pic["1"] + ">" +
                        "</div>" +
                        "<a href='#' class='m_title'>" + msg.title +
                        "</a>" +
                        "</div>"
                    $(".mod.mod_v_list.mod_preview .mod_bd section").append($newdiv);
                });
                //----------------------***安可曲**----------------------------------------------------
                $("#mod-music img.title_logo").remove();
                $("#mod-music .mod_bd").empty()
                var voteID = live_msg.data.live.vote.vote_id;
                $.ajax({
                    type: "get",
                    dataType: "jsonp",
                    // jsonp:"a",***********************************
                    jsonpCallback: "jsonp3",
                    cache: true,
                    // jsonp:"a",
                    url: "http://panshi.qq.com/v2/vote/" + voteID,
                    data: {source: "1"},
                    success: function (msg) {
                        var $music_msg = msg.data.subject[0].option
                        // alert(typeof $music_msg)
                        $.each($music_msg, function (i) {
                            // console.log($music_msg[i].title)
                            var $newDom = "<div class='item'>" +
                                "<span class='name'>" +
                                $music_msg[i].title +
                                "</span>"
                            "</div>";

                            $("#mod-music .mod_bd").append($newDom)
                        })
                    }

                })
            }



    })
})