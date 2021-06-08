//Input logger serves to store player input and hold it as a repository
//for use across all objects. 
class InputController {
  constructor(scene) {
    //Variables
    this.scene = scene;

    //enum determining what the data the system
    //"pays attention to" through play
    this.patternTypes = {
      suit: 0,
      value: 1,
      notFound: 2,
    }

    this.patternType = this.patternTypes.notFound;

    this.suits = null;
    this.values = null;

    this.generateTries();
  }

  //used for resetting the game
  generateTries() {
    this.patternType = this.patternTypes.notFound;
    this.suits = new PatternTrie(4, this, this.scene);
    this.values = new PatternTrie(13, this, this.scene);
  }

  //Controlls response of all card elements controlled by this controller
  recieveClick(card) {
    //guarentee we're recieving a playing card
    if (card.constructor.name != "PlayingCard") {
      console.warn("InputController.reieveClick: Tag not found, Actor not passed in");
      return;
    }

    //toggles card highlighting
    card.isSelected = !card.isSelected;
    if (card.isSelected) {
      card.activeColoration();
    } else {
      card.deactiveColoration();
    }
  }

  //takes a hand object of cards
  processSelection(hand) {
    if (hand == undefined || hand[0] == undefined) {
      console.warn("Wasn't even given a hand");
      return;
    }

    this.hcS = [];//contains suit values
    this.hcV = [];//contains value numbers

    //find cards selected
    for (let i = 0; i < hand.length; i++) {
      if (hand[i].isSelected) {
        switch (this.patternType) {
          case (this.patternTypes.suit):
            this.hcS.push(hand[i].suit)
            break;
          case (this.patternTypes.value):
            this.hcV.push(hand[i].value);
            break;
          default://if a type has not been selected, we record all information
            this.hcS.push(hand[i].suit)
            this.hcV.push(hand[i].value);
            break;
        }
        //visual of flipping card
        this.flipping = this.scene.flipCard(hand[i], 'cards', 'back');
        //replace with a new card
        this.flipping.on('complete', (tween, targets) => {
          //removes card from scene completely
          this.replaceCard = new PlayingCard(
            hand[i].scene,
            hand[i].posX,
            hand[i].posY,
            hand[i].controller
          );
          //delete the old one
          hand[i].destroy();
          //refill the now vacant hand position
          hand[i] = this.replaceCard;
        })
      }
    }

    //This sorts the hands of types selected and checks to see if they are within
    //the set of possiblilities to be approved of, and disapproves anyway

    switch (this.patternType) {
      case (this.patternTypes.suit):
        this.hcS.sort();
        if (this.suits.checkPattern(this.hcS)) {
          this.approve();
        } else {
          this.disapprove();
        }
        break;
      case (this.patternTypes.value):
        this.hcV.sort((l, r) => { return (l - r) });
        if (this.values.checkPattern(this.hcV)) {
          this.approve();
        } else {
          this.disapprove();
        };
        break;
      //if a type of value to watch for had not yet been selected, we look through all of them
      //and go with the first affirmitive match 
      default:
        this.hcS.sort();
        if (this.suits.checkPattern(this.hcS)) {
          console.log("Approving of suits now");
          this.patternType = this.patternTypes.suit //from hence forth, we only care about suits
          this.approve();
          break;
        }

        this.hcV.sort((l, r) => { return (l - r) });
        if (this.values.checkPattern(this.hcV)) {
          console.log("Approving of values now");
          this.patternType = this.patternTypes.value //from hence forth, we only care about card values
          this.approve();
          break;
        }
    }

    //this causes the hand indicator to drop only once on failed pick
    if (this.patternType == this.patternTypes.notFound) {
      this.disapprove();
    }

  }

  //plays approval sound
  //currently increases hand location
  approve() {
    score = score - 10;
    //HAND APPROVED, PLAYER PROGRESSES (♪)
    this.scene.playGrowth();
  }

  //plays disaproval sound
  //currently lowers tower bar
  disapprove() {
    score = score + 10;
    //HAND DISAPPROVED, PLAYER REGRESSES (♪)
    this.scene.playShuffle();
  }
}