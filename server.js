var restify = require("restify");
const {
  uploadByUrl
} = require("./uploader");

function respond(req, res, next) {
  //console.log("query is ", req.query);
  //console.log("getquery is ", req.getQuery());
  //console.log("params is ", req.params);
  if (req.getQuery() == '') {
    const response = {
      ok: false,
      result: {}
    }
    res.send(response);
    next();
  } else {
    var url = Buffer.from(req.getQuery(), 'base64').toString('utf-8');
    console.log("url is", url);
    url = decodeURIComponent(url);
    console.log("url is", url);
    uploadByUrl(url)
      .then(result => {
        console.log(result);
        /* {
           link: 'https://telegra.ph/file/...',
           path: '/file/...',
         } */
        const response = {
          ok: true,
          result: {
            link: result.link,
            src: url
          }
        };
        res.send(response);
        next();
      })
      .catch(err => {
        const response = {
          ok: false,
          result: {}
        };
        res.send(response);
        next();
      });
  }
}

var server = restify.createServer();
server.use(restify.plugins.queryParser());

//server.get("/fetch/:url", respond);
//server.head("/fetch/:url", respond);

server.post("/byurl:url", respond);

server.listen(42215, function() {
  console.log("Telegram uploader listening at %s", server.url);
});