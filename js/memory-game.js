class MemoryGame {
  constructor() {
    this.cards = []
    this.moves = 0
    this.startTime = null
    this.timer = null
    this.hasFlippedCard = false
    this.lockBoard = false
    this.firstCard = null
    this.secondCard = null

    this.symbols = ['♠', '♣', '♥', '♦', '★', '♪', '✿', '✤']
    this.init()
  }

  init() {
    this.cardsGrid = document.querySelector('.cards-grid')
    this.startButton = document.getElementById('start-game')
    this.movesCount = document.getElementById('moves-count')
    this.timeElement = document.getElementById('time')

    this.startButton.addEventListener('click', () => this.startGame())
  }

  startGame() {
    this.resetGame()
    this.createCards()
    this.startTimer()
  }

  createCards() {
    const cardPairs = [...this.symbols, ...this.symbols]
    const shuffledCards = this.shuffle(cardPairs)

    this.cardsGrid.innerHTML = ''
    shuffledCards.forEach(symbol => {
      const card = this.createCardElement(symbol)
      this.cardsGrid.appendChild(card)
    })
  }

  createCardElement(symbol) {
    const card = document.createElement('div')
    card.classList.add('memory-card')
    card.innerHTML = `
      <div class="card-front">${symbol}</div>
      <div class="card-back">?</div>
    `
    card.addEventListener('click', () => this.flipCard(card))
    return card
  }

  flipCard(card) {
    if (this.lockBoard) return
    if (card === this.firstCard) return

    card.classList.add('flip')

    if (!this.hasFlippedCard) {
      this.hasFlippedCard = true
      this.firstCard = card
      return
    }

    this.secondCard = card
    this.moves++
    this.movesCount.textContent = this.moves
    this.checkForMatch()
  }

  checkForMatch() {
    const isMatch =
      this.firstCard.querySelector('.card-front').textContent ===
      this.secondCard.querySelector('.card-front').textContent

    isMatch ? this.disableCards() : this.unflipCards()

    if (this.checkWin()) {
      this.endGame()
    }
  }

  disableCards() {
    this.firstCard.removeEventListener('click', this.flipCard)
    this.secondCard.removeEventListener('click', this.flipCard)
    this.resetBoard()
  }

  unflipCards() {
    this.lockBoard = true
    setTimeout(() => {
      this.firstCard.classList.remove('flip')
      this.secondCard.classList.remove('flip')
      this.resetBoard()
    }, 1000)
  }

  resetBoard() {
    ;[this.hasFlippedCard, this.lockBoard] = [false, false]
    ;[this.firstCard, this.secondCard] = [null, null]
  }

  shuffle(array) {
    return array.sort(() => Math.random() - 0.5)
  }

  startTimer() {
    this.startTime = Date.now()
    this.timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000)
      const minutes = Math.floor(elapsed / 60)
        .toString()
        .padStart(2, '0')
      const seconds = (elapsed % 60).toString().padStart(2, '0')
      this.timeElement.textContent = `${minutes}:${seconds}`
    }, 1000)
  }

  checkWin() {
    return (
      document.querySelectorAll('.memory-card.flip').length ===
      this.symbols.length * 2
    )
  }

  endGame() {
    clearInterval(this.timer)
    setTimeout(() => {
      alert(`Congratulations! You won in ${this.moves} moves!`)
    }, 500)
  }

  resetGame() {
    clearInterval(this.timer)
    this.moves = 0
    this.movesCount.textContent = '0'
    this.timeElement.textContent = '00:00'
    this.resetBoard()
  }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MemoryGame()
})
