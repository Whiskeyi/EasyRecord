import { View, Image } from "@tarojs/components";

import "./index.less";
import dayjs from "dayjs";

const typeCharMap = {
  income: '+',
  expend: '-',
  none: ''
}

const DayCard = ({ recordInfo }) => {
  const renderCardItem = ({
    amountType,
    recordTime,
    remark,
    type,
    amount
  }: {
    amountType: string;
    recordTime: string;
    remark: string;
    type: string;
    amount: number;
  }) => {
    return (
      <View className="content-item">
        <View className="item-left">
          <Image className="item-img" src="https://cloud.zhuchj.com/avatar.jpg" />
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
        <View className="item-money">{typeCharMap[type]}¥{amount}</View>
      </View>
    )
  }

  return (
    <View className="day-card-container">
      <View className="card-header">
        <View className="header-date">
          <View className="header-date-time">{dayjs().format('M月DD日')}</View>
          <View className="header-date-title">今天</View>
        </View>
        <View className="header-money-container">
          <View className="header-money">
            <View className="header-money-title">支出</View>
            <View className="header-money-amount">-￥{recordInfo?.expend?.list[0]?.total || 0}</View>
          </View>
          <View className="header-money">
            <View className="header-money-title">收入</View>
            <View className="header-money-amount">+￥{recordInfo?.income?.list[0]?.total || 0}</View>
          </View>
        </View>
      </View>
      <View className="card-content">
        {recordInfo?.userRecordList?.data?.map((item) => {
          return renderCardItem(item)
        })}
      </View>
    </View>
  )
};

export default DayCard;