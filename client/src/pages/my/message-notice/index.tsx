import { useState, useCallback, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components"
import { AtForm, AtSwitch } from 'taro-ui'

import './index.less'

const MessageNotice = () => {
  const [noticeStatus, setNoticeStatus] = useState<{
    messNotice: boolean;
    autoNotice: boolean;
    dayNotice: boolean;
    weekNotice: boolean;
  }>();

  useEffect(() => {
    Taro.cloud.callFunction({
      name: 'getNoticeStatus',
    }).then((res: any) => {
      setNoticeStatus(res.result);
    })
  }, [])

  const changeMessNotice = useCallback((changeValue) => {
    Taro.cloud.callFunction({
      name: 'updateNoticeStatus',
      data: {
        ...noticeStatus,
        ...changeValue
      }
    }).then((res: any) => {
      setNoticeStatus(res.result);
    })
  }, [noticeStatus])

  return <View className="message-notice-container">
    <AtForm>
      <AtSwitch title="消息推送" checked={noticeStatus?.messNotice} onChange={() => {
        changeMessNotice({
          messNotice: !noticeStatus?.messNotice
        });
      }} />
      <AtSwitch disabled={!noticeStatus?.messNotice} title="智能推送" checked={noticeStatus?.autoNotice} onChange={() => {
        changeMessNotice({
          autoNotice: !noticeStatus?.autoNotice
        });
      }} />
      <AtSwitch disabled={!noticeStatus?.messNotice} title="每日推送" checked={noticeStatus?.dayNotice} onChange={() => {
        changeMessNotice({
          dayNotice: !noticeStatus?.dayNotice
        });
      }} />
      <AtSwitch disabled={!noticeStatus?.messNotice} checked={noticeStatus?.weekNotice} title="每周推送" onChange={() => {
        changeMessNotice({
          weekNotice: !noticeStatus?.weekNotice
        });
      }} />
    </AtForm>
  </View>
}

export default MessageNotice;