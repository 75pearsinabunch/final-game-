//Input logger serves to store player input and hold it as a repository
//for use across all objects. 
class InputController {
  constructor(scene) {
    //Variables
    this.scene = scene;

    //setting up the response type enum
    this.responseTypes = {
      good: 0,
      bad: 1,
      vague: 2
    };

    //Setting up pattern tries
    this.suitPattern = new PatternTrie(4,this, this.scene);
    this.valuePattern = new PatternTrie(13,this, this.scene);
    this.timesTried = 0;
  }

  // preload() {
  //   this.load.path = 'assets/';
    
  //   this.load.audio('cDraw1', 'audio/CardDraw-01.wav');
  //   this.load.audio('cDraw2', 'audio/CardDraw-02.wav');
  //   this.load.audio('cDraw3', 'audio/CardDraw-03.wav');
  //   this.load.audio('cDraw4', 'audio/CardDraw-04.wav');
  //   this.load.audio('cDraw5', 'audio/CardDraw-05.wav');

  //   this.load.audio('cShuffle1', 'audio/CardShuffle-01.wav');
  //   this.load.audio('cShuffle2', 'audio/CardShuffle-02.wav');
  //   this.load.audio('cShuffle3', 'audio/CardShuffle-03.wav');
  //   this.load.audio('cShuffle4', 'audio/CardShuffle-04.wav');
  // }

  // create() {
  //   //Init sound
  //   // let sfxConfig = {
  //   //   mute: false,
  //   //   volume: 0.2,
  //   //   rate: 1,
  //   //   detune: 0,
  //   //   seek: 0,
  //   //   loop: false,
  //   //   delay: 0
  //   // }
  //   let cDraw1 = this.sound.add('cDraw1', sfxConfig);
  //   let cDraw2 = this.sound.add('cDraw2', sfxConfig);
  //   let cDraw3 = this.sound.add('cDraw3', sfxConfig);
  //   let cDraw4 = this.sound.add('cDraw4', sfxConfig);
  //   let cDraw5 = this.sound.add('cDraw5', sfxConfig);
  //   let cShuffle1 = this.sound.add('cShuffle1', sfxConfig);
  //   let cShuffle2 = this.sound.add('cShuffle2', sfxConfig);
  //   let cShuffle3 = this.sound.add('cShuffle3', sfxConfig);
  //   let cShuffle4 = this.sound.add('cShuffle4', sfxConfig);
  // }

  //Controlls response of all card elements controlled by this controller
  recieveClick(pointer, gameObject, event) {
    // let sfxConfig = {
    //   mute: false,
    //   volume: 0.2,
    //   rate: 1,
    //   detune: 0,
    //   seek: 0,
    //   loop: false,
    //   delay: 0
    // }
    
    //guarentee we're recieving an actor
    if (gameObject.constructor.name != "PlayingCard") {
      console.warn("InputController.reieveClick: Tag not found, Actor not passed in");
      return;
    }
    
    //highlights selected cards
    gameObject.isSelected = !gameObject.isSelected;
    if (gameObject.isSelected) {
      gameObject.activeColoration();
      //SELECTING CARD (♪)
      // let sfxVar = Math.floor(Math.random() * 5);
      // if (sfxVar == 0) {
      //   cDraw1.play(sfxConfig);
      // } else if (sfxVar == 1) {
      //   cDraw2.play(sfxConfig);
      // } else if (sfxVar == 2) {
      //   cDraw3.play(sfxConfig);
      // } else if (sfxVar == 3) {
      //   cDraw4.play(sfxConfig);
      // } else if (sfxVar == 4) {
      //   cDraw5.play(sfxConfig);
      // }
    } else {
      gameObject.deactiveColoration();
      //DESELECTING CARD (♪)
      // let sfxVar = Math.floor(Math.random() * 5);
      // if (sfxVar == 0) {
      //   cDraw1.play(sfxConfig);
      // } else if (sfxVar == 1) {
      //   cDraw2.play(sfxConfig);
      // } else if (sfxVar == 2) {
      //   cDraw3.play(sfxConfig);
      // } else if (sfxVar == 3) {
      //   cDraw4.play(sfxConfig);
      // } else if (sfxVar == 4) {
      //   cDraw5.play(sfxConfig);
      // }
    }
  }

  //takes a hand object of cards
  processSelection(hand) {
    if(hand == undefined || hand[0] == undefined){
      console.warn("Wasn't even given a hand");
      return;
    }

    this.timesTried++;
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
    this.hcV.sort((l, r) => { return (l - r) });
    this.hcS.sort();

    if(this.suitPattern.checkPattern(this.hcS) || this.valuePattern.checkPattern(this.hcV)){
      console.log("Approved");
      this.approve();
    }else{
      console.log("Disapproved");
      this.disapprove();
    }
  }

  //States a message of approval
  //currently increases tower bar
  approve() {
    //HAND APPROVED, PLAYER PROGRESSES (♪)
    this.scene.barFill += .1;
    this.scene.setMeterPercentage(this.scene.barFill);//TODO: should probably randomize
    this.scene.promptAnim("The Tower Grows");
  }

  //States a message of disapproval
  //currently lowers tower bar
  disapprove() {
    //HAND DISAPPROVED, PLAYER REGRESSES (♪)
    this.scene.barFill -= .1;
    this.scene.setMeterPercentage(this.scene.barFill);//TODO: should probably randomize
    this.scene.promptAnim("The Tower Diminishes");
  }
}