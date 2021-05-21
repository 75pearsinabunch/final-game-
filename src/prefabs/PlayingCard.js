//An actor is one of the characters in our scene
//they are automatically instantiated to be interactive
let suits = [
  'hearts',
  'diamonds',
  'clubs',
  'spades',
]

class PlayingCard extends Phaser.GameObjects.Sprite {
  constructor(scene, posX, posY, controller) {
    //TODO: DRAW ANIMATION
    const value = Phaser.Math.Between(1, 13);//randomizes card value
    const suit = Phaser.Math.Between(1, 4);//chooses random suit from list
    const texture = (`${value} ${suit}`); //creates texture name from random generation
    const suitTranslate = (suits[suit-1])
    //const texture = '12 3'; //creates texture name from random generation
    console.log(texture);
    super(scene, posX, posY, 'cards', texture, 0);//CHANGE 1back TO texture ONCE TEXTURES ARE IN
    this.text = scene.add.text(posX, (posY - 30), suitTranslate).setOrigin(0.5);//TEMPORARY TO SEE CARD VALUES
    scene.add.existing(this);//places in the world
    //Set interactivity
    this.setInteractive();//allows for clicking
    //Store actor in list of actors in input controller

    //variables from constructor
    this.value = value;
    this.suit = suit;
    this.posX = posX;
    this.posY = posY;
    this.scene = scene;
    this.tag = texture;
    this.controller = controller;
    this.isSelected = false;
    this.setAlpha(.8);
  }

  remove() {
    this.text.destroy();
    this.destroy();
  }
}