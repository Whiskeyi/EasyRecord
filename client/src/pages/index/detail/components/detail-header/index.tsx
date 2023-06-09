import { useState } from "react";
import { View, Picker } from "@tarojs/components";
import dayjs from "dayjs";
import Taro from "@tarojs/taro";

import { SELECT_TYPES } from "@/pages/add/constant";

import './index.less';

const ALL_TYPE = [
  '全部类型',
  ...SELECT_TYPES.expend.map(item => item.name),
  ...SELECT_TYPES.income.map(item => item.name),
  ...SELECT_TYPES.none.map(item => item.name),
]

const DetailHeader = ({ recordInfo, refresh }) => {
  const [selectDate, setSelectDate] = useState(dayjs().format('YYYY-MM'));
  const [selectType, setSelectType] = useState('全部类型');

  return (
    <View className="detail-header">
      <Picker
        className="type-picker-container"
        mode="selector"
        range={ALL_TYPE}
        onChange={(e: any) => {
          setSelectType(ALL_TYPE?.[e.target.value])
          Taro.setStorageSync('selectType', ALL_TYPE?.[e.target.value])
          refresh(selectDate, ALL_TYPE?.[e.target.value])
        }}
      >
        <View className="type-picker">
          <View className="type-picker-title">{Taro.getStorageSync('selectType') || selectType}</View>
          <View className="type-picker-icon" />
        </View>
      </Picker>
      <View className="header-bottom">
        <Picker
          fields="month"
          mode="date"
          value={dayjs().format('YYYY-MM')}
          end={dayjs().format('YYYY-MM')}
          onChange={async (e: any) => {
            setSelectDate(dayjs(e.target.value).format('YYYY-MM'))
            Taro.setStorageSync('selectDate', dayjs(e.target.value).format('YYYY-MM'))
            refresh(dayjs(e.target.value).format('YYYY-MM'), selectType)
          }}
        >
          <View className="bottom-left">
            <View className="date-picker">
              {dayjs(Taro.getStorageSync('selectDate')).format('YYYY年M月') || dayjs(selectDate).format('YYYY年M月')}
            </View>
            <View className="arrow-right" />
          </View>
        </Picker>
        <View className="total-container">
          <View className="total-expend-title">总支出</View>
          <View className="total-num">-¥{recordInfo?.expend?.list[0]?.total || 0}</View>
          <View className="total-income-title">总收入</View>
          <View className="total-num">+¥{recordInfo?.income?.list[0]?.total || 0}</View>
        </View>
      </View>
    </View>
  )
};

export default DetailHeader;