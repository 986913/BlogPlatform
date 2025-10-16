const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

const handlerUserRouter = (req, res) => {
  const method = req.method;

  // 登录
  if (method === 'GET' && req.path === '/api/user/login') {
    const { username, password } = req.query;

    const result = login(username, password);
    return result.then((data) => {
      if (!data.username) return new ErrorModel('登录失败');

      // 登录成功，设置 session
      req.session.username = data.username;
      req.session.realname = data.realname;
      console.log('req.session is', req.session);
      return new SuccessModel(
        `${data.username} 登录成功,session已设置: ${JSON.stringify(
          req.session
        )}`
      );
    });
  }

  // 登陆验证测试
  if (method === 'GET' && req.path === '/api/user/login-test') {
    if (req.session.username) {
      return Promise.resolve(
        new SuccessModel(`已登录,session已设置: ${JSON.stringify(req.session)}`)
      );
    } else {
      return Promise.resolve(new ErrorModel('未登录'));
    }
  }
};

module.exports = handlerUserRouter;
