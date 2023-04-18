import React, { useState } from 'react';
import { View, Input, Button }  from '@tarojs/components';

function NumberInput() {
  const [value, setValue] = useState('');

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  const handleDeleteClick = () => {
    setValue(value.slice(0, -1));
  };

  const handleConfirmClick = () => {
    // 处理确定按钮点击事件
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleConfirmClick();
    }
  };

  return (
    <View className="number-input">
      <Input
        type="text"
        value={value}
      />
      <Button onClick={handleDeleteClick}>删除</Button>
      <Button onClick={handleConfirmClick}>确定</Button>
    </View>
  );
}

export default NumberInput;