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
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {
	
		module.exports = __webpack_require__(1);
	
	
	/***/ },
	/* 1 */
	/***/ function(module, exports, __webpack_require__) {
	
		var $ = Txplayer.$;
		var util = Txplayer.util;
		var api = Txplayer.apiList;
		var globalMsg = Txplayer.msg;
	
		var htmlstr = __webpack_require__(2);
		var Emoji = __webpack_require__(3);
		var Bubble = __webpack_require__(9);
		var barrageUtil = __webpack_require__(6);
		var barrageEmojiMap = __webpack_require__(8);
		var login = __webpack_require__(7);
		var lsSwitchName = 'tvp-user-barrageswitch';
	
		function Barrage(context) {
			this.msg = new Txplayer.Events();
			this.dataset = {};
			this.context = context;
			this.init();
		}
	
		Barrage.prototype = {
			init: function() {
				var that = this;
	
				// h5播放器需要做一些处理
				// 记录当前播放器是否是flash播放器
				that.dataset._playerType = that.context.msg.run(api.publicApi.getPlayerType);
				that.dataset._isFlash = that.dataset._playerType == "flash";
				// !that.dataset._isFlash && that.initH5Player();
	
				// 弹幕是否开启回调事件
				that.context.msg.on(api.eventApi.onBulletReady, function(data) {
					// 用户是否开启弹幕，服务端是否开启弹幕
					if (that.isUserOpenBullet() && data && data.returncode === 0 && data.registid) {
						that.showBarrage(data);
					} else {
						that.hideBarrage();
					}
				});
				// 用户是否开启弹幕
				if (that.isUserOpenBullet()) {
					// 服务端是否开启弹幕
					var isServerOpenBullet = that.context.msg.run(api.privateApi.isServerOpenBullet);
					isServerOpenBullet && that.showBarrage(isServerOpenBullet);
				}
			},
			showBarrage: function(data) {
				this.dataset.registid = data.registid;
				this.dataset.bulletkey = data.bulletkey;
				if (this.dataset.isRender) {
					this.dataset.$mod.show();
				} else {
					this.write();
					this.addEventListerner();
					this.dataset.isRender = true;
				}
				// 气泡弹幕的处理
				this.showBubble(data);
				// 是否显示弹幕输入框
				this.isShowInput();
	
				this.bulletRegion(true);
			},
			hideBarrage: function() {
				if (this.dataset.isRender) {
					this.dataset.$mod.hide();
	
					this.bulletRegion(false);
				}
			},
			write: function() {
				var globalConfig = this.context.pluginConfig.globalConfig || {};
				globalConfig.useDefaultCss && this.loadBarrageCss();
				// 弹幕容器
				this.dataset.$mod = globalConfig.mod ?
					($.type(globalConfig.mod) == 'string' ? $('#' + globalConfig.mod) : $(globalConfig.mod)) : $('#mod_barrage_container');
				var htmldata = globalConfig.html ? ($.isFunction(globalConfig.html) ? globalConfig.html() : globalConfig.html) : $.tmpl(htmlstr);
	
				// 渲染
				this.dataset.$mod.html(htmldata);
	
				this.dataset.$input = this.dataset.$mod.find("[data-role='input']");
				this.dataset.$submit = this.dataset.$mod.find("[data-role='submit']");
	
				// 设置样式上切换的参数，可以由用户自定义
				this.dataset.openClass = globalConfig.openClass || 'txp_open';
				this.dataset.disableClass = globalConfig.disableClass || 'txp_disabled';
				this.dataset.focusClass = globalConfig.focusClass || 'txp_focus';
				this.dataset.hideHotBulletClass = globalConfig.hideHotBulletClass || 'txp_barrage_form_nohotbtn';
	
				// 字数限制
				this.dataset.strLength = +this.dataset.$input.attr('maxlength') || 25;
				// 创建高级表情实例
				this.dataset.emoji = new Emoji(this.context.msg.run(api.publicApi.getPlayerId),
					this.context.msg.run(api.publicApi.getVid), this.msg, this.dataset.$mod.find("[data-role='form']"));
	
				// 登录问题的处理
				this.toggleLoginStatus(this.getLoginStatus());
				// 弹幕数量
				this.updateBulletNumber();
				// 发表按钮状态
				this.updateSubmitStatus();
				// 弹幕开关状态
				this.updateSwitchStatus();
				// 根据配置判断是否隐藏热门弹幕
				globalConfig.hideHotBullet && this.hideHotBullet();
			},
			loadBarrageCss: function() {
				util.loadCss("//vm.gtimg.cn/tencentvideo/vstyle/player/style/txp_barrage.css");
			},
			addEventListerner: function() {
				var that = this;
				that.dataset.$mod
					.on("click", "[data-role='toggle']", function() {
						var $this = $(this);
						var status = !$this.hasClass(that.dataset.openClass);
						that.context.msg.broadcast(api.publicApi.bulletSwitch, status);
						that.context.userMsg.broadcast(api.eventApi.onSwitchBullet, status);
						// $this.toggleClass(that.dataset.openClass);
						// 上报
						that.report('barrage-toggle');
					})
					.on("click", "[data-role='face']", function() {
						if (that.dataset.isLogin) {
							that.dataset.emoji.toggle();
						} else {
							that.showLogin();
						}
						// 上报
						that.report('barrage-emoji');
					})
					.on("mouseenter", "[data-role='face']", function() {
						that.dataset.emoji.mouseenter();
					})
					.on("mouseleave", "[data-role='face']", function() {
						that.dataset.emoji.mouseleave();
					})
					.on("click", "[data-role='bubble']", function() {
						if (that.dataset.isLogin) {
							that.dataset.bubble && that.dataset.bubble.toggle();
						} else {
							that.showLogin();
						}
						// 上报
						that.report('barrage-bubble');
					})
					.on("mouseenter", "[data-role='bubble']", function() {
						that.dataset.bubble && that.dataset.bubble.mouseenter();
					})
					.on("mouseleave", "[data-role='bubble']", function() {
						that.dataset.bubble && that.dataset.bubble.mouseleave();
					})
					.on("click", "[data-role='list']", function() {
						that.context.userMsg.broadcast(api.eventApi.onToggleHotBarrage, {
							targetid: that.dataset.registid
						});
						// 上报
						that.report('barrage-hotlist');
					})
					.on("click", "[data-role='login']", function() {
						that.showLogin();
						// 上报
						that.report('barrage-login');
					});
	
				// 输入框的事件
				that.dataset.$input
					.on('focus', function() {
						that.dataset.$mod.find("[data-role='main']").addClass(that.dataset.focusClass);
					})
					.on('blur', function() {
						that.dataset.$mod.find("[data-role='main']").removeClass(that.dataset.focusClass);
					})
					.on('keypress', function(e) {
						if (e.which == 13) {
							that.submitBarrage();
						}
					});
	
				// 发表按钮事件
				that.dataset.$submit.on('click', function() {
					that.submitBarrage();
					// 上报
					that.report('barrage-submit');
				});
	
				// 高级表情的输入
				that.msg.on('txv_barrage_input', function(data) {
					that.insertText(data.content);
				});
	
				// 上报
				that.msg.on('txv_barrage_report', function(data) {
					that.report(data);
				});
	
				// 关闭伪全屏
				that.msg.on('txv_closebrowserfullscreen', function() {
					that.closeBrowserFullscreen();
				});
	
				// 登录或者退出登录
				globalMsg.on(api.eventApi.onAfterLogin, function() {
					that.dataset.emoji.removeEmojiContent();
					that.toggleLoginStatus(true);
				});
				globalMsg.on(api.eventApi.onAfterLogout, function() {
					that.dataset.emoji.removeEmojiContent();
					that.toggleLoginStatus(false);
					// 气泡弹幕
					if (that.dataset.bubble) {
						that.dataset.bubble.logoutHandler();
						that.setBubble(true);
					}
				});
	
				// 视频切换
				that.context.msg.on(api.eventApi.onVidChange, function() {
					// 用户是否开启弹幕
					if (!that.isUserOpenBullet()) {
						that.hideBarrage();
					}
					// 清除表情的dom
					that.dataset.emoji.removeEmojiContent();
				});
	
				// 提供接口告诉外部是否有弹幕
				that.context.msg.on(api.privateApi.isShowBulletRegion, function(data, options) {
					options.data = that.dataset.showBulletRegion;
				});
			},
			insertText: function(val) {
				var that = this;
				that.dataset.$input[0].focus();
	
				var originalVal = that.dataset.$input.val();
				var originalValLength = originalVal.length;
				var valLength = val.length;
				var len = that.dataset.strLength;
	
				originalValLength + valLength > len && (val = val.substring(0, len - originalValLength));
				barrageUtil.insertText(that.dataset.$input[0], val);
			},
			initToggleBtn: function(userswitch) { // 设置用户是否开启弹幕
				this.dataset.$mod.find("[data-role='toggle']")[userswitch ? 'addClass' : 'removeClass'](this.dataset.openClass);
			},
			toggleSubmitStatus: function(status) { // 切换发表按钮的可用状态
				this.dataset.$submit[status ? 'removeClass' : 'addClass'](this.dataset.disableClass);
				// 置灰不可点，hover提示：视频未播放，还不可发表弹幕哦
				if (status) {
					this.dataset.$submit.removeAttr('title');
				} else {
					if (this.dataset.isLogin) {
						this.dataset.$submit.attr('title', '视频未播放，还不可发表弹幕哦');
					} else {
						this.dataset.$submit.attr('title', '登录后才可以发表弹幕哦');
					}
				}
			},
			submitBarrage: function() {
				if (this.dataset.$submit.hasClass(this.dataset.disableClass) || !this.dataset.isLogin) {
					return;
				}
				var content = this.dataset.$input.val();
				if (!content) { // 为空不能发表
					return;
				}
				var spids = [];
				content = content.replace(/\[.+?\]/g, function(string) {
					var source = barrageEmojiMap.fromTargetToSource(string.replace(/[\[\]]/g, ''));
					if (source) {
						spids.push(source.eid);
						return '[' + source.value + ']';
					} else {
						return string;
					}
				});
				// targetid	  评论ID
				// content	 评论内容
				// timepoint  发表时间点，点播使用
				// platform	  web侧填2即可
				// liveid	视频ID
				// keytype	 0直播，1vid，2cid，3lid，4频道id，5v+账号
				// video_tag	如果是直播，则填“zhibo”，否则空
				// areaid	春晚聊天室的地域ID
				// picture	 图片URL
				// picture_width	图片宽
				// picture_height	图片高
				// picture_id	春晚聊天室的图片ID
				// spid    使用表情包id串（即pid串），以"|"分隔
				// danmukey  弹幕注册时后台下发，发表时带上
				// g_tk	QQ登录时的CSRF校验token，计算时使用skey（也可能是lskey）
				// g_wxtk	微信登录时的CSRF校验token，计算时使用vusession
				// icon   用户头像
				// sendid   guid
				// bubble_id  气泡id
				// bubbleUrl  气泡背景整图
				// hlwGradeUrl 好莱坞等级背景
				var data = {
					targetid: this.dataset.registid,
					content: content,
					platform: 2,
					liveid: this.context.msg.run(api.publicApi.getVid),
					danmukey: this.dataset.bulletkey,
					spid: spids.join('|'),
					g_wxtk: login.getWXToken(),
					g_tk: login.getToken(),
					icon: login.getAvatar(40),
					sendid: util.createGUID()
				};
				var videoType = this.context.msg.run(api.publicApi.getVideoType);
				if (videoType == 'vod') {
					data.timepoint = this.context.msg.run(api.publicApi.getCurrentTime);
					data.video_tag = "";
					data.keytype = 1;
				} else {
					data.video_tag = "zhibo";
					data.keytype = 0;
				}
	
				// 气泡弹幕的处理
				if (this.dataset.isShowBubble && this.dataset.bubble) {
					var bubble = this.dataset.bubble.getPostBubbleSelect();
					$.extend(data, bubble);
				}
	
				this.context.msg.broadcast(api.publicApi.postBullet, data);
				this.dataset.$input.val('');
				// 发表后倒计时
				this.countDown();
			},
			countDown: function() { // 发表后倒计时
				var that = this;
				var time = 5
				that.toggleSubmitStatus(false);
	
				var down = function() {
					if (time > 0) {
						that.dataset.$submit.text("发表(" + time + ")");
						time--;
						setTimeout(function() {
							down();
						}, 1000);
					} else {
						that.dataset.$submit.text("发表");
						that.toggleSubmitStatus(true);
					}
				};
				down();
			},
			formatCount: function(str) {
				var tail = [];
				while (str >= 100000000) {
					str = (str / 100000000).toFixed(1);
					tail.unshift('亿');
				}
				while (str >= 10000) {
					str = (str / 10000).toFixed(1);
					tail.unshift('万');
				}
	
				if (str >= 1000) {
					str = Math.round(str);
				}
				return ('' + str).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + tail.join('');
			},
			updateHotBarrage: function(count) { // 显示热门弹幕数量
				count = this.formatCount(count);
				this.dataset.$mod.find("[data-role='count']").text("(" + count + ")");
			},
			isShowInput: function() { // 是否显示弹幕输入框
				var isShow = this.context.msg.run(api.privateApi.isShowBulletInput);
				this.dataset.$mod.find("[data-role='form']")[isShow ? "show" : "hide"]();
			},
			toggleLoginStatus: function(isLogin) {
				this.dataset.isLogin = isLogin;
				this.dataset.$mod.find("[data-role='login']")[isLogin ? 'hide' : 'show']();
				this.toggleSubmitStatus(isLogin);
			},
			updateBulletNumber: function() {
				var that = this;
				// 弹幕点赞数更新事件
				that.context.msg.on(api.eventApi.onBulletLikeNumberUpdate, function(data) {
					data && that.updateHotBarrage(data.num || 0);
				});
				var bulletNumber = that.context.msg.run(api.privateApi.getBulletLikeNumber);
				bulletNumber && that.updateHotBarrage(bulletNumber || 0);
			},
			updateSubmitStatus: function() {
				var that = this;
				// 如果是目前没有登录态的情况下需要处理一下
				// 播放状态改变事件
				that.context.msg.on(api.eventApi.onPlayStateChange, function(data) {
					if (data) {
						var state = data.state;
						// 1 播放中 2 暂停 3 缓冲中
						// 发表按钮可用
						that.toggleSubmitStatus((state == 1 || state == 2 || state == 3) && that.dataset.isLogin);
					}
				});
				// 根据播放状态决定发表按钮能不能使用
				var playerState = that.context.msg.run(api.publicApi.getPlayerState);
				that.toggleSubmitStatus((playerState == 1 || playerState == 2 || playerState == 3) && that.dataset.isLogin);
			},
			updateSwitchStatus: function() {
				var that = this;
				// 弹幕开关切换事件
				that.context.msg.on(api.eventApi.onFlashBulletSwitchStatusChange, function(data) {
					that.initToggleBtn(data);
				});
				// 处理弹幕开关
				var switchStatus = that.context.msg.run(api.privateApi.getFlashBulletSwitchStatus);
				if (typeof switchStatus !== 'undefined') {
					that.initToggleBtn(switchStatus);
				}
			},
			hideHotBullet: function() {
				this.dataset.$mod.find("[data-role='list']").hide();
				this.dataset.$mod.find("[data-role='form']").addClass(this.dataset.hideHotBulletClass);
			},
			initH5Player: function() {
				var that = this;
				that.h5PlayerRegist();
				// 视频切换
				that.context.msg.on(api.eventApi.onVidChange, function() {
					that.h5PlayerRegist();
				});
				// 用户是否开启弹幕
				that.context.msg.on(api.privateApi.isUserOpenBullet, function(data, options) {
					options.data = that.context.config.showBullet;
				});
				// 服务端是否开启弹幕
				that.context.msg.on(api.privateApi.isServerOpenBullet, function(data, options) {
					options.data = that.dataset.serverShowBullet;
				});
				// 是否显示弹幕输入框
				that.context.msg.on(api.privateApi.isShowBulletInput, function(data, options) {
					options.data = that.context.config.showBulletInput;
				});
				// 弹幕开关
				that.context.msg.on(api.publicApi.bulletSwitch, function(data, options) {
					that.dataset.isLogin && barrageUtil.userswitch(data);
					that.context.msg.broadcast(api.eventApi.onFlashBulletSwitchStatusChange, data);
					// 记录用户的开关操作 1是开 2是关
					window.localStorage && (window.localStorage[lsSwitchName] = data ? '1' : '2');
				});
				// 弹幕发表
				that.context.msg.on(api.publicApi.postBullet, function(data, options) {
					barrageUtil.barragePost(data);
				});
				// 弹幕开关状态
				that.context.msg.on(api.privateApi.getFlashBulletSwitchStatus, function(data, options) {
					options.data = that.dataset.userswitchStatus;
				});
			},
			h5PlayerRegist: function() { // 注册弹幕
				var that = this;
				barrageUtil.barrageRegist(that.context.msg.run(api.publicApi.getVid)).then(function(result) {
					var userswitch;
					// 1. 后台是否返回用户开关切换状态，有则直接用后台返回的
					// 2. 如果后台没有返回，则判断用户是否主动关闭过弹幕，是则不开启弹幕
					// 3. 如果用户没有主动关闭过弹幕，则使用外部传进来的config“是否默认开启弹幕”
					if (typeof result.userstatus === 'undefined') {
						if (window.localStorage && window.localStorage[lsSwitchName] &&
							window.localStorage[lsSwitchName] == 2) {
							userswitch = false;
						} else {
							userswitch = !!that.context.msg.run(api.privateApi.isBulletOpenDefault);
						}
					} else {
						userswitch = !!result.userstatus;
					}
					var data = {
						returncode: 0,
						registid: result.targetid,
						bulletkey: result.danmukey
					};
					that.dataset.serverShowBullet = data;
					that.context.msg.broadcast(api.eventApi.onBulletReady, data);
					that.dataset.userswitchStatus = userswitch;
					that.context.msg.broadcast(api.eventApi.onFlashBulletSwitchStatusChange, userswitch);
				});
			},
			getLoginStatus: function() { // 是否登录
				var isLogin = false;
				if (this.context.config && this.context.config.loginHandler && this.context.config.loginHandler.isLogin) {
					isLogin = this.context.config.loginHandler.isLogin();
				}
				return isLogin;
			},
			report: function(reportType) {
				this.context.msg.broadcast(api.privateApi.reportUsrAction, {
					usr_action: reportType
				});
			},
			bulletRegion: function(status) {
				this.dataset.showBulletRegion = status;
				this.context.msg.broadcast(api.eventApi.onShowBulletRegion, this.dataset.showBulletRegion);
			},
			closeBrowserFullscreen: function() { // 如果当前是伪全屏状态，需要关闭伪全屏
				var status = this.context.msg.run(api.publicApi.isBrowserFullscreen);
				status && this.context.msg.broadcast(api.publicApi.exitBrowserFullscreen);
			},
			showLogin: function() {
				this.closeBrowserFullscreen();
				this.context.userMsg.broadcast(api.eventApi.onShowLogin);
			},
			isUserOpenBullet: function() { // 用户是否开启弹幕
				return this.context.msg.run(api.privateApi.isUserOpenBullet);
			},
			showBubble: function(data) { // 是否显示气泡弹幕
				var that = this;
				that.dataset.isShowBubble = data.isShowBubble == "1";
				if (that.dataset.isShowBubble) {
					that.dataset.$mod.find("[data-role='bubble']").show();
					that.dataset.$mod.find("[data-role='form']").addClass('txp_bubble_on');
					if (!that.dataset.bubble) {
						// 创建气泡弹幕实例
						that.dataset.bubble = new Bubble(that.context.msg.run(api.publicApi.getPlayerId),
							that.msg, that.dataset.$mod.find("[data-role='form']"));
						// 气泡弹幕相关事件
						that.msg.on('txv_barrage_setbubble', function() {
							that.setBubble();
						});
					}
					// 外部传入的获取登录会员信息的接口
					var getVipInfo;
					if (that.context.config && that.context.config.loginHandler && that.context.config.loginHandler.getVipInfo) {
						getVipInfo = that.context.config.loginHandler.getVipInfo;
					}
					that.dataset.bubble.init(data, getVipInfo);
				} else {
					that.dataset.$mod.find("[data-role='bubble']").hide();
					that.dataset.$mod.find("[data-role='form']").removeClass('txp_bubble_on');
					that.dataset.bubble && that.setBubble(true);
				}
			},
			setBubble: function(isReset) { // 设置输入框气泡弹幕的背景，isReset表示是否重置
				var param;
				if (!isReset) {
					param = this.dataset.bubble.getCurrentSelect();
				}
				var $bg = this.dataset.$mod.find("[data-role='bg']");
				if (param && param.color) {
					$bg.css({
						background: param.color.replace(/^0x*/g, "#")
					}).show();
				} else {
					$bg.hide();
				}
				this.dataset.$mod.find("[data-role='inp']").css({
					background: param && param.url_head ? "url(" + param.url_head + ") right center no-repeat" : 'none'
				});
			}
		};
	
		Txplayer.register('Barrage', Barrage);
	
	/***/ },
	/* 2 */
	/***/ function(module, exports) {
	
		module.exports = "<div class=\"txp_mod_barrage\" data-role=\"main\">\n\t<div class=\"txp_barrage_switch\">\n\t\t<div class=\"txp_btn_text\">弹幕</div>\n\t\t<div class=\"txp_btn_toggle\" data-role=\"toggle\"><i class=\"txp_btn_inner\"></i></div>\n\t</div>\n\t<div class=\"txp_barrage_form\" data-role=\"form\">\n\t\t<div class=\"txp_barrage_from_bg\" data-role=\"bg\" style=\"display: none;\"></div>\n\t\t<div class=\"txp_barrage_inp\" data-role=\"inp\">\n\t\t\t<input type=\"text\" class=\"txp_inp_text\" data-role=\"input\" maxlength=\"25\">\n\t\t\t<div class=\"txp_barrage_login\" data-role=\"login\"><span class=\"txp_text\">登录</span>后可以参与弹幕</div>\n\t\t</div>\n\t\t<a href=\"javascript:void(0);\" data-role=\"bubble\" class=\"txp_iconfont txp_icon_bubble\" style=\"display: none;\">&#xe62a;</a>\n\t\t<a href=\"javascript:void(0);\" data-role=\"face\" class=\"txp_iconfont txp_icon_face\">&#xe61b;</a>\n\t\t<button type=\"submit\" class=\"txp_btn_submit\" data-role=\"submit\">发表</button>\n\t</div>\n\t<a href=\"javascript:void(0);\" class=\"txp_btn_barrage_list\" data-role=\"list\">\n\t\t<span class=\"txp_icon_text\">弹幕</span><span class=\"txp_hl\" data-role=\"count\"></span><i class=\"txp_iconfont txp_icon_right\">&#xe606;</i>\n\t</a>\n</div>";
	
	/***/ },
	/* 3 */
	/***/ function(module, exports, __webpack_require__) {
	
		var $ = Txplayer.$;
	
		var tplEmojiContainer = __webpack_require__(4);
		var tplEmojiDetail = __webpack_require__(5);
		var barrageUtil = __webpack_require__(6);
		var barrageEmojiMap = __webpack_require__(8);
		var login = __webpack_require__(7);
	
		// 分页的size
		var EMOJI_PAGE_SIZE = 7;
		// 每一行显示的表情数量
		var EMOJI_ROW_COUNT = 5;
	
		function Emoji(id, vid, msg, $container) {
	
			this.container = "x_mod_emoji_" + id;
			this.detailPre = "emoji_detail_" + id + "_";
			this.emojiBd = "x_emoji_bd_" + id;
	
			// 容器ID
			this.emojiContainerId = "#" + this.container;
			// detail的前缀
			this.EMOJI_DETAIL_PRE = "#" + this.detailPre;
			// bd
			this.EMOJI_BD = "#" + this.emojiBd;
			// 当前页码
			this.emojiCurrentPage = 0;
			// 存放表情相关的数据
			this.expressionData = null;
			// 表情面板是否正在显示
			this.isEmojiTableShow = false;
	
			this.currentVid = vid;
			this.message = msg;
			this.$container = $container;
	
			this.timerShow = null;
	
			// 把CSS的加载提前
			this.loadEmojiCss();
		}
	
	
		/**
		 * 拉取视频下面的表情预览信息接口
		 * @author robbinlei
		 * @date   2015-10-09
		 * @param  {string}   videoId 点播时传vid，直播时传pid
		 */
		Emoji.prototype.getExpressionList = function(videoId, videoType) {
			var defer = $.Deferred();
			var data = {
				otype: "json"
			};
			if (videoType == 1) {
				data.pid = videoId;
			} else {
				data.vid = videoId;
			}
			data.g_tk = login.getToken();
			$.ajax({
				url: "//bullet.video.qq.com/fcgi-bin/expression/get_expression_list",
				data: data,
				dataType: "jsonp"
			}).done(function(json) {
				if (json && json.code === 0 && json.expression && json.expression.length > 0) {
					defer.resolve(json);
				} else {
					defer.reject(json);
				}
			}).fail(function(json) {
				defer.reject(json);
			});
	
			return defer;
		};
	
		/**
		 * 拉取表情详情
		 * @author robbinlei
		 * @date   2015-10-09
		 * @param  {string}   expression_id 表情包id
		 */
		Emoji.prototype.getExpression = function(expression_id, videoId, videoType) {
			var defer = $.Deferred();
			var data = {
				expression_id: expression_id,
				video_id: videoId,
				video_id_type: videoType,
				platform: 2,
				otype: "json"
			};
			data.g_tk = login.getToken();
			$.ajax({
				url: "//bullet.video.qq.com/fcgi-bin/expression/get_expression",
				data: data,
				dataType: "jsonp"
			}).done(function(json) {
				if (json && json.code === 0) {
					defer.resolve(json);
				} else {
					defer.reject(json);
				}
			}).fail(function(json) {
				defer.reject(json);
			});
	
			return defer;
		};
	
		// 模板辅助方法
		Emoji.prototype.helpers = {
			/**
			 * 高级表情 根据id拼图片url
			 * @param  {[type]}   id 表情id
			 * @return {[type]}      [description]
			 */
			emojiPic: function(id) {
				return "//puui.qpic.cn/virtual_item_ns/0/" + id + ".png/0";
			},
			/**
			 * 高级表情 计算到期时间
			 * @param  {[type]}   et 到期时间
			 * @return {[type]}      [description]
			 */
			emojiExpDate: function(et) {
				// 这里给的et时间是秒
				var gap = new Date(et * 1000) - new Date();
				if (gap > 0) {
					var day = gap / 1000 / 60 / 60 / 24;
					if (day > 30) {
						return Math.floor(day / 30) + "个月";
					} else {
						return Math.ceil(day) + "天";
					}
				} else {
					return "已到期";
				}
			}
		};
	
		// 加载高级表情css
		Emoji.prototype.loadEmojiCss = function() {
			barrageUtil.loadCss();
		};
	
		Emoji.prototype.hideEmojiContainer = function() {
			$(this.emojiContainerId).hide();
			this.isEmojiTableShow = false;
		};
	
		Emoji.prototype.removeEmojiContent = function() {
			$(this.emojiContainerId).remove();
			this.emojiCurrentPage = 0;
			this.expressionData = null;
			this.isEmojiTableShow = false;
			clearTimeout(this.timerShow);
		};
	
		Emoji.prototype.showEmojiContainer = function() {
			var that = this;
			// 加载css
			// that.loadEmojiCss();
			if (!that.expressionData) {
				that.getExpressionList(that.currentVid, 2).then(function(json) {
					// 避免多次请求重复添加
					if (!that.expressionData) {
						// 把拉取的数据缓存起来
						that.expressionData = {};
						$.each(json.expression, function(index, item) {
							that.expressionData[item.id] = item;
						});
						// 渲染模板
						var htmldata = $.tmpl(tplEmojiContainer, {
							"expression": json.expression,
							"emojiPageSize": EMOJI_PAGE_SIZE,
							"container": that.container,
							"emojiBd": that.emojiBd
						});
						that.$container.append(htmldata);
						// 绑定按钮
						that.bindEmojiEvent(json.expression.length);
						// 处理鼠标滚动冒泡
						barrageUtil.stopScrollPropagation('.x_emoji_table');
						// 触发第一个tab
						$(that.emojiContainerId + " .x_tab:eq(0)").trigger("click");
						// 重置当前分页为1
						that.emojiCurrentPage = 0;
					} else {
						// 显示面板
						$(that.emojiContainerId).show();
					}
					that.isEmojiTableShow = true;
				});
			} else {
				// 显示面板
				$(that.emojiContainerId).show();
				that.isEmojiTableShow = true;
			}
		};
	
		Emoji.prototype.showEmojiDetail = function(emoji_id) {
			var that = this;
			if (!(that.expressionData && that.expressionData[emoji_id] && that.expressionData[emoji_id]['__detail'])) {
				that.getExpression(emoji_id, that.currentVid, 2).then(function(json) {
					// 避免多次请求重复添加
					if (!(that.expressionData && that.expressionData[emoji_id] && that.expressionData[emoji_id]['__detail'])) {
						var $emojibd = $(that.EMOJI_BD);
						$emojibd.children().addClass("x_none");
						// 处理下json.list的长度，保证是EMOJI_ROW_COUNT的倍数，模板展示的时候需要是EMOJI_ROW_COUNT的倍数
						var length = json.list.length;
						var targetLength = Math.ceil(length / EMOJI_ROW_COUNT) * EMOJI_ROW_COUNT;
						if (targetLength != length) {
							json.list[targetLength - 1] = {};
						}
						$.extend(json, {
							"emojiRowCount": EMOJI_ROW_COUNT
						});
						json.__tplType = (json.isvip != 1 && (json.payn === 0 || json.own == 1)) ? 1 : 2;
						that.expressionData[emoji_id]['__detail'] = json;
						// 优先判断isvip，如果isvip为1，那表情就是可用的，
						// 如果isvip不为1，先判断表情是否是会员表情（payn>0）
						// 是的话，判断这个非会员是否购买过这个表情（own==1），购买过的话，表情可用，显示到期时间（et）
						var htmldata = $.tmpl(tplEmojiDetail, $.extend({}, json, {
							_: that.helpers,
							detailPre: that.detailPre
						}));
						$emojibd.append(htmldata);
					} else {
						$(that.EMOJI_DETAIL_PRE + emoji_id).removeClass("x_none").siblings().addClass("x_none");
					}
				});
			} else {
				$(that.EMOJI_DETAIL_PRE + emoji_id).removeClass("x_none").siblings().addClass("x_none");
			}
		};
	
		// 绑定事件
		Emoji.prototype.bindEmojiEvent = function(length) {
			var that = this;
			// 防止多次绑定
			$(that.emojiContainerId)
				.off("click", ".x_tab")
				.off("click", "._x_emoji_pic")
				.off("click", "._x_emoji_purchase")
				.off("click", ".x_page_prev,.x_page_next")
				.off("mouseenter")
				.off("mouseleave")
				.show()
				.on("click", ".x_tab", function() { // tab点击处理
					var $this = $(this);
					var eid = $this.attr("data-eid");
					// 切换tab的激活状态
					$this.addClass("x_current").siblings().removeClass("x_current");
					// 加载表情包详情
					that.showEmojiDetail(eid);
					// 上报
					that.message.emit("txv_barrage_report", "barrage-emoji-" + eid);
				})
				.on("click", "._x_emoji_pic", function() { // 表情点击处理，未购买的拉起购买浮层
					var $this = $(this);
					var eid = $this.attr("data-eid");
					if (that.expressionData[eid]['__detail'].isvip == 1 || that.expressionData[eid]['__detail'].payn === 0 ||
						that.expressionData[eid]['__detail'].own == 1) {
						// 发送表情
						that.message.emit("txv_barrage_input", {
							content: "[" + barrageEmojiMap.fromSourceToTarget($this.attr("data-did")) + "]"
						});
						// 关闭浮层
						that.hideEmojiContainer();
					} else {
						that.openMiniPay();
					}
					// 上报
					that.message.emit("txv_barrage_report", "barrage-emoji-" + eid + "-click");
				})
				.on("click", "._x_emoji_purchase", function() { // 购买按钮点击处理
					that.openMiniPay();
					// 上报
					that.message.emit("txv_barrage_report", "barrage-emoji-purchase");
				})
				.on("click", ".x_page_prev,.x_page_next", function() { // 翻页
					var $this = $(this);
					if ($this.hasClass("x_gery")) {
						return;
					}
					if ($this.hasClass("x_page_prev")) { // 上一页
						that.emojiCurrentPage = that.emojiCurrentPage - EMOJI_PAGE_SIZE;
						while (that.emojiCurrentPage < 0) {
							that.emojiCurrentPage++;
						}
						// 上报
						that.message.emit("txv_barrage_report", "barrage-emoji-prev");
					} else if ($this.hasClass("x_page_next")) { // 下一页
						that.emojiCurrentPage = that.emojiCurrentPage + EMOJI_PAGE_SIZE;
						while (that.emojiCurrentPage > length - EMOJI_PAGE_SIZE) {
							that.emojiCurrentPage--;
						}
						// 上报
						that.message.emit("txv_barrage_report", "barrage-emoji-next");
					}
					// 处理按钮样式
					$(that.emojiContainerId + " .x_page_prev")[(that.emojiCurrentPage === 0) ? "addClass" : "removeClass"]("x_gery");
					$(that.emojiContainerId + " .x_page_next")[(that.emojiCurrentPage == length - EMOJI_PAGE_SIZE) ? "addClass" : "removeClass"]("x_gery");
					$(that.emojiContainerId + " .x_tab").hide().slice(that.emojiCurrentPage, that.emojiCurrentPage + EMOJI_PAGE_SIZE).show();
				})
				.on("mouseenter", function() {
					that.mouseenter();
				})
				.on("mouseleave", function() {
					that.mouseleave();
				});
		};
	
		Emoji.prototype.openMiniPay = function() { // 开通好莱坞
			var that = this;
			// 关闭伪全屏
			that.message.emit("txv_closebrowserfullscreen");
			// 拉起开通好莱坞的浮层
			barrageUtil.openMiniPay('V0$$4:82', function() {
				that.removeEmojiContent();
			});
		};
	
		Emoji.prototype.toggle = function() {
			if (!this.isEmojiTableShow) {
				this.showEmojiContainer();
			} else {
				this.hideEmojiContainer();
			}
		};
	
		Emoji.prototype.mouseenter = function() {
			if (this.isEmojiTableShow) {
				clearTimeout(this.timerShow);
			}
		};
	
		Emoji.prototype.mouseleave = function() {
			var that = this;
			if (that.isEmojiTableShow) {
				clearTimeout(that.timerShow);
				that.timerShow = setTimeout(function() {
					that.hideEmojiContainer();
				}, 500);
			}
		};
	
		module.exports = Emoji;
	
	/***/ },
	/* 4 */
	/***/ function(module, exports) {
	
		module.exports = "<div class=\"x_mod_emoji\" id=\"<%=container%>\" style=\"right: 0;bottom: 40px;\">\n    <iframe class=\"x_iframe_mask\" src=\"about:blank\" frameborder=\"0\"></iframe>\n    <div class=\"x_box_triangle\"></div>\n    <div class=\"x_mod_inner\">\n        <div class=\"x_emoji_bd\" id=\"<%=emojiBd%>\">\n        </div>\n        <div class=\"x_mod_fd\">\n            <div class=\"x_emoji_tabs\">\n                <% for(var len = expression.length, i = 0; i < len; i++){ %>\n                <div class=\"x_tab\" data-eid=\"<%=expression[i].id%>\"<% if(i >= emojiPageSize){ %> style=\"display:none\"<% } %>><img src=\"<%=expression[i].pp%>\"><% if(expression[i]['new'] && expression[i]['new'] == 1){ %><i class=\"x_emoji_new\"></i><% } %></div>\n                <% } %>\n            </div>\n            <div class=\"x_emoji_pages\">\n                <span class=\"x_page_prev x_gery\"><span class=\"x_icon_prev\"></span></span>\n                <span class=\"x_page_next<% if(expression.length <= emojiPageSize){ %> x_gery<% } %>\"><span class=\"x_icon_next\"></span></span>\n            </div>\n        </div>\n    </div>\n</div>";
	
	/***/ },
	/* 5 */
	/***/ function(module, exports) {
	
		module.exports = "<div class=\"x_emoji_box<% if(__tplType == 2){ %> x_emoji_box_purchase<% } %>\" id=\"<%=detailPre%><%=id%>\">\n    <% if(__tplType == 2){ %>\n    <div class=\"x_emoji_head\">\n        <div class=\"x_emoji_pic\">\n            <img src=\"<%=pp%>\">\n        </div>\n        <div class=\"x_emoji_title\"><%=n%></div>\n        <div class=\"x_emoji_desc\" title=\"<%=pd%>\"><%=pd%></div>\n        <div class=\"x_emoji_purchase\">\n            <% if(isvip == 1){ %>\n            <a href=\"javascript:void(0);\" class=\"x_getit\"></a>\n            <span class=\"x_purchase_desc\">已是VIP会员，可免费使用</span>\n            <% } else {%>\n            <a href=\"javascript:void(0);\" class=\"x_btn _x_emoji_purchase\">\n                <span class=\"x_text\">开通会员</span>\n            </a>\n            <span class=\"x_purchase_desc\">开通VIP会员立即拥有</span>\n            <% } %>\n        </div>\n    </div>\n    <% } else {%>\n    <div class=\"x_emoji_hd\">\n        <div class=\"x_title\"><%=n%></div>\n        <div class=\"x_meta\"><% if(isvip != 1 && payn > 0 && et > 0){ %>有效期：<%=_.emojiExpDate(et)%><% } %></div>\n    </div>\n    <% } %>\n    <div class=\"x_emoji_table<% if(count <= emojiRowCount * (__tplType == 2 ? 2 : 3)){ %> x_emoji_table_less<% } %>\">\n    \t<table>\n            <% for(var len = list.length, i = 0; i < len; i++){ %>\n            <% if(i % emojiRowCount == 0){ %><tr><% } %>\n            <% if(list[i] && list[i].id){ %>\n            <td class=\"_x_emoji_pic\" data-eid=\"<%=id%>\" data-did=\"<%=list[i].id%>\"><img src=\"<%=_.emojiPic(list[i].id)%>\"></td>\n            <% } else {%>\n            <td class=\"empty\"></td>\n            <% } %>\n            <% if(i % emojiRowCount == emojiRowCount - 1 || i + 1 == list.length){ %></tr><% } %>\n            <% } %>\n\t\t</table>\n    </div>\n</div>";
	
	/***/ },
	/* 6 */
	/***/ function(module, exports, __webpack_require__) {
	
		var $ = Txplayer.$;
		var util = Txplayer.util;
		var login = __webpack_require__(7);
		// var barrageEmojiMap = require('modules/barrage-emoji-map');
	
		var hexColorReg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	
		module.exports = {
			openMiniPay: function(aid, successCallback, errorCallback, closeCallback) {
				var open = function() {
					var isSuccess = false;
					window.HLW_PAY.openPay({
						width: 670,
						codes: 'txsp',
						scene: 'minipay',
						type: 'service',
						amount: '12',
						amountType: 'month',
						channels: 'qdqb,kj,weixin',
						zIndex: 10001,
						// 统计用的aid
						aid: aid,
						// MA号 营销活动ID
						actid: '',
						// 可选。用户支付成功时的回调方法。
						// 如果用户支付成功，则立即回调onSuccess。
						// 参数opt为本次交易的信息。
						// 注意：银行卡渠道下，该回调不可信
						// 成功时的opt：{result_code:0, service_name:'xxx', amount:1, target_uin:123, uin:123, channel:'xxx', context:'xxx',type: 'xxx'}
						onSuccess: function(opt) {
							isSuccess = true;
							successCallback && successCallback(opt);
						},
						// 可选。用户支付失败时的回调方法。
						// 如果用户支付失败，则立即回调onError，当用户关闭对话框时再回调onClose。
						// 失败时的opt：{result_code:1, service_name:'xxx', amount:1, target_uin:123, uin:123, channel:'xxx',type: '',errmsg:'xxx'}
						onError: function(opt) {
							errorCallback && errorCallback(opt);
						},
						// 可选。对话框关闭时的回调方法。
						// 主要用于对话框关闭后进行UI方面的调整。
						onClose: function(opt) {
							closeCallback && closeCallback(opt);
							isSuccess && window.location.reload();
						}
					});
				};
	
				if (window.HLW_PAY && window.HLW_PAY.openPay) {
					open();
				} else {
					$.getScript("http://qzs.qq.com/tencentvideo_v1/script/film/open/pay.js", function() {
						if (window.HLW_PAY && window.HLW_PAY.openPay) {
							open();
						}
					});
				}
			},
			stopScrollPropagation: function(selector) {
				// 阻止鼠标滚动事件冒泡
				$(document)
					.off('DOMMouseScroll mousewheel', selector)
					.on('DOMMouseScroll mousewheel', selector, function(ev) {
						var $this = $(this),
							scrollTop = this.scrollTop,
							scrollHeight = this.scrollHeight,
							height = $this.height(),
							delta = (ev.type == 'DOMMouseScroll' ? ev.originalEvent.detail * -40 : ev.originalEvent.wheelDelta),
							up = delta > 0;
	
						var prevent = function() {
							ev.stopPropagation();
							ev.preventDefault();
							ev.returnValue = false;
							return false;
						};
	
						if (!up && -delta > scrollHeight - height - scrollTop) {
							// Scrolling down, but this will take us past the bottom.
							$this.scrollTop(scrollHeight);
							return prevent();
						} else if (up && delta > scrollTop) {
							// Scrolling up, but this will take us past the top.
							$this.scrollTop(0);
							return prevent();
						}
					});
			},
			// getInputSelection: function(el) {
			// 	var start = 0,
			// 		end = 0,
			// 		normalizedValue, range,
			// 		textInputRange, len, endRange;
	
			// 	if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
			// 		start = el.selectionStart;
			// 		end = el.selectionEnd;
			// 	} else {
			// 		range = document.selection.createRange();
	
			// 		if (range && range.parentElement() == el) {
			// 			len = el.value.length;
			// 			normalizedValue = el.value.replace(/\r\n/g, "\n");
	
			// 			// Create a working TextRange that lives only in the input
			// 			textInputRange = el.createTextRange();
			// 			textInputRange.moveToBookmark(range.getBookmark());
	
			// 			// Check if the start and end of the selection are at the very end
			// 			// of the input, since moveStart/moveEnd doesn't return what we want
			// 			// in those cases
			// 			endRange = el.createTextRange();
			// 			endRange.collapse(false);
	
			// 			if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
			// 				start = end = len;
			// 			} else {
			// 				start = -textInputRange.moveStart("character", -len);
			// 				start += normalizedValue.slice(0, start).split("\n").length - 1;
	
			// 				if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
			// 					end = len;
			// 				} else {
			// 					end = -textInputRange.moveEnd("character", -len);
			// 					end += normalizedValue.slice(0, end).split("\n").length - 1;
			// 				}
			// 			}
			// 		}
			// 	}
	
			// 	return {
			// 		start: start,
			// 		end: end
			// 	};
			// },
			// calcLength: function(val) {
			// 	// 表情算四个字符
			// 	val = val.replace(/\[.+?\]/g, function(string) {
			// 		return barrageEmojiMap.fromTargetToSource(string.replace(/[\[\]]/g, '')) ? 'mmmm' : string;
			// 	});
			// 	// 中文算两个字符
			// 	var r = /[^\x00-\xff]/g;
			// 	val = val.replace(r, "mm");
			// 	return val.length;
			// },
			insertText: function(e, t) {
				if (document.selection) {
					var a = document.selection.createRange();
					a.text = t
				} else if ("number" == typeof e.selectionStart && "number" == typeof e.selectionEnd) {
					var i = e.selectionStart,
						n = e.selectionEnd,
						o = i,
						r = e.value;
					e.value = r.substring(0, i) + t + r.substring(n, r.length),
						o += t.length,
						e.selectionStart = e.selectionEnd = o
				} else
					e.value += t
			},
			barrageRegist: function(vid) {
				var defer = $.Deferred();
				$.ajax({
					url: "//bullet.video.qq.com/fcgi-bin/target/regist",
					data: {
						otype: "json",
						vid: vid,
						g_tk: login.getToken()
					},
					dataType: "jsonp"
				}).done(function(json) {
					if (json && json.returncode === 0) {
						defer.resolve(json);
					} else {
						defer.reject(json);
					}
				}).fail(function(json) {
					defer.reject(json);
				});
	
				return defer;
			},
			userswitch: function(status) {
				var defer = $.Deferred();
				$.ajax({
					url: "//bullet.video.qq.com/fcgi-bin/userswitch",
					data: {
						otype: "json",
						cmd: "set",
						status: status ? "on" : "off",
						g_tk: login.getToken()
					},
					dataType: "jsonp"
				}).done(function(json) {
					if (json && json.returncode === 0) {
						defer.resolve(json);
					} else {
						defer.reject(json);
					}
				}).fail(function(json) {
					defer.reject(json);
				});
	
				return defer;
			},
			barragePost: function(postData) {
				$.ajax({
					url: '//bullet.video.qq.com/fcgi-bin/comment/post?otype=json&callback=postCommentCb',
					type: 'post',
					crossDomain: true,
					xhrFields: {
						withCredentials: true
					},
					data: postData,
					success: function(data) {
						try {
							data = data.replace('postCommentCb', '');
	
							data = data.replace(/[)\(]/gi, '');
	
							data = $.parseJSON(data);
	
						} catch (e) {}
					},
					error: function(e) {
	
					},
					timeout: function(e) {
	
					}
				});
			},
			loadCss: function() {
				util.loadCss("//vm.gtimg.cn/c/=/tencentvideo/vstyle/web/common/style/x_emoji.css,x_bubble.css");
			}
		};
	
	/***/ },
	/* 7 */
	/***/ function(module, exports) {
	
		var $ = Txplayer.$;
		var util = Txplayer.util;
		var login = {
			/**
			 * 根据skey计算出hashcode
			 *
			 * @param {string}
			 *          skey
			 * @return {string}
			 */
			time33: function(skey) {
				// 哈希time33算法
				for (var i = 0, len = skey.length, hash = 5381; i < len; ++i) {
					hash += (hash << 5) + skey.charAt(i).charCodeAt();
				};
				return hash & 0x7fffffff;
			},
			/**
			 * 获取CSRF 的 token
			 *
			 * @return {String}
			 */
			getToken: function() {
				var skey = login.getSkey(),
					token = !!skey ? login.time33(skey) : "";
				return token;
			},
			getWXToken: function() {
				var vu = $.trim(util.cookie.get("vusession")),
					token = !!vu ? login.time33(vu) : "";
				return token;
			},
			/**
			 * 获取用户的qq头像
			 * @param {Number} size 头像的尺寸
			 */
			getAvatar: function(size) {
				if (login.getLoginType() == "wx") {
					return login.getWxHead();
				}
				if (login.getSkey() === "") {
					return "";
				}
				var n = util.cookie.get('lw_nick');
				if (n === "") {
					return n;
				}
				var arr = n.split("|"),
					uin = login.getUinOnly();
				if (arr[1] && arr[1] == uin) {
					if (arr[2]) {
						size = login.getValidAvatarSize(size);
						return decodeURIComponent(arr[2]).replace(/([\?&]?s=)40([&$])/, "$1" + size + "$2");
					}
				}
				return "";
			},
			// 获得登陆的类型
			getLoginType: function() {
				return util.cookie.get('main_login');
			},
			// 拉取微信用户头像
			getWxHead: function() {
				return util.cookie.get('wx_head');
			},
			/**
			 * 获取skey
			 *
			 * @return {String} skey字符串
			 */
			getSkey: function() {
				return $.trim(util.cookie.get("skey")) || $.trim(util.cookie.get("lskey"));
			},
			// 原始的只拉取qq号的方法，只组件内部调用
			getUinOnly: function() {
				if (login.getSkey() === "") {
					return 0;
				}
				var uin = parseInt(util.cookie.get('uin').replace(/^o0*/g, ""), 10);
				if (!uin || uin <= 10000) {
					uin = parseInt(util.cookie.get('luin').replace(/^o0*/g, ""), 10);
					if (!uin || uin <= 10000) {
						return 0;
					}
				}
				return uin;
			},
			/**
			 * 获取有效的头像尺寸
			 * @param {Number} size
			 * @return {Number} 有效的头像尺寸，默认取第一个尺寸
			 */
			getValidAvatarSize: function(size) {
				var sizeArr = [40, 100];
				if ($.inArray(size, sizeArr) == -1) { // 没有这种格式的图片
					return sizeArr[0];
				}
				return size;
			}
		};
		module.exports = login;
	
	/***/ },
	/* 8 */
	/***/ function(module, exports) {
	
		var $ = Txplayer.$;
	
		var sourceArr = [
			"e7ybo", "g9cb0", "ejyvq", "fejnk", "cp34m",
			"5a8zt", "elfjz", "xl14z", "ov2hs", "2n51o",
			"p86eg", "dk4s3", "9sw9m", "21285", "5hflj",
			"u6rmb", "38ify", "rc4a6", "aakes", "b51dk",
			"4s6dc", "fy0ux", "p97hv", "38ewo",
	
			"a5pff", "jai5n", "7p28o", "v8ww6", "hj9no",
			"xgz6t", "dnxhe", "wr9u0", "gsj2f", "809lg",
			"sjhe5", "lovql", "q4u4b", "ymku0", "jw7ft",
			"2sa94", "cvrj4", "wkgjb", "4dmry", "b69il"
		];
	
		var targetArr = [
			"鄙视", "擦汗", "龇牙", "得意", "发呆",
			"发怒", "鼓掌", "害羞", "惊恐", "可怜",
			"抠鼻", "流汗", "流泪", "敲打", "亲亲",
			"色", "调皮", "偷笑", "微笑", "阴险",
			"吓", "疑问", '晕', "再见",
	
			"s鄙视", "s吃惊", "s大怒", "s色", "s恶心",
			"s尴尬", "s鼓掌", "s可怜", "s酷", "s狂笑",
			"s胜利", "s石化", "s抓狂", "s流泪", "s调皮",
			"s害羞", "s困", "s疑问", "s委屈", "s微笑"
		];
	
		module.exports = {
			fromSourceToTarget: function(source) {
				var index = $.inArray(source, sourceArr);
				return index >= 0 ? targetArr[index] : '';
			},
			fromTargetToSource: function(target) {
				var index = $.inArray(target, targetArr);
				if (index >= 0) {
					var eid = index <= 23 ? '10000058' : '10000059';
					return {
						eid: eid,
						value: sourceArr[index]
					}
				} else {
					return null;
				}
			}
		}
	
	/***/ },
	/* 9 */
	/***/ function(module, exports, __webpack_require__) {
	
		var $ = Txplayer.$;
	
		var tplBubbleContainer = __webpack_require__(10);
		var tplBubbleTips = __webpack_require__(11);
		var barrageUtil = __webpack_require__(6);
		var login = __webpack_require__(7);
	
		var LOCAL_STORAGE_SELECT_NAME = 'bubble_select_id';
		var LOCAL_STORAGE_TIPS = 'bubble_tips';
	
		function Bubble(id, msg, $container) {
			this.container = "x_mod_bubble_" + id;
			// tips的id
			this.bubbleTipsId = "bubble_tips_" + id;
			// 容器ID
			this.bubbleContainerId = "#" + this.container;
			this.danmukey = '';
			// 存放气泡弹幕相关数据
			this.bubbleCache = {
				'0': {
					paytype: 1,
					url_back: ''
				}
			};
			this.deferBubbleCache = null;
			this.bubbleId = '';
	
			// 气泡弹幕面板是否正在显示
			this.isBubbleTableShow = false;
	
			this.message = msg;
			this.$container = $container;
	
			// 是否好莱坞会员
			this.isVip = false;
			this.vipLevel = 0;
			this.annualVip = false;
			this.getVipInfo = null;
	
			this.timerShow = null;
	
			// 把CSS的加载提前
			this.loadBubbleCss();
		}
	
		Bubble.prototype.init = function(param, getVipInfo) {
			var that = this;
			that.getVipInfo = getVipInfo;
			that.danmukey = param.bulletkey;
			that.removeBubbleContainer();
			that.deferBubbleCache = null;
			that.getBubble().then(function(data) {
				// 用户选择过，并且该气泡存在，则使用用户选择的，否则有默认用默认，没默认用第一个
				var selectBid, defaultBid, hasSelectBid = false;
				if (window.localStorage && window.localStorage.getItem(LOCAL_STORAGE_SELECT_NAME)) {
					selectBid = window.localStorage.getItem(LOCAL_STORAGE_SELECT_NAME);
					if (selectBid == "0") { // 如果选择的是无气泡，则使用无气泡
						hasSelectBid = true;
					}
				}
				$.each(data.data, function(i, item) {
					if (item.isdefault == 1 && !defaultBid) {
						defaultBid = item.id;
					}
					if (selectBid && !hasSelectBid && selectBid == item.id) {
						hasSelectBid = true;
					}
				});
				var bid;
				if (hasSelectBid) {
					bid = selectBid;
				} else if (defaultBid) {
					bid = defaultBid;
				} else {
					bid = data.data[0].id;
				}
				// 登录态和是否好莱坞会员的处理，然后判断选中状态
				that.isLoginOrVip(bid, true);
				// 显示tips
				that.showTips();
			});
		};
	
		/**
		 * 拉取气泡弹幕列表
		 * @author robbinlei
		 * @date   2016-05-31
		 */
		Bubble.prototype.getBubble = function() {
			var that = this;
			if (!that.deferBubbleCache) {
				that.deferBubbleCache = $.Deferred();
				var data = {
					type: 1,
					danmukey: that.danmukey,
					otype: "json"
				};
				data.g_tk = login.getToken();
				$.ajax({
					url: "//bullet.video.qq.com/fcgi-bin/comment/get_danmu_richdata",
					data: data,
					dataType: "jsonp"
				}).done(function(json) {
					if (json && json.returncode === 0) {
						// 把数据存放起来
						that.putToCache(json.data);
						that.deferBubbleCache.resolve(json);
					} else {
						that.deferBubbleCache.reject(json);
					}
				}).fail(function(json) {
					that.deferBubbleCache.reject(json);
				});
			}
	
			return that.deferBubbleCache;
		};
	
		// 加载高级表情css
		Bubble.prototype.loadBubbleCss = function() {
			barrageUtil.loadCss();
		};
	
		// 把数据存放起来
		Bubble.prototype.putToCache = function(list) {
			var that = this;
			$.each(list, function(i, item) {
				that.bubbleCache['' + item.id] = item;
			});
		};
	
		Bubble.prototype.showBubbleContainer = function() {
			var that = this;
			if ($(that.bubbleContainerId).length === 0) {
				that.getBubble().then(function(json) {
					// 避免多次请求重复添加
					if ($(that.bubbleContainerId).length === 0) {
						// 渲染模板
						var htmldata = $.tmpl(tplBubbleContainer, {
							"list": json.data,
							"container": that.container
						});
						that.$container.append(htmldata);
						// 登录态和是否好莱坞会员的处理，然后判断选中状态
						that.isLoginOrVip(that.bubbleId, true);
						// 绑定按钮
						that.bindBubbleEvent();
						// 处理鼠标滚动冒泡
						barrageUtil.stopScrollPropagation('.x_bubble_list');
					} else {
						// 登录态和是否好莱坞会员的处理，然后判断选中状态
						that.isLoginOrVip(that.bubbleId);
						// 显示面板
						$(that.bubbleContainerId).show();
					}
					that.isBubbleTableShow = true;
				});
			} else {
				// 登录态和是否好莱坞会员的处理，然后判断选中状态
				that.isLoginOrVip(that.bubbleId);
				// 显示面板
				$(that.bubbleContainerId).show();
				that.isBubbleTableShow = true;
			}
		};
	
		Bubble.prototype.hideBubbleContainer = function() {
			$(this.bubbleContainerId).hide();
			this.isBubbleTableShow = false;
		};
	
		// 移除容器
		Bubble.prototype.removeBubbleContainer = function() {
			$(this.bubbleContainerId).remove();
			this.isBubbleTableShow = false;
		};
	
		// 绑定事件
		Bubble.prototype.bindBubbleEvent = function() {
			var that = this;
			$(that.bubbleContainerId)
				.off("click", ".x_list_item")
				.off("click", ".x_link")
				.off("mouseenter")
				.off("mouseleave")
				.show()
				.on("click", ".x_list_item", function() {
					var $this = $(this);
					var bid = $this.attr("data-bid");
					if (that.isVip || that.bubbleCache['' + bid].paytype == 1) {
						that.bubbleSelect(bid);
						// 关闭浮层
						that.hideBubbleContainer();
						// 用户手动选择的气泡才进行保存
						window.localStorage && window.localStorage.setItem(LOCAL_STORAGE_SELECT_NAME, bid);
					} else {
						that.openMiniPay();
					}
					// 上报
					that.message.emit("txv_barrage_report", "barrage-bubble-" + bid + "-click");
				})
				.on("click", ".x_link", function() {
					that.openMiniPay();
					// 上报
					that.message.emit("txv_barrage_report", "barrage-bubble-purchase");
				})
				.on("mouseenter", function() {
					that.mouseenter();
				})
				.on("mouseleave", function() {
					that.mouseleave();
				});
		};
	
		// 登录态和是否好莱坞会员的处理，然后判断选中状态
		Bubble.prototype.isLoginOrVip = function(id, isSelect) {
			var that = this;
			// 判断是否有getVipInfo方法，没有则无法判断会员
			if (that.getVipInfo) {
				that.getVipInfo().then(function(data) {
					that.isVip = data.vip == 1;
					that.vipLevel = data.vip == 1 ? (data.level || 1) : 0;
					that.annualVip = data.annualvip == 1;
					that.isVipHandler();
				}, function() {
					that.logoutHandler();
				}).always(function() {
					isSelect && that.bubbleSelect(id);
				});
			} else {
				that.logoutHandler();
				isSelect && that.bubbleSelect(id);
			}
		};
	
		Bubble.prototype.openMiniPay = function() { // 开通好莱坞
			var that = this;
			// 关闭伪全屏
			that.message.emit("txv_closebrowserfullscreen");
			// 拉起开通好莱坞的浮层
			barrageUtil.openMiniPay('V0$$4:81', function() {
				that.removeBubbleContainer();
			});
		};
	
		// 根据是否好莱坞会员判断是否显示“开通好莱坞”
		Bubble.prototype.isVipHandler = function() {
			$(this.bubbleContainerId).find(".x_link")[this.isVip ? "hide" : "show"]();
		};
	
		// 用户登出后的处理，显示开通好莱坞会员
		Bubble.prototype.logoutHandler = function() {
			this.isVip = false;
			this.isVipHandler();
		};
	
		// 根据指定气泡id处理选中
		Bubble.prototype.bubbleSelect = function(id) {
			id = id || '0';
			var $con = $(this.bubbleContainerId);
			// 如果气泡不存在或者不是vip又选中了vip的气泡
			if (($con.length > 0 && $con.find("[data-bid='" + id + "']").length === 0) || (!this.isVip && this.bubbleCache['' + id].paytype == 2)) {
				id = '0';
			}
			if ($con.length > 0) {
				$con.find("[data-bid='" + id + "']").addClass("x_current").siblings().removeClass("x_current");
			}
			this.bubbleId = id;
			this.message.emit('txv_barrage_setbubble');
		};
	
		// 获取当前正在使用的气泡弹幕的详细信息
		Bubble.prototype.getCurrentSelect = function() {
			var id = this.bubbleId;
			return this.bubbleCache['' + id] ? this.bubbleCache['' + id] : null;
		};
	
		// 整理发表弹幕的时候需要的字段信息
		Bubble.prototype.getPostBubbleSelect = function() {
			var bubble = this.getCurrentSelect();
			if (bubble && this.bubbleId != "0") {
				var data = {
					bubble_id: this.bubbleId,
					bubbleUrl: bubble.url_back
				};
				if (this.isVip && this.vipLevel > 0) {
					if (this.annualVip) {
						data.hlwGradeUrl = "//i.gtimg.cn/qqlive/images/20160414/y_" + this.vipLevel + ".jpg";
					} else {
						data.hlwGradeUrl = "//i.gtimg.cn/qqlive/images/20160414/m_" + this.vipLevel + ".jpg";
					}
				}
				return data;
			}
			return null;
		};
	
		// 显示会员可以使用气泡的提示
		// 1. 一天最多出现一次，总共出现三次，就不再提示
		// 2. 用户可手动关闭，或者5s后自动消失
		Bubble.prototype.isShowTips = function() {
			var stringify = (window.JSON && window.JSON.stringify) ? window.JSON.stringify : $.stringify;
			var parseJSON = (window.JSON && window.JSON.parse) ? window.JSON.parse : $.parseJSON;
			if ($.type(stringify) === 'function' && $.type(parseJSON) === 'function' && window.localStorage) {
				var localData = window.localStorage[LOCAL_STORAGE_TIPS];
				var nowTime = +new Date();
				var settingData = {
					count: 1,
					time: nowTime
				};
				if (localData) {
					try {
						localData = parseJSON(localData);
					} catch (e) {
						localData = {};
					}
					var count = localData.count;
					var time = localData.time;
					if (count) {
						if (count >= 3 || (time && nowTime < time + 24 * 60 * 60 * 1000)) {
							return false;
						} else {
							count++;
							localData.count = count;
							localData.time = nowTime;
							window.localStorage[LOCAL_STORAGE_TIPS] = stringify(localData);
							return true;
						}
					} else {
						window.localStorage[LOCAL_STORAGE_TIPS] = stringify(settingData);
						return true;
					}
				} else {
					window.localStorage[LOCAL_STORAGE_TIPS] = stringify(settingData);
					return true;
				}
			} else {
				return false;
			}
		};
		Bubble.prototype.showTips = function() {
			var $tips = this.$container.find('#' + this.bubbleTipsId);
			if (this.isShowTips() && $tips.length === 0) {
				var htmldata = $.tmpl(tplBubbleTips, {
					"selId": this.bubbleTipsId
				});
				this.$container.append(htmldata);
				var tipsTimer;
				$tips = this.$container.find('#' + this.bubbleTipsId);
				$tips.on('click', '.txp_bubble_close', function() {
					clearTimeout(tipsTimer);
					$tips.remove();
				});
				tipsTimer = setTimeout(function() {
					$tips.remove();
				}, 5000);
			}
		};
	
		Bubble.prototype.toggle = function() {
			if (!this.isBubbleTableShow) {
				this.showBubbleContainer();
			} else {
				this.hideBubbleContainer();
			}
		};
	
		Bubble.prototype.mouseenter = function() {
			if (this.isBubbleTableShow) {
				clearTimeout(this.timerShow);
			}
		};
	
		Bubble.prototype.mouseleave = function() {
			var that = this;
			if (that.isBubbleTableShow) {
				clearTimeout(that.timerShow);
				that.timerShow = setTimeout(function() {
					that.hideBubbleContainer();
				}, 500);
			}
		};
	
		module.exports = Bubble;
	
	/***/ },
	/* 10 */
	/***/ function(module, exports) {
	
		module.exports = "<div class=\"x_mod_bubble\" id=\"<%=container%>\" style=\"right: 0;bottom: 40px;\">\n\t<iframe class=\"x_iframe_mask\" src=\"about:blank\" frameborder=\"0\"></iframe>\n\t<div class=\"x_box_triangle\"></div>\n\t<div class=\"x_mod_inner\">\n\t\t<div class=\"x_mod_hd\">\n\t\t\t<div class=\"x_title\">VIP会员专享个性气泡</div>\n\t\t\t<a href=\"javascript:;\" class=\"x_link\">开通VIP会员 &#10095;</a>\n\t\t</div>\n\t\t<div class=\"x_mod_bd\">\n\t\t\t<ul class=\"x_bubble_list<% if(list.length > 5){ %> x_scroll_wrap<% } %>\">\n\t\t\t\t<li class=\"x_list_item\" data-bid=\"0\"><i class=\"x_ico_slted\"></i><img src=\"http://i.gtimg.cn/qqlive/images/hlw_bubble/1.png\"></li>\n\t\t\t\t<% for(var len = list.length, i = 0; i < len; i++){ %>\n\t\t\t\t<li class=\"x_list_item\" data-bid=\"<%=list[i].id%>\"><i class=\"x_ico_slted\"></i><img src=\"<%=list[i].url_cion%>\"></li>\n                <% } %>\n\t\t\t</ul>\n\t\t</div>\n\t</div>\n</div>";
	
	/***/ },
	/* 11 */
	/***/ function(module, exports) {
	
		module.exports = "<div class=\"txp_bubble_tip\" id=\"<%=selId%>\">\n\t<img src=\"//i.gtimg.cn/qqlive/images/20160606/bubble_tips.png\" alt=\"\">\n\t<span class=\"txp_bubble_close\"></span>\n</div>";
	
	/***/ }
	/******/ ]);
