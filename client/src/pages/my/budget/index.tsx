import { View } from "@tarojs/components"
import { AtInput } from "taro-ui"
import { useRef, useState } from "react"

import { FormTitle } from "@/components"
import useLock from "@/hooks/useLock"

import './index.less'
import Taro, { useDidShow } from "@tarojs/taro"

const Budget = () => {
  const budgetInputRef = useRef(null);
  const [isLock, setLock] = useLock(false);
  const [currentExpend, setCurrentExpend] = useState();
  const [budget, setBudget] = useState();

  useDidShow(() => {
    Taro.cloud.callFunction({
      name: 'getCurrentExpendAndBudget',
    }).then((res: any) => {
      setCurrentExpend(res.result.expend)
      setBudget(res.result.budget || '')
    })
  })

  const handleSave = () => {
    if (!isLock()) {
      Taro.cloud.callFunction({
        name: 'updateCurrentBudget',
        data: {
          budget
        }
      }).then(() => {
          Taro.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
      }).finally(() => {
        setLock(false)
      })
    }
  }

  return (
    <View className="budget-container">
      <View className="budget-title">每月预算设置</View>
      <View className="budget-subtitle">
        为了更好的控制每月的消费，我们建议您设置每月预算。
      </View>
      <View className="budget-form">
        <FormTitle title="当月消费" />
        <View className="input">
          <View className="prefix">¥</View>
          <AtInput
            name="currentExpend"
            disabled
            value={currentExpend}
            onChange={(value: any) => {
              setCurrentExpend(value)
            }}
          />
        </View>
        <FormTitle title="每月预算" />
        <View className="input">
          <View className="prefix">¥</View>
          <AtInput
           type="number"
            name="budget"
            ref={budgetInputRef}
            placeholder="请输入每月预算"
            value={budget}
            onChange={(value: any) => {
              setBudget(value)
            }} />
        </View>
      </View>
      <View
        className="budget-btn"
        onClick={() => {
          handleSave()
        }}
      >
        保存
      </View>
    </View>
  )
}

export default Budget;