import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Map, CoverView, CoverImage } from '@tarojs/components';
import { AtTabBar } from 'taro-ui';
import 'taro-ui/dist/style/components/tab-bar.scss';
import 'taro-ui/dist/style/components/icon.scss';
import './index.scss';

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
    markers: [],
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
          markers: [{
            id: 1,
            latitude: res.latitude,
            longitude: res.longitude,
            callout: {
              content: '面包树朴门永续',
              color: '#000000',
              fontSize: 14,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#000000',
              padding: 5,
              display: 'ALWAYS',
              textAlign: 'center',
            }
          }],
        });
      }
    });
  }

  handleTabClick = (value) => {
    this.setState({
      currentTab: value
    });

    if (value === 1) {
      Taro.navigateTo({
        url: '/pages/newGroup/index'
      })
    }
  }

  render () {
    return (
      <View className='index'>
        <Map
          longitude={this.state.longitude}
          latitude={this.state.latitude}
          markers={this.state.markers}
        >
        {this.state.markers.map((marker) => (
          <CoverView
            className='marker'
            style={{ width: '30px', height: '30px', lineHeight: '30px' }}
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
          >
            <CoverImage src={marker.iconPath} /> 
            <CoverView>{marker.name}</CoverView>
          </CoverView>
        ))}
        </Map>
        <AtTabBar
          fixed
          current={this.state.currentTab}
          onClick={this.handleTabClick}
          tabList={[
            { title: '地图', iconType: 'map-pin'},
            { title: '创建社区', iconType: 'add'},
            { title: '捐赠', iconType: 'money'}
          ]}
        />
      </View>
    );
  }
}
