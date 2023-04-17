import { FC, useState } from 'react'
import { View } from '@tarojs/components'

import './index.less'
interface ITabsProps {
  /** 配置tabs */
  configTabs: Array<{
    title: string;
    value: string;
  }>
  /** tab受控值 */
  tabValue: string | number;
  /** tab切换，受控使用 */
  onChange: (value: string) => any;
}

const Tabs: FC<ITabsProps> = ({
  configTabs,
  tabValue,
  onChange,
}) => {

  const handleClick = (value: string) => {
    onChange(value);
  }

  return (
    <View className='tabs-container'>
      {configTabs?.map((item) => {
        return (
          <View
            className={`tab-item ${tabValue === item.value ? 'active' : ''}`}
            key={item.value}
            onClick={() => handleClick(item.value)}
          >
            {item.title}
          </View>
        );
      })
      }
    </View>
  )
};

export default Tabs;