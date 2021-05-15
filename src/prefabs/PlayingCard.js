//An actor is one of the characters in our scene
//they are automatically instantiated to be interactive
let suits = [
  'hearts',
  'spades',
  'diamonds',
  'clubs'
]
class PlayingCard extends Phaser.GameObjects.Sprite {
  //constructor(scene, posX, posY, texture, controller) {
  constructor(scene, posX, posY, controller) {
    const value = 1;//TODO Randomized value
    const suit = 'back';//TODO randomized value
    const texture = (value+suit); //creates texture name from random generation
    super(scene, posX, posY, texture)//instantiates object
    scene.add.existing(this);//places in the world
    //Set interactivity
    this.setInteractive();//allows for clicking
    //Store actor in list of actors in input controller
    controller.pushActor(this);

    //variables from constructor
    this.scene = scene;
    this.tag = texture;
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