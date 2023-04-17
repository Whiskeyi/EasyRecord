import { FC } from 'react'
import { View } from '@tarojs/components'

import './index.less'

const Tabs: FC = () => {
  return (
    <View className='tabs-container'>
      <View className='tab-item'>明细</View>
      <View className='tab-item choose'>统计</View>
    </View>
  )
};

export default Tabs;