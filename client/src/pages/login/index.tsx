import { useState, useRef } from "react"
import { View, Image, Text } from "@tarojs/components"
import Taro, { showToast, switchTab } from "@tarojs/taro"

import Logo from "@/assets/img/logo.png"
import Choose from "@/assets/icons/choose.png"
import UnChoose from "@/assets/icons/un-choose.png"

import "./index.less"
import { useEffect } from "react"

const Login = () => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [iconChoose, setIconChoose] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [])

  const handleLogin = () => {
    if (!iconChoose) {
      showToast({
        title: '请阅读并勾选下方协议',
        icon: 'none'
      })
      return
    }

    Taro.cloud.callFunction({
      name: 'login',
      data: {},
      success: (res: any) => {
        Taro.setStorageSync('openid', res.result.openid)
        showToast({
          title: '登录成功',
          icon: 'none'
        })
        timeoutRef.current = setTimeout(() => {
          switchTab({
            url: '/pages/index/index'
          })
        }, 800)
      },
      fail: () => {
        showToast({
          title: '登录失败',
          icon: 'none'
        })
      }
    })
  }

  return (
    <View className="login-container">
      <View className="brand-show">
        <Image className="login-logo" src={Logo} />
        <View className="login-title">易记</View>
        <View className="login-subtitle">EasyRecord</View>
      </View>
      <View className="login-button" onClick={() => handleLogin()}>微信一键登录</View>
      <View className="login-tips">
        <Image
          className="login-radio"
          src={iconChoose ? Choose : UnChoose}
          onClick={() => {
            setIconChoose((prev) => !prev)
          }}
        />
        <View className="login-tips-text">我们的服务依赖于微信账号登录，请阅读并同意“<Text>用户登录指引协议</Text>”</View>
      </View>
    </View>
  )
}

export default Login