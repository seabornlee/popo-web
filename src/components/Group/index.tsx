import { View, Image } from "@tarojs/components";
import { Component } from "react";
import Taro from "@tarojs/taro";
import { AtTag } from "taro-ui";
import "taro-ui/dist/style/components/tab-bar.scss";
import "taro-ui/dist/style/components/icon.scss";
import "./index.scss";

export default class Group extends Component {
  componentDidMount() {}

  getDistance = (group) => {
    let lat1 = this.props.latitude;
    let lon1 = this.props.longitude;

    let lat2 = group.location.latitude;
    let lon2 = group.location.longitude;

    var earthRadiusKm = 6371;

    var dLat = this.degreesToRadians(lat2 - lat1);
    var dLon = this.degreesToRadians(lon2 - lon1);

    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = earthRadiusKm * c * 1000;
    if (distance > 1000) {
      return (distance / 1000).toFixed(2) + "公里";
    } else {
      return Math.ceil(distance) + "米";
    }
  };

  degreesToRadians = (degrees) => {
    return (degrees * Math.PI) / 180;
  };

  viewGroup = (group) => {
    Taro.navigateTo({
      url: "/pages/group/index?id=" + group.id,
    });
  };

  render() {
    const group = this.props.data;
    return (
      <View className="group" onClick={this.viewGroup.bind(this, group)}>
        <View className="at-row">
          <View className="at-col-5 image-container">
            <Image
              src={
                group.images.length === 0
                  ? "https://cdn.pixabay.com/photo/2022/09/25/09/58/houses-7477950_1280.jpg"
                  : group.images[0]
              }
            />
          </View>
          <View className="at-col-7">
            <View className="group-name">{group.name}</View>
            <View className="tag-container">
              {group.tags.map((tag, index) => (
                <AtTag
                  key={index}
                  type="primary"
                  circle
                  size="small"
                  className={tag === "社区空间" ? "tag-space" : ""}
                >
                  {tag}
                </AtTag>
              ))}
            </View>
            <View className="address">
              📍 &nbsp;
              {group.location.name}
            </View>
            <View>🧭 &nbsp;距您直线距离{this.getDistance(group)}</View>
            <View className="coin">
              ☎️ &nbsp;
              {group.contact != "" ? group.contact : "暂无联系方式"}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
