const path = require('path')
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const Game = require('./game')
const players = {}
const rooms = {}

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../public/index.html'))
})

function getRoomDetails (room) {
  if (typeof room === 'number') {
    room = rooms[room]
  }

  return {
    id: room.id,
    name: room.name,
    players: room.game.players.map(p => ({
      id: p.id,
      name: p.name
    }))
  }
}

io.on('connection', (socket) => {
  console.log(`a user connected: ${socket.id}`)

  socket.on('player.login', (player, callback) => {
    players[player.id] = { player, socket }
    io.emit('player.login', player)
  })

  socket.on('room.create', ({ roomName, player }, callback) => {
    const game = new Game()
    const room = {
      id: Object.values(rooms).length,
      name: roomName,
      game
    }

    game.openForJoin()
    rooms[room.id] = room

    socket.broadcast.emit('room.create', getRoomDetails(room.id))
    callback && callback(getRoomDetails(room.id))
  })

  socket.on('room.player.join', ({ roomId, player }, callback) => {
    const room = rooms[roomId]
    room.game.addPlayer(player)
    io.emit('room.player.join', { roomId: roomId, player })

    if (room.game.isReadyToStart()) {
      room.game.startGame()
      io.emit('room.game.start')

      room.game.players.forEach(player => {
        const playerSocket = players[player.id].socket
        playerSocket.emit('room.game.dealcards', player.cards)
      })

      io.emit('room.game.token', room.game.getPlayerWithToken().id)
    }
  })

  socket.on('room.player.leave', (userId, roomId) => {
    const user = users[userId]
    const room = rooms[roomId]
    room.game.removePlayer(user)
    io.emit('user leave', { roomId, user })
  })

  socket.on('room.game.playcard', ({ roomId, player, card }, callback) => {
    const { game } = rooms[roomId]
    game.playCard(player.id, card)
    io.emit('room.game.playcard', ({ roomId, player, card }))

    if (game.isGameEnd()) {
      const winner = game.endGame()
      io.emit('room.game.end', winner)
    } else {
      io.emit('room.game.token', game.getPlayerWithToken().id)
    }
  })

})

http.listen(3000, function () {
  console.log('listening on *:3000')
})
