const { loginCheck } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

const handlerUserRouter = (req, res) => {
  const method = req.method;

  // 登录
  if (method === 'POST' && req.path === '/api/user/login') {
    const { username, password } = req.body;

    const result = loginCheck(username, password);
    return result.then((data) => {
      if (!data.username) return new ErrorModel('登录失败');
      return new SuccessModel('登录成功');
    });
  }
};

module.exports = handlerUserRouter;
