//An actor is one of the characters in our scene
//they are automatically instantiated to be interactive
let suits = [
  'hearts',
  'spades',
  'diamonds',
  'clubs'
]

class PlayingCard extends Phaser.GameObjects.Sprite {
  constructor(scene, posX, posY, controller) {
    //TODO: DRAW ANIMATION
    const value = Phaser.Math.Between(1, 13);//randomizes card value
    const suit = suits[Phaser.Math.Between(0, 3)];//chooses random suit from list
    const texture = (value + suit); //creates texture name from random generation
    super(scene, posX, posY, '1back');//CHANGE 1back TO texture ONCE TEXTURES ARE IN
    this.text = scene.add.text(posX, (posY - 30), texture).setOrigin(0.5);//TEMPORARY TO SEE CARD VALUES
    scene.add.existing(this);//places in the world
    //Set interactivity
    this.setInteractive();//allows for clicking
    //Store actor in list of actors in input controller
  
    //variables from constructor
    this.value = value;
    this.suit = suit;
    this.posX = posX;
    this.posY = posY;
    this.scene = scene;
    this.tag = texture;
    this.controller = controller;
    this.isSelected = false;
    this.setAlpha(.8);
  }
}