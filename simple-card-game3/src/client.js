const sharedb = require('sharedb/lib/client');

// Open WebSocket connection to ShareDB server
const socket = new WebSocket('ws://' + window.location.host);
const connection = new sharedb.Connection(socket);

const gameDoc = connection.get('Game', 'demoGame')
const me = {
  id: Date.now(),
  name: 'Jack Yang'
}

gameDoc.subscribe(() => {
  console.log('subscribed game', gameDoc.data)
})

gameDoc.on('op', () => {
  console.log('game op', gameDoc.data)
})

const login = () => {
  const players = gameDoc.data.players
  gameDoc.submitOp(
    [{ p: ['players'], od: players, oi: [...players, me] }]
  )
}

const createRoom = roomName => {
  const rooms = gameDoc.data.rooms
  const newRoom = {
    id: rooms.length,
    roomName,
    players: [],
    gameStarted: false,
    gameResult: null,
    tokenPlayer: null
  }

  gameDoc.submitOp(
    [{ p: ['rooms'], od: rooms, oi: [...rooms, newRoom] }]
  )
}

const joinRoom = roomId => {

}

const leaveRoom = room => {

}

window.login = login
window.createRoom = createRoom
