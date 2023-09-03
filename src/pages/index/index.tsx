import Taro, { Component, Config } from '@tarojs/taro'
import { View, Map } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { AtTabBar } from 'taro-ui'
import './index.scss'
export default function Index() {
  return (
    <View className='index'>
      <Map />
      <AtTabBar
        fixed
        tabList={[
          { title: '小组', iconType: 'list'},
          { title: '地图', iconType: 'map-pin'},
          { title: '金库', iconType: 'money'}
        ]}
      />
    </View>
  )
}
