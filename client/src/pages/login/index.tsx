import { useState } from "react"
import { View, Image, Text } from "@tarojs/components"
import Taro, { showToast, switchTab } from "@tarojs/taro"

import Logo from "@/assets/img/logo.png"
import Choose from "@/assets/icons/choose.png"
import UnChoose from "@/assets/icons/un-choose.png"
import api from "@/services"

import "./index.less"

const Login = () => {
  const [iconChoose, setIconChoose] = useState<boolean>(false);

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
      complete: res => {
        console.log('callFunction test result: ', res)
      }
    })
    // wx.login({
    //   success (res) {
    //     console.log(res)
    //     if (res.code) {
    //       //发起网络请求
    //       // wx.request({
    //       //   url: 'https://example.com/onLogin',
    //       //   data: {
    //       //     code: res.code
    //       //   }
    //       // })
    //     } else {
    //       showToast({
    //         title: '登录失败'
    //       })
    //     }
    //   }
    // })
    // console.log(wx.getUserProfile({
    //   desc: '用于获取/完善个人资料',
    // }))
    //  switchTab({
    //     url: '/pages/my/index'
    //  })
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