const { appendFile } = require('fs');

const logAddress = './logs/info.log';

async function log(message) {
  return new Promise((resolve, reject) => {
    const str = JSON.stringify(message);
    appendFile(logAddress, `${str} \n`, (err) => {
      if (err) {
        reject(err);
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.log(str);
        }
        resolve();
      }
    });
  });
}

module.exports.log = log;
