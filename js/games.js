class GameManager {
  constructor() {
    this.currentGame = null
    this.games = {
      memory: null,
      wordle: null
    }
    this.init()
  }

  init() {
    this.setupGameSelector()
    this.startButton = document.getElementById('start-game')
    this.startButton.addEventListener('click', () => this.startCurrentGame())

    // Initialize Memory Game
    this.games.memory = new MemoryGame()

    // Initialize Wordle Game instead of Snake Game
    this.games.wordle = new WordleGame()

    // Set Memory as default
    this.currentGame = 'memory'
  }

  setupGameSelector() {
    const buttons = document.querySelectorAll('.game-select-btn')
    buttons.forEach(btn => {
      btn.addEventListener('click', e => {
        buttons.forEach(b => b.classList.remove('active'))
        e.target.classList.add('active')
        this.switchGame(e.target.dataset.game)
      })
    })
  }

  switchGame(gameName) {
    // Hide all games
    document.querySelectorAll('.games-container > div').forEach(div => {
      div.classList.remove('active')
    })

    // Show selected game
    document.querySelector(`.${gameName}-game`).classList.add('active')

    // Update stats visibility
    const movesStat = document.querySelector('.moves')
    const timeStat = document.querySelector('.time')
    const scoreStat = document.querySelector('.score')

    if (gameName === 'memory') {
      movesStat.classList.remove('hidden')
      timeStat.classList.remove('hidden')
      scoreStat.classList.add('hidden')
      document.querySelector('.game-intro p').textContent =
        'Match all the pairs to win!'
    } else {
      movesStat.classList.add('hidden')
      timeStat.classList.add('hidden')
      scoreStat.classList.remove('hidden')
      document.querySelector('.game-intro p').textContent =
        'Guess the word in 6 tries!'
    }

    this.currentGame = gameName
  }

  startCurrentGame() {
    if (this.games[this.currentGame]) {
      this.games[this.currentGame].startGame()
    }
  }
}

class WordleGame {
  constructor() {
    this.word = ''
    this.guesses = []
    this.currentGuess = ''
    this.maxGuesses = 6
    this.wordLength = 5
    this.gameOver = false
    this.currentCategory = 'tech'

    // Word lists by category
    this.wordLists = {
      tech: [
        'REACT',
        'REDUX',
        'SWIFT',
        'LINUX',
        'CLOUD',
        'STACK',
        'ARRAY',
        'GRAPH',
        'CACHE',
        'PROXY',
        'ASYNC',
        'CLASS',
        'CONST',
        'DEBUG',
        'ERROR',
        'FLOAT',
        'INPUT',
        'LOGIC',
        'QUERY',
        'SCOPE',
        'SHELL',
        'TRACE',
        'PARSE',
        'BUILD',
        'FETCH',
        'STYLE',
        'ROUTE',
        'MODEL',
        'CLICK',
        'FOCUS',
        'MOUNT',
        'PROPS',
        'STATE',
        'STORE',
        'THEME',
        'TOKEN',
        'VALUE',
        'WRITE',
        'YIELD',
        'BREAK'
      ],
      football: [
        'MESSI',
        'SALAH',
        'FINAL',
        'BRUNO',
        'MOUNT',
        'SILVA',
        'LEEDS',
        'VILLA',
        'INTER',
        'PORTO',
        'MILAN',
        'PARIS',
        'BAYERN',
        'CELTIC',
        'AJAX',
        'GOALS',
        'DRAWS',
        'COACH',
        'SQUAD',
        'PITCH',
        'FINAL',
        'DERBY',
        'SCORE',
        'TEAMS',
        'MATCH'
      ],
      movies: [
        'ACTOR',
        'SCENE',
        'DRAMA',
        'MOVIE',
        'AWARD',
        'STAGE',
        'SOUND',
        'LIGHT',
        'STORY',
        'GENRE',
        'MUSIC',
        'DANCE',
        'VOICE',
        'ROLES',
        'STARS',
        'OSCAR',
        'FILMS',
        'SHOWS',
        'PLOTS',
        'CLIPS',
        'AUDIO',
        'VIDEO',
        'FRAME',
        'FOCUS',
        'ZOOM'
      ]
    }

    this.gameStarted = false
    this.init()
  }

  init() {
    this.gameBoard = document.querySelector('.wordle-board')
    this.keyboard = document.querySelector('.wordle-keyboard')
    this.scoreElement = document.getElementById('score')
    this.gameContainer = document.querySelector('.wordle-game')
    this.gameContainer.classList.add('not-started')
    this.setupKeyboard()
    this.setupCategorySelector()
    document.addEventListener('keydown', e => this.handleKeyPress(e))
  }

  setupKeyboard() {
    const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

    this.keyboard.innerHTML =
      rows
        .map(
          row => `
      <div class="keyboard-row">
        ${row
          .split('')
          .map(
            key => `
          <button class="key" data-key="${key}">${key}</button>
        `
          )
          .join('')}
      </div>
    `
        )
        .join('') +
      `
      <div class="keyboard-row">
        <button class="key key-wide" data-key="ENTER">ENTER</button>
        <button class="key key-wide" data-key="BACKSPACE">⌫</button>
      </div>
    `

    this.keyboard.addEventListener('click', e => {
      const key = e.target.closest('.key')
      if (!key) return
      this.handleKey(key.dataset.key)
    })
  }

