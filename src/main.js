'use strict';

let gameConfig = {
  type: Phaser.AUTO,
  width: 500,
  height: 500,
  scene: [Title, Loading, Intro, Attic,  Table]
};

let game = new Phaser.Game(gameConfig);//instantiate game

let cursors = null; 

let score = 125;

/*A NOTE FOR GRADERS (PLEASE READ AFTER FIRST PLAY THROUGH):
  Our game is an experimental one, so this is a note for judging its functionality.
  An explaination of specifically how the game works is in the PatternTrie.js file.
  For your benefit, we have left in console logs which state what form of input the
  current game is looking for.

  Suits: The card suit.
  Value: The card's value (face values range from prince = 11 to king = 13).

  At the start of the game, every input is considered "incorrect" until the 3rd-5th try,
  leaving the player somewhat perterbed for just the right amount of time. 

  It takes this long because it waits for the first type of data it can recieve that creates
  a "valid combination", that is, the first solid link of three cards. It then ONLY checks 
  for this sort of combination. 

  After this point, connections will become easier to create. Players will find success by remembering
  what they've done and making subtle changes to their own pattern. 

  Though with random inputs, the game still produces and interesting "uplifting series of successes" 
  around the half way point. 

  We take particular pride in pointing out that this system is in fact designed to conform to
  the player's experience and actions and did NOT in fact rely on randomness, asside from the card generation.
*/