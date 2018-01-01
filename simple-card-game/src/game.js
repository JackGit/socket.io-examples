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
    this.players = [] // [{ id, name, cards, dealedCard }]
    this.token = -1

    this.status = 'initiated' // initiated => joining => playing => completed
    this.cards = []
  }

  // check if game should end
  isGameEnd () {
    return this.players.filter(player => player.dealedCard).length === 3
  }

  // check if game is ready to start
  isReadyToStart () {
    return this.players.length === 3
  }

  openForJoin () {
    if (['initiated', 'completed'].includes(this.status)) {
      this.players = []
      this.token = -1
      this.status = 'joining'
      this.cards = []
    }
  }

  // add player when "playerjoin"
  addPlayer (player) {
    if (this.status !== 'joining') {
      console.warn('game is not open for joining right now')
    } else if (this.players.length === 3) {
      console.warn('players full')
    } else {
      this.players.push({
        ...player,
        cards: [],
        dealedCard: null
      })

      console.log('now we have players', this.players)

      if (this.isReadyToStart()) {
        this.startGame()
      }
    }
  }

  // remove player when "playerleft"
  removePlayer (player) {
    this.players = this.players.filter(p => p.id === player.id)

    if (this.status === 'playing') {
      this.endGame()
    }
  }

  startGame () {
    console.log('start game')
    this.status = 'playing'
    this.shuffleCards()
    this.dealCards()
    this.assignToken()
  }

  endGame () {
    const winner = this.players.sort((p1, p2) => p2.dealedCard - p1.dealedCard)[0]
    this.status = 'completed'
    console.log(`game end, winner is ${winner.name}`)
  }

  // shuffle cards before deal
  shuffleCards () {
    this.cards =  _.shuffle('0123456789'.split(''))
    console.log('shuffle cards', this.cards)
  }

  // deal cards to players
  dealCards () {
    let cursor = 0
    for (let i = 0; i < 2; i++) {
      this.players.forEach(player => {
        player.cards.push(this.cards[cursor++])
      })
    }
    console.log('deal cards', this.players)
  }

  assignToken () {
    this.token = ++this.token % 3
    console.log('new token', this.token)
  }

  getPlayerWithToken () {
    return this.players[this.token]
  }

  checkToken (playerId) {
    if (this.getPlayerWithToken().id !== playerId) {
      console.warn(`player[id=${playerId}] does not match with token`)
      return false
    } else {
      return true
    }
  }

  isCardValid (player, card) {
    if (player.cards.length === 0) {
      console.warn('empty cards')
      return false
    } else if (!player.cards.includes(card)) {
      console.warn('wrong card')
      return false
    } else {
      return true
    }
  }

  playCard (playerId, card) {
    if (this.checkToken(playerId)) {
      const player = this.getPlayerWithToken()

      if (this.isCardValid(player, card)) {
        player.cards = player.cards.filter(c => c !== card)
        player.dealedCard = card

        console.log('deal card', `${player.name} => ${card}`)
        if (this.isGameEnd()) {
          this.endGame()
        } else {
          this.assignToken()
        }
      } else {
        this.assignToken()
      }
    }
  }
}

const g = new Game()
g.openForJoin()
g.addPlayer({ id: 0, name: 'Player 0' })
g.addPlayer({ id: 1, name: 'Player 1' })
g.addPlayer({ id: 2, name: 'Player 2' })
g.playCard(0, g.getPlayerWithToken().cards[0])
g.playCard(1, g.getPlayerWithToken().cards[0])
g.playCard(2, g.getPlayerWithToken().cards[0])
