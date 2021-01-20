# Space Invaders

For my first project for the General Assembly Software Engineering Immersive course, I built this game using HTML, CSS and Javascript.
[Play the game:](https://ikalff.github.io/SpaceInvaders/) 


## Brief

Space Invaders is a classic arcade game from the 80s. The player aims to shoot an invading alien armada, before it reaches the planet's surface using a mounted gun turret. The player can only move left or right. The aliens also move from left to right, and also down each time the reach the side of the screen. The aliens also periodically drop bombs towards the player. Once the player has destroyed a wave of aliens, the game starts again. The aim is to achieve the highest score possible before either being destroyed by the aliens, or allowing them to reach the planet's surface.

## Requirements

* The player should be able to clear at least one wave of aliens
* The player's score should be displayed at the end of the game

## Resources

* [Space Invaders 1978 - Arcade Gameplay - Youtube](https://www.youtube.com/watch?v=MU4psw3ccUI)
* [Space Invaders - Wikipedia](https://en.wikipedia.org/wiki/Space_Invaders)


## Technologies Used
- HTML
- CSS
- Javascript

## Planning
At the beginning of this project, I tried to work out what variables I would need and what data types these would be. I then considered how many functions I would need, and in what order.

- startGame(): Sets variables, creates the grid, places the player in the middle, sets the intervals for movement and alien attacks, then calls generateAliens()
- generateAliens(): Loops through the cells on the board, placing aliens in some of the cells. The 'leftHorizOffset', 'HorizOffset', 'verticalOffset' and 'alienRows' variables allow me to control how many aliens appear relative to the size of the grid. After the alienCells array has been populated, I loop through this to randomly assign a number of 'boss' aliens which are harder to kill. The number of boss aliens increases with each level.
- moveCharacter(): Moves the character left or right. This also clears the grid of any laser beams, to fix a bug where the beam would still briefly appear in position after the player character had moved.
- moveAliens(): Determines the direction to move in, then loops through the aliens updating their positions.
- shoot():  Loops through the cells above the player, displaying the laser beam. If the beam hits an alien, the hitTarget() function is called.
- dropBomb(): Identifies a random alien and loops through the cells below it, displaying the enemy laser beam. If the beam is in the same column as the player, the takeDamage() function is called.
- hitTarget():  Accepts one argument, 'position'. Increases score. Updates the display and the number of lives left on the specified alien.
- takeDamage(): Reduces score and lives. Updates the display.
- gameOver(): Accepts one argument, 'reason'. Updates the display to inform the player if they have won, lost or quit the game. Resets the levels and clears intervals.
  
## Challenges
The biggest challenges with this game were:
- Making the aliens move in formation: This was the most time consuming part to work out, especially as I wanted to be able to update the grid dimensions. 
- The shooting/enemy fire functionality: I had an issue where every second blast of enemy fire happened just as the moveAliens() function was being run, meaning the laser beam would not be visible to the player (or the explosion, if the player was hit). I added an extra variable, 'bombFlag', and wrote an if statement to ensure the code inside the function only runs if it is an even number. This prevented the two events from clashing with each other.
- The user interface: It took me some time to iron out the main cross-platform issues and ensure the game was playable on mobile or desktop
  
## Future Improvements
There are a number of improvements I would like to add in future:






