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
      slotNum: 2,
    }

    //Setting which pattern we'll be searching for
    this.pattern = null;
    this.generateTrie();
  }

  generateTrie() {
    if (this.pattern != null) {
      this.pattern = null;
    }

    this.patternType = Phaser.Math.Between(0, 2)

    //randomly determines what type of pattern will be detected
    switch (this.patternType) {
      case (this.patternTypes.suit):
        //patterns based on card suits
        //intentional comments for graders
        console.log("Suit selected");
        this.pattern = new PatternTrie(4, this, this.scene);
        break;
      case (this.patternTypes.value):
        //patterns based on card values
        //intentional comments for graders
        console.log("Value selected");
        this.pattern = new PatternTrie(13, this, this.scene);
        break;
      default:
        //patterns on which slots were selected, card values notwithstanding
        //intentional comments for graders
        console.log("Slot Number selected");
        this.pattern = new PatternTrie(5, this, this.scene);
        break;
    }
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

    //instantiate to holders of copies of cards
    this.hcV = []

    //find cards selected
    for (let i = 0; i < hand.length; i++) {
      if (hand[i].isSelected) {
        switch (this.patternType) {
          case (this.patternTypes.suit):
            this.hcV.push(hand[i].suit)
            break;
          case (this.patternTypes.value):
            this.hcV.push(hand[i].value);
            break;
          default:
            this.hcV.push(i);
            break;
        }
        this.hcV.push(hand[i].value);
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
    //if numeric, must use custom numeric sorting function
    if(this.patternTypes.value || this.patternTypes.slotNum){
      this.hcV.sort((l, r) => { return (l - r) });
    }else{//otherwise, lexicographic will do fine
      this.hcV.sort();
    }

    //check to see if we have a match
    if (this.pattern.checkPattern(this.hcV)) {
      this.approve();
    } else {
      this.disapprove();
    }
  }

  //plays approval sound
  //currently increases hand location
  approve() {
    score = score - 15;
    //HAND APPROVED, PLAYER PROGRESSES (♪)
    this.scene.playGrowth();
  }

  //plays disaproval sound
  //currently lowers tower bar
  disapprove() {
    score = score + 15;
    //HAND DISAPPROVED, PLAYER REGRESSES (♪)
    this.scene.playShuffle();
  }
}