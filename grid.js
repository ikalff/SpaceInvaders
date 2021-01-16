// Set the width. ideally this should be an odd number so the character can be placed in the center. Anything less than 5 won't have room for aliens. Recommend 7-15
const width = 15
const height = 15
let score = 0
let lives = 3

const grid = document.querySelector('.grid')
const debugscreen = document.querySelector('.debugscreen')
const displayLives = document.querySelector('#displaylives')
const displayScore = document.querySelector('#displayscore')
const cells = []
let alienCells = []
let characterPosition
let aliensLeftAlive = []

// default alien starting positions
const alienRows = 4
const maxHorizOffset = 3
let leftHorizOffset = 2
let rightHorizOffset = 4
let verticalOffset = 0
let direction = 'right'


// Initialise the scoreboard
displayScore.innerHTML = score
displayLives.innerHTML = lives


// Generate the grid and add the cells to an array. 
// Identify walls, top row, final row, and second to last row
for (let i = 0; i < width * height; i++) {
  const cell = document.createElement('div')
  const cellwidth = 100 / width
  grid.appendChild(cell)
  cell.id = "cell" + i
  //cell.innerHTML = i
  cell.style.width = `${cellwidth}%`
  cells.push(cell)

  // place the character
  if (i === ((width * height) - Math.round(width / 2))) {
    cell.classList.add('character')
    characterPosition = i
  }
}

// place the aliens
generateAliens()

// set the intervals for alien movements and bomb drops
const intervalBombDrop = setInterval(() => {
  dropBomb()
}, 1000)

const intervalPositionAliens = setInterval(() => {
  moveAliens()
}, 2000)

// Listen for keypresses
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
    //cells[i].innerHTML = ''
    if (i >= (width * (verticalOffset)) && i % width >= leftHorizOffset && i % width < width - rightHorizOffset && i < width * (alienRows + verticalOffset)) {
      cells[i].classList.add('alien')
      alienCells.push({ 'id': [alienCounter], 'position': i, 'alive': true })
      aliensLeftAlive = alienCells
      //cells[i].innerHTML = alienCounter
      alienCounter++
    }
  }
}

// shift the aliens
function moveAliens() {
  //alienCells = []
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
    //cells[i].innerHTML = ''
    if (i >= (width * (verticalOffset)) && i % width >= leftHorizOffset && i % width < width - rightHorizOffset && i < width * (alienRows + verticalOffset)) {
      alienCells[alienCounter - 1].position = i
      if (alienCells[alienCounter - 1].alive) {
        cells[i].classList.add('alien')
        //cells[i].innerHTML = alienCounter
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
    document.querySelector(`#cell${i}`).classList.add('bullet')
    //console.log(i)
    const aliensInBulletPath = alienCells.find(element => element.position === i)
    if (Boolean(aliensInBulletPath) && aliensInBulletPath.alive === true) {
      aliensInBulletPath.alive = false
      hitTarget(aliensInBulletPath.id, aliensInBulletPath.position)
      break
    }
    i -= width
  }
  aliensLeftAlive = alienCells.filter(element => element.alive === true)
  //console.log(`Aliens left alive: ${aliensLeftAlive.length}`)
  console.log(aliensLeftAlive)
}

function dropBomb() {
  const randomAlien = Math.floor(Math.random() * aliensLeftAlive.length)
  let i = aliensLeftAlive[randomAlien].position
  const alienColumn = i % width
  const characterColumn = characterPosition - ((width * height) - width)
  //console.log(`Character column: ${characterColumn}  Bomb column: ${alienColumn}`)
  while (i < width * height) {
    document.querySelector(`#cell${i}`).classList.add('bomb')
    i += width
  }
  if (alienColumn === characterColumn){
    takeDamage()
  }
}

function hitTarget(id, position) {
  score = score + 100
  displayScore.innerHTML = score
  cells[position].classList.add('hittarget')
  console.log(`Alien #${id} killed at position ${position}`)
}

function takeDamage() {
  lives--
  displayLives.innerHTML = lives
  cells[characterPosition].classList.add('hittarget')
  console.log('You\'ve been hit!')
}
