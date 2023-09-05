import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Map } from '@tarojs/components'
import { AtForm, AtInput, AtButton, AtImagePicker } from 'taro-ui'
import 'taro-ui/dist/style/components/form.scss'
import 'taro-ui/dist/style/components/input.scss'
import 'taro-ui/dist/style/components/button.scss'
import 'taro-ui/dist/style/components/image-picker.scss'
import 'taro-ui/dist/style/components/icon.scss'

export default class CreateGroup extends Component {
  state = {
    latitude: null,
    longitude: null,
    name: '',
    tags: '',
    images: [],
    location: null
  }

  handleChangeName = (value) => {
    this.setState({
      name: value
    })
  }

  handleChangeTags = (value) => {
    this.setState({
      tags: value
    })
  }

  handleChangeImage = (files) => {
    this.setState({
      images: files
    })
  }

  handleChooseLocation = async () => {
    try {
      const res = await Taro.chooseLocation()
      this.setState({ location: res })
    } catch (error) {
      console.error(error)
    }
  }

  componentDidMount () {
    Taro.getLocation({
      type: 'wgs84',
      success: (res) => {
        this.setState({
          latitude: res.latitude,
          longitude: res.longitude,
          speed: res.speed,
          accuracy: res.accuracy
        });
      }
    });
  }

  handleSubmit = () => {
    if(!this.state.name || !this.state.tags || this.state.images.length === 0) {
      Taro.atMessage({ 'message': 'All fields are required!', 'type': 'error', })
    } else {
      // submit form
    }
  }

  render() {
    return (
      <View>
        <AtForm
          onSubmit={this.handleSubmit}
        >
          <AtInput
            name='groupName'
            title='社区名称'
            type='text'
            placeholder='Enter group name'
            value={this.state.name}
            onChange={this.handleChangeName}
          />
          <AtInput
            name='tags'
            title='成员标签'
            type='text'
            placeholder='Enter tags'
            value={this.state.tags}
            onChange={this.handleChangeTags}
          />
          <View>
            <Text>场地照片</Text>
            <AtImagePicker
              files={this.state.images}
              onChange={this.handleChangeImage}
              multiple
            />
          </View>
          <View>
            <Text>Location</Text>
            <Map
              longitude={this.state.longitude}
              latitude={this.state.latitude}
              onClick={this.handleChooseLocation}>
            </Map>
          </View>
          <AtButton formType='submit'>Submit</AtButton>
        </AtForm>
      </View>
    )
  }
}

