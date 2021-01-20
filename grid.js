// Declare global variables 
let width
let height
let score
let lives
let level = 1
let gameInProgress
let cells
let alienCells = []
let aliensLeftAlive
let characterPosition
let intervalPositionAliens
let intervalBombDrop
let bombFlag
let alienRows
let maxHorizOffset
let leftHorizOffset
let rightHorizOffset
let verticalOffset
let direction


// Grab elements from the DOM
const grid = document.querySelector('.grid')
const displayIntro = document.querySelector('#displayintro')
const displayGame = document.querySelector('#displaygame')
const displayLives = document.querySelector('#displaylives')
const displayScore = document.querySelector('#displayscore')
const displayLevel = document.querySelector('#displaylevel')
const displayGameOver = document.querySelector('#displaygameover')
const displayMessage = document.querySelector('#displaymessage')
const playGame = document.querySelector('#playgame')
const playAgain = document.querySelector('#playagain')
const quitGame = document.querySelector('#quitgame')
const levels = [
  {
    level: 1,
    lives: 10,
    bossAliens: 3,
    offset: 4
  },
  {
    level: 2,
    lives: 20,
    bossAliens: 9,
    offset: 3
  },
  {
    level: 3,
    lives: 30,
    bossAliens: 18,
    offset: 2
  }
]


//startGame()


function startGame() {

  // Start game
  gameInProgress = true

  // Set the width. ideally this should be an odd number so the character can be placed in the center. Anything less than 5 won't have room for aliens. Recommend 7-15
  width = 15
  height = 15

  // Set other variables
  if (level === 1) {
    score = 0
  }
  lives = levels[level - 1].lives

  cells = []
  alienCells = []
  aliensLeftAlive = []
  bombFlag = 0

  // Default alien starting positions
  alienRows = 4
  maxHorizOffset = levels[level - 1].offset
  leftHorizOffset = levels[level - 1].offset
  rightHorizOffset = levels[level - 1].offset
  verticalOffset = 0
  direction = 'right'

  // Update DOM elements
  grid.innerHTML = ''
  displayScore.innerHTML = score
  displayLives.innerHTML = lives
  displayLevel.innerHTML = level
  displayIntro.classList.add('hide')
  displayGameOver.classList.add('hide')
  displayGame.classList.remove('hide')

  // Generate the grid, set variables and add the cells to an array. 
  for (let i = 0; i < width * height; i++) {
    const cell = document.createElement('div')
    const cellwidth = 100 / width
    grid.appendChild(cell)
    cell.id = 'cell' + i
    cell.style.width = `${cellwidth}%`
    cells.push(cell)

    // place the character
    if (i === ((width * height) - Math.round(width / 2))) {
      cell.classList.add('character')
      characterPosition = i
    }
  }
  // Generate the aliens
  generateAliens()

  // set the interval for alien movements and bomb drops.
  //! intervalBombDrop must be HALF of intervalPositionAliens
  intervalBombDrop = setInterval(() => {
    dropBomb()
  }, 500)
  intervalPositionAliens = setInterval(() => {
    moveAliens()
  }, 1000)
}


// Listen for keypresses or play button
playGame.addEventListener('click', () => {
  startGame()
})
playAgain.addEventListener('click', () => {
  startGame()
})
quitGame.addEventListener('click', () => {
  if (confirm('Are you sure you want to quit?')) {
    gameOver('quit')
  }
})
document.addEventListener('keyup', (event) => {
  const key = event.code
  if (key === 'Space') {
    shoot()
  }
  if (key === 'ArrowLeft') {
    moveCharacter('left')
  }
  if (key === 'ArrowRight') {
    moveCharacter('right')
  }
})


// Move the character
function moveCharacter(direction) {
  for (let i = 0; i < cells.length; i++) {
    cells[i].classList.remove('bullet')
  }
  if (direction === 'right' && characterPosition < ((width * height) - 1)) {
    cells[characterPosition].classList.remove('character')
    characterPosition++
    cells[characterPosition].classList.add('character')
  } else if (direction === 'left' && characterPosition > ((width * height) - width)) {
    cells[characterPosition].classList.remove('character')
    characterPosition--
    cells[characterPosition].classList.add('character')
  }
}


// Initialise aliens
function generateAliens() {
  let alienCounter = 1

  for (let i = 0; i < cells.length; i++) {
    cells[i].classList.remove('alien')
    if (i >= (width * (verticalOffset)) && i % width >= leftHorizOffset && i % width < width - rightHorizOffset && i < width * (alienRows + verticalOffset)) {
      cells[i].classList.add('alien')
      alienCells.push({ 'id': [alienCounter], 'position': i, 'lives': 1, 'maxLives': 1 })
      aliensLeftAlive = alienCells
      alienCounter++
    }
  }
  for (let i = 0; i < levels[level - 1].bossAliens; i++) {
    let randomAlien = Math.floor(Math.random() * alienCells.length)
    cells[alienCells[randomAlien].position].classList.add('bossalien')
    alienCells[randomAlien].lives = 2
    alienCells[randomAlien].maxLives = 2
  }
}


