import { FC } from "react";
import { View, Image } from "@tarojs/components";

import "./index.less";

const DayCard: FC = () => {
  const renderCardItem = () => {
    return (
      <View className="content-item">
        <View className="item-left">
          <Image className="item-img" src="https://cloud.zhuchj.com/avatar.jpg" />
          <View className="item-info">
            <View className="info-title">餐饮</View>
            <View className="info-detail">
              <View className="info-time">15:19</View>
              <View className="column-divide" />
              <View className="info-desc">luckincoffee</View>
            </View>
          </View>
        </View>
        <View className="item-money">-27.84</View>
      </View>
    )
  }

  return (
    <View className="day-card-container">
      <View className="card-header">
        <View className="header-date">
          <View className="header-date-time">4月17日</View>
          <View className="header-date-title">今日</View>
        </View>
        <View className="header-money-container">
          <View className="header-money">
            <View className="header-money-title">支出</View>
            <View className="header-money-amount">-￥0.00</View>
          </View>
          <View className="header-money">
            <View className="header-money-title">收入</View>
            <View className="header-money-amount">+￥0.00</View>
          </View>
        </View>
      </View>
      <View className="card-content">
        {renderCardItem()}
        {renderCardItem()}
        {renderCardItem()}
      </View>
    </View>
  )
};

export default DayCard;