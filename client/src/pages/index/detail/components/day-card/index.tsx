import { View, Image } from "@tarojs/components";
import dayjs from "dayjs";
import { navigateTo } from "@tarojs/taro";

import { judgeType2PrefixChar } from "@/utils";

import "./index.less";

const DayCard = ({ recordInfo }) => {
  const renderCardItem = ({
    _id,
    amountType,
    recordTime,
    remark,
    type,
    amount
  }: {
    _id: string;
    amountType: string;
    recordTime: string;
    remark: string;
    type: string;
    amount: number;
  }) => {
    return (
      <View className="content-item" onClick={() => {
        navigateTo({
          url: `/pages/detail/index?recordId=${_id}`
        })
      }}>
        <View className="item-left">
          <View className={`item-img ${type}`}>
            <View className="item-img-text">{amountType.slice(0, 1)}</View>
          </View>
          <View className="item-info">
            <View className="info-title">{amountType}</View>
            <View className="info-detail">
              <View className="info-time">{dayjs(recordTime).format('HH:mm')}</View>
              {remark ? (
                <>
                  <View className="column-divide" />
                  <View className="info-desc">{remark}</View>
                </>
              ) : null}
            </View>
          </View>
        </View>
        <View className="item-money">{judgeType2PrefixChar(type)}¥{amount}</View>
      </View>
    )
  }

  return (
    <View className="day-card-container">
      <View className="card-header">
        <View className="header-date">
          <View className="header-date-time">{dayjs(recordInfo?.date).format('M月DD日')}</View>
        </View>
        <View className="header-money-container">
          <View className="header-money">
            <View className="header-money-title">支出</View>
            <View className="header-money-amount">-￥{recordInfo?.totalExpend || 0}</View>
          </View>
          <View className="header-money">
            <View className="header-money-title">收入</View>
            <View className="header-money-amount">+￥{recordInfo?.totalIncome || 0}</View>
          </View>
        </View>
      </View>
      <View className="card-content">
        {recordInfo?.recordList?.map((item) => {
          return renderCardItem(item)
        })}
      </View>
    </View>
  )
};

export default DayCard;