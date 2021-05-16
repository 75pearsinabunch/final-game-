//Input logger serves to store player input and hold it as a repository
//for use across all objects. 
class InputController {
  constructor(scene) {
    //Variables
    //this.actions = [];//used to store actions
    //this.actors = [];
    this.scene = scene;

    //setting up the response type enum
    this.responseTypes = {
      good: 0,
      bad: 1,
      vague: 2
    };

    //Setting up pattern tries
    this.suitPattern = new PatternTrie(4);
    this.valuePattern = new PatternTrie(13);
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
    if (gameObject.isSelected) {
      gameObject.setAlpha(1);
    } else {
      gameObject.setAlpha(.8);
    }
  }

  //takes a hand object of cards
  processSelection(hand) {
    //TO DO: Check to make sure hand items are cards

    //instantiate to holders of copies of cards
    this.hcV = []//copy of hand
    this.hcS = [];//copy of Suits
    //don't need more than this b/c you never check if you have a value
    //AND it's on a certain color, you just check colors and values separately
    //find cards selected
    for (let i = 0; i < hand.length; i++) {
      if (hand[i].isSelected) {
        this.hcV.push(hand[i].value);
        this.hcS.push(hand[i].suit);
        //removes card from scene completely
        this.replaceCard = new PlayingCard(
          hand[i].scene,
          hand[i].posX,
          hand[i].posY,
          hand[i].controller
        );
        hand[i].remove();
        hand[i] = this.replaceCard;
      }
    }
    this.hcV.sort((l,r)=>{return (l-r)});
    this.hcS.sort();
    console.log(this.hcV)
    console.log(this.hcS);
  }

  //TO DO: Stand alone function for determinining success based on game progression

  //causes an actor to perform the action assigned
  //in its respective stimulus object
  performAction(stim, sI) {
    //figure out how to react
    switch (sI) {
      case (this.responseTypes.good):
        stim.approve();
        break;
      case (this.responseTypes.bad):
        stim.disapprove();
        break;
      case (this.responseTypes.vague):
        stim.vague();
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

  remove(){
    this.text.destroy();
    this.destroy();
  }
}