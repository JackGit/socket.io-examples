/**
 * take responsibility of event handling
 */
class Room {
  constructor () {
    this.game
  }

  handlePlayerJoin () {
    this.game.addPlayer()
  }

  handlePlayerLeave () {
    this.game.removePlayer()
  }

  handlePlayerReady () {

  }
}

/**
 * core game logic
 */
class Game {
  constructor () {

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

/* core game logic shouldn't care about async handling */
const game = new Game()

game.addPlayer(player)

if (game.isReadyToState()) {
  game.start() // shuffle and deal cards
}

game.playCard(player, card)

if (game.isGameOver()) {
  game.end()
}
