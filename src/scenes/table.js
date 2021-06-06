class Table extends Phaser.Scene {
  constructor() {
    super('tableScene')
  }

  preload() {
    this.load.path = 'assets/';

    this.load.audio('music', 'audio/Ambience.mp3');

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
}
  
  create() {
    //-----MACHINE IMAGE AND ANIMATIONS-------
    this.machineAnim = this.anims.create({
      key: 'body-begin',
      frames: this.anims.generateFrameNames('body', { prefix: 'body', start: 0, end: 30, zeroPad: 4 }),
    });

    this.machineAnim = this.anims.create({
      key: 'body-end',
      frames: this.anims.generateFrameNames('body', { prefix: 'body', start: 61, end: 90, zeroPad: 4 }),
    });

    this.machineAnim = this.anims.create({
      key: 'body-reset',
      frames: this.anims.generateFrameNames('body', { prefix: 'body', start: 30, end: 0, zeroPad: 4 }),
    });

    //------HANDLE IMAGE AND ANIMATION---------
    this.machine = this.add.sprite(0, 0, 'body', "body0000").setOrigin(0, 0);

    //this.add.rectangle(gameConfig.width / 2, gameConfig.height / 2, 100, 100, 0xffffff).setOrigin(.5);

    this.handle = this.add.sprite(0, 0, 'handle', 'machine0000').setOrigin(0);

    //-----LEVER IMAGE AND SETUP------
    this.leverIgnitePoint = 166;//the point at which the lever activates the mechanism
    this.leverResetPoint = 322;//point at which lever is considered at rest
    this.leverSpeed = 0;//speed the lever moves rightward on its own
    this.leverMovable = false;//whether the player can move the lever
    this.lockpoint = 120;//the furthest point left the lever can reach, this changes frequently

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

    //-----INPUT LOGGER DATA STRUCTURE----
    this.iC = new InputController(this);

    //-----PLAYING CARDS------
    //Container for hand of cards
    this.hand = [];

    //instantiating 5 pictures of cards as the game begins
    for (let i = 0; i < 5; i++) {
      this.cards = this.add.sprite(
        (55 * i + 149), //x
        (gameConfig.height - 189),//y
        'cards',
        'back',
      );
      this.cards.setScale(1.2, 1.2);
      this.cards.setAlpha(.7);
      this.hand.push(this.cards);
    }

    //-----VISUAL TIMER REPRESENTATION SETUP-----
    //the following "big" hand is controlled by the timer event created later when the player
    //pulls the lever to begin the game
    var circle = new Phaser.Geom.Circle(360, 430, 30);//  Create a large circle, then draw the angles on it
    var graphics = this.add.graphics();
    graphics.lineStyle(1, 0xFFFFFF, 1); // white lines
    graphics.strokeCircleShape(circle);// make the circle
    graphics.beginPath();
    for (var a = 0; a < 360; a += 22.5) {
      graphics.moveTo(360, 430);
      var p = Phaser.Geom.Circle.CircumferencePoint(circle, Phaser.Math.DegToRad(a));
      graphics.lineTo(p.x, p.y);
    }
    graphics.strokePath(); // lines visiblity
    this.big = this.add.sprite(361, 430, 'big').setOrigin(.5, 1).setScale(0.30, 0.15);
    this.add.circle(360, 430, 5, 0x000000);//adding center circle

    //Boolean that determines if the initial lever pull has occured
    this.hasStarted = false;

    //------INPUT CONTROLS SOUNDS-------
    let leverConfig = {
      mute: false,
      volume: 0.05,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    }

    this.leverDrag = this.sound.add('leverDrag', leverConfig);

    //------LEVER CONTROL SETUP-------
    this.leverBoundary = this.add.rectangle(326, 115, 60, 130).setOrigin(0, 0);

    this.leverBoundary.on('drag', (pointer, dragX, dragY) => {
      if (!this.leverMovable) {
        return;
      }

      this.leverBoundary.x = dragX;//moves the lever along with the pointer
    });

    this.cardTaken = true;
    this.cardsTurned = false;
    //determines a middle state where game isn't fully over but no input should be read
    this.input.on('pointerdown', () => {
      if (this.cardTaken) {//ensures this only happens once per game
        //does not use "hasStarted" because animations must occur before player can place input
        this.machine.anims.play('body-begin');
        //set up ending card
        this.flip = 180 * Phaser.Math.Between(0, 1);
        this.tCard = Phaser.Math.Between(0, 21);
        this.cardTaken = false;
      }
    });

    //---MAKING SURE PLAYER CANT "MASH THROUGH OPENING CUTSCENE"---
    this.machine.on('animationcomplete-body-begin', () => {
      //Allow player to interact with the lever
      this.leverMovable = true;
      this.hasStarted = true;
      this.leverBoundary.setInteractive({
        draggable: true,
        useHandCursor: true,
        clickable: false,
      });
      //start w/ full lever access to "boot" machine

    })

    //This on serves to reset the state of the game back to the start
    this.machine.on('animationcomplete-body-reset', () => {
      this.hasStarted = false;
      this.cardTaken = true;
      this.cardsTurned = false;
      this.lockpoint = 120;
      //reset interactability

      //lever movable should be equal to false already
    })
  }

  setRealCards() {
    //Container for hand of cards
    //instantiating 5 cards
    for (let i = 0; i < 5; i++) {
      this.hand[i].destroy();
      this.hand[i] = new PlayingCard(
        this,//scene 
        (55 * i + 149), //x
        (gameConfig.height - 189),//y
        this.iC //input controller
      );
    }

    //creates a fresh trie object
    this.iC.generateTrie();

  }

  startTimer() {
    //this.totalTime = 120 * 1000;//length of one game
    this.totalTime = 45000;
    this.startSpin = this.tweens.addCounter({
      from: 360,
      to: 0,
      duration: 500,
      onUpdate: (tween) => {
        this.big.setAngle(tween.getValue())
      },
      repeat: 0,
    });

    this.startSpin.on('complete', (tween, targets) => {
      //starts the counter proper
      this.tweens.addCounter({
        from: 0,
        to: 360,
        duration: this.totalTime,
        onUpdate: (tween) => {
          this.big.setAngle(tween.getValue())
        },
        repeat: 0,
      });

      //starts internal timer for the game
      this.gOEvent = this.time.addEvent({

        delay: this.totalTime,
        callback: () => {
          this.leverMovable = false;//lock lever so player cant move it


          //music.stop();
          //goMusic.setLoop(false);
          //goMusic.setVolume(0.025);
          //goMusic.play();
        },
      })
      //a safety case to allow all player based actions to stop
      this.finishEvent = this.time.addEvent({
        delay: (this.totalTime + 500),//one 
        callback: () => {
          this.finish()
        },
      });
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

  //Controlls actions which occur to indicate that play is finished
  finish() {
    this.machine.anims.play('body-end');

    for (let i = 0; i < this.hand.length; i++) {
      this.hand[i].terminate();
    }

    //Generates an invisible hitbox over the animated card object
    this.tHB = this.add.rectangle(265, 430, 90, 80);
    this.tHB.setInteractive({
      useHandCursor: true,
    }).on('pointerdown', () => {
      this.machine.setFrame('body0030');
      this.displayTarot();
      this.tHB.disableInteractive();
      this.tHB.destroy();
    });

    this.hasStarted = false;//close off game

    this.leverBoundary.disableInteractive();
  }

  displayTarot() {
    let clickedOnce = false;
    this.tarot = this.add.sprite(gameConfig.width / 2 + 10, gameConfig.height / 2, 'cards', 'backCard').setOrigin(.5, .5);
    this.tarot.setAngle(this.flip);
    this.tarot.setScale(1.5, 1.5);
    this.tarot.setInteractive({
      useHandCursor: true,
    }).on('pointerdown', () => {

      if (!clickedOnce) {
        this.flipCard(this.tarot, 'cards', `${this.tCard}`);
        clickedOnce = true;
      } else {
        this.tarot.destroy();
        this.machine.anims.play('body-reset');
      }
    });

  }

  //Called whenever the lever is pulled, determines whether or not
  //the card conditions permit the lever to move
  checkCardCount() {

    if (!this.leverMovable || !this.cardsTurned) {
      return;
    }
    let cardCount = 0;
    for (let i = 0; i < this.hand.length; i++) {
      if (this.hand[i].isSelected) {
        cardCount++;
      }
    }
    if (cardCount == 3) {
      this.lockpoint = 120;
    } else {
      this.lockpoint = 294;
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

    this.checkCardCount();

    //LEVER MOTION
    //console.log(this.leverBoundary.x);
    this.leverBoundary.x = Phaser.Math.Clamp(this.leverBoundary.x, this.lockpoint, 326);
    //always move a little in the speed direction

    //sets a reset point that resets all lever values
    if (this.leverBoundary.x > this.leverResetPoint && this.hasStarted) {
      this.leverSpeed = 0;
      this.leverMovable = true;
    }

    if (this.leverBoundary.x < 300) {
      this.leverSpeed = 2 + ((this.leverBoundary.x) / 50);//its resistance increases as player pulls
    }

    this.leverBoundary.x += this.leverSpeed;

    this.boundInt = this.leverBoundary.x;

    let percDone = 1 - ((this.boundInt - 156) / (335 - 156));
    this.percDone = Phaser.Math.Clamp(percDone, 0, 1);

    if (this.boundInt > 0 && this.hasStarted) {
      let progPerc = (Phaser.Math.Snap.Ceil((percDone) * 29, 1) + 31);
      progPerc = Phaser.Math.Clamp(progPerc, 31, 60);
      this.handle.setFrame('machine' + this.formatNum(progPerc));
      this.machine.setFrame('body' + this.formatNum(progPerc));
    }

    if ((this.leverBoundary.x < this.leverIgnitePoint && this.leverMovable)) {
      this.leverMovable = false;
      //console.log("cards turned: "+this.cardsTurned)
      if (this.cardsTurned) {
        this.iC.processSelection(this.hand);
      } else {
        this.setRealCards();
        this.startTimer();
        this.hasStarted = true;
        this.cardsTurned = true;
      }
      this.leverDrag.play();
      if (!this.leverDrag.isPlaying) {
        this.leverDrag.destroy();
        console.log('lever');
      }
    }
  }


  playDraw() {
    //---CARD SELECT AUDIO---
    let selectConfig = {
      mute: false,
      volume: 0.3,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    }
    let cDraw1 = this.sound.add('cDraw1', selectConfig);
    let cDraw2 = this.sound.add('cDraw2', selectConfig);
    let cDraw3 = this.sound.add('cDraw3', selectConfig);
    let cDraw4 = this.sound.add('cDraw4', selectConfig);
    let cDraw5 = this.sound.add('cDraw5', selectConfig);
 
 
    let sfxVar = Math.floor(Math.random() * 5);
    if (sfxVar == 0) {
      cDraw1.play();
    } else if (sfxVar == 1) {
      cDraw2.play();
    } else if (sfxVar == 2) {
      cDraw3.play();
    } else if (sfxVar == 3) {
      cDraw4.play();
    } else if (sfxVar == 4) {
      cDraw5.play();
    }
 
    if (!cDraw1.isPlaying) {
      cDraw1.destroy();
    } else if (!cDraw2.isPlaying) {
      cDraw2.destroy();
    } else if (!cDraw3.isPlaying) {
      cDraw3.destroy();
    } else if (!cDraw4.isPlaying) {
      cDraw4.destroy();
    } else if (!cDraw5.isPlaying) {
      cDraw5.destroy();
    }
  }

  playShuffle() {

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
    let cShuffle1 = this.sound.add('cShuffle1', shuffleConfig);
    let cShuffle2 = this.sound.add('cShuffle2', shuffleConfig);
    let cShuffle3 = this.sound.add('cShuffle3', shuffleConfig);
    let cShuffle4 = this.sound.add('cShuffle4', shuffleConfig);
 
    let sfxVar = Math.floor(Math.random() * 4);
    if (sfxVar == 0) {
      cShuffle1.play();
    } else if (sfxVar == 1) {
      cShuffle2.play();
    } else if (sfxVar == 2) {
      cShuffle3.play();
    } else if (sfxVar == 3) {
      cShuffle4.play();
    }
 
    if (!cShuffle1.isPlaying) {
      cShuffle1.destroy();
    } else if (!cShuffle2.isPlaying) {
      cShuffle2.destroy();
    } else if (!cShuffle3.isPlaying) {
      cShuffle3.destroy();
    } else if (!cShuffle4.isPlaying) {
      cShuffle4.destroy();

    }
  }

  playGrowth() {
    //---APPROVE AUDIO---
    let growthConfig = {
      mute: false,
      volume: 0.3,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    }
    let tGrow1 = this.sound.add('tGrow1', growthConfig);
    let tGrow2 = this.sound.add('tGrow2', growthConfig);
    let tGrow3 = this.sound.add('tGrow3', growthConfig);
    let tGrow4 = this.sound.add('tGrow4', growthConfig);
    
    let sfxVar = Math.floor(Math.random() * 4);
    if (sfxVar == 0) {
      tGrow1.play();
    } else if (sfxVar == 1) {
      tGrow2.play();
    } else if (sfxVar == 2) {
      tGrow3.play();
    } else if (sfxVar == 3) {
      tGrow4.play();
    }
 
    if (!tGrow1.isPlaying) {
      tGrow1.destroy();
    } else if (!tGrow2.isPlaying) {
      tGrow2.destroy();
    } else if (!tGrow3.isPlaying) {
      tGrow3.destroy();
    } else if (!tGrow4.isPlaying) {
      tGrow4.destroy();
    }
  }

}
