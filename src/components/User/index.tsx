import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { Component } from "react";
import { AtTag, AtAvatar } from "taro-ui";
import "./index.scss";

export default class User extends Component {
  componentDidMount() {}

  render() {
    const user = this.props.data;
    return (
      <View className="member at-row">
        <View className="at-col-3 avatar-container">
          <AtAvatar className="avatar" circle image={user.avatarUrl}></AtAvatar>
        </View>
        <View className="at-col-6">
          <View className="name">{user.nickName}</View>
          <View className="tag-container">
            <AtTag type="primary" className="gender" circle>
              {user.gender === 0 ? "男" : "女"}
            </AtTag>
            <AtTag type="primary" className="city" circle>
              {user.city === "" ? "未知" : user.city}
            </AtTag>
          </View>
          <View className="intro">向往的生活</View>
        </View>
      </View>
    );
  }
}
