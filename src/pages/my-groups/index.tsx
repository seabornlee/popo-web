import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import React, { Component } from "react";
import Group from "../../components/group";
import "./index.scss";

export default class MyGroups extends Component {
  state = {
    groups: [],
    latitude: 0,
    longitude: 0,
  };

  componentDidMount() {
    this.getMyLocation(() => {
      this.loadJoinedGroups();
    });
  }

  getMyLocation = (callback) => {
    Taro.getLocation({
      type: "wgs84",
      success: (res) => {
        this.setState({
          latitude: res.latitude,
          longitude: res.longitude,
        });

        callback();
      },
    });
  };

  loadJoinedGroups = async () => {
    Taro.request({
      url: "http://localhost:1337/group/joined",
      method: "GET",
      header: {
        "content-type": "application/json",
        token: await Taro.getStorageSync("token"),
      },
    }).then((res) => {
      console.log(res);
      if (res.statusCode === 200) {
        const groups = res.data.map((group) => ({
          id: group.id,
          name: group.name,
          tags: JSON.parse(group.tags),
          images: JSON.parse(group.images),
          location: JSON.parse(group.location),
          contact: group.contact,
          owner: group.owner,
        }));

        this.setState({
          groups,
        });
      } else {
        console.log(res);
      }
    });
  };

  render() {
    return (
      <View className="my-groups">
        {this.state.groups.map((group, index) => (
          <Group
            latitude={this.state.latitude}
            longitude={this.state.longitude}
            data={group}
          />
        ))}
      </View>
    );
  }
}
