import "./index.scss";

import { AtAvatar, AtButton, AtList, AtListItem } from "taro-ui";
import { View, Text } from "@tarojs/components";
import React, { Component } from "react";
import Taro from "@tarojs/taro";

export default class Profile extends Component {
  state = {
    userInfo: {
      nickName: "游客",
      avatarUrl:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
  };

  login = () => {
    const thiz = this;
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

              thiz.setState({
                loggedIn: true,
              });

              // Taro.navigateBack();
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

  getUserProfile = () => {
    Taro.getUserProfile({
      desc: "用于完善会员资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        console.log(res);
        this.setState({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
      },
    });
  };

  render() {
    return (
      <View className="profile">
        <View>
          <AtAvatar image={this.state.userInfo.avatarUrl} circle></AtAvatar>
          <Text className="nickName">{this.state.userInfo.nickName}</Text>
        </View>
        <View>
          {!this.state.loggedIn && (
            <AtButton className="wechat" onClick={this.login}>
              登录/注册
            </AtButton>
          )}
          {this.state.loggedIn && !this.state.hasUserInfo && (
            <AtButton className="wechat" onClick={this.getUserProfile}>
              获取头像和昵称
            </AtButton>
          )}
        </View>
        <AtList className="settings">
          <AtListItem
            title="我的社群"
            arrow="right"
            disabled
            iconInfo={{ size: 25, color: "#78A4FA", value: "bookmark" }}
          />
          <AtListItem
            title="我的活动"
            arrow="right"
            disabled
            iconInfo={{ size: 25, color: "#FF4949", value: "calendar" }}
          />
        </AtList>
        {this.state.loggedIn && (
          <AtButton className="logout" onClick={this.logout} disabled>
            退出
          </AtButton>
        )}
      </View>
    );
  }
}
