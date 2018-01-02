const path = require('path')
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const publicDir = path.resolve(__dirname, '../public')

const Room = require('./room')
const users = {}
const rooms = {}

app.get('/', function (req, res) {
  res.sendFile(publicDir.join('/index.html'))
})

io.on('connection', (socket) => {
  console.log(`a user connected: ${socket.id}`)

  socket.on('user login', user => {
    users[user.id] = {
      ...user,
      socket
    }
    socket.broadcast.emit('user login', user)
  })

  socket.on('new room', userId => {
    const room = new Room()
    rooms[room.id] = room
    room.game.openForJoin()
    socket.broadcast.emit('new room', { roomId: room.id })

    const user = users[userId]
    room.game.addPlayer(user)

    socket.join(`room ${room.id}`)
    socket.to(`room ${room.id}`).emit('user join', user)
  })

  socket.on('user join', (userId, roomId) => {
    const user = users[userId]
    const room = rooms[roomId]
    const roomEmit = socket.to(`room ${room.id}`).emit
    room.game.addPlayer(user)

    socket.join(roomId)
    roomEmit('user join', user)

    if (room.game.isReadyToStart()) {
      room.on('gamestart', roomEmit('game start'))

      room.on('dealcards', () => {
        room.games.players.forEach(player => {
          users[player.id].socket.emit('dealcard', player.cards)
        })
      })
    }
  })

  socket.on('user leave', (userId, roomId) => {
    const user = users[userId]
    const room = rooms[roomId]
    room.game.removePlayer(user)
    socket.broadcast.emit('user leave', { roomId, user })
  })

})

http.listen(3000, function () {
  console.log('listening on *:3000')
})
