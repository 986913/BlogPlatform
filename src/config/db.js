const env = process.env.NODE_ENV; // 环境变量

// 配置mysql和redis
let MYSQL_CONF;
let REDIS_CONF;

if (env === 'dev') {
  MYSQL_CONF = {
    host: 'localhost', // 数据库地址
    user: 'root', // 数据库用户名
    password: 'moremoney888', // 数据库密码
    database: 'myblog', // 连接的数据库名称
  };
  REDIS_CONF = {
    host: '127.0.0.1', // redis 地址
    port: 6379, // redis 端口
  };
}

if (env === 'productiogn') {
  // 暂时写dev一样的配置, 需要改成线上的数据库
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'moremoney888',
    database: 'myblog',
  };
  // 暂时写dev一样的配置, 需要改成线上的Redis;
  REDIS_CONF = {
    host: '127.0.0.1',
    port: 6379,
  };
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF,
};
