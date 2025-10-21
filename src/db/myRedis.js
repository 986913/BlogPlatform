const redis = require('redis');
const { REDIS_CONF } = require('../config/db');

let redisClient;
!(async () => {
  // 创建 Redis 客户端
  redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);

  // 连接
  await redisClient
    .connect()
    .then(() => {
      console.log('Redis client connected');
    })
    .catch((err) => {
      console.error('Redis connection error:', err);
    });
})();

// set
async function set(key, val) {
  let value = val;
  if (typeof val === 'object') {
    value = JSON.stringify(val);
  }
  await redisClient.set(key, value);
}
// get
async function get(key) {
  const res = await redisClient.get(key);
  if (res == null) return null;
  try {
    return JSON.parse(res);
  } catch (err) {
    return res;
  }
}

module.exports = {
  set,
  get,
};
