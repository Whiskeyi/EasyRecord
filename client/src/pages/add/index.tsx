import { useState, useCallback, useRef } from 'react'
import dayjs from 'dayjs'
import { View, ITouchEvent, Input } from '@tarojs/components'
import Taro, { showToast, useDidShow, switchTab, useDidHide } from '@tarojs/taro'

import useLock from '@/hooks/useLock'

import { SELECT_TYPES } from './constant'

import './index.less'

const TYPE = {
  '支出': 'expend',
  '收入': 'income',
  '不计入收支': 'none'
}

const Add = (props) => {

  const [type, setType] = useState<'expend' | 'income' | 'none'>(TYPE['支出'] as 'expend');
  const [amountType, setAmountType] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isLock, setLock] = useLock(false);

  const inputRef = useRef<any>()

  const clearData = useCallback(() => {
    setType('expend')
    setAmount('')
    setAmountType('')
    inputRef.current.value = ''
  }, [])

  useDidShow(() => {
    if (Taro.getStorageSync('recordId')) {
      dataReBack()
    } else {
      clearData()
    }
  })

  useDidHide(() => {
    Taro.removeStorageSync('recordId')
  })

  const dataReBack = useCallback(() => {
    Taro.cloud.callFunction({
      name: 'getRecordDetail',
      data: {
        recordId: Taro.getStorageSync('recordId')
      }
    }).then((res: any) => {
      const { type, amountType, amount, remark } = res?.result?.data
      setType(type)
      setAmountType(amountType)
      setAmount(amount.toString())
      inputRef.current.value = remark
    }).catch(() => {
      showToast({
        title: '获取数据失败',
        icon: 'none'
      })
    })
  }, [])

  const keyBoardClick = useCallback((value) => {
    if (!value) return
    if (value === '.' && amount === '') {
      setAmount('0.')
      return
    }
    if (value === 'delete') {
      if (amount.length === 0) {
        return
      }
      setAmount(val => val?.slice(0, -1))
      return
    }
    if (value === 'confirm') {
      return
    }
    if (amount?.includes('.') && value === '.') {
      return
    }
    if (amount?.split('.')[1]?.length === 2) {
      showToast({
        title: '最多支持小数点后两位',
        icon: 'none'
      })
      return
    }
    if (+(amount + value) > 100000) {
      showToast({
        title: '金额不能超过十万',
        icon: 'none'
      })
      return
    }
    setAmount(val => val + value)
  }, [amount, inputRef.current?.value])

  const preValidate = useCallback(() => {
    if (amount === '') {
      showToast({
        title: '请输入金额',
        icon: 'none'
      })
      return false
    }
    if (+amount === 0) {
      showToast({
        title: '金额不能为0',
        icon: 'none'
      })
      return false
    }
    if (amountType === '') {
      showToast({
        title: '请选择类型',
        icon: 'none'
      })
      return false
    }
    return true
  }, [amount, amountType])

  const updateRecord = useCallback(() => {
    Taro.cloud.callFunction({
      name: 'updateRecord',
      data: {
        recordId: Taro.getStorageSync('recordId'),
        type,
        amountType,
        amount: +amount,
        remark: inputRef.current?.value
      }
    }).then(() => {
      clearData()
      switchTab({
        url: '/pages/index/index'
      })
    }).catch(() => {
      showToast({
        title: '更新失败',
        icon: 'none'
      })
    }).finally(() => {
      setLock(false)
    })
  }, [amount, amountType, type, inputRef.current?.value])

  const addConfirm = useCallback(() => {
    if (isLock()) return
    setLock(true)

    if (!preValidate()) {
      setLock(false)
      return
    }

    if (Taro.getStorageSync('recordId')) {
      updateRecord()
      return
    }

    Taro.cloud.callFunction({
      name: 'addOneRecord',
      data: {
        type,
        amountType,
        amount: +amount,
        recordTime: dayjs().valueOf(),
        remark: inputRef.current?.value
      }
    }).then(() => {
      clearData()
      switchTab({
        url: '/pages/index/index'
      })
    }).catch(err => {
      console.error(err)
      showToast({
        title: '添加失败',
        icon: 'none'
      })
    }).finally(() => {
      setLock(false)
    })
  }, [amount, amountType, type, inputRef.current?.value])

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
                  onClick={() => {
                    if (type === TYPE[item]) return
                    setType(TYPE[item])
                  }}
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
              {amount}
            </View>
          </View>
          <View className="input-content-divide" />
        </View>
        <View className="add-content-middle">
          <View className="type-items">
            {SELECT_TYPES[type]?.map((item, index) => (
              <View
                className="type-item"
                key={item.name + index}
              >
                <View
                  className={`type-text ${amountType === item.name ? type : ''}`}
                  onClick={() => {
                    if (amountType === item.name) return
                    setAmountType(item.name)
                  }}
                >
                  {item.name}
                </View>
              </View>
            ))}
          </View>
          <View className="input-container">
            <View className="input-prefix">备注：</View>
            <Input className="middle-input" ref={inputRef} />
          </View>
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