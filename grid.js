// Set the width. ideally this should be an odd number so the character can be placed in the center. Anything less than 5 won't have room for aliens. Recommend 7-15
const width = 17
const height = 10

const grid = document.querySelector('.grid')
const cells = []
let alienCells = []
let characterPosition

// default alien starting positions
const alienRows = 4
const maxHorizOffset = 3
let leftHorizOffset = 2
let rightHorizOffset = 4
let verticalOffset = 0
let direction = 'right'



// Generate the grid and add the cells to an array. 
// Identify walls, top row, final row, and second to last row
for (let i = 0; i < width * height; i++) {
  const cell = document.createElement('div')
  const cellwidth = 100 / width
  grid.appendChild(cell)
  cell.id = i
  //cell.innerHTML = i
  cell.style.width = `${cellwidth}%`
  cells.push(cell)

  // get the top row
  if (i >= 0 && i < width) {
    cell.classList.add('toprow')
  }
  // get the walls
  if (i % width === 0 || i % width === (width - 1)) {
    cell.classList.add('wall')
  }
  // get the second to last row
  if (i >= ((width * height) - (width * 2)) && i < (width * height) - width) {
    cell.classList.add('earthsurface')
  }
  // get the last row
  if (i >= ((width * height) - width) && i < width * height) {
    cell.classList.add('finalrow')
  }
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
  //console.log('Bomb drop!')
}, 5000)

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
// make some aliens
function generateAliens() {

  let alienCounter = 1
  for (let i = 0; i < cells.length; i++) {
    cells[i].classList.remove('alien')
    cells[i].innerHTML = ''
    if (i >= (width * (verticalOffset)) && i % width >= leftHorizOffset && i % width < width - rightHorizOffset && i < width * (alienRows + verticalOffset)) {
      cells[i].classList.add('alien')
      alienCells.push({ 'id': [alienCounter], 'position': i, 'alive': true })
      cells[i].innerHTML = alienCounter
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
  }
  else if (direction === 'left') {
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
    cells[i].classList.remove('deadalien')
    cells[i].innerHTML = ''
    if (i >= (width * (verticalOffset)) && i % width >= leftHorizOffset && i % width < width - rightHorizOffset && i < width * (alienRows + verticalOffset)) {
      if (alienCells[alienCounter - 1].alive){
      cells[i].classList.add('alien')
      cells[i].innerHTML = alienCounter
      }
      alienCounter++
    }
  }
  if (verticalOffset === (height - alienRows)) {
    verticalOffset = 0
  }
}




function shoot() {
  alienCells[6].alive = false
}




// Move the aliens
//function moveAliens() {
//
//  alienCells.forEach(element => {
//    element.classList.remove('alien')
//    const nextCell = parseInt(element.id - width)
//    cells[nextCell].classList.add('alien')
//  })
//
//}
