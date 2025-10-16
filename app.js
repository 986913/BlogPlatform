const handleBlogRouter = require('./src/router/blog');
const handlerUserRouter = require('./src/router/user');
const querystring = require('querystring');

// 获取cookie的过期时间
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000); // 24小时
  return d.toGMTString();
};

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

// session 数据
const SESSION_DATA = {};

const serverHandler = (req, res) => {
  // 设置返回格式为 JSON
  res.setHeader('Content-Type', 'application/json');

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
  // 解析 session
  let needSetCookie = false;
  let userId = req.cookie.userid;
  if (userId) {
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {};
    }
    req.session = SESSION_DATA[userId];
  } else {
    needSetCookie = true;
    // 如果没有 userId，说明是第一次访问，需要设置session和cookie
    userId = `${Date.now()}_${Math.random()}`;
    SESSION_DATA[userId] = {};
    req.session = SESSION_DATA[userId];
  }

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

    // 未命中任何路由，返回 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('404 Not Found\n');
    res.end();
  });
};

module.exports = serverHandler;
