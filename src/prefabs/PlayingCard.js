//An actor is one of the characters in our scene
//they are automatically instantiated to be interactive
class PlayingCard extends Phaser.GameObjects.Sprite {
  //constructor(scene, posX, posY, texture, controller) {
  constructor(scene, posX, posY, controller) {
    //Add to scene
    const value = 1;
    const suit = 'back';
    const texture = (value+suit);
    super(scene, posX, posY, texture)
    scene.add.existing(this);
    //Set interactivity
    this.setInteractive();
    //Store actor in list of actors in input controller
    controller.pushActor(this);

    //variables
    this.scene = scene;
    this.tag = texture;
    this.controller = controller;

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