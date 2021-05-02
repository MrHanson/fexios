const fs = require('fs')
const cp = require('child_process')
const path = require('path')
const http = require('http')
let server
let dirs

function listDirs(root) {
  var files = fs.readdirSync(root)
  var dirs = []

  for (var i = 0, l = files.length; i < l; i++) {
    let file = files[i]
    if (file[0] !== '.') {
      var stat = fs.statSync(path.join(root, file))
      if (stat.isDirectory()) {
        dirs.push(file)
      }
    }
  }

  return dirs;
}

function getIndexTemplate() {
  var links = dirs.map(function (dir) {
    var url = '/' + dir;
    return '<li onclick="document.location=\'' + url + '\'"><a href="' + url + '">' + url + '</a></li>';
  });

  return (
    '<!doctype html>' +
    '<html>' +
    '<head>' +
    '<title>axios examples</title>' +
    '<style>' +
    'body {padding:25px;}' +
    'ul {margin:0; padding:0; list-style:none;}' +
    'li {padding:5px 10px;}' +
    'li:hover {background:#eee; cursor:pointer;}' +
    'a {text-decoration:none; color:#0080ff;}' +
    '</style>' +
    '<body>' +
    '<ul>' +
    links.join('') +
    '</ul>'
  );
}

function sendResponse(res, statusCode, body) {
  res.writeHead(statusCode)
  res.write(body)
  res.end()
}

function send200(res, body) {
  sendResponse(res, 200, body)
}

function send404(res, body = '<h1>Not Found</h1>') {
  sendResponse(res, 404, body)  
}

function pipeFileToResponse(res, file, type) {
  if (type) {
    res.writeHead(200, {
      'Content-Type': type
    })
  }

  fs.createReadStream(path.join(__dirname, file)).pipe(res)
}

dirs = listDirs(__dirname)

server = http.createServer((req, res) => {
  let url = req.url

  // Process fexios itself
  if (/fexios\.es[\.min*]*\.js$/.test(url)) {
    pipeFileToResponse(res, '../dist/fexios.es.min.js', 'text/javascript')
    return
  }
  if (/fexios\.common\.js$/.test(url)) {
    pipeFileToResponse(res, '../dist/fexios.common.js', 'text/javascript')
    return
  }
  if (/fexios\.umd[\.min]*\.js$/.test(url)) {
    pipeFileToResponse(res, '../dist/fexios.umd.min.js', 'text/javascript')
    return
  }

  // process template request
  if (url === '/' || url === '/index.html') {
    send200(res, getIndexTemplate())
    return
  }

  // Format request */ -> */index.html
  if (/\/$/.test(url)) {
    url += 'index.html'
  }

  // Format request /get -> /get/index.html
  var parts = url.split('/');
  if (dirs.indexOf(parts[parts.length - 1]) > -1) {
    url += '/index.html'
  }

  // Process index.html request
  if (/index\.html$/.test(url)) {
    if (fs.existsSync(path.join(__dirname, url))) {
      pipeFileToResponse(res, url, 'text/html')
    } else {
      send404(res)
    }
  }

  // Process server request
  else if (new RegExp('(' + dirs.join('|') + ')\/server').test(url)) {
    if (fs.existsSync(path.join(__dirname, url + '.js'))) {
      require(path.join(__dirname, url + '.js'))(req, res)
    } else {
      send404(res)
    }
  }
  else {
    send404(res)
  }
})

const PORT = 3000
server.listen(PORT)

// eslint-disable-next-line no-undef
console.log('Examples running on ' + `http://127.0.0.1:${PORT}`)

const serverArgs = process.argv.slice(2)
if (serverArgs.some(arg => arg.indexOf('--open') !== -1)) {
  cp.exec(`start http:127.0.0.1:${PORT}`)
}
