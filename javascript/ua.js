function uaMatch(ua){
  ua = ua || navigator.userAgent;
  ua = ua.toLowerCase();
  // if (!this.browser) this.browser = {};
  // if (!this.os) this.os = {};
  // if (!this.phone) this.phone = {};
  // if (!this.mobile) this.mobile = false;
  this.browser = {};
  this.os = {};
  this.phone = {};
  this.mobile = false;

  // $.mobile
  if (ua.indexOf('mobile')>-1) this.mobile = true;


  // $.os
  var osDetect = {
    android_1: /android[\s\/]([\d\.]+)/i,
    android_2: /android/i,
    android_3: /MIDP-/i,
    ipod_1: /iPod\stouch;\sCPU\siPhone\sos\s([\d_]+)/i,
    ipod_100: /iPod.*os\s?([\d_\.]+)/i,
    iphone: /iPhone;\sCPU\siPhone\sos\s([\d_]+)/i,
    iphone_100: /iPhone.*os\s?([\d_\.]+)/i,
    ipad_1: /ipad;\scpu\sos\s([\d_]+)/i,
    ipad_2: /ipad([\d]+)?/i,
    windows: /windows\snt\s([\d\.]+)/i,
    mac: /Macintosh.*mac\sos\sx\s([\d_\.]+)/i
  };
  var osMatch;
  for(var i in osDetect){
    osMatch = osDetect[i].exec(ua);
    if (!osMatch) continue;
    this.os[ i.replace(/_\d+/,'') ] = true;
    if (osMatch[1]) this.os.version = osMatch[1].replace(/_/g,'.');
    break;
  }
  // $.os.ios
  if (this.os.iphone || this.os.ipad || this.os.ipod) {
    this.os.ios = true;
  }


  // $.browser
  var browserDetect = {
    wechat: /MicroMessenger\/([\d\.]+)/i,
    ipadqq: /IPadQQ\/([\d\.]+)/i,
    mqq: /qq\/([\d\.]+)/i,
    chrome_1: /CriOS\/([\d\.]+)/i,
    chrome_2: /Chrome\/([\d\.]+)/i,
    qzone: /QZONEJSSDK\/([\d\.]+)/i,
    mqqbrowser: /mqqbrowser\/([\d\.]+)/i,
    qqbrowser: /[^m]QQBrowser\/([\d\.]+)/i,
    x5: /tbs\/(\d+)/i,
    uc: /UCBrowser\/([\d\.]+)/i,
    safari: /Safari\/([\d\.]+)/i,
    firefox: /Firefox\/([\d\.]+)/i,
    ie_1: /MSIE\s([\d\.]+)/i,
    ie_2: /(trident\/\d\.\d)/,
    weibo: /weibo__([\d\.]+)/i,
    qqnews: /qqnews\/([\d\.]+)/i,
    qqlive: /QQLiveBrowser\/([\d\.]+)/i,
    kuaibao: /qnreading\/([\d\.]+)/i,
    liebao: /LieBaoFast\/([\d\.]+)/i,
    douban: /com\.douban\.frodo\/([\d\.]+)/i,
    miuibrowser: /MiuiBrowser/i,
    baidu: /baiduboxapp/i,
    browser360: /360browser/i,
    oppobrowser: /OppoBrowser/i
  };
  var browserMatch;
  var browserName;
  for(var j in browserDetect){
    browserMatch = browserDetect[j].exec(ua);
    if (!browserMatch) continue;
    browserName = j.replace(/_\d+/,'');
    if ( this.browser[ browserName ] ) return;
    this.browser[ browserName ] = {
      version: browserMatch[1]
    };
  }
  if (this.os.android && this.browser.safari) delete this.browser.safari;
  if (this.browser.chrome && this.browser.safari) delete this.browser.safari;
  // https://msdn.microsoft.com/library/ms537503.aspx#TriToken
  if (this.browser.ie &&
      this.browser.ie.version &&
      this.browser.ie.version.indexOf('trident')>-1) {
    if ( this.browser.ie.version.indexOf('6.0')>-1 ) {
      this.browser.ie.version = '10';
    }
    else if ( this.browser.ie.version.indexOf('5.0')>-1 ) {
      this.browser.ie.version = '9';
    }
    else if ( this.browser.ie.version.indexOf('4.0')>-1 ) {
      this.browser.ie.version = '8';
    }
    else {
      this.browser.ie.version = '11';
    }
  }


  // $.phone
  var phoneDetect = {
    ipod: /iPod/i,
    ipad: /iPad/i,
    iphone: /iPhone/i,
    huawei_1: /HUAWEI([\w_-]+)/i,
    huawei_2: /(CHM-\w+)/i,
    huawei_3: /(HonorChe)/i,
    huawei_4: /HONORPLK/i,
    huawei_5: /(Che\d+-CL\d+)/i,
    huawei_6: /(H\d+-L\d+)/i,
    huawei_100: /HUAWEI/i,
    xiaomi_1: /(HM\sNOTE)/i,
    xiaomi_2: /(HM\s\w+)/i,
    xiaomi_3: /(MI\s\w+)/i,
    xiaomi_4: /(MI-ONE\sPlus)/i,
    xiaomi_5: /(M1)\sBuild/i,
    xiaomi_6: /(HM\d+)/i,
    xiaomi_7: /Xiaomi[\s_]?([\w_]+)/i,
    samsung_1: /(GT-\w+)/i,
    samsung_2: /(SCH-\w+)/i,
    samsung_3: /(SM-\w+)/i,
    vivo: /vivo\s(\w+)/i,
    oneplus: /ONEPLUS-([a-z0-9]+)/i,
    lenovo_1: /Lenovo[\s-]?([\w-]+)/i,
    lenovo_100: /Lenovo/i,
    zte_1: /ZTE\s?(\w+)?/i,
    zte_2: /ZTE/i,
    coolpad_1: /Coolpad\s(\w+)/i,
    coolpad_100: /Coolpad/i,
    oppo_1: /OPPO\s?(\w+)/i,
    oppo_2: /(R7Plus|R8007|R801|R831S|R8205)/i,
    oppo_100: /OPPO/i,
    meizu_1: /(MX\d+)/i,
    meizu_2: /(m\d+\snote)\sBuild/i,
    htc_1: /HTC\s?(\w+)/i,
    htc_100: /HTC/i,
    tcl: /TCL\s(\w+)/i,
    lephone: /lephone\s(\w+)/i,
    lg: /LG[\s-]?(\w+)/i,
    galaxy: /(galaxy\d+)/,
    hisense_1: /Hisense/i,
    hisense_2: /HS-(\w+)/i,
    philips: /Philips\s?(\w+)?/i,
    '金立': /(GN\w+)\sBuild/i,
    sonny: /sonny/i,
    '天语': /K-Touch/i
  };
  var phoneMatch;
  for(var k in phoneDetect){
    phoneMatch = phoneDetect[k].exec(ua);
    if (!phoneMatch) continue;
    this.phone.name = k.replace(/_\d+/,'')
    if (phoneMatch[1]) this.phone.version = phoneMatch[1].replace(/^[_-]/ig,'');
    break;
  }
}

module.exports = uaMatch;