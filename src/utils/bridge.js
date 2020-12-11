if (typeof window != 'undefined') {
  window.setupWebViewJavascriptBridge = (callback) => {
    if (window.WebViewJavascriptBridge) {
      return callback(window.WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    const WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(() => {
      document.documentElement.removeChild(WVJBIframe);
    }, 0);
    return null;
  };
}

let isiOS = false;
if (typeof navigator != 'undefined') {
  const u = navigator.userAgent;
  isiOS = u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}

function callNative(methodName, jsonData = {}, callback = () => {}) {
  if (typeof window != 'undefined' && isiOS) {
    const iosMethodName = `TZ.${methodName}`;
    window.setupWebViewJavascriptBridge((bridge) => {

      bridge.registerHandler(iosMethodName, function(data, responseCallback) {
        responseCallback(data);
      })

      bridge.callHandler(iosMethodName, JSON.stringify(jsonData), callback);
    });
  } else {
    const androidMethodName = methodName;
    if (
      typeof window != 'undefined' &&
      typeof window.TZ != 'undefined' &&
      typeof window.TZ[androidMethodName] != 'undefined'
    ) {
      let result = window.TZ[androidMethodName](JSON.stringify(jsonData));

      if (result) {
        callback(result);
        return result;
      }
    }
  }
}

export default {
  openAppToAppStore(jsonData) { // 打开应用商店
    callNative('openAppToAppStore', jsonData);
  },

  // 跳转页面
  // "to_page": 'page_name'
  // page_name: tongzhuo://coins 充值
  // page_name: tongzhuo://users/12312313212 指定用户主页
  // page_name: tongzhuo://rooms/1231231312 指定直播房间
  // page_name: tongzhuo://live_list 直播列表页

  openAppToPage(to_page) { // 跳转APP页面
    callNative('openAppToPage', { to_page });
  },
  openAppShareToSNS(shareData) {
    callNative('openAppShareToSNS', shareData);
  },
  shareInnerAndOutside(shareData) {
    callNative('shareInnerAndOutside', shareData);
  },
  openAppToBackPage() { // 返回APP上一级
    callNative('openAppToBackPage');
  },
  shareFeed(shareData) {
    callNative('shareFeed', shareData);
  },

  // 分享
  // "title": '', "url": '', "icon": ''
  shareFeedAndOutside(shareData) {
    callNative('shareFeedAndOutside', shareData);
  },

  // 分享到facebook
  // params: { title: string, url: string}
  shareLinkToFacebook(params) {
    callNative('shareLinkToFacebook', params)
  },

  refreshVip() { // 刷新是不是VIP用户
    callNative('refreshVip');
  },
  toast(message, type) {
    callNative('toastTips', { tips: message, type: type });
  },
  playAD(param) { // 播放视频
    callNative('playAd', param);
  },
  getDeviceId(data) {
    return callNative('getDeviceId', data);
  },

  // 关注
  // data = uid
  addFollowing(data) {
    return callNative('addFollowing', data);
  },

  // 获取请求api参数
  getAuthParameters(data, cb) {
    return callNative('getAuthParameters', data, cb);
  }
};
export const toastTips = (tips, type) => {
  callNative('toastTips', { tips, type });
};

export let statistic = (eventKey, eventDetail) => { // 埋点
  return callNative('statistic', { eventKey, eventDetail });
};
