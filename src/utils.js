const Downloader = require('nodejs-file-downloader');


const download = async (url, address, name) => {
  const downloader = new Downloader({
    url,
    directory: address,
    fileName: name,
  });
  await downloader.download();
};

module.exports.download = download;
