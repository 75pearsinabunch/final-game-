//Input logger serves to store player input and hold it as a repository
//for use across all objects. 
class InputController {
  constructor(scene) {
    //Variables
    this.actions = [];//used to store actions
    this.actors = [];
    this.scene = scene
  }

  //pushes a given action struct onto the actions stack
  //action: an input of form: {pointer, gameObject, event}
  pushAction(action) {
    this.actions.push(action);
  }

  //pushes a newly made action onto the list
  //called in every actor's consturctor phase
  pushActor(actor) {
    this.actors.push(actor);
  }

  generateStimulus(){
    let i = Phaser.Math.Between(0,this.actors.length);
    this.scene.promptAnim(i); 
  }

  //---PRINT STATEMENTS FOR TESTING
  printActors() {
    this.actors.forEach(function (action) {
      console.log(action);
    })
  }

  printActionList() {
    this.actions.forEach(function (action) {
      console.log(action);
    })
  }
}