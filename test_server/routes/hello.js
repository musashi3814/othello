var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', (_, res) => {
  // HTMLファイルのパスを指定
  console.log('hello');
  const htmlFilePath = path.join(__dirname, "../",'public', 'hello.html');

  // HTMLファイルを読み込み、その内容をレスポンスとして送信
  fs.readFile(htmlFilePath, 'utf8', (err, data) => {
      if (err) {
          // エラーハンドリング
          console.error('HTMLファイルの読み込みエラー:', err);
          res.status(500).send('Internal Server Error');
      } else {
          // HTMLファイルの内容をクライアントに送信
          res.send(data);
      }
  });
});

module.exports = router;
