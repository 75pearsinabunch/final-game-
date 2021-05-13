//Input logger serves to store player input and hold it as a repository
//for use across all objects. 
class InputController {
  constructor(scene) {
    //Variables
    this.actions = [];//used to store actions
    this.actors = [];
    this.scene = scene;

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
  generateStimulus(pointer, gameObject, event) {
    //Selects actor and random
    this.i = Phaser.Math.Between(0, (this.actors.length-1));
    this.currActor = this.actors[this.i];
    //figure out how to react
    this.response = null;
    switch (Phaser.Math.Between(0, 3)) {
      case (0):
        this.currActor.approve();
        this.response = "good";
        break;
      case (1):
        this.currActor.disapprove();
        this.response = "bad";
        break;
      case (2):
        this.currActor.vague();
        this.response = "unknown";
      default:
        //Does nothing
        this.response = null;
        break;
    }

    //save action taken
    this.action = {
      pointer: pointer,
      gameObject: gameObject,
      event: event,
      response: this.response
    };

    this.pushAction(this.action);
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