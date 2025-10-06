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
  let sql = `SELECT * from blogs WHERE id='${id}' `;
  // 返回 promise
  return exec(sql).then((rows) => {
    return rows[0];
  });
};

const newBlog = (blogData = {}) => {
  let sql = `INSERT INTO blogs (title, content, author, createtime) VALUES ('${
    blogData.title
  }', '${blogData.content}', '${blogData.author}', ${Date.now()})`;

  // 返回 promise
  return exec(sql).then((insertData) => {
    // insertData 是插入数据后的对象，包含 insertId 属性
    console.log('insertData is ', insertData);
    return {
      id: insertData.insertId, // 新建博客，插入到数据表里的 id
    };
  });
};

const updateBlog = (id, blogData = {}) => {
  let sql = `UPDATE blogs SET title='${blogData.title}', content='${blogData.content}' WHERE id=${id}`;

  // 返回 promise
  return exec(sql).then((updateData) => {
    // updateData 是更新数据后的对象，包含 affectedRows 属性
    console.log('updateData is ', updateData);
    if (updateData.affectedRows > 0) return true; // 更新成功
    return false; // 更新失败
  });
};

const delBlog = (id) => {
  let sql = `DELETE FROM blogs WHERE id=${id}`;

  // 返回 promise
  return exec(sql).then((delData) => {
    // delData 是删除数据后的对象，包含 affectedRows 属性
    console.log('delData is ', delData);
    if (delData.affectedRows > 0) return true; // 删除成功
    return false; // 删除失败
  });
};

module.exports = {
  getList,
  getBlogDetail,
  newBlog,
  updateBlog,
  delBlog,
};
