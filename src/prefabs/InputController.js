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

  determineResult(pointer, gameObject, event) {
    //guarentee we're recieving an actor
    if (gameObject.tag == undefined) {
      console.warn("InputController.determineResult: Tag not found, Actor not passed in");
      return;
    }


    console.log("InputController, determineResult");
    if (this.stimuli.length > 0) {
      let sI = this.stimuli.findIndex((element) => { return gameObject.tag == element.key; });
      this.performAction(sI);
    } else {//if nothing was found
      this.generateStimulus(gameObject);
    }
  }

  //Selects an actor at random to determine what happens to it
  generateStimulus(gameObject) {
    console.log("InputController, generateStimulus");
    //Find random actor
    this.i = Phaser.Math.Between(0, (this.actors.length - 1));
    this.currActor = this.actors[this.i];

    //stimulus object which holds information about results of functions
    let stimulus = {//this Can be const
      key: gameObject.tag, //the game object which was clicked
      subject: this.currActor, //a game object generated below
      response: Phaser.Math.Between(0, 3), //responseType enum generated
      uses: 2//probably make a function to generate this
    }
    console.log("InputController, generateStimulus, stimulus: " + stimulus.response);
    this.stimuli.push(stimulus);
    this.performAction(this.stimuli.length - 1);//just pushed so last element on array
  }

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