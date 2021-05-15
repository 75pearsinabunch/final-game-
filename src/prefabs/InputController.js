//Input logger serves to store player input and hold it as a repository
//for use across all objects. 
class InputController {
  constructor(scene) {
    //Variables
    this.actions = [];//used to store actions
    this.actors = [];
    this.scene = scene;

    //setting up the response type enum
    this.responseTypes = {
      good: 0,
      bad: 1,
      vague: 2
    };
    this.stimuli = [];
  }

  //pushes a newly made action onto the list
  //called in every actor's consturctor phase
  pushActor(actor) {
    this.actors.push(actor);
  }

  //Controlls response of all card elements controlled by this controller
  recieveClick(pointer, gameObject, event) {
    //guarentee we're recieving an actor
    if (gameObject.constructor.name != "PlayingCard") {
      console.warn("InputController.reieveClick: Tag not found, Actor not passed in");
      return;
    }

    //highlights selected cards
    gameObject.isSelected = !gameObject.isSelected;
    if(gameObject.isSelected){
      gameObject.setAlpha(1);
    }else{
      gameObject.setAlpha(.8);
    }
  }

  processSelection(deck){
    //run a sort
    
  }

  //checks for the given subset of cards within the hands list
  checkForSet(deck){
    //make a subest of all selected cards in the deck. 
  }

  //TO DO: Stand alone function for determinining success based on game progression


  //causes an actor to perform the action assigned
  //in its respective stimulus object
  performAction(sI) {
    let stim = this.stimuli[sI];//ONLY USE IN THIS CONTEXT
    console.log("InputController, performAction");

    //figure out how to react
    switch (stim.response) {
      case (this.responseTypes.good):
        stim.subject.approve();
        break;
      case (this.responseTypes.bad):
        stim.subject.disapprove();
        break;
      case (this.responseTypes.vague):
        stim.subject.vague();
      default:
        //Does nothing
        console.log("InputController, performAction, Nothing selected as performance")
        this.response = null;
        break;
    }
    stim.uses--;
    if (stim.uses <= 0) {
      this.stimuli.splice(sI, 1);//remove element
      console.log("InputController, performAction: removed stimulus: " + this.stimuli);

    }
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