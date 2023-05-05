export interface UserInfo {
  /** 用户头像 */
  avatar?: string;
  /** 用户简介 */
  intro?: string;
  /** 用户名称 */
  username?: string;
  /** 注册时间 */
  registerTime?: string;
  /** 记账次数 */
  recordCount?: number;
  /** 连续记账 */
  continueRecord?: number;
}

export interface RecordDetail {
  /** 记录id */
  _id: string;
  /** 记录金额 */
  amount: number;
  /** 记录分类 */
  amountType: string;
  /** 记录时间 */
  recordTime: string;
  /** 记录备注 */
  remark: string;
  /** 记录类型 */
  type: 'income' | 'expend' | 'none';
  /** 记录用户id */
  openid: string;
  /** 更新时间 */
  updateTime: string;
}