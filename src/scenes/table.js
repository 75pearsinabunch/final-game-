class Table extends Phaser.Scene {
  constructor() {
    super('tableScene')
  }

  preload() {
    this.load.image('machine', 'blender/machine.png')//main machine done before path

    this.load.path = 'assets/';//shortens future path names
    this.load.image('cards', 'cardBack.png');
    //health bar/ status bar assets
    this.load.image('green_left-cap', 'barHorizontal_green_left.png');
    this.load.image('green_middle', 'barHorizontal_green_mid.png');
    this.load.image('green_right-cap', 'barHorizontal_green_right.png');

    this.load.image('blue_left-cap', 'barHorizontal_blue_left.png');
    this.load.image('blue_middle', 'barHorizontal_blue_mid.png');
    this.load.image('blue_right-cap', 'barHorizontal_blue_right.png');

    this.load.image('red_left-cap', 'barHorizontal_red_left.png');
    this.load.image('red_middle', 'barHorizontal_red_mid.png');
    this.load.image('red_right-cap', 'barHorizontal_red_right.png');

    this.load.image('left-cap-shadow', 'barHorizontal_shadow_left.png');
    this.load.image('middle-shadow', 'barHorizontal_shadow_mid.png');
    this.load.image('right-cap-shadow', 'barHorizontal_shadow_right.png');



    //audio
    this.load.audio('music', 'audio/Ambience.mp3');
    this.load.audio('goMusic', 'audio/GameOverAmbience.mp3');
  }

  init() {
    this.fullWidth = 300
  }

  create() {
    //-------CAMERA---------
    //this.cameras.main.setBackgroundColor('#FFF');
    console.log("scene started");

    //------MACHINE IMAGE---------
    this.machine = this.add.image(0,0,'machine').setOrigin(0);

    //-------INPUT OBJECTS------
    //using event system from prof Altice's example
    //https://newdocs.phaser.io/docs/3.54.0/Phaser.Input.Events
    this.mouse = this.input.activePointer;
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    //-----MUSIC-----
    let musicConfig = {
      mute: false,
      volume: 0.1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    }
    let music = this.sound.add('music', musicConfig);
    music.play();
    let goMusic = this.sound.add('goMusic', musicConfig);

    //-----PROMPT TEXT-----
    //sets up text at upper right of the screen
    this.prompt = this.add.text(gameConfig.width - 10, 100, '', { color: '#FFF' }).setOrigin(1);

    //-----health bar/status bar
    //pre-plans the bar changes 
    const green_y = 25;
    const x = 10;
    const blue_y = 55;
    // background shadow
    const green_leftShadowCap = this.add.image(x, green_y, 'left-cap-shadow').setOrigin(0, 0.5);
    const green_middleShaddowCap = this.add.image(green_leftShadowCap.x + green_leftShadowCap.width, green_y, 'middle-shadow').setOrigin(0, 0.5);
    green_middleShaddowCap.displayWidth = this.fullWidth;
    this.add.image(green_middleShaddowCap.x + green_middleShaddowCap.displayWidth, green_y, 'right-cap-shadow').setOrigin(0, 0.5);
    this.green_leftCap = this.add.image(x, green_y, 'green_left-cap').setOrigin(0, 0.5);
    this.green_middle = this.add.image(this.green_leftCap.x + this.green_leftCap.width, green_y, 'green_middle').setOrigin(0, 0.5);
    this.green_rightCap = this.add.image(this.green_middle.x + this.green_middle.displayWidth, green_y, 'green_right-cap').setOrigin(0, 0.5)
    this.setMeterPercentage(green_value);

    //--------------TIMING/CLOCK---------------
    //Temp meter fill
    this.barFill = .5;
    this.setMeterPercentage(this.barFill);
    this.gameTime = 0;//number of seconds
    this.totalTime = 60;//number of seconds in a game
    this.timing = this.time.addEvent({
      delay: 1000, // time in ms
      paused: false, // timer continues even when clicked off if set to false
      loop: true, // repeats
      callback: () => {
        this.gameTime++;//increments every second
      }
    });


    //-----INPUT LOGGER DATA STRUCTURE----
    this.iC = new InputController(this);

    //-----INPUT TO RECIEVE CLICK ACTIONS---
    this.input.on('gameobjectdown', (pointer, gameObject, event) => {
      //records input to input logger
      this.iC.recieveClick(pointer, gameObject, event);
    }, this);

    //-----PLAYING CARDS------
    //Deck of cards
    this.hand = [];
    //instantiating 5 cards
    for (let i = 0; i < 5; i++) {
      this.cards = new PlayingCard(
        this,//scene 
        (55 * i + 133), //x
        (gameConfig.height - 190), //y
        this.iC //input controller
      );
      this.hand.push(this.cards);
    }

    //---------PRESS SPACE INSTRUCTIONS-----------
    this.textConfig = {
      fontFamily: 'Courier',
      fontSize: '22px',
      backgroundColor: '#FFF',
      color: '#cc3300',
      align: 'center',
      padding: {
        top: 1,
        bottom: 1,
      },
      fixedWidth: 0
    }
    //this.promptText = this.add.text(game.config.width / 2, game.config.height - 200, 'Which 3 Cards Fit the Pattern?', this.textConfig).setOrigin(0.5);
    //this.spaceText = this.add.text(game.config.width / 2, game.config.height - 50, 'Press Space to Try', this.textConfig).setOrigin(0.5);

    //---------ENDING CARD------
    this.flip = 180 * Phaser.Math.Between(0, 1);
    this.tCard = Phaser.Math.Between(0, 21);


    //---------GAME TIMER------
    this.gameOver = false;
    this.gOEvent = this.time.addEvent({
      delay: 56000,
      callback: () => {
        this.gameOver = true;
        console.log("Game over!");
        this.finish();
        music.stop();
        goMusic.setLoop(false);
        goMusic.setVolume(0.025);
        goMusic.play();
      },
    })
  }

  //-------METER FUNCTIONS--------
  //handles the percentage 
  setMeterPercentage(percent = 1) {
    const width = this.fullWidth * percent;
    this.green_middle.displayWidth = width;
    this.green_rightCap.x = this.green_middle.x + this.green_middle.displayWidth;

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
        this.green_rightCap.x = this.green_middle.x + this.green_middle.displayWidth;
        this.green_leftCap.visible = this.green_middle.displayWidth > 0;
        this.green_middle.visible = this.green_middle.displayWidth > 0;
        this.green_rightCap.visible = this.green_middle.displayWidth > 0;
      }
    })
  }

  //puts tarot card and ends the game
  finish() {
    this.tarot = this.add.sprite(game.config.width / 2 - 10, game.config.height- 70, 'cards', `${this.tCard}`).setOrigin(.5);
    this.tarot.setScale(.9,.9);
    this.tarot.angle = this.flip;
    for (let i = 0; i < this.hand.length; i++) {
      this.hand[i].remove();
    }
    //this.promptText.destroy();
    //this.spaceText.destroy();
    this.endText = this.add.text(game.config.width / 2, game.config.height - 160, 'The Future your Choices Sew', this.textConfig).setOrigin(.5);
  }

  //The base of the data structure that will take in
  //information about what was pressed and store it,
  //just a function in its current iteration
  //pointer: The pointer that pressed the object
  //gameObject: The object pressed
  //event:???
  recordInput(pointer, gameObject, event) {
    //if statements that stops the bar from hitting 0
    if (green_value > 0.1) {
      green_value = green_value - 0.1;
    }
    this.setMeterPercentage(green_value);
    console.log(green_value);
  }

  //changes the text of the prompt to a given statement
  //shows prompt for a short time, then removes text
  promptAnim(changeText) {
    this.prompt.text = changeText;
    this.tweens.add({
      targets: this.prompt,
      alpha: { from: 0, to: 1 },
      duration: 3000,
      yoyo: true,
      hold: 1000,
    });
  }

  update() {
    //game over check
    if (this.gameOver) {
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      let cardCount = 0;
      for (let i = 0; i < this.hand.length; i++) {
        if (this.hand[i].isSelected) {
          cardCount++;
        }
      }
      if (cardCount == 3) {
        this.iC.processSelection(this.hand);
        
      } else {
        this.promptAnim("Please Select 3");
        for (let i = 0; i < this.hand.length; i++) {
          this.hand[i].isSelected = false;
          this.hand[i].deactiveColoration();
        }
      }
    }
  }
}

