import { View } from "@tarojs/components"
import { useState, useCallback, useRef, useEffect } from "react"
import { AtForm, AtTextarea, AtButton, AtImagePicker } from 'taro-ui'
import Taro from "@tarojs/taro"

import { FormTitle } from '@/components'

import './index.less'

const Feedback = () => {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const [value, setValue] = useState<any>('')
  const [files, setFiles] = useState<any>([])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const checkSubmit = useCallback(() => {
    if (value.length < 10) {
      Taro.showToast({
        title: '请输入意见描述至少10字',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    return true
  }, [value])

  const handleSubmit = useCallback(() => {
    if (!checkSubmit()) {
      return
    }
    Taro.cloud.callFunction({
      name: 'addFeedback',
      data: {
        content: value,
        images: files,
      }
    }).then((res: any) => {
      Taro.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000
      })
      timeoutRef.current = setTimeout(() => {
        Taro.navigateBack()
      }, 2000)
    })

    console.log(value, files)
  }, [value])

  return <View className="feedback-container">
    <AtForm>
      <FormTitle title="反馈图片" />
      <AtImagePicker
        className="image-picker"
        files={files}
        onChange={(files) => setFiles(files)}
      />
      <FormTitle title="意见描述" />
      <AtTextarea
        className="textarea"
        placeholder='请输入意见描述至少10字'
        value={value}
        onChange={(value) => setValue(value)}
        maxLength={200}
      />
      <AtButton className="submit-btn" onClick={() => handleSubmit()}>提交</AtButton>
    </AtForm>
  </View>
}

export default Feedback;