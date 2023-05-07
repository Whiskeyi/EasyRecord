import { useCallback, useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtProgress } from 'taro-ui'
import dayjs from 'dayjs'

import './index.less'

const Statistics = () => {
  const [statisticsList, setStatisticsList] = useState<any>();
  const [selectType, setSelectType] = useState('支出')
  const [selectDate, setSelectDate] = useState(dayjs().format('YYYY-MM'))

  const refresh = useCallback(() => {
    Taro.cloud.callFunction({
      name: 'getUserStatisticsList',
      data: {
        type: selectType === '支出' ? 'expend' : 'income',
        date: selectDate
      }
    }).then((res: any) => {
      console.log(res)
      setStatisticsList(res.result)
    })
  }, [selectType, selectDate])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <View className="statistics-container">
      <View className={`sta-background ${selectType === '收入' ? 'income' : ''}`}>
        <View className="sta-background-top">
          <View className="sta-background-top-left">
            <Picker
              fields="month"
              mode="date"
              value={dayjs().format('YYYY-MM')}
              end={dayjs().format('YYYY-MM')}
              onChange={async (e: any) => {
                setSelectDate(dayjs(e.target.value).format('YYYY-MM'))
              }}
            >
              <View className="picker-container">
                <View className="date-picker">
                  {dayjs(selectDate).format('YYYY年M月')}
                </View>
                <View className="type-picker-icon" />
              </View>
            </Picker>
          </View>
          <View className="sta-background-top-right">
            <View
              className={`item-text ${selectType === '支出' ? 'choose' : ''}`}
              onClick={() => {
                setSelectType('支出')
              }}
            >
              支出
            </View>
            <View
              className={`item-text ${selectType === '收入' ? 'choose' : ''}`}
              onClick={() => {
                setSelectType('收入')
              }}
            >
              收入
            </View>
          </View>
        </View>
        <View className="sta-background-bottom">
          <View className="title">
            总{selectType === '支出' ? '支出' : '收入'}
          </View>
          <View className="money">
            ￥{statisticsList?.totalAmount || 0}
          </View>
        </View>
      </View>
      <View className="sta-list">
        <View className="sta-list-title">
          {selectType === '支出' ? '支出' : '收入'}类别排名
        </View>
        <View className="type-items">
          {statisticsList?.typeList?.map((item: any, index: number) => {
            return (
              <View className="type-item" key={index}>
                <View className="item-left">
                  <View className="item-num">{index + 1}</View>
                  <View className="title">{item.amountType}</View>
                  <AtProgress color={`${selectType === '支出' ? '#73d1a1' : '#ecbf59'}`} className="item-process" percent={item.total / statisticsList.maxAmount * 100} isHidePercent />
                </View>
                <View className="item-right">
                  <View className="right-title">¥{item.total}</View>
                </View>
              </View>)
          })}
        </View>
      </View>
      <View className="sta-list">
        <View className="sta-list-title">
          {selectType === '支出' ? '支出' : '收入'}记录排名
        </View>
        <View className="sta-list-items">
          {statisticsList?.recordList?.map((item: any, index: number) => {
            return (
              <View className="sta-list-item" key={index} onClick={() => {
                Taro.navigateTo({
                  url: `/pages/detail/index?recordId=${item._id}`
                })
              }}>
                <View className="item-left">
                  <View className="item-num">{index + 1}</View>
                  <View className="item-center">
                    <View className="center-img" />
                    <View className="center-right">
                      <View className="right-title">{item.amountType}</View>
                      <View className="right-remark">{item.remark}</View>
                    </View>
                  </View>
                </View>
                <View className="item-right">
                  <View className="right-money">
                    {selectType === '支出' ? '-' : '+'}￥{item.amount}
                  </View>
                  <View className="right-date">{dayjs(item.createTime).format('M月D日 HH:mm')}</View>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}

export default Statistics;
