/**
 * take responsibility of event handling
 */
class Room {
  constructor () {
    this.game
  }

  init () {
    this.game = new Game()
  }

  handlePlayerJoin () {
    this.game.addPlayer()
  }

  handlePlayerLeave () {
    this.game.removePlayer()
  }
}
