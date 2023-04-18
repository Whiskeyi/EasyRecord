import { useEffect, useState, useCallback, memo, useMemo } from 'react'
import { View, Image, ITouchEvent } from '@tarojs/components'
import { showToast } from '@tarojs/taro'

import './index.less'

const Add = (props) => {
  const [inputValue, setInputValue] = useState<string>('')

  useEffect(() => {
    setInputValue('')
  }, [])

  const keyBoardClick = useCallback((value) => {
    if (!value) return
    if (value === '.' && inputValue === '') {
      setInputValue('0.')
      return
    }
    if (value === 'delete') {
      if (inputValue.length === 0) {
        setInputValue('')
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
    if (+inputValue > 999999.99) {
      showToast({
        title: '金额不能超过999999.99',
        icon: 'none'
      })
      return
    }
    setInputValue(val => val + value)
  }, [inputValue])

  const TypeItem = memo((props: {
    img: string,
    title: string
  }) => {
    const { img, title } = props;
    return useMemo(() => (
      <View className="type-item">
        <Image className="type-item-img" src={img} />
        <View className="type-item-title">{title}</View>
      </View>
    ), [img, title])
  })

  const typeItems = useMemo(() => new Array(30).fill(1).map((item, index) => (
    <TypeItem img="https://cloud.zhuchj.com/avatar.jpg" title="分类" key={index} />
  )), [])

  return (
    <View className="add-container">
      <View className="add-header" />
      <View className="add-content">
        <View className="add-content-top">
          <View className="top-info">
            <View className="add-button-group">
              <View className="add-button-group-item active">
                支出
              </View>
              <View className="add-button-group-item">
                收入
              </View>
              <View className="add-button-group-item">
                不计入收支
              </View>
            </View>
            <View className="add-date-picker">
              4月18日
            </View>
          </View>
          <View className="top-input-content">
            <View className="top-input-prefix">¥</View>
            <View className="top-input">
              {inputValue}
            </View>
          </View>
        </View>
        <View className="add-content-middle">
          {typeItems}
          <TypeItem img="https://cloud.zhuchj.com/avatar.jpg" title="管理" />
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
            <View className="key confirm" data-value="confirm">确定</View>
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