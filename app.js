const handleBlogRouter = require('./src/router/blog');
const handlerUserRouter = require('./src/router/user');
const querystring = require('querystring');

// 用于处理 post data
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST' && req.method !== 'PUT') {
      resolve({});
      return;
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({});
      return;
    }

    let postData = '';
    req.on('data', (chunk) => {
      postData += chunk.toString();
    });
    req.on('end', () => {
      if (!postData) {
        resolve({});
        return;
      }
      resolve(JSON.parse(postData));
    });
  });

  return promise;
};

const serverHandler = (req, res) => {
  // 设置返回格式为 JSON
  res.setHeader('Content-Type', 'application/json');

  const url = req.url;
  // 获取路径
  req.path = url.split('?')[0];
  // 解析 query
  req.query = querystring.parse(url.split('?')[1]);

  // 处理 post data
  getPostData(req).then((postData) => {
    req.body = postData;

    // 处理 blog 路由
    const result = handleBlogRouter(req, res);
    if (result) {
      result.then((blogData) => {
        res.end(JSON.stringify(blogData)); // 设置返回内容
      });
      return;
    }

    // 处理 user 路由
    const userData = handlerUserRouter(req, res);
    if (userData) {
      res.end(JSON.stringify(userData));
      return;
    }

    // 未命中任何路由，返回 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('404 Not Found\n');
    res.end();
  });
};

module.exports = serverHandler;
