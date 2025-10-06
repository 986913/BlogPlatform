const { exec } = require('../db/mysql');

const getList = (author, keyword) => {
  let sql = `SELECT * from blogs WHERE 1=1 `;
  if (author) sql += `AND author='${author}' `;
  if (keyword) sql += `AND title LIKE '%${keyword}%' `;
  sql += `ORDER BY createtime DESC;`;

  // 返回 promise
  return exec(sql);
};

const getBlogDetail = (id) => {
  return {
    id: 1,
    title: '标题A',
    content: '内容A',
    createTime: 1617123456789,
    author: 'zhangsan',
  };
};

const newblog = (blogData = {}) => {
  // blogData 是一个博客对象，包含 title content 属性
  // console.log('new blog', blogData);
  return {
    id: 3, // 新建博客，插入到数据表里的 id
  };
};

const updateBlog = (id, blogData = {}) => {
  // 更新博客，id 就是要更新的博客的 id
  // console.log('update blog', id, blogData);
  return true; // 成功返回 true，失败返回 false
};

const delBlog = (id) => {
  // 删除博客，id 就是要删除的博客的 id
  return true; // 成功返回 true，失败返回 false
};

module.exports = {
  getList,
  getBlogDetail,
  newblog,
  updateBlog,
  delBlog,
};
