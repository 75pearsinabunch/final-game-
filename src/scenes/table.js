class Table extends Phaser.Scene {
  constructor() {
    super('tableScene')
  }

  preload() {
    this.load.path = 'assets/';//shortens future path names
    this.load.image('cards', 'cardBack.png');
  }

  create() {
    //-------CAMERA---------
    this.cameras.main.setBackgroundColor('#FFF');
    console.log("scene started");

    //-------INPUT OBJECTS------
    //using event system from prof Altice's example
    //https://newdocs.phaser.io/docs/3.54.0/Phaser.Input.Events
    this.mouse = this.input.activePointer;

    //-----ACTORS------
    //Deck of cards
    this.cards = this.add.sprite(gameConfig.width / 2, gameConfig.height / 2, 'cards');
    this.cards.setInteractive();
    this.input.on('gameobjectdown', (pointer, gameObject,event) => {
      this.recordInput(pointer, gameObject, event);
    }, this);

    //-----INPUT LOGGER DATA STRUCTURE----
    this.iL = new InputLogger();

    //-----PROMPTS-----
    //sets up text at upper right of the screen
    this.prompt = this.add.text(gameConfig.width-10, 100, '', { color: '#000' } ).setOrigin(1);
  }

  //The base of the data structure that will take in
  //information about what was pressed and store it,
  //just a function in its current iteration
  //pointer: The pointer that pressed the object
  //gameObject: The object pressed
  //event:???
  recordInput(pointer, gameObject, event){
    let action = {pointer, gameObject, event}
    this.iL.pushAction(action);
  }
}