const g = new Game()

g.openForJoin()
g.addPlayer({ id: 0, name: 'Player 0' })
g.addPlayer({ id: 1, name: 'Player 1' })
g.addPlayer({ id: 2, name: 'Player 2' })
g.playCard(0, g.getPlayerWithToken().cards[0])
g.playCard(1, g.getPlayerWithToken().cards[0])
g.playCard(2, g.getPlayerWithToken().cards[0])
