export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/newGroup/index",
    "pages/group/index",
    "pages/login/index",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  permission: {
    "scope.userLocation": {
      desc: "你的位置信息将用于小程序位置接口的效果展示", // 高速公路行驶持续后台定位
    },
  },
  requiredPrivateInfos: [
    "getLocation",
    "chooseLocation",
    "onLocationChange",
    "startLocationUpdateBackground",
    "chooseAddress",
  ],
});
