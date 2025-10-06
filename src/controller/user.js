const { exec } = require('../db/mysql');

const loginCheck = (username, password) => {
  // 这里是模拟登录，实际项目中要查询数据库
  let sql = `SELECT username, realname FROM users WHERE username='${username}' AND password='${password}'`;

  // 返回 promise
  return exec(sql).then((rows) => {
    return rows[0] || {};
  });
};

module.exports = { loginCheck };
