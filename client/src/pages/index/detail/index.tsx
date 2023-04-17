import { View } from '@tarojs/components'

import DayCard from './components/day-card'
import DetailHeader from './components/detail-header'

import './index.less'

const Detail = () => {
  return (
    <View className='detail-container'>
      <DetailHeader />
      <View className='detail-content'>
        <DayCard />
        <DayCard />
      </View>
    </View>
  )
}

export default Detail;
