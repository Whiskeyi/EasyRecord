import { navigateBack } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import Close from '@/assets/icons/close.png';

import './index.less';

const AboutUs = () => {
  return (
    <View className="about-us-container">
      <View className="about-us-title">关于我们</View>
      <View className="about-us-content">
        <Text>你好朋友～</Text>
        <Text>欢迎使用我开发的记账微信小程序</Text>
        <Text>我是一个热爱编程和创新的个人开发者。我致力于为您提供一个高效、简单、智能的记账体验。</Text>
        <Text>如果您在使用我们的小程序中遇到任何问题或有任何建议，欢迎通过以下方式联系我们：</Text>
        <Text>微信：Whiskey_o</Text>
        <Text>邮箱：zhuchenjie163@163.com</Text>
        <Text>我们会尽快回复您的反馈，并不断优化我们的产品，让它更符合您的需求。谢谢您的支持！</Text>
      </View>
      <Image
        className="back-btn"
        src={Close}
        onClick={() => {
          navigateBack();
        }}
      />
    </View>
  )
}

export default AboutUs;