// grab elements from the DOM
const grid = document.querySelector('.grid')
const displayStats = document.querySelector('#displaystats')
const displayLives = document.querySelector('#displaylives')
const displayScore = document.querySelector('#displayscore')
const displayGameOver = document.querySelector('#displaygameover')
const displayMessage = document.querySelector('#displaymessage')
const playAgain = document.querySelector('#playagain')

// Declare variables 
let width
let height
let score = 0
let lives = 3
let cells
let alienCells = []
let aliensLeftAlive
let characterPosition
let intervalPositionAliens
let intervalBombDrop
let alienRows
let maxHorizOffset
let leftHorizOffset
let rightHorizOffset
let verticalOffset
let direction

// Initialise the scoreboard
displayScore.innerHTML = score
displayLives.innerHTML = lives


// Generate the grid, set variables and add the cells to an array. 
function startGame() {

  grid.innerHTML = ''

  clearInterval(intervalBombDrop)
  clearInterval(intervalPositionAliens)

  // Set the width. ideally this should be an odd number so the character can be placed in the center. Anything less than 5 won't have room for aliens. Recommend 7-15
  width = 15
  height = 15
  score = 0
  lives = 3
  cells = []
  alienCells = []
  aliensLeftAlive = []

  // default alien starting positions
  alienRows = 4
  maxHorizOffset = 3
  leftHorizOffset = 2
  rightHorizOffset = 4
  verticalOffset = 0
  direction = 'right'

  displayStats.classList.remove('hide')
  grid.classList.remove('hide')
  displayGameOver.classList.add('hide')

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
  generateAliens()

  // set the intervals for alien movements and bomb drops
  intervalBombDrop = setInterval(() => {
    dropBomb()
  }, 1000)

  intervalPositionAliens = setInterval(() => {
    moveAliens()
  }, 2000)
}

// Listen for keypresses or play again button
playAgain.addEventListener('click', () => {
  startGame()
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
  if (key === 'KeyQ') {
    const quitKey = prompt('Do you really want to quit? Press Y for yes, or any other key for no.')
    if (quitKey === 'y' || quitKey === 'Y') {
      gameOver('quit')
    }
  }
})

// Move the character
function moveCharacter(direction) {
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
// initialise aliens
function generateAliens() {
  let alienCounter = 1
  for (let i = 0; i < cells.length; i++) {
    cells[i].classList.remove('alien')
    if (i >= (width * (verticalOffset)) && i % width >= leftHorizOffset && i % width < width - rightHorizOffset && i < width * (alienRows + verticalOffset)) {
      cells[i].classList.add('alien')
      alienCells.push({ 'id': [alienCounter], 'position': i, 'alive': true })
      aliensLeftAlive = alienCells
      alienCounter++
    }
  }
}

// shift the aliens
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
    cells[i].classList.remove('alien')
    cells[i].classList.remove('bullet')
    cells[i].classList.remove('bomb')
    cells[i].classList.remove('hittarget')
    cells[characterPosition].classList.add('character')
    if (i >= (width * (verticalOffset)) && i % width >= leftHorizOffset && i % width < width - rightHorizOffset && i < width * (alienRows + verticalOffset)) {
      alienCells[alienCounter - 1].position = i
      if (alienCells[alienCounter - 1].alive) {
        cells[i].classList.add('alien')
      }
      alienCounter++
    }
  }
  if (verticalOffset === (height - alienRows)) {
    verticalOffset = 0
  }
}

//loop through the cells above the character position. If an alien is found alive, kill it
function shoot() {

  let i = characterPosition - width


  while (i > 0) {

  console.log(i)
    document.querySelector(`#cell${i}`).classList.add('bullet')
    const aliensInBulletPath = alienCells.find(element => element.position === i)
    if (Boolean(aliensInBulletPath) && aliensInBulletPath.alive === true) {
      aliensInBulletPath.alive = false
      hitTarget(aliensInBulletPath.position)
      break
    }
    i -= width
  }
  aliensLeftAlive = alienCells.filter(element => element.alive === true)
}

// Select a random alien that is still alive and drop a bomb from it
function dropBomb() {
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

// Update score when an alien is hit
function hitTarget(position) {
  score = score + 100
  displayScore.innerHTML = score
  cells[position].classList.remove('alien')
  cells[position].classList.remove('bullet')
  cells[position].classList.add('hittarget')
  if (aliensLeftAlive.length === 1) {
    gameOver('win')
  }
}

// Update lives when player character is bombed
function takeDamage() {
  lives--
  displayLives.innerHTML = lives
  cells[characterPosition].classList.remove('bomb')
  cells[characterPosition].classList.remove('character')
  cells[characterPosition].classList.add('hittarget')
  if (lives === 0) {
    gameOver('lose')
  }
}

// End the game if the user wins, loses or hits Q
function gameOver(reason) {
  clearInterval(intervalBombDrop)
  clearInterval(intervalPositionAliens)
  grid.classList.add('hide')
  displayGameOver.classList.remove('hide')
  if (reason === 'win') {
    displayMessage.innerHTML = 'You win!'
  } else if (reason === 'lose') {
    displayMessage.innerHTML = 'You lost!'
  } else if (reason === 'quit') {
    displayMessage.innerHTML = 'You left the game'
  }
}


