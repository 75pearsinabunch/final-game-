//enumeration of all possible suits a card can be
let suits = [
  'hearts',
  'diamonds',
  'clubs',
  'spades',
]

//Contains most behavior native to the playing cards (some required to be external for functionality)
class PlayingCard extends Phaser.GameObjects.Sprite {
  constructor(scene, posX, posY, controller) {
    super(scene, posX, posY, 'cards', 'back');
    this.sprite = scene.add.existing(this);//places card in the scene
    this.setScale(1.2, 1.2);

    //setting up face values
    this.value = Phaser.Math.Between(1, 13);//randomizes card value
    this.suit = Phaser.Math.Between(1, 4);//chooses random suit from list
    this.texture = (`${this.value} ${this.suit}`); //creates texture name from random generation

    //address values
    this.posX = posX;
    this.posY = posY;
    this.scene = scene;

    this.controller = controller;
    this.isSelected = false;

    this.pulse = undefined;

    this.setAlpha(.5);
    this.setTint('0xffffcc');
  }

  activeColoration() {
    this.setAlpha(1);
    this.setTint('0xfff000');
  }

  setPulse(){
    //light pulsation of an active card
    
    this.pulse = this.scene.tweens.add({
      targets: this,
      alpha: { value: 1, duration: Phaser.Math.Between(1000, 3000), ease: 'Bounce' },
      yoyo: true,
      loop: -1,
    })
  }

  deactiveColoration() {


    this.setAlpha(.7);
    this.setTint('0xffffcc')
  }

  //creates a new face for cards and flips them onto it
  turnToFace() {
    this.isSelected = false;
    this.value = Phaser.Math.Between(1, 13);//randomizes card value
    this.suit = Phaser.Math.Between(1, 4);//chooses random suit from list
    this.texture = (`${this.value} ${this.suit}`); //creates texture name from random generation
    this.scene.flipCard(this, 'cards', this.texture);

    this.deactiveColoration();
  }

  //sets the interactivity parameters for cards
  setActive() {
    //Set interactivity
    this.setInteractive({
      useHandCursor: true,
    });
    //on click behavior
    this.on('pointerdown', () => {
      //records input to input logger
      this.controller.recieveClick(this);
      this.scene.playDraw();
    });
  }

  //effectively turns cards off
  //used when game is over
  terminate() {
    this.scene.flipCard(this, 'cards', 'back');
    this.disableInteractive();
    this.setAlpha(.5);
    if (this.pulse != undefined) {
      this.pulse.stop();
    }
    this.setTint('0xffffcc');
    this.isSelected = false;
  }
}