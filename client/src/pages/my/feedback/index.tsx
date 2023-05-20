import { View, Picker } from "@tarojs/components"
import { useState, useCallback, useRef, useEffect } from "react"
import { AtForm, AtTextarea, AtButton, AtImagePicker, AtList, AtListItem } from 'taro-ui'
import dayjs from "dayjs"
import Taro from "@tarojs/taro"

import { FormTitle } from '@/components'

import './index.less'

const typeMap = {
  0: '功能建议',
  1: '界面优化',
  2: '错误修复',
  3: '其他'
}

const Feedback = () => {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const [value, setValue] = useState<any>('')
  const [files, setFiles] = useState<any>([])
  const [type, setType] = useState<any>('')

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
    if (!type) {
      Taro.showToast({
        title: '请选择反馈类型',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    return true
  }, [value, type])

  const handleSubmit = useCallback(async () => {
    if (!checkSubmit()) {
      return
    }

    const fileImgs = files.map((item: any) => item.url || item.path)

    const fileIds = await Promise.all(fileImgs.map((item: any) => {
      return Taro.cloud.uploadFile({
        cloudPath: `feedback/${dayjs().valueOf()}-${(Math.random() * 10000).toFixed(0)}.png`,
        filePath: item,
      }).then((res: any) => {
        return res.fileID
      })
    }))

    const images = await Taro.cloud.getTempFileURL({
      fileList: fileIds
    }).then((res: any) => {
      return res.fileList.map((item: any) => item.tempFileURL)
    })

    await Taro.cloud.callFunction({
      name: 'addFeedback',
      data: {
        content: value,
        images,
        type
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
  }, [value, files, type, checkSubmit])

  return <View className="feedback-container">
    <AtForm>
      <FormTitle title="反馈类型" />
      <Picker
        mode="selector"
        range={['功能建议', '界面优化', '错误修复', '其他']}
        value={type}
        onChange={(e) => {
          setType(typeMap[e.detail.value])
        }}
      >
        <AtList>
          <AtListItem title="反馈类型"  extraText={type} />
        </AtList>
      </Picker>
      <FormTitle title="意见描述" />
      <AtTextarea
        className="textarea"
        placeholder='请输入意见描述至少10字'
        value={value}
        onChange={(value) => setValue(value)}
        maxLength={200}
      />
      <FormTitle title="反馈图片" />
      <AtImagePicker
        className="image-picker"
        files={files}
        onChange={(files) => setFiles(files)}
      />
      <AtButton className="submit-btn" onClick={() => handleSubmit()}>提交</AtButton>
    </AtForm>
  </View>
}

export default Feedback;