// Shift the aliens
function moveAliens() {
  if (direction === 'right') {
    leftHorizOffset++
    rightHorizOffset--
    if (leftHorizOffset === (maxHorizOffset * 2)) {
      direction = 'down'
    }
  } else if (direction === 'left') {
    leftHorizOffset--
    rightHorizOffset++

    if (rightHorizOffset === (maxHorizOffset * 2)) {
      direction = 'down'
    }
  } else if (direction === 'down') {
    verticalOffset++
    if (rightHorizOffset === (maxHorizOffset * 2)) {
      direction = 'right'
    } else {
      direction = 'left'
    }
  }
  let alienCounter = 1
  for (let i = 0; i < cells.length; i++) {
    cells[i].classList = ''
    cells[characterPosition].classList.add('character')
    if (i >= (width * (verticalOffset)) && i % width >= leftHorizOffset && i % width < width - rightHorizOffset && i < width * (alienRows + verticalOffset)) {
      alienCells[alienCounter - 1].position = i
      if (alienCells[alienCounter - 1].maxLives === 1 && alienCells[alienCounter - 1].lives === 1) {
        cells[i].classList.add('alien')
      } else if (alienCells[alienCounter - 1].maxLives === 2 && alienCells[alienCounter - 1].lives === 2) {
        cells[i].classList.add('bossalien')
      } else if (alienCells[alienCounter - 1].maxLives === 2 && alienCells[alienCounter - 1].lives === 1) {
        cells[i].classList.add('bossalienhalfdead')
      }
      alienCounter++
    }
  }
  // If aliens reach the bottom, game is over
  if (verticalOffset === (height - alienRows)) {
    gameOver('lose')
  }
}


// Loop through the cells above the character position. If an alien is found alive, kill it
function shoot() {
  if (Boolean(gameInProgress)) {
    let i = characterPosition - width
    while (i > 0) {
      document.querySelector(`#cell${i}`).classList.add('bullet')
      const aliensInBulletPath = alienCells.find(element => element.position === i)
      if (Boolean(aliensInBulletPath) && aliensInBulletPath.lives > 0) {
        aliensInBulletPath.lives--
        hitTarget(aliensInBulletPath.position)
        break
      }
      i -= width
    }
    aliensLeftAlive = alienCells.filter(element => element.lives > 0)
  }
}


// Select a random alien that is still alive and drop a bomb from it
function dropBomb() {
  if (bombFlag % 2 === 0) {
    const randomAlien = Math.floor(Math.random() * aliensLeftAlive.length)
    let i = aliensLeftAlive[randomAlien].position
    const alienColumn = i % width
    const characterColumn = characterPosition - ((width * height) - width)
    while (i < width * height) {
      document.querySelector(`#cell${i}`).classList.add('bomb')
      i += width
    }
    if (alienColumn === characterColumn) {
      takeDamage()
    }
  }
  bombFlag++
}


// Update score when an alien is hit
function hitTarget(position) {
  score = score + 100
  displayScore.innerHTML = score
  cells[position].classList = ''
  cells[position].classList.add('hittarget')
  if (aliensLeftAlive.length === 1) {
    gameOver('win')
  }
}


// Update lives when player character is bombed
function takeDamage() {
  lives--
  score = score - 50
  displayLives.innerHTML = lives
  displayScore.innerHTML = score
  cells[characterPosition].classList.remove('bomb')
  cells[characterPosition].classList.remove('character')
  cells[characterPosition].classList.add('hittarget')
  if (lives === 0) {
    gameOver('lose')
  }
}


// End the game if the user wins, loses or quits
function gameOver(reason) {
  gameInProgress = false
  clearInterval(intervalBombDrop)
  clearInterval(intervalPositionAliens)
  let message = ''
  let delay = 0
  if (reason === 'win' && level < levels.length) {
    message = `Congratulations - You survived level ${level} with a score of ${score}`
    playAgain.innerHTML = `Next level: ${level + 1}`
    level++
    delay = 1000
  } else if (reason === 'win' && level >= levels.length) {
    message = `Congratulations - You have completed the game! Your final score was ${score}`
    level = 1
    playAgain.innerHTML = 'Play again'
    delay = 1000
  } else if (reason === 'lose') {
    message = `Sorry - you lost all your lives. Your final score was ${score}`
    level = 1
    playAgain.innerHTML = 'Play again'
    delay = 1000
  } else if (reason === 'quit') {
    message = 'You left the game'
    level = 1
    playAgain.innerHTML = 'Play again'
    delay = 0
  }
  setTimeout(() => {
    displayGame.classList.add('hide')
    displayGameOver.classList.remove('hide')
    displayMessage.innerHTML = message
  }, delay)
}
