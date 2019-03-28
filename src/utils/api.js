import wepy from 'wepy'

// 服务器接口地址
const host = 'https://www.phpzc.net/api'

const request = async (options, showLoading = true) => {
  // 简化开发，如果传入字符串则转换成 对象
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }
  // 显示加载中
  if (showLoading) {
    wepy.showLoading({title: '加载中'})
  }

  // 拼接请求地址
  options.url = host + '/' + options.url
  console.log(options.url)
  // 调用小程序的 request 方法
  let response = await wepy.request(options)

  if (showLoading) {
    // 隐藏加载中
    wepy.hideLoading()
  }
  // 服务器异常后给与提示
  if (response.statusCode === 500) {
    wepy.showModal({
      title: '提示',
      content: '服务器错误，请联系管理员或重试'
    })
  }
  return response
}

// 登录
const login = async (params = {}) => {
  let loginData = await wepy.login()

  params.code = loginData.code

  // 请求接口 weapp/authorizations
  let authResponse = await request({
    url: 'weapp/authorizations2',
    data: params,
    method: 'POST'
  })

  if (authResponse.statusCode === 201) {
    wepy.setStorageSync('access_token', authResponse.data.access_token)
    wepy.setStorageSync('access_token_expired_at', new Date().getTime() + authResponse.data.expires_in * 1000)
  }

  return authResponse
}

const about = async () => {
  let aboutResponse = await request({
    url: 'about',
    method: 'GET'
  })

  if (aboutResponse.statusCode === 200) {
    wepy.setStorageSync('api.about', aboutResponse.data)
  }

  return aboutResponse
}

export default {
  request,
  login,
  about
}
