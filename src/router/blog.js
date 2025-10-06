const {
  getList,
  getBlogDetail,
  newblog,
  updateBlog,
  delBlog,
} = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');

const handleBlogRouter = (req, res) => {
  const method = req.method;
  const id = req.query.id || '';

  // 博客列表
  if (method === 'GET' && req.path === '/api/blog/list') {
    const author = req.query.author || '';
    const keyword = req.query.keyword || '';

    const result = getList(author, keyword);
    // 返回的promise
    return result.then((listData) => {
      return new SuccessModel(listData);
    });
  }

  // 博客详情
  if (method === 'GET' && req.path === '/api/blog/detail') {
    const detailData = getBlogDetail(id);
    return new SuccessModel(detailData);
  }

  // 新建一篇博客
  if (method === 'POST' && req.path === '/api/blog/new') {
    const data = newblog(req.body);
    return new SuccessModel(data);
  }

  // 更新一篇博客
  if (method === 'POST' && req.path === '/api/blog/update') {
    const response = updateBlog(id, req.body);
    if (!response) {
      return new ErrorModel('更新博客失败');
    }
    return new SuccessModel(data);
  }

  // 删除一篇博客
  if (method === 'DELETE' && req.path === '/api/blog/del') {
    const response = delBlog(id);
    if (!response) {
      return new ErrorModel('删除博客失败');
    }
    return new SuccessModel(response);
  }
};

module.exports = handleBlogRouter;
