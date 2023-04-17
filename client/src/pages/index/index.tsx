import { useState } from 'react'
import { View, Text } from '@tarojs/components'

import Detail from './detail'
import Statistics from './statistics'
import { Tabs } from '../../components'

import './index.less'

const Index = () => {
  const [activeTab, setActiveTab] = useState('1');

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
      <View className='index-content'>
        {activeTab === '1' && <Detail />}
        {activeTab === '2' && <Statistics />}
      </View>
    </View>
  )
}

export default Index;