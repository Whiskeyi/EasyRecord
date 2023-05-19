import { useState } from "react"
import { View, Image } from "@tarojs/components"
import Taro, { useDidShow } from "@tarojs/taro"
import dayjs from "dayjs"

import './index.less'

const statusMap = {
  1: '未处理',
  2: '处理中',
  3: '已处理'
}

const statusColorMap = {
  1: 'unprocessed',
  2: 'processing',
  3: 'success'
}


const FeedbackList = () => {

  const [feedbackList, setFeedbackList] = useState([])

  useDidShow(() => {
    Taro.cloud.callFunction({
      name: 'getAllFeedback',
    }).then((res: any) => {
      setFeedbackList(res.result.res.data)
    })
  })

  const RenderFeedbackCard = ({
    title,
    status,
    content,
    images,
    time
  }) => {
    return (
      <View className="feedback-card">
        <View className="feedback-card-top">
          <View className="feedback-card-title">{title}</View>
          <View className={`feedback-card-status ${statusColorMap[status]}`}>{statusMap[status]}</View>
        </View>
        <View className="divider" />
        <View className="feedback-card-items">
          <View className="feedback-card-item">
            <View className="feedback-card-item-title">反馈内容</View>
            <View className="feedback-card-item-value">{content}</View>
          </View>
          {images?.length > 0 && images?.map((item) => {
            return (
              <View className="feedback-card-item">
                <View className="feedback-card-item-title">反馈图片</View>
                <Image
                  className="feedback-card-item-img"
                  src={item} mode="aspectFill"
                  onClick={() => {
                    Taro.previewImage({
                      urls: images
                    })
                  }}
                />
              </View>
            )
          })}
        </View>
        <View className="feedback-card-footer">
          <View className="feedback-card-time">{dayjs(time).format('YYYY-MM-DD HH:mm')}</View>
        </View>
      </View>
    )
  }
  return <View className="feedback-list-container">
    {feedbackList?.map((item: any) => {
      return <RenderFeedbackCard title={item.type} status={item.feedbackStatus} content={item.content} time={item.createTime} images={item.images} />
    })}
    <View className="btn-container">
      <View className="btn-back">
        <View
          className="feedback-list-btn"
          onClick={() => {
            Taro.navigateTo({
              url: '/pages/my/feedback/index'
            })
          }}
        >
          新增反馈
        </View>
      </View>
    </View>
  </View>
}

export default FeedbackList;