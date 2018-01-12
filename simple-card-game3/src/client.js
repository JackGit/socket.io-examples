const sharedb = require('sharedb/lib/client');

// Open WebSocket connection to ShareDB server
const socket = new WebSocket('ws://' + window.location.host);
const connection = new sharedb.Connection(socket);

const gameDoc = connection.get('Game', 'demoGame')
const me = {
  id: Date.now(),
  name: 'Jack Yang'
}
let joinedRoomId = null

gameDoc.subscribe(() => {
  console.log('subscribed game', gameDoc.data)
})

gameDoc.on('op', () => {
  console.log('game op', gameDoc.data)

  // can start game ?
  const myRoom = gameDoc.data.rooms.filter(r => r.id === roomId)[0]
  if (myRoom && myRoom.players.length === 3) {
    console.log('start game')
    window.startGame()
  }

  // if this is my token
  if (myRoom && myRoom.tokenPlayerId === me.id) {
    console.log('it is my token')
  }
})

window.login = () => {
  const players = gameDoc.data.players
  gameDoc.submitOp(
    [{ p: ['players'], od: players, oi: [...players, me] }]
  )
}

window.createRoom = roomName => {
  const rooms = gameDoc.data.rooms
  const roomId = rooms.length + 1
  const newRoom = {
    id: roomId,
    roomName,
    players: [],
    gameStarted: false,
    gameResult: null,
    tokenPlayerId: null
  }

  gameDoc.submitOp(
    [{ p: ['rooms'], od: rooms, oi: [...rooms, newRoom] }]
  )

  return newRoom
}

window.deleteRoom = roomId => {
  const rooms = gameDoc.data.rooms
  const room = rooms.filter(r => r.id === roomId)[0]

  if (room) {
    gameDoc.submitOp(
      [{ p: ['rooms'], od: rooms, oi: rooms.filter(r => r.id !== roomId) }]
    )
  } else {
    console.error(`room[${roomId}] does not exists`)
  }
}

window.joinRoom = roomId => {
  if (joinedRoomId) {
    console.error('cannot join another room')
    return
  }

  const rooms = gameDoc.data.rooms
  const room = rooms.filter(r => r.id === roomId)[0]

  if (room) {
    room.players.push(me)
    gameDoc.submitOp(
      [{ p: ['rooms'], od: rooms, oi: rooms.map(r => r.id === roomId ? room : r) }]
    )
    joinedRoomId = roomId
  } else {
    console.error(`room[${roomId}] does not exists`)
  }
}

window.leaveRoom = () => {
  if (!joinedRoomId) {
    console.error('you are not in a room')
    return
  }

  const rooms = gameDoc.data.rooms
  const room = rooms.filter(r => r.id === joinedRoomId)[0]

  if (room) {
    room.players = room.players.filter(p => p.id !== me.id)
    gameDoc.submitOp(
      [{ p: ['rooms'], od: rooms, oi: rooms.map(r => r.id === joinedRoomId ? room : r) }]
    )

    if (room.players.length === 0) {
      window.deleteRoom(joinedRoomId)
    }

    joinedRoomId = null
  } else {
    console.error(`room[${roomId}] does not exists`)
  }
}

window.startGame = () => {
  const rooms = gameDoc.data.rooms
  const room = rooms.filter(r => r.id === joinedRoomId)[0]

  room.gameStarted = true
  room.tokenPlayerId = room.players[0].id

  gameDoc.submitOp(
    [{ p: ['rooms'], od: rooms, oi: rooms.map(r => r.id === joinedRoomId ? room : r) }]
  )
}
