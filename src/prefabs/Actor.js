//An actor is one of the characters in our scene
//they are automatically instantiated to be interactive
class Actor extends Phaser.GameObjects.Sprite {
  constructor(scene, posX, posY, texture, controller) {
    //Add to scene
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
    //console.log("Actor, approve");
    //TODO: push action onto stack
    //scene.setMeterPercentage(10);//TODO: should probably randomize
    this.scene.promptAnim(this.tag + " liked this");
  }

  disapprove() {
    //this.scene.setMeterPercentage(-10);//TODO: should probably randomize
    this.scene.promptAnim(this.tag + " disliked this");
  }

  vague() {
    this.scene.promptAnim(this.tag + " will remember this");
  }
}