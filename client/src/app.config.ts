export default defineAppConfig({
  pages: [
    // 首页
    'pages/index/index',
    'pages/detail/index',
    // 记一笔
    'pages/add/index',
    // 我的
    'pages/my/index',
    'pages/my/about-us/index',
    'pages/my/feedback/index',
    'pages/my/message-notice/index',
    'pages/my/self-info/index',
    // 登录
    'pages/login/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#bfbfbf',
    selectedColor: '#73d1a1',
    borderStyle: 'white',
    backgroundColor: '#fff',
    list: [
      {
        iconPath: 'assets/icons/index.png',
        selectedIconPath: 'assets/icons/index-choose.png',
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        iconPath: 'assets/icons/add.png',
        selectedIconPath: 'assets/icons/add.png',
        pagePath: 'pages/add/index',
        text: '记一笔'
      },
      {
        iconPath: 'assets/icons/my.png',
        selectedIconPath: 'assets/icons/my-choose.png',
        pagePath: 'pages/my/index',
        text: '我的'
      }
    ]
  },
  cloud: true
})