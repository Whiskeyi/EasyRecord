import { useState, useCallback, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components"
import { AtForm, AtButton, AtInput } from 'taro-ui'

import { FormTitle } from "@/components";
import { UserInfo } from "@/types/user"

import './index.less'

const SelfInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>();

  useEffect(() => {
    Taro.cloud.callFunction({
      name: 'getUserInfo',
    }).then((res: any) => {
      setUserInfo(res.result);
    })
  }, [])

  const handleSubmit = useCallback(() => {
    Taro.cloud.callFunction({
      name: 'updateUserInfo',
      data: {
        username: userInfo?.username,
        intro: userInfo?.intro
      }
    }).then((res: any) => {
      setUserInfo(res.result);
      Taro.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 2000
      })
    })
  }, [userInfo])

  return (
    <View className="self-info-container">
      <AtForm>
        <FormTitle title="名称" />
        <AtInput
          name="value"
          type="text"
          placeholder="请输入"
          value={userInfo?.username}
          onChange={(val) => {
            setUserInfo({
              ...userInfo,
              username: val as string
            })
          }}
        />
        <FormTitle title="个人简介" />
        <AtInput
          name="value"
          type="text"
          placeholder="请输入"
          value={userInfo?.intro}
          onChange={(val) => {
            setUserInfo({
              ...userInfo,
              intro: val as string
            })
          }}
        />
        <AtButton className="submit-btn" onClick={() => handleSubmit()}>提交</AtButton>
      </AtForm>
    </View>
  )
}

export default SelfInfo;