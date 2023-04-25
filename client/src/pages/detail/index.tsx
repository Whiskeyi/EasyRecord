import { View, Image } from "@tarojs/components";
import Taro, { useRouter, showLoading, hideLoading } from "@tarojs/taro";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { RecordDetail } from '@/types/user'
import { judgeType2PrefixChar } from "@/utils";
import ArrowRight from "@/assets/icons/arrow-right.png";

import "./index.less";

const CardDetail = () => {
  const {
    params: { recordId },
  } = useRouter();
  const [recordDetail, setRecordDetail] = useState<RecordDetail>();

  const handleDeleteRecord = () => {
    Taro.cloud.callFunction({
      name: "deleteRecordById",
      data: {
        recordId,
      },
    }).then((res) => {
      console.log(res)
      Taro.showToast({
        title: "删除成功",
        icon: "success",
      });
      Taro.navigateBack();
    });
  };

  useEffect(() => {
    showLoading({
      title: "加载中...",
    });
    Taro.cloud.callFunction({
      name: "getRecordDetail",
      data: {
        recordId,
      },
    }).then((res: any) => {
      setRecordDetail(res?.result?.data)
      hideLoading()
    });
  }, [recordId]);

  return recordDetail ? (
    <View className="card-detail-container">
      <View className="card-container">
        <View className="card-title">
          <View className="title-type">{recordDetail?.amountType}</View>
          <Image className="title-icon" src={ArrowRight} />
        </View>
        <View className="card-content">
          {judgeType2PrefixChar(recordDetail?.type as 'income')}{recordDetail?.amount}
        </View>
        <View className="card-items">
          <View className="card-item">
            <View className="item-title">记录时间</View>
            <View className="item-content">{dayjs(recordDetail?.recordTime).format('YYYY年M月D日 HH:mm')}</View>
          </View>
          {recordDetail?.remark ? (
            <View className="card-item">
              <View className="item-title">备注</View>
              <View className="item-content">{recordDetail?.remark}</View>
            </View>
          ) : null}
        </View>
        <View className="card-footer">
          <View
            className="btn del"
            onClick={() => {
              handleDeleteRecord()
            }}
          >
            删除
          </View>
          <View className="btn edit">编辑</View>
        </View>
      </View>
    </View>
  ) : null
}

export default CardDetail;