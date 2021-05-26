var http = require('http');
var fs = require('fs');
var url = require('url');
var chat = require('./chat');

var server = http.createServer(function (req, res) {
  var urlParsed = url.parse(req.url);

  switch (urlParsed.pathname) {
    case '/':
      sendFile("index.html", res);
      break;

    case '/subscribe':
      chat.subscribe(req, res);
      break;

    case '/publish':
      let body = '';
      req
        .on('readable', function () {
          let content;
          if (null !== (content = req.read())) {
            body += content;
          }
        })
        .on('end', function () {
          body = JSON.parse(body);
          chat.publish(body.message);
          res.end("ok");
        });

      break;

    default:
      res.statusCode = 404;
      res.end("Not found");
  }


}).listen(3000);

function sendFile(fileName, res) {
  var fileStream = fs.createReadStream(fileName);
  fileStream
    .on('error', function () {
      res.statusCode = 500;
      res.end("Server error");
    })
    .pipe(res)
    .on('close', function () {
      fileStream.destroy();
    });
}