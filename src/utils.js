const Downloader = require('nodejs-file-downloader');
const appRoot = require('app-root-path');
const { exec } = require('child_process');

const download = async (url, address, name) => {
  const downloader = new Downloader({
    url,
    directory: address,
    fileName: name,
  });
  await downloader.download();
};

const run = (command) => new Promise((done, failed) => {
  exec(command, (err, stdout, stderr) => {
    if (err) {
      failed(err);
    } else {
      done({
        stdout,
        stderr,
      });
    }
  });
});

module.exports.download = download;
module.exports.run = run;
module.exports.appRoot = appRoot;
