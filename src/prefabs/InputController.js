//trieTypes in order:
//0) suit
//1) value
//2) slot number

//Input logger serves to store player input and hold it as a repository
//for use across all objects. 
class InputController {
  constructor(scene) {
    //Variables
    this.scene = scene;

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

    switch (this.patternType) {
      case (this.patternTypes.suit):
        console.log("Suit selected");
        this.pattern = new PatternTrie(4, this, this.scene);
        break;
      case (this.patternTypes.value):
        console.log("Value selected");
        this.pattern = new PatternTrie(13, this, this.scene);
        break;
      default:
        console.log("Slot Number selected");
        this.pattern = new PatternTrie(5, this, this.scene);
        break;
    }
  }

  //Controlls response of all card elements controlled by this controller
  recieveClick(card) {
    //guarentee we're recieving an actor
    if (card.constructor.name != "PlayingCard") {
      console.warn("InputController.reieveClick: Tag not found, Actor not passed in");
      return;
    }
    //highlights selected cards
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
    this.hcV = []//copy of hand
    //this.hcS = [];//copy of Suits
    //don't need more than this b/c you never check if you have a value
    //AND it's on a certain color, you just check colors and values separately
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
        //this.hcS.push(hand[i].suit);
        this.flipping = this.scene.flipCard(hand[i], 'cards', 'back');
        this.flipping.on('complete', (tween, targets) => {
          //removes card from scene completely
          this.replaceCard = new PlayingCard(
            hand[i].scene,
            hand[i].posX,
            hand[i].posY,
            hand[i].controller
          );
          hand[i].destroy();
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
      console.log("Approved");
      this.approve();
    } else {
      console.log("Disapproved");
      this.disapprove();
    }
  }

  //States a message of approval
  //currently increases tower bar
  approve() {
    //HAND APPROVED, PLAYER PROGRESSES (♪)
    this.scene.playGrowth();
  }

  //States a message of disapproval
  //currently lowers tower bar
  disapprove() {
    //HAND DISAPPROVED, PLAYER REGRESSES (♪)
    this.scene.playShuffle();
  }
}