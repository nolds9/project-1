# Project 1
## War
#### Gameplay
This is my take on the classic, 2-player card game "War." It's a game in which a shuffled deck is dealt evenly to both players. The players then compare their top cards. The player with the highest card value will take both cards. The game ends when one player has no remaining cards.

You can play the game [here](https://pkmoran.github.io/project-1).


#### Technologies Used
For this project I used HTML, CSS and vanilla javascript.

## Goals for this project

### Bronze Level Goal
- The game should be able to determine the highest card played
- The game should add the two played cards to the winner's hand
- There should be a button that compares the top card from each player's hand when pressed
- The game should alert that the game is over when one player is out of cards

### Silver Level Goal
- Some DOM manipulation
  * DIVs to represent "flipped cards" (not necessarily styled)
- Reset button
- DIVs to represent each player's hand (not necessarily styled)
- If there is a tie each player keeps the card they played
  * (I ended up scrapping this idea because of the eventual "war on tie" functionality)

### Gold Level Goal
- Styled cards for players hands and for the flipped cards
- Play "War" if the players tie
  * Play "War" again if the war ends in a tie (continue this until there is a winner)
- Notification when someone wins
- Support for multiple players
- Visuals for "War"

## Installation
Simply clone down this repository to a folder on your computer and open the `index.html` file in your web browser.

## Remaining Problems
- When the player clicks the Player Deck before the cards disappear the graphics from both clicks get meshed together. Then, if they continue to click quickly the cards disappear at an unpredictable rate
  * (This does not affect the game logic, but it looks bad)
- There is no visual for when "War" is played
- ~~No notification when someone wins~~
- No multiplayer

## User Stories
1. As a user I would like to see which cards are played when I click.
2. As a user I would like to be able to reset the game so I can start over if I want/need to.
3. As a user I would like to be notified of the current state of the game so I know what is happening behind the scenes.
