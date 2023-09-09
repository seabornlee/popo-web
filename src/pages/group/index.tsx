import { View, Text, Swiper, SwiperItem, Image } from "@tarojs/components";
import { AtButton, AtTag, AtMessage, AtAvatar } from "taro-ui";
import Taro from "@tarojs/taro";
import { Component } from "react";
import "./index.scss";

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
    },
  };

  async componentDidMount() {
    const group = await Taro.getStorageSync("group");
    console.log(group);
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
        <View className="info">
          <View>📍&nbsp;{this.state.group.location.address}</View>
          <View className="coin">
            ☎️ &nbsp;
            {this.state.group.contact != ""
              ? this.state.group.contact
              : "暂无联系方式"}
          </View>
        </View>
        <View className="members">
          <Text className="title">主理人</Text>
          <View className="member at-row">
            <View className="at-col-3 avatar-container">
              <AtAvatar
                className="avatar"
                circle
                image={this.state.group.owner.avatarUrl}
              ></AtAvatar>
            </View>
            <View className="at-col-6">
              <View className="name">{this.state.group.owner.nickName}</View>
              <View className="tag-container">
                <AtTag type="primary" className="gender" circle>
                  {this.state.group.owner.gender === 0 ? "男" : "女"}
                </AtTag>
                <AtTag type="primary" className="city" circle>
                  {this.state.group.owner.city === ""
                    ? "未知"
                    : this.state.group.owner.city}
                </AtTag>
              </View>
              <View className="intro">向往的生活</View>
            </View>
          </View>
        </View>
        <View className="members">
          <Text className="title">成员(39)</Text>
          <View className="member at-row">
            <View className="at-col-3 avatar-container">
              <AtAvatar
                className="avatar"
                circle
                image="https://preview.qiantucdn.com/ing/97/41/80/56358PICbZmtMntkkiPr7_PIC2018.png!w1024_new_small_1"
              ></AtAvatar>
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
          <AtButton type="primary" size="small" onClick={this.join}>
            加入
          </AtButton>
        </View>
      </View>
    );
  }
}
