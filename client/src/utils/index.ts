/**
 * 根据类型判断是收入还是支出, 返回对应的前缀字符
 * @param type income | expend | none
 * @returns prefix char
 */
export const judgeType2PrefixChar = (type: string) => {
  if (!type) return;
  const typeCharMap = {
    income: '+',
    expend: '-',
    none: ''
  }
  return typeCharMap[type]
}