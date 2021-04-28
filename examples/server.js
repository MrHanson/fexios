const fs = require('fs')
const path = require('path')
const http = require('http')
let server

server = http.createServer((req, res) => {
  const url = req.url

  // to do: process fexios itself

  // to do: process template request
})

const PORT = 3000
server.listen(PORT)

// eslint-disable-next-line no-undef
console.log('Examples running on ' + PORT)
