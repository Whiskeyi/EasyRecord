import { View, Text, Image } from '@tarojs/components'

import './index.less'

const My = () => {
  const renderSelfData = (config: Array<{
    title: string;
    num: React.ReactNode;
  }>) => {
    return (
      <View className="self-items">
       {config?.map((item, index) => {
          return (
            <View className="self-item" key={index}>
              <View className="self-item-num">{item.num}</View>
              <View className="self-item-title">{item.title}</View>
            </View>
          )
        })
       }
      </View>
    )
  }

  const renderConfigItems = (config: Array<{
    title: string;
    onClick?: Function;
  }>) => {
    return (
      <View className="config-items">
        {config?.map((item, index) => {
          return (
            <View
              className="config-item"
              key={index}
              onClick={() => {
                typeof item.onClick === 'function' && item.onClick()
              }}
            >
              <View className="config-item-title">{item.title}</View>
              <View className="config-item-arrow"></View>
            </View>
          )
        }
        )}
      </View>
    )
  }

  return (
    <View className="my-container">
      <View className="self-info">
        <Image className="avatar-img" src="https://cloud.zhuchj.com/avatar.jpg" />
        <View className="self-name">Whiskeyi</View>
        <View className="self-intro">stay happy~</View>
        <View className="self-data">
          {renderSelfData([
            {
              title: '已加入',
              num: <View>66<Text className="suffix">/天</Text></View>
            },
            {
              title: '记账',
              num: <View>33<Text className="suffix">/笔</Text></View>
            },
            {
              title: '获赞',
              num: 0
            }
          ])}
        </View>
      </View>
      <View className="self-config">
        {renderConfigItems([
          {
            title: '个人信息'
          },
          {
            title: '分类管理'
          },
          {
            title: '消息推送'
          },
          {
            title: '关于我们'
          },
          {
            title: '意见反馈'
          },
          {
            title: '退出登录'
          }
        ])}
        </View>
    </View>
  )
}

export default My;