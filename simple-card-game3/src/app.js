const path = require('path')
const http = require('http')
const express = require('express')

const ShareDB = require('sharedb')
const WebSocket = require('ws');
const WebSocketJSONStream = require('websocket-json-stream')

const backend = new ShareDB();
createDoc(startServer)

// Create initial document then fire callback
function createDoc (callback) {
  const connection = backend.connect()
  const doc = connection.get('examples', 'counter')
  doc.fetch(function(err) {
    if (err) throw err
    if (doc.type === null) {
      doc.create({numClicks: 0}, callback)
      return
    }
    callback()
  })
}

function startServer() {
  // Create a web server to serve files and listen to WebSocket connections
  const app = express();
  app.use(express.static(path.resolve(__dirname, '../public')))

  const server = http.createServer(app)

  // Connect any incoming WebSocket connection to ShareDB
  const wss = new WebSocket.Server({ server })
  wss.on('connection', function(ws, req) {
    const stream = new WebSocketJSONStream(ws)
    backend.listen(stream)
  })

  server.listen(3000)
  console.log('Listening on http://localhost:3000')
}


/*
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
    io.emit('player.login', {
      player,
      rooms: Object.values(rooms).map(room => getRoomDetails(room))
    })
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

    io.emit('room.create', getRoomDetails(room.id))
    callback && callback(getRoomDetails(room.id))
  })

  socket.on('room.player.join', ({ roomId, player }, callback) => {
    const room = rooms[roomId]
    room.game.addPlayer(player)
    io.emit('room.player.join', {
      room: getRoomDetails(room),
      player
    })

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

  socket.on('room.game.playcard', ({ roomId, playerId, card }, callback) => {
    const { game } = rooms[roomId]
    game.playCard(playerId, card)
    io.emit('room.game.playcard', ({ roomId, playerId, card }))

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
*/
