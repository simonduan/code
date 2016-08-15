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
	
		module.exports = __webpack_require__(69);
	
	
	/***/ },
	
	/***/ 69:
	/***/ function(module, exports, __webpack_require__) {
	
		var $ = Txplayer.$;
		var util = Txplayer.util;
		var api = Txplayer.apiList;
		var htmlstr = __webpack_require__(70);
	
		function UiShadow(context){
		  this.msg = new Txplayer.Events();
		  this.dataset = {};
		  this.context = context;
		  this.init();
		}
	
		UiShadow.prototype = {
		  init: function(){
		    this.write();
		    this.addEventListerner();
		  },
		  write: function(){
		    var renderData = {
		      shadow: 'txp-shadow-mod'
		    };
		    this.dataset.renderData = renderData;
		    var htmldata = $.tmpl(htmlstr, renderData);
		    this.context.$mod.$videomod.append(htmldata);
		    this.dataset.$shadow = this.context.$mod.$videomod.find('[data-role='+renderData.shadow+']');
		  },
		  remove: function(){
		    this.dataset.$shadow.remove();
		  },
		  initHDPlayerEvent: function(){
		    var clickTimeout, that = this;
		    this.dataset.$shadow.on('click', function(){
		      var togglePlay = function(){
		        if (that.context.superMsg.run(api.publicApi.isPlaying)) {
		          that.context.superMsg.broadcast(api.publicApi.pause);
		          that.context.superMsg.broadcast(api.eventApi.onUserPausePlayer);
		        }else{
		          that.context.superMsg.broadcast(api.publicApi.play);
		        }
		      };
		      if (clickTimeout) clearTimeout(clickTimeout);
		      clickTimeout = setTimeout(function(){
		        togglePlay();
		        clickTimeout = null;
		      },300);
		    });
		    this.dataset.$shadow.on('dblclick', function(){
		      if (clickTimeout) clearTimeout(clickTimeout);
		      that.context.superMsg.broadcast(api.publicApi.toggleWindowFullScreen);
		    });
		    // 屏蔽播放器区域鼠标右键
		    // this.dataset.$shadow
		    // .on('contextmenu', function(e){
		    //   return false;
		    // });
		  },
		  initH5PlayerEvent: function(){
		    var that = this;
		    // that.context.superMsg.broadcast(api.privateApi.showPlayerUiTools);
		    this.dataset.$shadow.on('click', function(){
		      // return;
		      that.context.superMsg.broadcast(api.privateApi.togglePlayerUiTools);
		    });
		  },
		  addEventListerner: function(){
		    var that = this;
		    if (util.mobile){
		      this.initH5PlayerEvent();
		    }else{
		      this.initHDPlayerEvent();
		    }
		  }
		};
	
		Txplayer.register('UiShadow', UiShadow);
	
	/***/ },
	
	/***/ 70:
	/***/ function(module, exports) {
	
		module.exports = "<txpdiv data-role=\"<%=shadow%>\" class=\"txp_shadow\"></txpdiv>";
	
	/***/ }
	
	/******/ });
