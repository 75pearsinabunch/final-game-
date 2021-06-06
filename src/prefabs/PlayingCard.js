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
    const value = Phaser.Math.Between(1, 13);//randomizes card value
    const suit = Phaser.Math.Between(1, 4);//chooses random suit from list
    const texture = (`${value} ${suit}`); //creates texture name from random generation
    super(scene, posX, posY, 'cards', 'back', 0);
    this.sprite = scene.add.existing(this);//places card in the scene
    this.setScale(1.2, 1.2);
    scene.flipCard(this, 'cards', texture);

    //Set interactivity
    this.setInteractive({
      useHandCursor: true,
    });

    //on click behavior
    this.on('pointerdown', () => {
      //records input to input logger
      controller.recieveClick(this);
      this.scene.playDraw();
    });

    //storing variables from constructor for use
    this.value = value;
    this.suit = suit;
    this.posX = posX;
    this.posY = posY;
    this.scene = scene;
    this.tag = texture;
    this.controller = controller;
    this.isSelected = false;
    this.setAlpha(.7);
    this.deactiveColoration();
  }

  activeColoration() {
    this.setAlpha(1)
    this.setTint('0xfff000')
    this.pulse.stop();
  }

  deactiveColoration() {
    this.setAlpha(.7);
    this.pulse = this.scene.tweens.add({
      targets: this,
      alpha: { value: 1, duration: Phaser.Math.Between(1000, 3000), ease: 'Power1' },
      yoyo: true,
      loop: -1,
    })
    this.setTint('0xffffcc')
  }

  //effectively turns cards off
  //used when game is over
  terminate() {
    this.scene.flipCard(this, 'cards', 'back');
    this.disableInteractive();
    this.setAlpha(.5);
    this.pulse.stop();
    this.setTint('0xffffcc');
  }
}