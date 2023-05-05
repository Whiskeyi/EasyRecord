import { useState, useCallback, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components"
import { AtForm, AtButton, AtInput, AtImagePicker } from 'taro-ui'
import dayjs from "dayjs";

import { FormTitle } from "@/components";
import { UserInfo } from "@/types/user"

import './index.less'

const SelfInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [files, setFiles] = useState<any>([]);

  useEffect(() => {
    Taro.cloud.callFunction({
      name: 'getUserInfo',
    }).then((res: any) => {
      setUserInfo(res.result);
      setFiles([{
        url: res.result.avatar
      }])
    })
  }, [])

  const handleSubmit = useCallback(() => {
    Taro.cloud.callFunction({
      name: 'updateUserInfo',
      data: {
        username: userInfo?.username,
        intro: userInfo?.intro,
        avatar: files[0]?.url
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
        <FormTitle title="头像" />
        <AtImagePicker
          showAddBtn={files.length < 1}
          files={files}
          onChange={(files) => {
            if (files.length === 0) {
              setFiles(files)
              return
            }
            Taro.cloud.uploadFile({
              cloudPath: `avatar/${userInfo?.openid}/${dayjs().valueOf()}.png`,
              filePath: files[0]?.url,
            }).then((res: any) => {
              Taro.cloud.getTempFileURL({
                fileList: [res.fileID]
              }).then((res: any) => {
                setFiles([{
                  url: res.fileList[0].tempFileURL
                }])
              })
            })
          }}
        />
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