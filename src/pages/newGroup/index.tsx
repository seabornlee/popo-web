import Taro from "@tarojs/taro";
import { Component } from "react";
import { View, Text, Map } from "@tarojs/components";
import { AtForm, AtInput, AtButton, AtImagePicker, AtTag, AtMessage } from "taro-ui";
import "taro-ui/dist/style/components/form.scss";
import "taro-ui/dist/style/components/input.scss";
import "taro-ui/dist/style/components/button.scss";
import "taro-ui/dist/style/components/image-picker.scss";
import "taro-ui/dist/style/components/icon.scss";
import "./index.scss";

export default class CreateGroup extends Component {
  state = {
    latitude: null,
    longitude: null,
    name: "",
    currentTagInput: "",
    tags: [],
    images: [],
    location: null,
    inputValueKey: 0,
  };

  handleChangeName = (value) => {
    this.setState({
      name: value,
    });
  };

  handleConfirm = (value, event) => {
    if (value) {
      // Only add the tag if there's any
      this.setState((prevState) => ({
        tags: [...prevState.tags, value],
        currentTagInput: "",
        inputValueKey: Math.random(),
      }));
    }
  };

  handleChangeImage = (files) => {
    this.setState({
      images: files,
    });
  };

  handleChangeTag = (value, event) => {
    this.setState({
      currentTagInput: value,
    });
  };

  handleChooseLocation = async () => {
    try {
      const res = await Taro.chooseLocation();
      this.setState({ location: res });
    } catch (error) {
      console.error(error);
    }
  };

  componentDidMount() {
    Taro.getLocation({
      type: "wgs84",
      success: (res) => {
        this.setState({
          latitude: res.latitude,
          longitude: res.longitude,
          speed: res.speed,
          accuracy: res.accuracy,
        });
      },
    });
  }

  handleDeleteTag = (tagToDelete) => {
    this.setState((prevState) => ({
      tags: prevState.tags.filter((tag, index) => index !== tagToDelete),
    }));
  };

  handleSubmit = async () => {
    if (
      !this.state.name ||
      !this.state.tags ||
      this.state.images.length === 0 ||
      this.state.location === null
    ) {
      Taro.atMessage({ message: "必填字段不能为空！", type: "error" });
      return;
    }

    const { name, tags, images, location } = this.state;

    try {
      const response = await Taro.request({
        url: "http://localhost:1337/group", // replace with your POST url
        method: "POST",
        data: {
          name,
          tags: JSON.stringify(tags),
          images: JSON.stringify(images),
          location: JSON.stringify(location),
        },
        header: {
          "content-type": "application/json",
          "token": await Taro.getStorageSync("token"),
        },
      });

      if (response.statusCode !== 200) {
        throw new Error(`HTTP Error: ${response.statusCode}`);
      }

      // handle incoming data, whether it's error or success
      if (response.data.error) {
        Taro.atMessage({ message: response.data.error, type: "error" });
      } else {
        Taro.atMessage({
          message: "创建成功！",
          type: "success",
        });

        Taro.navigateTo({
          url: '/pages/index/index'
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    return (
      <View className='page'>
        <AtMessage />
        <AtForm onSubmit={this.handleSubmit}>
          <View className='row'>
            <Text>名称</Text>
            <AtInput
              name='groupName'
              type='text'
              placeholder='Enter group name'
              value={this.state.name}
              onChange={this.handleChangeName}
            />
          </View>
          <View>
            <Text>成员标签</Text>
            <AtInput
              key={this.state.inputValueKey}
              name='tags'
              type='text'
              focus
              placeholder='Enter tag'
              value={this.state.currentTagInput}
              onConfirm={this.handleConfirm}
              onChange={this.handleChangeTag}
            />
            <View className='tags'>
              {this.state.tags.map((tag, index) => (
                <View className='tag-container'>
                  <AtTag key={index} type='primary' circle>
                    {tag}
                  </AtTag>
                  <Text
                    className='at-icon at-icon-close-circle'
                    onClick={() => this.handleDeleteTag(index)}
                    style={{
                      position: "relative",
                      left: "-18px",
                      top: "-10px",
                      color: "#ff0000",
                    }}
                  />
                </View>
              ))}
            </View>
          </View>
          <View>
            <Text>场地照片</Text>
            <AtImagePicker
              files={this.state.images}
              onChange={this.handleChangeImage}
              multiple
            />
          </View>
          <View>
            <Text>位置</Text>
            <Map
              longitude={this.state.longitude}
              latitude={this.state.latitude}
              onClick={this.handleChooseLocation}
            ></Map>
          </View>
        </AtForm>
        <AtButton
          type='primary'
          className='submit-button'
          formType='submit'
          onClick={this.handleSubmit}
        >
          创建
        </AtButton>
      </View>
    );
  }
}
