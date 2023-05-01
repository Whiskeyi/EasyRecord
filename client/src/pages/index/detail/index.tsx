import { View, Image } from '@tarojs/components'

import NoData from '@/assets/img/no-message.png'

import DayCard from './components/day-card'
import DetailHeader from './components/detail-header'

import './index.less'

const Detail = ({ recordInfo, refresh }) => {

  return (
    <View className="detail-container">
      <DetailHeader recordInfo={recordInfo} refresh={refresh} />
      <View className="detail-content">
        {recordInfo?.userRecordList?.list.length ? recordInfo.userRecordList.list.map((item, index) => {
          return <DayCard key={index} recordInfo={item} />
        }) : (
          <View className='no-data-container'>
            <Image src={NoData} className="no-data" />
            <View className="no-data-text">暂无数据</View>
          </View>
        )}
      </View>
    </View>
  )
}

export default Detail;
