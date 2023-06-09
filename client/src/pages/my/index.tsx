import { useState } from 'react'
import dayjs from 'dayjs'
import { View, Text, Image } from '@tarojs/components'
import Taro, { reLaunch, useDidShow, navigateTo } from '@tarojs/taro'

import { UserInfo } from '@/types/user'

import './index.less'

const My = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>()

  useDidShow(() => {
    Taro.cloud.callFunction({
      name: 'getUserInfo',
    }).then((res: any) => {
      setUserInfo(res.result)
    })
  })

  const handleLogin = () => {
    if (userInfo) {
      return
    }
    Taro.redirectTo({
      url: '/pages/login/index'
    })
  }

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
    tag?: string;
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
              <View className="config-item-left">
                <View className="config-item-title">{item.title}</View>
                {item?.tag ? <View className="config-item-tag">{item.tag}</View> : null}
              </View>
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
        <View className="user-info" onClick={() => handleLogin()}>
          <Image className="avatar-img" src={userInfo?.avatar || 'https://cloud.zhuchj.com/default-avatar.png'} />
          <View className="self-name">{userInfo?.username || '点击登录'}</View>
          <View className="self-intro">{userInfo?.intro || '暂无简介'}</View>
        </View>
        <View className="self-data">
          {renderSelfData([
            {
              title: '已加入',
              num: <View>{dayjs().diff(dayjs(userInfo?.registerTime), 'days')}<Text className="suffix">/天</Text></View>
            },
            {
              title: '记账',
              num: <View>{userInfo?.recordCount || '0'}<Text className="suffix">/笔</Text></View>
            },
            {
              title: '坚持',
              num: <View>{userInfo?.continueRecord || '0'}<Text className="suffix">/天</Text></View>,
            }
          ])}
        </View>
      </View>
      <View className="self-config">
        {renderConfigItems([
          {
            title: '个人信息',
            onClick: () => {
              navigateTo({
                url: '/pages/my/self-info/index'
              })
            }
          },
          {
            title: '分类管理',
            onClick: () => {
              navigateTo({
                url: '/pages/my/types-manage/index'
              })
            }
          },
          {
            title: '预算管理',
            onClick: () => {
              navigateTo({
                url: '/pages/my/budget/index'
              })
            }
          },
          {
            title: '消息推送',
            tag: 'beta',
            onClick: () => {
              navigateTo({
                url: '/pages/my/message-notice/index'
              })
            }
          },
          {
            title: '意见反馈',
            onClick: () => {
              navigateTo({
                url: '/pages/my/feedback/list/index'
              })
            }
          },
          {
            title: '关于我们',
            onClick: () => {
              navigateTo({
                url: '/pages/my/about-us/index'
              })
            }
          },
          {
            title: '退出登录',
            onClick: () => {
              reLaunch({
                url: '/pages/login/index'
              })
            }
          }
        ])}
        </View>
    </View>
  )
}

export default My;