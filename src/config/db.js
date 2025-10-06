const env = process.env.NODE_ENV; // 环境变量

// 配置mysql
let MYSQL_CONF;

if (env === 'dev') {
  MYSQL_CONF = {
    host: 'localhost', // 数据库地址
    user: 'root', // 数据库用户名
    password: 'moremoney888', // 数据库密码
    database: 'myblog', // 连接的数据库名称
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
}

module.exports = {
  MYSQL_CONF,
};
