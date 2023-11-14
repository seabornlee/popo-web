import "./index.scss";

import { AtButton, AtTag, AtAvatar } from "taro-ui";
import { View, Text, Swiper, SwiperItem, Image } from "@tarojs/components";
import React, { Component } from "react";
import Taro from "@tarojs/taro";

import User from "../../components/User";

export default class Group extends Component {
  state = {
    group: {
      contact: "",
      name: "",
      location: {
        address: "",
      },
      owner: {
        nickName: "",
      },
      images: [],
      members: [],
      memberCount: 0,
    },
  };

  async componentDidMount() {
    this.loadGroup();
  }

  loadGroup = async () => {
    const { id } = Taro.getCurrentInstance().router.params;
    console.log(id);
    Taro.request({
      url: process.env.SERVER_URL + "/group/" + id,
      method: "GET",
      header: {
        "content-type": "application/json",
      },
    }).then((res) => {
      console.log(res);
      this.updateGroup(res.data);
    });
  };

  updateGroup = (g) => {
    const group = {
      id: g.id,
      name: g.name,
      tags: JSON.parse(g.tags),
      images: JSON.parse(g.images),
      location: JSON.parse(g.location),
      contact: g.contact,
      owner: g.owner,
      memberCount: g.memberCount,
      members: g.members,
    };

    this.setState({
      group: group,
    });

    Taro.setNavigationBarTitle({
      title: group.name,
    });
  };

  openLocation = () => {
    Taro.openLocation({
      latitude: this.state.group.location.latitude,
      longitude: this.state.group.location.longitude,
      scale: 18,
    });
  };

  join = async () => {
    Taro.request({
      url: process.env.SERVER_URL + "/group/" + this.state.group.id + "/join",
      method: "POST",
      header: {
        "content-type": "application/json",
        token: await Taro.getStorageSync("token"),
      },
    }).then((res) => {
      console.log(res);
      if (res.statusCode === 200) {
        this.updateGroup(res.data);
      } else if (res.statusCode === 401) {
        Taro.navigateTo({
          url: "/pages/profile/index",
        });
      }
    });
  };

  render() {
    return (
      <View>
        <View>
          <Swiper
            className="test-h"
            indicatorColor="#999"
            indicatorActiveColor="#333"
            circular
            indicatorDots
            autoplay
          >
            {this.state.group.images.map((url, index) => (
              <SwiperItem>
                <Image src={url} />
              </SwiperItem>
            ))}
          </Swiper>
        </View>
        <View className="info">
          <View>📍&nbsp;{this.state.group.location.name}</View>
          <View className="coin">
            ☎️ &nbsp;
            {this.state.group.contact != ""
              ? this.state.group.contact
              : "暂无联系方式"}
          </View>
        </View>
        <View className="members">
          <Text className="title">主理人</Text>
          <User data={this.state.group.owner} />
        </View>
        <View className="members">
          <Text className="title">成员({this.state.group.memberCount})</Text>
          {this.state.group.members.map((member) => (
            <User data={member} />
          ))}
        </View>
        <View className="members">
          <Text className="title">活动(9)</Text>
          <View className="member at-row">
            <View className="at-col-3 avatar-container">
              <AtAvatar
                className="avatar"
                image="https://jdc.jd.com/img/200"
              ></AtAvatar>
            </View>
            <View className="at-col-9">
              <View className="name">搞钱，搞事</View>
              <View className="tag-container">
                <AtTag key={0} type="primary" circle>
                  2023.08.09
                </AtTag>
                <AtTag key={0} type="primary" circle>
                  35人
                </AtTag>
              </View>
              <View className="intro">地址：素方舟3楼未来办公空间</View>
            </View>
          </View>
        </View>
        <View className="actions">
          <AtButton type="secondary" size="small" onClick={this.openLocation}>
            前往
          </AtButton>
          <AtButton type="primary" size="small" onClick={this.join}>
            加入
          </AtButton>
        </View>
      </View>
    );
  }
}
