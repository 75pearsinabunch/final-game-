//An actor is one of the characters in our scene
//they are automatically instantiated to be interactive
class Actor extends Phaser.GameObjects.Sprite{
  constructor(scene, posX, posY, texture, controller){
    //Add to scene
    super(scene, posX, posY, texture)
    scene.add.existing(this);
    //Set interactivity
    this.setInteractive();
    scene.input.on('gameobjectdown', (pointer, gameObject,event) => {
      //records input to input logger
      scene.recordInput(pointer, gameObject, event);
    }, scene);

    controller.pushActor(this);
  }
}