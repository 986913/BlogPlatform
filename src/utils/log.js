const fs = require('fs');
const path = require('path');

// 生成 Write Stream 对象
function createWriteStream(fileName) {
  const fullFileName = path.join(__dirname, '../../logs', fileName); // 日志文件的完整路径: Users/mingyueliu/Documents/GitHub/BlogPlatform/logs/access.log
  // 使用流式写入, 写入文件的stream对象
  const writeStream = fs.createWriteStream(fullFileName, { flags: 'a' }); // 'a' 代表 append，追加写入
  return writeStream;
}

// 写日志, 往哪里写？-> 写入流对象writeStream; 写什么？-> 日志内容log
function writeLog(writeStream, log) {
  writeStream.write(log + '\n'); //通过.write方法写入内容
}

// 写access访问日志
const accessWriteStream = createWriteStream('access.log');
function access(logContent) {
  // 写日志, 往哪里写？-> 写入流对象writeStream; 写什么？-> 日志内容logContent
  writeLog(accessWriteStream, logContent);
}

module.exports = {
  access,
};
