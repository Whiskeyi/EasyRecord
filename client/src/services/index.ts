import Taro from '@tarojs/taro'

import { baseUrl } from '../config'

const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  CLIENT_ERROR: 400,
  AUTHENTICATE: 301,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
}

const logError = (name, action, info?) => {
  if (!info) {
    info = 'empty'
  }
  let deviceInfo = Taro.getSystemInfoSync()
  let device = JSON.stringify(deviceInfo)
  console.error(name, action, info, device)
}

export default {
  baseOptions(params, method = 'GET') {
    let { url, data } = params
    let contentType = 'application/json'
    contentType = params.contentType || contentType
    type OptionType = {
      url: string,
      data?: object | string,
      method?: any,
      header: object,
      // mode: string,
      success: any,
      error: any,
      xhrFields: object,
    }
    const setCookie = (res: {
      cookies: Array<{
        name: string,
        value: string,
        expires: string,
        path: string
      }>,
      header: {
        'Set-Cookie': string
      }
    }) => {
      if (res.cookies && res.cookies.length > 0 && url.indexOf('login/cellphone') !== -1) {
        let cookies = '';
        res.cookies.forEach((cookie, index) => {
          // windows的微信开发者工具返回的是cookie格式是有name和value的,在mac上是只是字符串的
          if (cookie.name && cookie.value) {
            cookies += index === res.cookies.length - 1 ? `${cookie.name}=${cookie.value};expires=${cookie.expires};path=${cookie.path}` : `${cookie.name}=${cookie.value};`
          } else {
            cookies += `${cookie}`
          }
        });
        Taro.setStorageSync('cookies', cookies)
      }
    }
    data = {
      ...data,
      timestamp: new Date().getTime(),
      cookie: Taro.getStorageSync('cookies')
    }
    const option: OptionType = {
      url: url.indexOf('http') !== -1 ? url : baseUrl + url,
      data: data,
      method: method,
      header: {
        'content-type': contentType,
        'token': Taro.getStorageSync('token'),
        cookie: Taro.getStorageSync('cookies')
      },
      xhrFields: { withCredentials: true },
      success(res) {
        console.log('res', res)
        setCookie(res)
        if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
          return logError('api', '请求资源不存在')
        } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
          return logError('api', '服务端出现了问题')
        } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
          return logError('api', '没有权限访问')
        } else if (res.statusCode === HTTP_STATUS.AUTHENTICATE) {
          Taro.clearStorage()
          Taro.navigateTo({
            url: '/pages/login/index'
          })
          return logError('api', '请先登录')
        } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
          return res.data
        }
      },
      error(e) {
        logError('api', '请求接口出现问题', e)
      }
    }
    return Taro.request(option)
  },

  get(url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option)
  },
  post: function (url, data?: object, contentType?: string) {
    let params = { url, data, contentType }
    return this.baseOptions(params, 'POST')
  },
  put(url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option, 'PUT')
  },
  delete(url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option, 'DELETE')
  }
}
