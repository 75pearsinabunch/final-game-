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
    //this.cameras.main.setBackgroundColor('#FFF');
    console.log("scene started");


    //-------INPUT OBJECTS------
    //using event system from prof Altice's example
    //https://newdocs.phaser.io/docs/3.54.0/Phaser.Input.Events
    this.mouse = this.input.activePointer;

    //-----PROMPTS-----
    //sets up text at upper right of the screen
    this.prompt = this.add.text(gameConfig.width - 10, 100, 'prompt', { color: '#FFF' }).setOrigin(1);


    //-----INPUT LOGGER DATA STRUCTURE----
    this.iC = new InputController(this.prompt.text);

    //-----ACTORS------
    //Deck of cards
    this.cards = new Actor(
      this,//scene 
      gameConfig.width / 2, //x
      gameConfig.height / 2, //y
      'cards', //texture
      this.iC //input controller
    );

    //----MISC TESTING-----
    this.iC.generateStimulus();

  }

  //The base of the data structure that will take in
  //information about what was pressed and store it,
  //just a function in its current iteration
  //pointer: The pointer that pressed the object
  //gameObject: The object pressed
  //event:???
  recordInput(pointer, gameObject, event) {
    this.iC.pushAction({ pointer, gameObject, event });
    console.log("something");//just to see if card collision is detected 
  }
}