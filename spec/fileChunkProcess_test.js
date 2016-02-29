"use strict";

const fsp = require('fs-promise');
const testFile = 'spec/files/testfile.txt';
const fpm = require('../index');

describe('Checks processing of file chunks', () => {
  it('Checks all sections of file are correctly processed.', (done) => {
    let resultString = '';

    const config = {
      filePath: testFile,
      chunkSize: 1024 * 10, // 10 kb
      processingFunc: buffer => resultString += buffer.toString()
    };

    fpm.processFile(config)
      .then(() => fsp.readFile(testFile, 'utf8'))
      .then(fileContents => {
        expect(fileContents).toEqual(resultString);
        done();
      })
      .catch(err => {
        try {
          done.fail(err);
        } catch (err) {}
        done();
      });
  });
});
