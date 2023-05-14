import { useEffect, useRef, useState } from "react"
import { View } from "@tarojs/components"
import { AtFloatLayout, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import { navigateBack } from "@tarojs/taro"
import { SELECT_TYPES } from "@/pages/add/constant"

import { FormTitle } from "@/components"

import './index.less'

const TypesManage = () => {
  const [showFloatLayout, setShowFloatLayout] = useState<boolean>(false);
  const [showActionSheet, setShowActionSheet] = useState<boolean>(false);
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
              <View
                className={`types-item ${type}`}
                key={index}
                onClick={() => {
                  setShowActionSheet(true)
                }}>
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
    <View className="types-manage-container">
      <AtFloatLayout
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
      <AtActionSheet
        isOpened={showActionSheet}
        cancelText='取消'
        onClose={() => {
          setShowActionSheet(false)
        }}
      >
        <AtActionSheetItem>
          修改
        </AtActionSheetItem>
        <AtActionSheetItem className="delete">
          删除
        </AtActionSheetItem>
      </AtActionSheet>
    </View>
  )
}

export default TypesManage;