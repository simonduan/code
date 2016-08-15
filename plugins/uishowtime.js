/*! TenVideoPlayer_V3 - v3.0.0 
* Update 2016-06-24 17:59:52
* Copyright (c) 2016
* Powered by Tencent-Video Web Front End Team
*/
	/******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	
	
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ({
	
	/***/ 0:
	/***/ function(module, exports, __webpack_require__) {
	
		module.exports = __webpack_require__(73);
	
	
	/***/ },
	
	/***/ 73:
	/***/ function(module, exports, __webpack_require__) {
	
		var $ = Txplayer.$;
		var util = Txplayer.util;
		var api = Txplayer.apiList;
		var htmlstr = __webpack_require__(74);
	
		function UiShowTime(context){
		  this.msg = new Txplayer.Events();
		  this.dataset = {};
		  this.context = context;
		  this.init();
		}
	
		UiShowTime.prototype = {
		  init: function(){
		    this.write();
		    this.addEventListerner();
		  },
		  write: function(){
		    var renderData = {
		      time: 'txp-control-time-mod',
		      currentTimeRole: 'txp-control-currenttime',
		      durationRole: 'txp-control-duration'
		    };
		    var htmldata = $.tmpl(htmlstr, renderData);
		    this.context.$mod.$buttonsleftmod.append(htmldata);
		    this.dataset.$time = this.context.$mod.$buttonsleftmod.find('[data-role="'+renderData.time+'"]');
		    this.dataset.$currenttime = this.context.$mod.$buttonsleftmod.find('[data-role="'+renderData.currentTimeRole+'"]');
		    this.dataset.$duration = this.context.$mod.$buttonsleftmod.find('[data-role="'+renderData.durationRole+'"]');
		  },
		  remove: function(){
		    this.dataset.$time.remove();
		  },
		  updateDuration: function(duration){
		    if ( $.type(duration)==='undefined' ){
		      duration = this.context.superMsg.run(api.publicApi.getDuration);
		    }
		    if ($.type(duration)==='number') this.dataset.$duration.html( util.formatPlayTime(duration) );
		  },
		  updateCurrentTime: function(time){
		    if ( $.type(time)==='undefined' ){
		      time = this.context.superMsg.run(api.publicApi.getCurrentTime);
		    }
		    if ($.type(time)==='number') this.dataset.$currenttime.html( util.formatPlayTime(time) );
		  },
		  addEventListerner: function(){
		    var that = this;
		    that.updateDuration();
	
		    this.dataset.eventsList = {};
		    this.dataset.eventsList[util.getUniqueMsgKey(api.eventApi.onGetVideoUrlSuccess)] = function(){
		      that.updateDuration();
		    }
		    // 切换视频
		    this.dataset.eventsList[util.getUniqueMsgKey(api.eventApi.onVidChange)] = function(){
		      that.updateCurrentTime(0);
		      that.updateDuration(0);
		    }
		    // 正片播放结束
		    this.dataset.eventsList[util.getUniqueMsgKey(api.eventApi.onSectionEnded)] = function(data){
		      if (data && data.playListType==='film' && data.playListTypeEnd){
		        that.updateCurrentTime(0);
		        that.updateDuration(0);
		      }
		    }
		    this.dataset.eventsList[util.getUniqueMsgKey(api.eventApi.onSectionTimeupdate)] = function(){
		      // 控制栏不显示，不计算缓冲数据
		      if ( !that.context.superMsg.run(api.privateApi.isControlShow) ) return;
		      if (that.context.superMsg.run('isPlayingAd')) return;
		      that.updateCurrentTime();
		    }
		    $.each(this.dataset.eventsList,function(key, fn){
		      that.context.superMsg.on(key, fn);
		    });
		  }
		};
	
		Txplayer.register('UiShowTime', UiShowTime);
	
	/***/ },
	
	/***/ 74:
	/***/ function(module, exports) {
	
		module.exports = "<txpdiv data-role=\"<%=time%>\" class=\"txp_time_display\">\n  <txpdiv class=\"txp_time_current\" data-role=\"<%=currentTimeRole%>\">00:00</txpdiv>\n  <txpdiv class=\"txp_time_separator\">/</txpdiv>\n  <txpdiv class=\"txp_time_duration\" data-role=\"<%=durationRole%>\">00:00</txpdiv>\n  <txpdiv class=\"txp_live_badge\">直播</txpdiv>\n</txpdiv>";
	
	/***/ }
	
	/******/ });
