"use strict";

const fsp = require('fs-promise');
const _ = require('lodash');

function processFile(config) {
  if (!config) {
    throw new Error('Configuration for file processor must be passed in.');
  }
  if (!config.filePath) {
    throw new Error('Path of file to be processed must be specified.');
  }
  if (!config.chunkSize) {
    throw new Error('Size of file chunk to process must be specified');
  }
  if (!config.processingFunc) {
    throw new Error('A function to run on each file chunk must be specified.');
  }

  let fd;
  let size = 0;

  return fsp.open(config.filePath, 'r')
    .then(fileHandle => {
      fd = fileHandle;
      return fsp.stat(config.filePath);
    })
    .then(stats => {
      size = stats.size;
      return Math.ceil(stats.size / config.chunkSize);
    })
    .then(chunkNumbers => {
      let perChunkProcessing = _.times(chunkNumbers, (index) => {
        const buffer = new Buffer(config.chunkSize);
        const position = index * config.chunkSize;

        return fsp.read(fd, buffer, 0, config.chunkSize, position)
          .then((bytesRead) => {
            const uploadBuff = bytesRead === config.chunkSize ? buffer : buffer.slice(0, bytesRead);
            return config.processingFunc(uploadBuff, index, bytesRead, size);
          });
      });

      return Promise.all(perChunkProcessing);
    });
}

module.exports = {
  processFile: processFile,
};
