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
  slotNum: The slot selected's number, ordered 1-5 from left to right.
  With this in mind
*/