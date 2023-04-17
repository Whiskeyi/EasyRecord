export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/my/index',
    'pages/statistics/index',
    'pages/add/index',
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
  }
})