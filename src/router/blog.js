const {
  getList,
  getBlogDetail,
  newBlog,
  updateBlog,
  delBlog,
} = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');

// 统一的登陆验证函数
const loginCheck = (req) => {
  if (!req.session.username) {
    return Promise.resolve(new ErrorModel('还未登录'));
  }
};

const handleBlogRouter = (req, res) => {
  const method = req.method;
  const id = req.query.id || '';

  // 博客列表
  if (method === 'GET' && req.path === '/api/blog/list') {
    let author = req.query.author || '';
    const keyword = req.query.keyword || '';
    const isadmin = req.query.isadmin || '';

    // 管理员界面
    if (isadmin === '1') {
      // 管理员界面一定要验证登陆
      const loginCheckResult = loginCheck(req);
      if (loginCheckResult) return loginCheckResult; // 未登录
      // 强制查询自己的博客
      author = req.session.username;
    }

    const result = getList(author, keyword);
    // 返回的promise
    return result.then((listData) => {
      return new SuccessModel(listData);
    });
  }

  // 博客详情
  if (method === 'GET' && req.path === '/api/blog/detail') {
    const result = getBlogDetail(id);
    return result.then((detailData) => {
      return new SuccessModel(detailData);
    });
  }

  // 新建一篇博客
  if (method === 'POST' && req.path === '/api/blog/new') {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult;
    }

    req.body.author = req.session.username; // 给 req.body 添加 author 属性
    const result = newBlog(req.body);
    return result.then((data) => {
      return new SuccessModel(data);
    });
  }

  // 更新一篇博客
  if (method === 'POST' && req.path === '/api/blog/update') {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult;
    }

    const result = updateBlog(id, req.body);
    return result.then((data) => {
      if (!data) return new ErrorModel('更新博客失败');
      return new SuccessModel(data);
    });
  }

  // 删除一篇博客
  if (method === 'POST' && req.path === '/api/blog/del') {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult;
    }

    const author = req.session.username;
    const result = delBlog(id, author);
    return result.then((response) => {
      if (!response) return new ErrorModel('删除博客失败');
      return new SuccessModel(response);
    });
  }
};

module.exports = handleBlogRouter;
