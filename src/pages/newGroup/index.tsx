import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Newgroup() {

  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='newGroup'>
      <Text>Hello world!</Text>
    </View>
  )
}
