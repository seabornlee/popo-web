import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Map } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'
import 'taro-ui/dist/style/components/tab-bar.scss';
import 'taro-ui/dist/style/components/icon.scss';
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: 'Home'
  }

  state = {
    latitude: null,
    longitude: null,
    speed: null,
    accuracy: null,
    currentTab: 0,
  }

  componentDidMount () {
    Taro.getLocation({
      type: 'wgs84',
      success: (res) => {
        this.setState({
          latitude: res.latitude,
          longitude: res.longitude,
          speed: res.speed,
          accuracy: res.accuracy,
        })
      }
    });
  }

  handleTabClick = (value) => {
    this.setState({
      currentTab: value
    });
  }

  render () {
    return (
      <View className='index'>
        <Map longitude={this.state.longitude} latitude={this.state.latitude}/>
        <AtTabBar
          fixed
          current={this.state.currentTab}
          onClick={this.handleTabClick}
          tabList={[
            { title: '小组', iconType: 'list'},
            { title: '地图', iconType: 'map-pin'},
            { title: '金库', iconType: 'money'}
          ]}
        />
      </View>
    )
  }
}
