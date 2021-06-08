class Table extends Phaser.Scene {
  constructor() {
    super('tableScene')
  }

  create() {
    //-----MACHINE IMAGE AND ANIMATIONS-------
    //These are animations performed by the machine body throughout play
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
    //the main body of the machine's sprite
    this.machine = this.add.sprite(0, 0, 'body', "body0000").setOrigin(0, 0);

    //-------wire attatched to finger----
    this.wireOffset = (25 - score);
    this.wire = this.add.image(0, score + this.wireOffset, 'wire').setOrigin(0)
    //------- finger ------
    this.finger = this.add.image(150, score, 'finger').setOrigin(0, 0).setScale(0.25);//50-125-200 every 15

    //the sliding bar
    this.handle = this.add.sprite(0, 0, 'handle', 'machine0000').setOrigin(0);

    //-----LEVER IMAGE AND SETUP------
    this.leverIgnitePoint = 166;//the point at which the lever activates the mechanism
    this.leverResetPoint = 322;//point at which lever is considered at rest
    this.leverSpeed = 0;//speed the lever moves rightward on its own
    this.leverMovable = false;//whether the player can move the lever
    this.lockpoint = 120;//the furthest point left the lever can reach, this changes frequently

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

    //background music
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
    //a "hitbox" for the player go grab and pull the lever
    this.leverBoundary = this.add.rectangle(326, 115, 60, 130).setOrigin(0, 0);

    //moves this hitbox (if movable) relative to the player's drag
    this.leverBoundary.on('drag', (pointer, dragX, dragY) => {
      if (!this.leverMovable) {
        return;
      }

      this.leverBoundary.x = dragX;//moves the lever along with the pointer
    });

    let machineConfig = {
      mute: false,
      volume: 0.1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    }
    let machineOn = this.sound.add('mOn', machineConfig);

    //For purpose of repititious play, this determines if the final tarot card has been taken
    //by the player (the default is true)
    this.cardTaken = true;
    //establishes if the cards have been flipped to be visible to the player
    this.cardsTurned = false;
    //determines a middle state where game isn't fully over but no input should be read
    this.input.on('pointerdown', () => {
      if (this.cardTaken) {
        //does not use "hasStarted" because animations must occur before player can place input
        this.machine.anims.play('body-begin');
        machineOn.play();
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
    })

    //This on serves to reset the state of the game back to the start
    this.machine.on('animationcomplete-body-reset', () => {
      //reset interactability

      this.hasStarted = false;
      this.cardTaken = true;
      this.cardsTurned = false;
      this.lockpoint = 120;
      //lever movable should be equal to false already
    })
  }

  setRealCards() {
    //Container for hand of cards
    //instantiating 5 cards
    for (let i = 0; i < 5; i++) {
      //remove placeholder or previous card
      this.hand[i].destroy();
      //sets up new playing card objects in proper locations
      this.hand[i] = new PlayingCard(
        this,//scene 
        (55 * i + 149), //x
        (gameConfig.height - 189),//y
        this.iC //input controller
      );
    }

    //creates a fresh trie object
    this.iC.generateTries();
  }

  startTimer() {
    this.totalTime = 70 * 1000;//length of one game
    //does a backward spin to give the player the impression it is winding up
    //and to catch attention 
    this.startSpin = this.tweens.addCounter({
      from: 360,
      to: 0,
      duration: 500,
      onUpdate: (tween) => {
        this.big.setAngle(tween.getValue())
      },
      repeat: 0,
    });

    //begins rotating the clock hand to indicate the remaining time
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

      //locks controlls down after a game is over
      this.gOEvent = this.time.addEvent({

        delay: this.totalTime,
        callback: () => {
          this.leverMovable = false;//lock lever so player cant move it
        },
      })
      //a safety case to allow all player based actions to stop
      //once everything is guarenteed to stop, the game ends. 
      this.finishEvent = this.time.addEvent({
        delay: (this.totalTime + 1000),
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
        if (card == undefined) {
          tween.stop();
          console.warn("Sorry, something went wrong, please restart the game!");
        }
        card.scaleX = (tween.getValue() / card.width) * originalScaleX;
        if (tween.getValue() == 0) {
          card.setTexture(`${set}`, `${image}`);
        }
      },
      yoyo: true,
      repeat: 0,
    });
    return flipTween;
  }

  //Controls actions which occur to indicate that play is finished
  finish() {
    this.machine.anims.play('body-end');
    this.playTarot();

    for (let i = 0; i < this.hand.length; i++) {
      this.hand[i].terminate();
    }

    //Generates an invisible hitbox over the animated card object
    this.tHB = this.add.rectangle(265, 430, 90, 80);
    //creates a "pick up" scenario for the aparition of the printed
    //tarot card
    this.tHB.setInteractive({
      useHandCursor: true,
    }).on('pointerdown', () => {
      this.machine.setFrame('body0030');
      this.displayTarot();
      //break down the hitbox
      this.tHB.disableInteractive();
      this.tHB.destroy();
      this.playPull();
    });

    this.hasStarted = false;//close off game

    //make further lever usage impossible
    this.leverBoundary.disableInteractive();
  }

  //presents a tarot card to the player, reveals it, then removes it from the screen 
  //each on consecutive clicks
  displayTarot() {
    let machineConfig = {
      mute: false,
      volume: 0.1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    }
    let machineOff = this.sound.add('mOff', machineConfig);

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
        this.playDraw();
      } else {
        this.tarot.destroy();
        this.machine.anims.play('body-reset');
        machineOff.play();
        score = 125//resets hand/wire position
      }
    });

  }

  //Called whenever the lever is pulled, determines whether or not
  //the card conditions permit the lever to move
  checkCardCount() {
    //do nothing if the game hasn't yet begun
    if (!this.cardsTurned) {
      return;
    }
    //count active cards in hand
    let cardCount = 0;
    for (let i = 0; i < this.hand.length; i++) {
      if (this.hand[i].isSelected) {
        cardCount++;
      }
    }
    if (cardCount == 3) {
      //allows full bar pull
      this.lockpoint = 120;
    } else {
      //permits only partial pull
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

  //update is dedicated to the degree which the lever can move
  update() {
    //check number of cards selected and determine max motion distance
    this.checkCardCount();

    //-----in charge of moving the finger
    if (score >= 50) {

      this.finger.y = Phaser.Math.Linear(this.finger.y, score, .3);
    } else {
      this.finger.y = 50;
      score = 50;
    }
    if (score <= 200) {
      this.finger.y = Phaser.Math.Linear(this.finger.y, score, .3);
    } else {
      this.finger.y = 200;
      score = 200;
    }

    this.wire.y = this.finger.y + this.wireOffset;

    //clamp movement between current max left and the constant max right
    this.leverBoundary.x = Phaser.Math.Clamp(this.leverBoundary.x, this.lockpoint, 326);
    //always move a little in the speed direction

    //sets a reset point that resets all lever values
    if (this.leverBoundary.x > this.leverResetPoint && this.hasStarted) {
      //stops rightward motion
      this.leverSpeed = 0;
      //allows for player control of lever
      this.leverMovable = true;
    }

    //sets an increasing "resistance" to player's pulls
    if (this.leverBoundary.x < 300) {
      this.leverSpeed = 2 + ((this.leverBoundary.x) / 50);
    }

    //moves the lever backward to its resting position
    this.leverBoundary.x += this.leverSpeed;

    //a modifiable representation of the lever boundary's current location
    this.boundInt = this.leverBoundary.x;

    //calculating the percentage traversed for frame calculation
    let percDone = 1 - ((this.boundInt - 156) / (335 - 156));
    this.percDone = Phaser.Math.Clamp(percDone, 0, 1);

    //sets "animation" frames for both the handle and the machine's body
    if (this.boundInt > 0 && this.hasStarted) {
      let progPerc = (Phaser.Math.Snap.Ceil((percDone) * 29, 1) + 31);
      progPerc = Phaser.Math.Clamp(progPerc, 31, 60);
      this.handle.setFrame('machine' + this.formatNum(progPerc));
      this.machine.setFrame('body' + this.formatNum(progPerc));
    }

    //details what occurs when the player slides the lever furthest left
    //this will either flip cards to begin play or process a current selection of hands
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
      }
    }
  }

  //--------SFX--------
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
    }
    if (!cDraw2.isPlaying) {
      cDraw2.destroy();
    }
    if (!cDraw3.isPlaying) {
      cDraw3.destroy();
    }
    if (!cDraw4.isPlaying) {
      cDraw4.destroy();
    }
    if (!cDraw5.isPlaying) {
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
    }
    if (!cShuffle2.isPlaying) {
      cShuffle2.destroy();
    }
    if (!cShuffle3.isPlaying) {
      cShuffle3.destroy();
    }
    if (!cShuffle4.isPlaying) {
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
    }
    if (!tGrow2.isPlaying) {
      tGrow2.destroy();
    }
    if (!tGrow3.isPlaying) {
      tGrow3.destroy();
    }
    if (!tGrow4.isPlaying) {
      tGrow4.destroy();
    }
  }

  playPull() {
    let pullConfig = {
      mute: false,
      volume: 0.1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    }

    let pullTarot = this.sound.add('cardPull', pullConfig);
    pullTarot.play();

    if (!pullTarot.isPlaying) {
      pullTarot.destroy();
    }
  }

  playTarot() {
    let tarotConfig = {
      mute: false,
      volume: 0.1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    }

    let tarotOut = this.sound.add('tarotOut', tarotConfig);
    tarotOut.play();

    if (!tarotOut.isPlaying) {
      tarotOut.destroy();
    }
  }
}