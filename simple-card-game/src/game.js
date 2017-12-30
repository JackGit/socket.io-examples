class Room {

  handlePlayerJoin () {

  }

  handlePlayerLeave () {
    
  }
}

class Game {
  constructor () {

    this.init()
  }

  init () {
    this.handleEvents()
  }

  handleEvents () {

  }

  handlePlayerJoin (player) {
    this.addPlayer(player)

    if (this.isReadyToStart()) {
      this.startGame()
    }
  }

  handlePlayerLeave (player) {
    this.removePlayer(player)
  }

  handlePlayCard (player, card) {
    this.playCard(player, card)

    if (this.isGameEnd()) {
      this.endGame()
    }
  }

  // check if game should end
  isGameEnd () {

  }

  // check if game is ready to start
  isReadyToStart () {

  }

  // add player when "playerjoin"
  addPlayer (player) {

  }

  // remove player when "playerleft"
  removePlayer (player) {

  }

  startGame () {
    this.shuffleCards()
    this.dealCards()
  }

  endGame () {

  }

  // shuffle cards before deal
  shuffleCards () {

  }

  // deal cards to players
  dealCards () {

  }

  playCard (player, card) {

  }




}

// usage would be like
const game = new Game(roomId)

game.openForJoin()

game.on('playerjoin', () => {})

game.on('playerready', () => {})

game.on('allready', () => {})

game.on('dealing', (player, card) => {})
