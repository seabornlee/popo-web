import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/tab-bar.scss";

import "./index.scss";

import { AtTabBar } from "taro-ui";
import { View, Map } from "@tarojs/components";
import React, { Component } from "react";
import Taro from "@tarojs/taro";

import Group from "../../components/Group";

export default class Index extends Component {
  state = {
    latitude: null,
    longitude: null,
    currentTab: 0,
    markers: [],
    groups: [],
    selectedGroup: null,
    lastTapTime: 0,
  };

  async componentDidShow() {
    this.setState({
      token: await Taro.getStorageSync("token"),
    });
  }

  async componentDidMount() {
    const response = await Taro.request({
      url: "http://localhost:1337/group/list",
      method: "GET",
      header: {
        "content-type": "application/json",
      },
    });
    const groups = response.data.map((group) => ({
      id: group.id,
      name: group.name,
      tags: JSON.parse(group.tags),
      images: JSON.parse(group.images),
      location: JSON.parse(group.location),
      contact: group.contact,
      owner: group.owner,
    }));

    console.log(response.data);

    this.setState({
      groups: groups,
    });

    const markers = groups.map((group) => {
      const bgColor = group.tags.find((tag) => tag === "社区空间")
        ? "#26c1dd"
        : "#98dc21";
      return {
        id: group.id,
        latitude: group.location.latitude,
        longitude: group.location.longitude,
        width: 30,
        height: 40,
        callout: {
          content: group.name,
          color: "#ffffff",
          fontSize: 14,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "#000000",
          bgColor: bgColor,
          padding: 5,
          display: "ALWAYS",
          textAlign: "center",
        },
      };
    });
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

    switch (value) {
      case 1:
        this.createGroup();
        break;
      case 2:
        this.goToProfile();
    }
  };

  goToProfile = () => {
    Taro.navigateTo({ url: "/pages/profile/index" });
  };

  createGroup = async () => {
    Taro.request({
      url: "http://localhost:1337/account/profile",
      method: "GET",
      header: {
        "content-type": "application/json",
        token: await Taro.getStorageSync("token"),
      },
    }).then((res) => {
      console.log(res);
      if (res.statusCode === 200) {
        Taro.navigateTo({ url: "/pages/newGroup/index" });
      } else {
        Taro.navigateTo({ url: "/pages/profile/index" });
      }
    });
  };

  handleMarkerTap = (e) => {
    console.log("marker tap", e);

    const groupId = e.markerId;
    const group = this.state.groups.find((g) => g.id === groupId);
    console.log(group);
    this.setState({
      lastTapTime: e.timeStamp,
    });
    this.setState({
      selectedGroup: group,
    });
  };

  verifyJWTFormat = (jwt) => {
    // Regular expression pattern to match JWT format
    var jwtPattern = /^[\w-]+\.[\w-]+\.[\w-]+$/;

    // Check if the JWT matches the pattern
    var isValidFormat = jwtPattern.test(jwt);

    return isValidFormat;
  };

  handleMapClick = (e) => {
    console.log("map click", e);
    if (e.timeStamp - this.state.lastTapTime > 300) {
      this.setState({
        selectedGroup: null,
      });
    }
  };

  render() {
    return (
      <View className="index">
        <Map
          longitude={this.state.longitude}
          latitude={this.state.latitude}
          markers={this.state.markers}
          onmarkertap={this.handleMarkerTap}
          onCalloutTap={this.handleMarkerTap}
          onRegionChange={this.handleMapClick}
          showLocation
        ></Map>
        {this.state.selectedGroup && (
          <View className="group-container">
            <Group
              latitude={this.state.latitude}
              longitude={this.state.longitude}
              data={this.state.selectedGroup}
            />
          </View>
        )}
        <AtTabBar
          fixed
          current={this.state.currentTab}
          onClick={this.handleTabClick}
          tabList={[
            { title: "地图", iconType: "map-pin" },
            { title: "创建社区", iconType: "add" },
            { title: "我的", iconType: "user" },
          ]}
        />
      </View>
    );
  }
}
