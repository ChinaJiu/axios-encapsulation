import myAxios from './axios';

export function login(param) {
  return myAxios({
    url: '/api/login',
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [
      (data) => {
        let result = ''
        for (let key in data) {
          result += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&'
        }
        return result.slice(0, result.length - 1)
      }
    ]
  });
}
