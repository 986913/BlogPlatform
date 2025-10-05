const loginCheck = (username, password) => {
  if (username === 'admin' && password === '123') {
    return true;
  }
  return false;
};

module.exports = { loginCheck };
