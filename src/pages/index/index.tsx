import Taro from "@tarojs/taro";
import { Component } from "react";
import { View, Map, CoverView, CoverImage } from "@tarojs/components";
import { AtTabBar, AtActionSheet, AtActionSheetItem } from "taro-ui";
import "taro-ui/dist/style/components/tab-bar.scss";
import "taro-ui/dist/style/components/icon.scss";
import "./index.scss";

export default class Index extends Component {
  state = {
    latitude: null,
    longitude: null,
    speed: null,
    accuracy: null,
    currentTab: 0,
    markers: [],
    showLogin: false,
    token: null
  };

  async componentDidMount() {
    this.setState({
      token: await Taro.getStorageSync("token")
    });

    const response = await Taro.request({
      url: "http://localhost:1337/group",
      method: "GET",
      header: {
        "content-type": "application/json"
      },
    });
    const groups = response.data;
    const markers = groups
      .map((group) => ({
        id: group.id,
        name: group.name,
        tags: JSON.parse(group.tags),
        images: JSON.parse(group.images),
        location: JSON.parse(group.location),
      }))
      .map((group) => ({
        id: group.id,
        latitude: group.location.latitude,
        longitude: group.location.longitude,
        callout: {
          content: group.name,
          color: "#000000",
          fontSize: 14,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "#000000",
          padding: 5,
          display: "ALWAYS",
          textAlign: "center",
        },
      }));
    console.log(markers);
    Taro.getLocation({
      type: "wgs84",
      success: (res) => {
        this.setState({
          latitude: res.latitude,
          longitude: res.longitude,
          speed: res.speed,
          accuracy: res.accuracy,
          markers: markers,
        });
      },
    });
  }

  handleTabClick = (value) => {
    this.setState({
      currentTab: value,
    });

    if (value === 1) {
      this.login();
      // create group
      // if (this.state.token) {
      //   Taro.navigateTo({ url: "/pages/newGroup/index" });
      // } else {
        // this.setState({
        //   showLogin: true,
        // });
      // }
    }
  };

  login = () => {
    Taro.login({
      success: function (res) {
        if (res.code) {
          Taro.request({
            url: "http://localhost:1337/account/login-with-wechat",
            data: {
              code: res.code,
            },
          }).then((res) => {
            if (res.data.token || !this.verifyJWTFormat(res.data.token)) {
              Taro.setStorage({
                key: "token",
                data: res.data.token,
              });

              Taro.navigateTo({ url: "/pages/newGroup/index" });
            } else {
              console.log("登录失败！");
              console.log(res.data);
            }
          });
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      },
    });
  };

  verifyJWTFormat = (jwt) => {
    // Regular expression pattern to match JWT format
    var jwtPattern = /^[\w-]+\.[\w-]+\.[\w-]+$/;

    // Check if the JWT matches the pattern
    var isValidFormat = jwtPattern.test(jwt);

    return isValidFormat;
  };

  render() {
    return (
      <View className='index'>
        <Map
          longitude={this.state.longitude}
          latitude={this.state.latitude}
          markers={this.state.markers}
        >
          {this.state.markers.map((marker) => (
            <CoverView
              className='marker'
              style={{ width: "30px", height: "30px", lineHeight: "30px" }}
              key={marker.id}
              longitude={marker.longitude}
              latitude={marker.latitude}
            ></CoverView>
          ))}
        </Map>
        <AtTabBar
          fixed
          current={this.state.currentTab}
          onClick={this.handleTabClick}
          tabList={[
            { title: "地图", iconType: "map-pin" },
            { title: "创建社区", iconType: "add" },
            { title: "捐赠", iconType: "money" },
          ]}
        />
        <AtActionSheet isOpened={this.state.showLogin} cancelText='取消'>
          <AtActionSheetItem onClick={this.login}>微信登录</AtActionSheetItem>
        </AtActionSheet>{" "}
      </View>
    );
  }
}
