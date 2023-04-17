import { FC } from "react";
import { View } from "@tarojs/components";

import './index.less';

const DetailHeader: FC = () => {
  return <View className='detail-header'>
    <View className='type-picker'>
      <View className='type-picker-title'>全部类型</View>
      <View className='type-picker-icon' />
    </View>
    <View className='header-bottom'>
      <View className='date-picker'>
        2023年4月
      </View>
      <View className='total-container'>
        <View className='total-expend-title'>总支出</View>
        <View className='total-num'>-¥609.12</View>
        <View className='total-income-title'>总收入</View>
        <View className='total-num'>+¥1230.12</View>
      </View>
    </View>
  </View>;
};

export default DetailHeader;