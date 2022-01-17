import myAxios from './axios'

export function getListApi(param) {
  return myAxios({
    url: '/api/list',
    method: 'get',
    data: param
  }, 
  {
    repeat_request_cancel: true,
    loading: true
  },
  {
    fullscreen: true,
    target: '.loading'
  })
}