import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import './index.scss'
export default function Index() {
  return (
    <View className='index'>
        <AtButton type='primary'>按钮文案</AtButton>
    </View>
  )
}
