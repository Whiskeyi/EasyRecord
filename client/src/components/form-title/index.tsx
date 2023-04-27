import { FC } from "react";
import { View } from "@tarojs/components";

import './index.less';

interface IFormTitleProps {
  /** 样式透传 */
  style?: React.CSSProperties;
  /** 标题 */
  title: string;
}

const FormTitle: FC<IFormTitleProps> = ({
  style,
  title,
}) => {
  return <View className="form-title-container" style={style}>
    <View className="form-title">{title}</View>
  </View>;
}

export default FormTitle;