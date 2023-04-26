import { View } from '@tarojs/components'

import DayCard from './components/day-card'
import DetailHeader from './components/detail-header'

import './index.less'

const Detail = ({ recordInfo }) => {

  return (
    <View className="detail-container">
      <DetailHeader recordInfo={recordInfo} />
      <View className="detail-content">
        {recordInfo?.userRecordList?.list?.map((item, index) => {
          return <DayCard key={index} recordInfo={item} />
        })}
      </View>
    </View>
  )
}

export default Detail;
