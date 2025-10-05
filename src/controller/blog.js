const getList = (author, keyword) => {
  return [
    {
      id: 1,
      title: '标题A',
      content: '内容A',
      createTime: 1617123456789,
      author: 'zhangsan',
    },
    {
      id: 2,
      title: '标题B',
      content: '内容B',
      createTime: 2617123456789,
      author: 'lisi',
    },
  ];
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
