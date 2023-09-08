import { View, Text, Swiper, SwiperItem, Image } from "@tarojs/components";
import { AtButton, AtTag, AtMessage, AtAvatar } from "taro-ui";
import Taro from "@tarojs/taro";
import { Component } from "react";
import "./index.scss";

export default class Group extends Component {
  state = {
    group: {
      name: "",
      images: [],
    },
  };

  async componentDidMount() {
    const group = await Taro.getStorageSync("group");
    this.setState({
      group: group,
    });

    Taro.setNavigationBarTitle({
      title: group.name,
    });
  }

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
        <Text className="members">小组成员</Text>
        <View className="member at-row">
          <View className="at-col-3">
            <AtAvatar circle image="https://jdc.jd.com/img/200"></AtAvatar>
          </View>
          <View className="at-col-9">
            <View className="name">李浪溪</View>
            <View>
              <AtTag key={0} type="primary" circle>
                产品
              </AtTag>
            </View>
            <View className="intro">向往的生活</View>
          </View>
        </View>
      </View>
    );
  }
}
