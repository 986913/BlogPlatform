const { exec, escape } = require('../db/mysql');

const login = (username, password) => {
  username = escape(username); // 防止 SQL 注入
  password = escape(password); // 防止 SQL 注入

  let sql = `SELECT username, realname FROM users WHERE username=${username} AND password=${password}`;
  // console.log('执行的 SQL 语句:', sql);
  // 返回 promise
  return exec(sql).then((rows) => {
    return rows[0] || {};
  });
};

module.exports = { login };
