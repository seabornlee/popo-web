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
    const groups = await this.loadGroups();
    const groupsByLocation = this.groupByLocation(groups);

    this.setState({
      groupsByLocation,
    });

    const markers = this.toMarkers(groupsByLocation);
    Taro.getLocation({
      type: "wgs84",
      success: (res) => {
        this.setState({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: markers,
        });
      },
    });
  }

  groupByLocation = (groups) => {
    const groupsByLocation = {};
    groups.forEach((group) => {
      const key = `${group.location.latitude},${group.location.longitude}`;
      if (groupsByLocation[key]) {
        groupsByLocation[key].push(group);
      } else {
        groupsByLocation[key] = [group];
      }
    });
    return groupsByLocation;
  };

  toMarkers = (groupsByLocation) => {
    const iconForSpace =
      "https://cdn.icon-icons.com/icons2/1559/PNG/512/3440906-direction-location-map-marker-navigation-pin_107531.png";
    const iconForGroup =
      "https://cdn.icon-icons.com/icons2/2073/PNG/96/location_map_twitter_icon_127126.png";

    let iconPath;
    let calloutText;
    return Object.keys(groupsByLocation).map((key, index) => {
      if (groupsByLocation[key].length > 1) {
        calloutText = `${groupsByLocation[key].length}个小组这里`;
      } else {
        calloutText = groupsByLocation[key][0].name;
      }

      if (
        groupsByLocation[key].find((group) => group.tags.includes("社区空间"))
      ) {
        iconPath = iconForSpace;
      } else {
        iconPath = iconForGroup;
      }

      const bgColor = this.getBgColor(groupsByLocation[key].length);

      return this.toMarker(
        index,
        groupsByLocation[key],
        iconPath,
        calloutText,
        bgColor
      );
    });
  };

  // return color according to group count, base color is red, deeper when more groups
  getBgColor = (groupCount) => {
    const baseColor = 255;
    const colorStep = 20;
    const color = baseColor - groupCount * colorStep;
    return `rgb(${color}, 0, 0)`;
  };

  toMarker = (id, groups, iconPath, calloutText, bgColor) => {
    return {
      id,
      latitude: groups[0].location.latitude,
      longitude: groups[0].location.longitude,
      width: 30,
      height: 30,
      iconPath: iconPath,
      callout: {
        content: calloutText,
        color: "#ffffff",
        fontSize: 14,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#000000",
        bgColor,
        padding: 5,
        display: "ALWAYS",
        textAlign: "center",
      },
    };
  };

  loadGroups = async () => {
    const response = await Taro.request({
      url: "http://localhost:1337/group",
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
    return groups;
  };

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
    const index = e.markerId;
    const key = Object.keys(this.state.groupsByLocation)[index];
    const group = this.state.groupsByLocation[key][0];
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
