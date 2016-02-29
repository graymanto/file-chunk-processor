# File chunk processing

Reads through a file and every 'x' bytes of the file, runs a processing function to do something with the chunk that has been read.

Could be used for uploading a file in chunks for example.

The callback function is specified in the form

```javascript
function (dataReadBuffer, chunkIndex, bytesRead, totalFileSize) {...}
```

## Installation

```sh
npm install --save file-chunk-processor
```

## Usage
```javascript
const fp = require('file-chunk-processor');

const config = {
  filePath: 'bigvideo.mp4',
  chunkSize: 1024 * 1024 * 2, // 2 mb
  processingFunc: (dataReadBuffer, chunkIndex, bytesRead, totalFileSize) => {
    // do something with data in buffer
    }
};


fp.processFile(config)
  .then(() => {
    // Do something when file has been processed.
  })
  .catch(err => {...});

```

## Testing

```sh
npm test
```
