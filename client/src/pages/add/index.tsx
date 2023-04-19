import { useState, useCallback } from 'react'
import dayjs from 'dayjs'
import { View, ITouchEvent } from '@tarojs/components'
import { showToast, useDidShow, switchTab } from '@tarojs/taro'

import { SELECT_TYPES } from './constant'

import './index.less'

const TYPE = {
  '支出': 'expend',
  '收入': 'income',
  '不计入收支': 'none'
}

const Add = (props) => {
  const [type, setType] = useState<'expend' | 'income' | 'none'>(TYPE['支出'] as 'expend');
  const [selectType, setSelectType] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('')

  useDidShow(() => {
    setType('expend')
    setInputValue('')
    setSelectType('')
  })

  const keyBoardClick = useCallback((value) => {
    if (!value) return
    if (value === '.' && inputValue === '') {
      setInputValue('0.')
      return
    }
    if (value === 'delete') {
      if (inputValue.length === 0) {
        return
      }
      setInputValue(val => val.slice(0, -1))
      return
    }
    if (value === 'confirm') {
      return
    }
    if (inputValue.includes('.') && value === '.') {
      return
    }
    if (inputValue?.split('.')[1]?.length === 2) {
      showToast({
        title: '最多支持小数点后两位',
        icon: 'none'
      })
      return
    }
    if (+(inputValue + value) > 100000) {
      showToast({
        title: '金额不能超过十万',
        icon: 'none'
      })
      return
    }
    setInputValue(val => val + value)
  }, [inputValue])

  const addConfirm = useCallback(() => {
    if (inputValue === '') {
      showToast({
        title: '请输入金额',
        icon: 'none'
      })
      return
    }
    if (+inputValue === 0) {
      showToast({
        title: '金额不能为0',
        icon: 'none'
      })
      return
    }
    if (selectType === '') {
      showToast({
        title: '请选择类型',
        icon: 'none'
      })
      return
    }
    switchTab({
      url: '/pages/index/index'
    })
  }, [inputValue])

  return (
    <View className="add-container">
      <View className={`add-header ${type}`} />
      <View className="add-content">
        <View className="add-content-top">
          <View className="top-info">
            <View className="add-button-group">
              {Object.keys(TYPE)?.map((item, index) => (
                <View
                  className={`add-button-group-item ${type === TYPE[item] ? type : ''}`}
                  data-value={TYPE[item]}
                  key={index}
                  onClick={() => setType(TYPE[item])}
                >
                  {item}
                </View>
              ))}
            </View>
            <View className="add-date-picker">
              {dayjs().format('M月DD日')}
            </View>
          </View>
          <View className="top-input-content">
            <View className="top-input-prefix">¥</View>
            <View className="top-input">
              {inputValue}
            </View>
          </View>
          <View className="input-content-divide" />
        </View>
        <View className="add-content-middle">
          {SELECT_TYPES[type]?.map((item, index) => (
            <View
              className="type-item"
              key={item.name + index}
            >
              <View
                className={`type-text ${selectType === item.name ? type : ''}`}
                onClick={() => setSelectType(item.name)}
              >
                {item.name}
              </View>
            </View>
          ))}
        </View>
        <View className="add-content-bottom">
          <View className="keyboard" onClick={(e: ITouchEvent) => keyBoardClick(e.target?.dataset?.value)}>
            <View className="key" data-value="1">1</View>
            <View className="key" data-value="2">2</View>
            <View className="key" data-value="3">3</View>
            <View className="key delete" data-value="delete">&lt;</View>
            <View className="key" data-value="4">4</View>
            <View className="key" data-value="5">5</View>
            <View className="key" data-value="6">6</View>
            <View className={`key confirm ${type}`} data-value="confirm" onClick={() => addConfirm()}>确定</View>
            <View className="key" data-value="7">7</View>
            <View className="key" data-value="8">8</View>
            <View className="key" data-value="9">9</View>
            <View className="key row-two" data-value="0">0</View>
            <View className="key" data-value=".">.</View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Add;