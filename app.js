const handleBlogRouter = require('./src/router/blog');
const handlerUserRouter = require('./src/router/user');
const querystring = require('querystring');
const { get, set } = require('./src/db/myRedis');
const { access } = require('./src/utils/log');

// 获取cookie的过期时间
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000); // 24小时
  return d.toGMTString();
};

// 用于处理 post data
/**
 * Parse JSON body from POST / PUT HTTP requests's body
 * @param {IncomingMessage} req - Node.js HTTP request object
 * @returns {Promise<Object>} A Promise that resolves to parsed JSON object
 *
 * @example
 * getPostData(req).then(body => {
 *   console.log(body);
 *   // If request body is: { "name": "Mingyue", "age": 25 }
 *   // Then body will be: { name: "Mingyue", age: 25 }
 * });
 */
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
  // 记录 access 日志 (使用自己写的log模块)
  access(
    `${req.method} -- ${req.url} -- ${
      req.headers['user-agent']
    } -- ${Date.now()}`
  );

  // 设置返回格式为 JSON
  res.setHeader('Content-Type', 'application/json');

  /*************** 实现跨域 *************** /
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 允许跨域传递cookie
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*'); // 允许跨域的origin, *代表允许所有，谨慎使用
  // 允许的请求方法
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  /*****************************************/

  const url = req.url;
  // 获取路径
  req.path = url.split('?')[0];
  // 解析 query
  req.query = querystring.parse(url.split('?')[1]);

  // 解析cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || ''; //eg: k1=v1;k2=v2;k3=v3
  cookieStr.split(';').forEach((item) => {
    if (!item) return;
    const arr = item.split('=');
    const key = arr[0].trim();
    const val = arr[1].trim();
    req.cookie[key] = val;
  });
  console.log('req.cookie is', req.cookie);

  // 解析 session (使用redis解析)
  let needSetCookie = false;
  let userId = req.cookie.userid;
  // 如果没有 userId，说明是第一次访问，需要先设置cookie后设置session
  if (!userId) {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    // 初始化 redis 中的 session 值
    set(userId, {});
  }
  // 获取 session
  req.sessionId = userId;
  get(req.sessionId)
    .then((sessionData) => {
      if (sessionData == null) {
        // 初始化 redis 中的 session 值
        set(req.sessionId, {});
        // 设置session
        req.session = {};
      } else {
        req.session = sessionData;
      }
      console.log('redis中读取的, req.session is', req.session);
    })
    .then(() => {
      // 处理 post data
      getPostData(req).then((postData) => {
        req.body = postData;

        // 处理 blog 路由
        const result = handleBlogRouter(req, res);
        if (result) {
          result.then((blogData) => {
            if (needSetCookie) {
              res.setHeader(
                'Set-Cookie',
                `userid=${userId}; path=/; httpOnly; expire=${getCookieExpires()}` // httpOnly: 只能后端修改cookie
              ); // 设置 cookie
            }
            res.end(JSON.stringify(blogData));
          });
          return;
        }

        // 处理 user 路由
        const resultData = handlerUserRouter(req, res);
        if (resultData) {
          resultData.then((userData) => {
            if (needSetCookie) {
              res.setHeader(
                'Set-Cookie',
                `userid=${userId}; path=/; httpOnly; expire=${getCookieExpires()}` // httpOnly: 只能后端修改cookie
              ); // 设置 cookie
            }
            res.end(JSON.stringify(userData));
          });
          return;
        }

        // 测试跨域： 处理cors-test测试路由
        if (req.method === 'GET' && req.path === '/api/cors-test') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              errno: 0,
              message: '跨域请求测试成功！',
            })
          );
          return;
        }

        // 未命中任何路由，返回 404
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('404 Not Found\n');
        res.end();
      });
    });
};

module.exports = serverHandler;
