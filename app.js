const serverHandler = (req, res) => {
  res.statusCode = 200;

  // 设置返回格式为 JSON
  res.setHeader('Content-Type', 'application/json');

  const responseData = {
    name: 'Blog Platform',
    version: '1.0.0',
    env: process.env.NODE_ENV,

    // 下面这些信息可以帮助我们调试
    // method: req.method,
    // url: req.url,
    // headers: req.headers,
  };
  // 设置返回内容
  res.end(JSON.stringify(responseData));
};

module.exports = serverHandler;
