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
	
		module.exports = __webpack_require__(79);
	
	
	/***/ },
	
	/***/ 79:
	/***/ function(module, exports, __webpack_require__) {
	
		var $ = Txplayer.$;
		var util = Txplayer.util;
		var api = Txplayer.apiList;
		var htmlstr = __webpack_require__(80);
	
		function UiToggleSidebar(context){
		  this.msg = new Txplayer.Events();
		  this.dataset = {};
		  this.context = context;
		  this.init();
		}
	
		UiToggleSidebar.prototype = {
		  init: function(){
		    this.dataset.playerConfig = this.context.msg.run(api.privateApi.getPlayerConfig);
		    this.write();
		    this.initDisplay();
		    this.addEventListener();
		  },
		  initDisplay: function(){
		    if (this.dataset.playerConfig.showToggleSideBar) {
		      this.dataset.$btn.removeClass(Txplayer.dataset.hideClass);
		    }else{
		      this.dataset.$btn.addClass(Txplayer.dataset.hideClass);
		    }
		  },
		  write: function(){
		    var renderData = {
		      btn: 'txp-ui-control-sidebar',
		      tooltips: 'txp-ui-control-sidebar-tooltips',
		      tabindex: Txplayer.dataset.tabindex++,
		      hideClass: Txplayer.dataset.hideClass
		    };
		    this.dataset.renderData = renderData;
		    var htmldata = $.tmpl(htmlstr, renderData);
		    this.context.$mod.$buttonsrightmod.append(htmldata);
		    this.dataset.$btn = this.context.$mod.$buttonsrightmod.find('[data-role=' + renderData.btn +']');
		    this.dataset.$tooltips = this.context.$mod.$buttonsrightmod.find('[data-role=' + renderData.tooltips +']');
		  },
		  remove: function(){
		    this.dataset.$btn.remove();
		  },
		  bindMouseEvent: function(){
		    var that = this;
		    this.dataset.$btn.on('mouseenter', function(){
		      that.dataset.$btn.addClass(Txplayer.dataset.btnHoverClass);
		    }).on('mouseleave', function(){
		      that.dataset.$btn.removeClass(Txplayer.dataset.btnHoverClass);
		    });
		  },
		  addEventListener: function(){
		    var that = this;
		    this.dataset.$btn.on(Txplayer.dataset.clickEventName, function(){
		      var action = '';
		      if (that.dataset.$btn.attr('data-status')==='false') {
		        action = 'hide';
		      }else{
		        action = 'show';
		      }
		      that.context.superMsg.broadcast(api.eventApi.onToggleSideBar, {
		        action: action
		      });
		    });
		    this.context.superMsg.on(api.eventApi.onToggleSideBar, function(data){
		      if (data && !data.hasOwnProperty('exitFullScreen')){
		        data.exitFullScreen = true;
		      }
		      if(data && data.action==='show'){
		        that.dataset.$btn.attr('data-status', 'false');
		        that.dataset.$tooltips.html('剧场模式');
		        that.dataset.isTheaterMode = false;
		      }else if(data && data.action==='hide'){
		        that.dataset.$btn.attr('data-status', 'true');
		        that.dataset.$tooltips.html('默认视图');
		        that.dataset.isTheaterMode = true;
		      }
		      that.context.userMsg.broadcast(api.eventApi.onToggleSideBar, data.action);
		      // 剧场模式和全屏互斥
		      if (data.exitFullScreen) {
		        if ( that.context.superMsg.run(api.publicApi.isWindowFullscreen) ) {
		          that.context.superMsg.broadcast(api.publicApi.exitWindowFullscreen);
		        }
		        if ( that.context.superMsg.run(api.publicApi.isBrowserFullscreen) ) {
		          that.context.superMsg.broadcast(api.publicApi.exitBrowserFullscreen);
		        }
		      }
		    });
		    this.context.superMsg.on(api.publicApi.setTheaterMode, function(data, options){
		      if (!!data) {
		        that.context.superMsg.broadcast(api.eventApi.onToggleSideBar, {
		          action: 'hide'
		        });
		      }else{
		        that.context.superMsg.broadcast(api.eventApi.onToggleSideBar, {
		          action: 'show'
		        });
		      }
		    });
		    this.context.superMsg.on(api.publicApi.isTheaterMode, function(data, options){
		      options.data = !! that.dataset.isTheaterMode;
		    });
	
		    if (!util.mobile){
		      this.bindMouseEvent();
		    }
		  }
		};
	
		Txplayer.register('UiToggleSidebar', UiToggleSidebar);
	
	/***/ },
	
	/***/ 80:
	/***/ function(module, exports) {
	
		module.exports = "<button data-role=\"<%=btn%>\" class=\"txp_btn txp_btn_size <%=hideClass%>\" data-status=\"false\" data-report=\"sidebar-toggle\">\n  <svg class=\"txp_icon txp_icon_size\" version=\"1.1\" viewBox=\"0 0 24 24\">\n    <use class=\"txp_svg_symbol txp_svg_size\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#txp_svg_size\"></use>\n    <use class=\"txp_svg_symbol txp_svg_size_true\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#txp_svg_size_true\"></use>\n  </svg>\n  <txpdiv data-role=\"<%=tooltips%>\" class=\"txp_tooltip\">剧场模式</txpdiv>\n</button>";
	
	/***/ }
	
	/******/ });
