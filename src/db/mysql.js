const mysql = require('mysql2');
const { MYSQL_CONF } = require('../config/db');

// 创建连接对象
const connection = mysql.createConnection(MYSQL_CONF);

// 连接数据库
connection.connect((err) => {
  if (err) {
    console.log('连接数据库失败:', err);
    return;
  }
  console.log('成功连接到数据库');
});

// 统一 执行 SQL 语句的函数
function exec(sql) {
  const promise = new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
    });
  });
  // 返回 promise
  return promise;
}

// 导出连接对象
module.exports = {
  exec,
  escape: mysql.escape, // 导出 mysql自带带 escape 方法，用于防止 SQL 注入
};
