import { Component } from "react";
import { AtButton } from "taro-ui";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";

export default class Login extends Component {
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

              Taro.navigateBack();
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

  render() {
    return (
      <View className="login">
        <AtButton className="wechat" onClick={this.login}>
          微信登录
        </AtButton>
      </View>
    );
  }
}
