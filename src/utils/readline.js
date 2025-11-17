const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 日志文件的完整路径: Users/mingyueliu/Documents/GitHub/BlogPlatform/logs/access.log
const fullFileName = path.join(__dirname, '../../logs', 'access.log');
// 创建读取流
const readStream = fs.createReadStream(fullFileName);
// 创建 readline 对象
const rl = readline.createInterface({ input: readStream });

let chromeNum = 0;
let totalSum = 0;

// 逐行读取日志文件
rl.on('line', (lineData) => {
  if (!lineData) return;
  // 总行数
  totalSum++;
  // 解析用户浏览器信息
  const arr = lineData.split('--');
  const userAgent = arr[2].trim();
  if (userAgent.indexOf('Chrome') > 0) {
    chromeNum++;
  }
});

// 读取结束
rl.on('close', () => {
  console.log('chrome 占比:', (chromeNum / totalSum) * 100 + '%');
});
