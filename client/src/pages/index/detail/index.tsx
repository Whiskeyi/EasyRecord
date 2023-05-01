import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'

import NoMessage from '@/assets/img/no-message.png'
import Top from '@/assets/icons/top.png'

import DayCard from './components/day-card'
import DetailHeader from './components/detail-header'

import './index.less'

const Detail = ({ recordInfo, refresh }) => {

  return (
    <View className="detail-container">
      <View className="fixed-top" onClick={() => {
        Taro.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
      }}>
        <Image src={Top} className="top-img" />
      </View>
      <DetailHeader recordInfo={recordInfo} refresh={refresh} />
      <View className="detail-content">
        {recordInfo?.userRecordList?.list.length ? recordInfo.userRecordList.list.map((item, index) => {
          return <DayCard key={index} recordInfo={item} />
        }) : (
          <View className='no-data-container'>
            <Image src={NoMessage} className="no-data" />
            <View className="no-data-text">暂无数据</View>
          </View>
        )}
      </View>
    </View>
  )
}

export default Detail;
