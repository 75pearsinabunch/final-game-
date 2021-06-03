class Table extends Phaser.Scene {
  constructor() {
    super('tableScene')
  }

  preload() {
    this.load.image('machine', 'blender/machine.png');//main machine done before path
    this.load.image('lever', 'blender/lever.png');
    this.load.image('slots', 'blender/slots.png');

    this.load.image('1back', 'assets/cardBack.png');
    this.load.image('timer', 'assets/loading.png');
    this.load.atlas('cards', 'assets/cardSheet.png', 'assets/cardSheet.json');
    //this.load.bitmapFont('digital', 'assets/font/digital-7.ttf');
    this.load.image('big', 'assets/big_hand.png');
    this.load.path = 'assets/';//shortens future path names
    //this.load.image('cards', 'cardBack.png');
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

    this.load.audio('cDraw1', 'audio/CardDraw-01.wav');
    this.load.audio('cDraw2', 'audio/CardDraw-02.wav');
    this.load.audio('cDraw3', 'audio/CardDraw-03.wav');
    this.load.audio('cDraw4', 'audio/CardDraw-04.wav');
    this.load.audio('cDraw5', 'audio/CardDraw-05.wav');

    this.load.audio('cShuffle1', 'audio/CardShuffle-01.wav');
    this.load.audio('cShuffle2', 'audio/CardShuffle-02.wav');
    this.load.audio('cShuffle3', 'audio/CardShuffle-03.wav');
    this.load.audio('cShuffle4', 'audio/CardShuffle-04.wav');

    this.load.audio('tGrow1', 'audio/Rumble-01.wav');
    this.load.audio('tGrow2', 'audio/Rumble-02.wav');
    this.load.audio('tGrow3', 'audio/Rumble-03.wav');
    this.load.audio('tGrow4', 'audio/Rumble-04.wav');

    this.load.audio('leverDrag', 'audio/LeverDrag.wav');


  }

  init() {
    this.fullWidth = 300
  }

  create() {
    //-------CAMERA---------
    //this.cameras.main.setBackgroundColor('#FFF');

    //top secret machine animation
    this.machineAnim = this.anims.create({
      key: 'machanim',
      frames: this.anims.generateFrameNames('animachine', { prefix: '', start: 1, end: 220, zeroPad: 4 }),
      repeat: -1,
    });

    //------MACHINE IMAGE---------
    this.machine = this.add.sprite(0, 0, 'animachine', "0001").setOrigin(0);
    //an invisible "hitbox" for the lever animation
    this.leverBoundary = this.add.rectangle(0, 200, gameConfig.width * 3, 200)

    //-----LEVER IMAGE AND SETUP------
    this.leverIgnitePoint = -210;//the point at which the lever activates the mechanism
    this.leverResetPoint = -2;
    this.leverSpeed = 0;
    this.leverMovable = true;

    this.leverBoundary.setInteractive({
      draggable: true,
      clickable: false,
    });

    this.lockpoint = -30;
    //-----LEVER CONTROL LISTENER-----
    this.leverBoundary.on('drag', (pointer, dragX, dragY) => {
      //console.log(this.leverBoundary.x);
      if (this.gameOver || !this.leverMovable) {
        return;
      }

      this.leverBoundary.x = dragX;//moves the lever along with the pointer
    });

    //-----CARD SLOTS IMAGE--------
    this.slots = this.add.image(0, 0, 'slots').setOrigin(0);

    //-------INPUT OBJECTS------
    //using event system from prof Altice's example
    //https://newdocs.phaser.io/docs/3.54.0/Phaser.Input.Events
    this.mouse = this.input.activePointer;
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    //-----AUDIO-----
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

        ///---CARD SELECT AUDIO---
    let sfxConfig = {
      mute: false,
      volume: 0.3,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    }
    this.cDraw1 = this.sound.add('cDraw1', sfxConfig);
    this.cDraw2 = this.sound.add('cDraw2', sfxConfig);
    this.cDraw3 = this.sound.add('cDraw3', sfxConfig);
    this.cDraw4 = this.sound.add('cDraw4', sfxConfig);
    this.cDraw5 = this.sound.add('cDraw5', sfxConfig);

        //---DISAPPROVE AUDIO---
    let shuffleConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    }
    this.cShuffle1 = this.sound.add('cShuffle1', shuffleConfig);
    this.cShuffle2 = this.sound.add('cShuffle2', shuffleConfig);
    this.cShuffle3 = this.sound.add('cShuffle3', shuffleConfig);
    this.cShuffle4 = this.sound.add('cShuffle4', shuffleConfig);

    //---APPROVE AUDIO---
    let growthConfig = {
      mute: false,
      volume: 0.5,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    }
    this.tGrow1 = this.sound.add('tGrow1', growthConfig);
    this.tGrow2 = this.sound.add('tGrow2', growthConfig);
    this.tGrow3 = this.sound.add('tGrow3', growthConfig);
    this.tGrow4 = this.sound.add('tGrow4', growthConfig);

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

    //-----INPUT LOGGER DATA STRUCTURE----
    this.iC = new InputController(this);

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

    //---------ENDING CARD------
    this.flip = 180 * Phaser.Math.Between(0, 1);
    this.tCard = Phaser.Math.Between(0, 21);
    this.tarot = this.add.sprite(game.config.width / 2 - 10, game.config.height - 70, 'cards', `backCard`).setOrigin(.5);
    this.tarot.setScale(.9, .9);

    //---------GAME TIMER------
    this.totalTime = 60*1000;
    this.gameOver = false;
    this.gOEvent = this.time.addEvent({
      delay: this.totalTime,
      callback: () => {
        this.gameOver = true;
        this.finish();
        music.stop();
        goMusic.setLoop(false);
        goMusic.setVolume(0.025);
        goMusic.play();
      },
    })

    //Visual Timer Stuff

    
    var circle = new Phaser.Geom.Circle(340, 425, 30);//  Create a large circle, then draw the angles on it
    var graphics = this.add.graphics();
    graphics.lineStyle(1, 0xFFFFFF, 1); // white lines
    var r1 = this.add.circle(340, 425, 5, 0x000000);
    graphics.strokeCircleShape(circle);// make the circle
    graphics.beginPath();
    for (var a = 0; a < 360; a += 22.5) {
      graphics.moveTo(340, 425);
      var p = Phaser.Geom.Circle.CircumferencePoint(circle, Phaser.Math.DegToRad(a));
      graphics.lineTo(p.x, p.y);
    }
    graphics.strokePath(); // lines visiblity
    this.big = this.add.sprite(340, 425, 'big').setOrigin(.5, 1).setScale(0.15, 0.15);
    this.tweens.addCounter({
      from: 0,
      to: 360,
      duration: this.totalTime,
      onUpdate: (tween) => {
        this.big.setAngle(tween.getValue())
      },
      repeat: 0,
    });
    
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

  //Creates the illusion of a card flipping by shrinking in the X direction
  //and replacing the sprite's texture
  flipCard(card, set, image) {
    let originalScaleX = card.scaleX;
    let flipTween = this.tweens.addCounter({
      from: card.width,
      to: 0,
      duration: 100,
      onUpdate: (tween) => {
        card.scaleX = (tween.getValue() / card.width) * originalScaleX;
        if (tween.getValue() == 0) {
          card.setTexture(`${set}`, `${image}`);
        }
      },
      yoyo: true,
      repeat: 0,
      //TODO: FIGURE OUT EASING
    });
    return flipTween;
  }

  //puts tarot card and ends the game
  finish() {
    this.tarot.angle = this.flip;
    this.flipCard(this.tarot, 'cards', `${this.tCard}`);
    for (let i = 0; i < this.hand.length; i++) {
      this.hand[i].remove();
    }
    this.endText = this.add.text(game.config.width / 2, game.config.height - 160, 'The Future your Choices Sew', this.textConfig).setOrigin(.5);
  }

  //used just for bar values
  recordInput() {
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

  playDraw() {
    let sfxVar = Math.floor(Math.random() * 5);
    if (sfxVar == 0) {
      this.cDraw1.play();
    } else if (sfxVar == 1) {
      this.cDraw2.play();
    } else if (sfxVar == 2) {
      this.cDraw3.play();
    } else if (sfxVar == 3) {
      this.cDraw4.play();
    } else if (sfxVar == 4) {
      this.cDraw5.play();
    }
  }

  playShuffle() {
    let sfxVar = Math.floor(Math.random() * 4);
    if (sfxVar == 0) {
      this.cShuffle1.play();
    } else if (sfxVar == 1) {
      this.cShuffle2.play();
    } else if (sfxVar == 2) {
      this.cShuffle3.play();
    } else if (sfxVar == 3) {
      this.cShuffle4.play();
    }
  }

  playGrowth() {
    let sfxVar = Math.floor(Math.random() * 4);
    if (sfxVar == 0) {
      this.tGrow1.play();
    } else if (sfxVar == 1) {
      this.tGrow2.play();
    } else if (sfxVar == 2) {
      this.tGrow3.play();
    } else if (sfxVar == 3) {
      this.tGrow4.play();
    }
  }

  //Called whenever the lever is pulled, determines whether or not
  //the card conditions permit the lever to move
  checkCardCount() {
    if (!this.leverMovable) {
      return;
    }
    let cardCount = 0;
    for (let i = 0; i < this.hand.length; i++) {
      if (this.hand[i].isSelected) {
        cardCount++;
      }
    }
    if (cardCount == 3) {
      this.lockpoint = -222;
    } else {
      this.lockpoint = -30;
    }
  }

  //used based on user InfinitesLoop from stack overflow
  //formats a given number to have leading zeroes
  //used to convert positional data to animation frames
  formatNum(num) {
    num = num.toString();
    while (num.length < 4) {
      num = "0" + num;
    }
    return num;
  }

  update() {
    //game over check
    if (this.gameOver) {
      return;
    }

    this.checkCardCount();
    //sets a reset point that resets all lever values
    if (this.leverBoundary.x > this.leverResetPoint) {
      this.leverSpeed = 0;
      this.leverMovable = true;
    }

    //LEVER MOTION
    //max -222
    this.leverBoundary.x = Phaser.Math.Clamp(this.leverBoundary.x, this.lockpoint, 0);

    if (this.leverMovable) {
      this.leverSpeed = 2 + ((0 - this.leverBoundary.x) / 50);//its resistance increases as player pulls
    }

    //always move a little in the speed direction
    this.leverBoundary.x += this.leverSpeed;

    this.boundInt = Phaser.Math.Snap.Ceil((0 - this.leverBoundary.x), 1);
    //console.log(this.boundInt);
    if (this.boundInt > 0) {
      this.machine.setFrame(this.formatNum(this.boundInt));
    }
    //INPUT CONTROLS 
    let leverConfig = {
      mute: false,
      volume: 0.05,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    }

    let leverDrag = this.sound.add('leverDrag', leverConfig);
    if ((this.leverBoundary.x < this.leverIgnitePoint) && this.leverMovable) {
      this.leverMovable = false;
      this.iC.processSelection(this.hand);
      leverDrag.play();
    }
  }
}

