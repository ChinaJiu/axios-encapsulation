const http = require('http');
const host = '127.0.0.1';
const port = '8889';
const app = require('./router'); // 引入router.js文件

const server = http.createServer(app);

app.get('/api/list', (req, res) => {
  setTimeout(function() {
    console.log('/api/list');
    res.end('查询列表接口响应')
  }, 2000)

  // setTimeout(() => {
  //   res.end();
  // },  150000)

  // res.statusCode = 302;
  // res.end('重定向');

  // res.statusCode = 400;
  // res.end('请求参数错误');
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
