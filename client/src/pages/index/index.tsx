import { useCallback, useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import Taro, { useDidShow, showLoading, hideLoading } from '@tarojs/taro'
import dayjs from 'dayjs'

import { Tabs } from '@/components'

import Detail from './detail'
import Statistics from './statistics'

import './index.less'

const Index = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [recordInfo, setRecordInfo] = useState();

  const refresh = useCallback((date?: string, type?: string) => {
    Taro.cloud.callFunction({
      name: 'getUserRecordList',
      data: {
        date: date || Taro.getStorageSync('selectDate') || dayjs().format('YYYY-MM'),
        type: type || Taro.getStorageSync('selectType') || '全部类型'
      }
    }).then((res: any) => {
      setRecordInfo(res.result)
    }).finally(() => {
      hideLoading()
    })
  }, [])

  useEffect(() => {
    Taro.setStorageSync('selectDate', dayjs().format('YYYY-MM'))
    Taro.setStorageSync('selectType', '全部类型')
  }, [])

  useDidShow(() => {
    showLoading({
      title: '加载中...'
    })
    refresh()
  })

  return (
    <View className="index-container">
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
        {activeTab === '1' && <Detail recordInfo={recordInfo} refresh={refresh} />}
        {activeTab === '2' && <Statistics />}
      </View>
    </View>
  )
}

export default Index;