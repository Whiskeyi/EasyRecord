import { useEffect, useRef, useState } from "react"
import { View } from "@tarojs/components"
import { AtFloatLayout } from 'taro-ui'
import { navigateBack } from "@tarojs/taro"
import { SELECT_TYPES } from "@/pages/add/constant"

import { FormTitle } from "@/components"

import './index.less'

const TypesManage = () => {
  const [showFloatLayout, setShowFloatLayout] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setShowFloatLayout(true)
    }, 200)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const renderTypesItems = (items: string[], type?: string) => {
    return (
      <View className="types-items-container">
        {
          items.map((item, index) => {
            return (
              <View className={`types-item ${type}`} key={index}>
                {item}
              </View>
            )
          })
        }
        <View className={`types-item add-item ${type}`}>添加+</View>
      </View>
    )
  }

  return (
    <AtFloatLayout
      className="types-manage-container"
      isOpened={showFloatLayout}
      onClose={() => {
        navigateBack();
      }}
    >
      <View className="manage-content">
      <FormTitle title="支出" />
        {renderTypesItems(SELECT_TYPES.expend?.map(item => item.name), 'expend')}
        <FormTitle title="收入" />
        {renderTypesItems(SELECT_TYPES.income?.map(item => item.name), 'income')}
        <FormTitle title="不计入收支" />
        {renderTypesItems(SELECT_TYPES.none?.map(item => item.name), 'none')}
      </View>
    </AtFloatLayout>
  )
}

export default TypesManage;