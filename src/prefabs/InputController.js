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
  ///TODO: change action form
  pushAction(action) {
    this.actions.push(action);
  }

  //pushes a newly made action onto the list
  //called in every actor's consturctor phase
  pushActor(actor) {
    this.actors.push(actor);
  }

  //Selects an actor at random to determine what happens to it
  generateStimulus(){
    //Selects actor and random
    let i = Phaser.Math.Between(0,this.actors.length);
    //this.scene.promptAnim(i);//Testing only 
    //TODO: determine what action to take
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