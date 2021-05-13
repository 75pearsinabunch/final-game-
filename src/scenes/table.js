class Table extends Phaser.Scene {
  constructor() {
    super('tableScene')
  }

  preload() {
    this.load.path = 'assets/';//shortens future path names
    this.load.image('cards', 'cardBack.png');
    //health bar/ status bar assets
    this.load.image('left-cap', 'barHorizontal_green_left.png');
    this.load.image('middle', 'barHorizontal_green_mid.png');
    this.load.image('right-cap', 'barHorizontal_green_right.png');
    this.load.image('left-cap-shadow', 'barHorizontal_shadow_left.png');
    this.load.image('middle-shadow', 'barHorizontal_shadow_mid.png');
    this.load.image('right-cap-shadow', 'barHorizontal_shadow_right.png');
  }

  init() {
    this.fullWidth = 300
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
    this.prompt = this.add.text(gameConfig.width - 10, 100, '', { color: '#FFF' }).setOrigin(1);


    //-----INPUT LOGGER DATA STRUCTURE----
    this.iC = new InputController(this);

    //-----INPUT TO RECIEVE CLICK ACTIONS---
    this.input.on('gameobjectdown', (pointer, gameObject, event) => {
      //records input to input logger
      this.iC.generateStimulus(pointer, gameObject, event);
    }, this);

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
    //this.iC.generateStimulus();

    //-----PROMPTS-----
    //sets up text at upper right of the screen
    //this.prompt = this.add.text(gameConfig.width - 10, 100, '', { color: '#000' }).setOrigin(1);

    //-----health bar/status bar
    //pre-plans the bar changes 
    const y = 24;
    const x = 10;
    // background shadow
    const leftShadowCap = this.add.image(x, y, 'left-cap-shadow').setOrigin(0, 0.5);
    const middleShaddowCap = this.add.image(leftShadowCap.x + leftShadowCap.width, y, 'middle-shadow').setOrigin(0, 0.5);
    middleShaddowCap.displayWidth = this.fullWidth;
    this.add.image(middleShaddowCap.x + middleShaddowCap.displayWidth, y, 'right-cap-shadow').setOrigin(0, 0.5);
    this.leftCap = this.add.image(x, y, 'left-cap').setOrigin(0, 0.5);
    this.middle = this.add.image(this.leftCap.x + this.leftCap.width, y, 'middle').setOrigin(0, 0.5);
    this.rightCap = this.add.image(this.middle.x + this.middle.displayWidth, y, 'right-cap').setOrigin(0, 0.5)
    this.setMeterPercentage(value);
  }

  //-------METER FUNCTIONS--------
  //handles the percentage 
  setMeterPercentage(percent = 1) {
    const width = this.fullWidth * percent;
    this.middle.displayWidth = width;
    this.rightCap.x = this.middle.x + this.middle.displayWidth;
  }

  //handles updating the animation of the bar
  setMeterPercentageAnimated(percent = 1, duration = 1000) {
    const width = this.fullWidth * percent;
    this.tweens.add({
      targets: this.middle,
      displayWidth: width,
      duration,
      ease: Phaser.Math.Easing.Sine.Out,
      onUpdate: () => {
        this.rightCap.x = this.middle.x + this.middle.displayWidth;
        this.leftCap.visible = this.middle.displayWidth > 0;
        this.middle.visible = this.middle.displayWidth > 0;
        this.rightCap.visible = this.middle.displayWidth > 0;
      }
    })
  }

  //The base of the data structure that will take in
  //information about what was pressed and store it,
  //just a function in its current iteration
  //pointer: The pointer that pressed the object
  //gameObject: The object pressed
  //event:???
  //recordInput(pointer, gameObject, event) {
  //  this.iC.pushAction({ pointer, gameObject, event });
  //if statements that stops the bar from hitting 0
  //if(value > 0.1){FIND ME A NEW HOME
  // value = value - 0.1;
  //}
  //}

  //changes the text of the prompt to a given statement
  //shows prompt for a short time, then removes text
  promptAnim(changeText) {
    this.prompt.text = changeText;
    let promptTweenIn = this.tweens.add({
      targets: this.prompt,
      alpha: { from: 0, to: 1 },
      duration: 3000,
      yoyo: true,
      hold: 1000,
    });
  }
}