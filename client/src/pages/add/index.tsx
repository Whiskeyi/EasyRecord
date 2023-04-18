import { useEffect } from 'react'
import { View } from '@tarojs/components'
import { useDidShow, useDidHide } from '@tarojs/taro'

import { NumberInput } from '@/components'

function Add(props) {
  useEffect(() => {})
  useDidShow(() => {})
  useDidHide(() => {})

  return (
    <View><NumberInput /></View>
  )
}

export default Add;