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
    const value = Phaser.Math.Between(1, 13);//randomizes card value
    const suit = suits[Phaser.Math.Between(0, 3)];//chooses random suit from list
    const texture = (value + suit); //creates texture name from random generation
    super(scene, posX, posY, '1back');//CHANGE 1back TO texture ONCE TEXTURES ARE IN
    scene.add.text(posX, (posY - 30), texture).setOrigin(0.5);//TEMPORARY TO SEE CARD VALUES
    scene.add.existing(this);//places in the world
    //Set interactivity
    this.setInteractive();//allows for clicking
    //Store actor in list of actors in input controller
    controller.pushActor(this);

    //variables from constructor
    this.value = value;
    this.suit = suit;
    this.scene = scene;
    this.tag = texture;//PUT BACK WHEN WE GET CARD FACES
    this.controller = controller;
    this.isSelected = false;
    this.setAlpha(.8);
  }

  //States a message of approval
  approve() {
    this.scene.barFill += .1;
    this.scene.setMeterPercentage(this.scene.barFill);//TODO: should probably randomize
    this.scene.promptAnim("The Tower Grows");
  }

  disapprove() {
    this.scene.barFill -= .1;
    this.scene.setMeterPercentage(this.scene.barFill);//TODO: should probably randomize
    this.scene.promptAnim("The Tower Diminishes");
  }

  vague() {
    this.scene.promptAnim("No Effect");
  }
}