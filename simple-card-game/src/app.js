const path = require('path')
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const publicDir = path.resolve(__dirname, '../public')

app.get('/', function (req, res) {
  res.sendFile(publicDir.join('/index.html'))
})

io.on('connection', (socket) => {
  console.log(`a user connected: ${socket.id}`)

  
})

http.listen(3000, function () {
  console.log('listening on *:3000')
})
