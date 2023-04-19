import { useCallback, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidShow, showLoading, hideLoading } from '@tarojs/taro'

import { Tabs } from '@/components'

import Detail from './detail'
import Statistics from './statistics'

import './index.less'

const Index = () => {
  const [activeTab, setActiveTab] = useState('1');

  const [recordInfo, setRecordInfo] = useState();

  const refresh = useCallback(() => {
    Taro.cloud.callFunction({
      name: 'getUserRecordList',
    }).then((res: any) => {
      setRecordInfo(res.result)
    }).finally(() => {
      hideLoading()
    })
  }, [])

  useDidShow(() => {
    showLoading({
      title: '加载中...'
    })
    refresh()
  })

  return (
    <View>
      <Tabs
        configTabs={[
          {
            title: '明细',
            value: '1'
          },
          {
            title: '统计',
            value: '2'
          }
        ]}
        tabValue={activeTab}
        onChange={(value) => setActiveTab(value)}
      />
      <View className="index-content">
        {activeTab === '1' && <Detail recordInfo={recordInfo} />}
        {activeTab === '2' && <Statistics />}
      </View>
    </View>
  )
}

export default Index;