  setupCategorySelector() {
    const categoryBtns = document.querySelectorAll('.category-btn')
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        categoryBtns.forEach(b => b.classList.remove('active'))
        e.target.classList.add('active')
        this.currentCategory = e.target.dataset.category
      })
    })
  }

  startGame() {
    // Get words for current category
    const words = this.wordLists[this.currentCategory].filter(
      word => word.length === this.wordLength
    )
    this.word = words[Math.floor(Math.random() * words.length)]

    this.guesses = []
    this.currentGuess = ''
    this.gameOver = false
    this.gameStarted = true
    this.gameContainer.classList.remove('not-started')
    this.gameContainer.classList.add('started')
    this.updateDisplay()
    this.scoreElement.textContent = '0'
    this.resetKeyboard()
  }

  handleKeyPress(e) {
    if (!this.gameStarted || this.gameOver) return

    if (e.key === 'Enter') {
      this.handleKey('ENTER')
    } else if (e.key === 'Backspace') {
      this.handleKey('BACKSPACE')
    } else if (/^[A-Za-z]$/.test(e.key)) {
      this.handleKey(e.key.toUpperCase())
    }
  }

  handleKey(key) {
    if (!this.gameStarted || this.gameOver) return

    if (key === 'BACKSPACE') {
      this.currentGuess = this.currentGuess.slice(0, -1)
    } else if (key === 'ENTER') {
      if (this.currentGuess.length === this.wordLength) {
        this.submitGuess()
      }
    } else if (this.currentGuess.length < this.wordLength) {
      this.currentGuess += key
    }

    this.updateDisplay()
  }

  submitGuess() {
    const guess = this.currentGuess
    this.guesses.push(guess)

    // Check correctness and update keyboard colors
    const result = this.checkGuess(guess)
    this.updateKeyboardColors(guess, result)

    if (guess === this.word) {
      this.gameOver = true
      const score = (this.maxGuesses - this.guesses.length + 1) * 20
      this.scoreElement.textContent = score
      setTimeout(
        () =>
          alert(
            `Congratulations! You found the word in ${this.guesses.length} tries!`
          ),
        500
      )
    } else if (this.guesses.length >= this.maxGuesses) {
      this.gameOver = true
      setTimeout(() => alert(`Game Over! The word was ${this.word}`), 500)
    }

    this.currentGuess = ''
    this.updateDisplay()
  }

  checkGuess(guess) {
    const result = new Array(this.wordLength).fill('wrong')
    const wordArray = [...this.word]
    const guessArray = [...guess]

    // First pass: mark correct letters
    for (let i = 0; i < guessArray.length; i++) {
      if (guessArray[i] === wordArray[i]) {
        result[i] = 'correct'
        wordArray[i] = null
        guessArray[i] = null
      }
    }

    // Second pass: mark present letters
    for (let i = 0; i < guessArray.length; i++) {
      if (guessArray[i] === null) continue // Skip already matched letters

      const index = wordArray.indexOf(guessArray[i])
      if (index !== -1) {
        result[i] = 'present'
        wordArray[index] = null // Mark this letter as used
      }
    }

    return result
  }

  updateKeyboardColors(guess, result) {
    guess.split('').forEach((letter, i) => {
      const key = document.querySelector(`[data-key="${letter}"]`)
      if (!key) return

      if (result[i] === 'correct') {
        key.classList.add('correct')
      } else if (
        result[i] === 'present' &&
        !key.classList.contains('correct')
      ) {
        key.classList.add('present')
      } else if (
        !key.classList.contains('correct') &&
        !key.classList.contains('present')
      ) {
        key.classList.add('wrong')
      }
    })
  }

  resetKeyboard() {
    document.querySelectorAll('.key').forEach(key => {
      key.classList.remove('correct', 'present', 'wrong')
    })
  }

  updateDisplay() {
    const rows = []

    // Add previous guesses
    for (let i = 0; i < this.maxGuesses; i++) {
      if (i < this.guesses.length) {
        const guess = this.guesses[i]
        const result = this.checkGuess(guess)
        rows.push(this.createGuessRow(guess, result))
      } else if (i === this.guesses.length) {
        // Current guess row
        rows.push(this.createCurrentRow())
      } else {
        // Empty row
        rows.push(this.createEmptyRow())
      }
    }

    this.gameBoard.innerHTML = rows.join('')
  }

  createGuessRow(guess, result) {
    return `
      <div class="wordle-row">
        ${guess
          .split('')
          .map(
            (letter, i) => `
          <div class="wordle-tile ${result[i]}">${letter}</div>
        `
          )
          .join('')}
      </div>
    `
  }

  createCurrentRow() {
    return `
      <div class="wordle-row">
        ${Array(this.wordLength)
          .fill('')
          .map(
            (_, i) => `
          <div class="wordle-tile${
            i < this.currentGuess.length ? ' filled' : ''
          }">${i < this.currentGuess.length ? this.currentGuess[i] : ''}</div>
        `
          )
          .join('')}
      </div>
    `
  }

  createEmptyRow() {
    return `
      <div class="wordle-row">
        ${Array(this.wordLength)
          .fill('')
          .map(
            () => `
          <div class="wordle-tile"></div>
        `
          )
          .join('')}
      </div>
    `
  }
}

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
    this.movesCount = document.getElementById('moves-count')
    this.timeElement = document.getElementById('time')
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

// Initialize games when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GameManager()
})
