import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'

const pendingMap = new Map();
const LoadingInstance = {
  _target: null,
  _count: 0
}

function myAxios(config, customOption, loadingOptions) {
  
  const service = axios.create({
    baseURL: 'http://127.0.0.1:3000',
    timeout: 3000
  })

  let custom_options = Object.assign({
    repeat_request_cancel: true,
    loading: false,
    error_message_show: true
  }, customOption)

  service.interceptors.request.use(
    config => {
      removePending(config)
      custom_options.repeat_request_cancel && addPendingKey(config)
      if(custom_options.loading) {
        LoadingInstance._count++
        if(LoadingInstance._count == 1) {
          LoadingInstance._target = ElLoading.service(loadingOptions)
        }
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  service.interceptors.response.use(
    response => {
      removePending(response.config)
      custom_options.loading && closeLoading(custom_options)
      return response
    },
    error => {
      error.config && removePending(error.config)
      custom_options.loading && closeLoading(custom_options)
      custom_options.error_message_show && httpErrorStatusHandle(error)
      return Promise.reject(error)
    }
  )

  /**
   * 关闭Loading层实例
   * @param {*} _options 
   */
  function closeLoading(_options) {
    
    if(_options.loading && LoadingInstance._count > 0) LoadingInstance._count--;
    if(LoadingInstance._count === 0) {
      LoadingInstance._target.close();
      LoadingInstance._target = null;
    }
  }

  return service(config)
}

/**
 * 处理异常
 * @param {*} error 
 */
function httpErrorStatusHandle(error) {
  if(axios.isCancel(error)) return console.error('请求的重复请求：' + error.message);
  let message = '';
  if (error && error.response) {
    switch(error.response.status) {
      case 302: message = '接口重定向了！';break;
      case 400: message = '参数不正确！';break;
      case 401: message = '您未登录，或者登录已经超时，请先登录！';break;
      case 403: message = '您没有权限操作！'; break;
      case 404: message = `请求地址出错: ${error.response.config.url}`; break; // 在正确域名下
      case 408: message = '请求超时！'; break;
      case 409: message = '系统已存在相同数据！'; break;
      case 500: message = '服务器内部错误！'; break;
      case 501: message = '服务未实现！'; break;
      case 502: message = '网关错误！'; break;
      case 503: message = '服务不可用！'; break;
      case 504: message = '服务暂时无法访问，请稍后再试！'; break;
      case 505: message = 'HTTP版本不受支持！'; break;
      default: message = '异常问题，请联系管理员！'; break
    }
  }
  if (error.message.includes('timeout')) message = '网络请求超时！';
  if (error.message.includes('Network')) message = window.navigator.onLine ? '服务端异常！' : '您断网了！';

  ElMessage({
    type: 'error',
    duration: '1000',
    message
  })

}

/**
 * 生成每个请求唯一的键
 * @param {*} config 
 * @returns string
 */
function getPendingKey(config) {
  const { url, method, params, data } = config
  let _data = ''
  if(typeof data === 'string') _data = JSON.parse(data); 
  return [url, method, JSON.stringify(params), JSON.stringify(_data)].join('&');
}

/**
 * 储存每个请求唯一值, 也就是cancel()方法, 用于取消请求
 * @param {*} config 
 */
function addPendingKey(config) {
  const pendingKey = getPendingKey(config)
  config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
    if(!pendingMap.has(pendingKey)) {
      pendingMap.set(pendingKey, cancel)
    }
  })
}

/**
 * 删除重复的请求
 * @param {*} config 
 */
function removePending(config) {
  const pendingKey = getPendingKey(config)
  if(pendingMap.has(pendingKey)) {
    const cancelToken = pendingMap.get(pendingKey) 
    cancelToken(pendingKey)
    pendingMap.delete(pendingKey)
  }
}
export default myAxios;
