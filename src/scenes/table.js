class Table extends Phaser.Scene {
  constructor() {
    super('tableScene')
  }

  create() {

    //-----ANIMATIONS-------
    this.machineAnim = this.anims.create({
      key: 'begin',
      frames: this.anims.generateFrameNames('animachine', { prefix: 'machine', start: 0, end: 30, zeroPad: 4 }),
    });

    this.machineAnim = this.anims.create({
      key: 'end',
      frames: this.anims.generateFrameNames('animachine', { prefix: 'machine', start: 61, end: 90, zeroPad: 4 }),
    });

    this.machineAnim = this.anims.create({
      key: 'reset',
      frames: this.anims.generateFrameNames('animachine', { prefix: 'machine', start: 30, end: 0, zeroPad: 4 }),
    });

    //------MACHINE IMAGE---------
    this.machine = this.add.sprite(0, 0, 'animachine', "machine0000").setOrigin(0);

    //-----LEVER IMAGE AND SETUP------
    this.leverIgnitePoint = 166;//the point at which the lever activates the mechanism
    this.leverResetPoint = 322;
    this.leverSpeed = 0;
    this.leverMovable = true;

    //an invisible "hitbox" for the lever animation

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

    //-----INPUT LOGGER DATA STRUCTURE----
    this.iC = new InputController(this);

    //-----PLAYING CARDS------
    //Container for hand of cards
    this.hand = [];
    //instantiating 5 cards
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


    //---------GAME TIMER------
    this.totalTime = 1 * 1000;//length of one game
    this.gameOver = true;//WOAH PLOT TWIST

    //Visual Timer Stuff
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

    //---GAME OVER AND RENEWAL LOGIC---
    this.cardTaken = true;
    //determines a middle state where game isn't fully over but no input should be read
    this.input.on('pointerdown', () => {
      if (this.cardTaken) {
        this.machine.anims.play('begin');
        //set up ending card
        this.flip = 180 * Phaser.Math.Between(0, 1);
        this.tCard = Phaser.Math.Between(0, 21);
        this.cardTaken = false;

        //---INSTANTIATING LEVER CONTROLLES---
        this.leverBoundary = this.add.rectangle(326, 115, 60, 130).setOrigin(0, 0);
        this.leverBoundary.setInteractive({
          draggable: true,
          useHandCursor: true,
          clickable: false,
        });
        
        this.leverBoundary.on('drag', (pointer, dragX, dragY) => {
          if (this.gameOver || !this.leverMovable) {
            return;
          }

          this.leverBoundary.x = dragX;//moves the lever along with the pointer
        });
      }
    });

    //---MAKING SURE PLAYER CANT "MASH THROUGH OPENING CUTSCENE"---
    this.machine.on('animationcomplete-begin', () => {
      this.gameOver = false;
      this.hasStarted = false;
      //start w/ full lever access to "boot" machine
      this.lockpoint = 120;
    })

    this.machine.on('animationcomplete-reset', () => {
      this.gameOver = true;
      this.cardTaken = true;
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
  }

  startTimer() {
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
          this.gameOver = true;
          this.finish();
          //music.stop();
          //goMusic.setLoop(false);
          //goMusic.setVolume(0.025);
          //goMusic.play();
        },
      })
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
    this.machine.anims.play('end');

    for (let i = 0; i < this.hand.length; i++) {
      this.hand[i].terminate();
    }

    //Generates an invisible hitbox over the animated card object
    this.tHB = this.add.rectangle(265, 430, 90, 80);
    this.tHB.setInteractive({
      useHandCursor: true,
    }).on('pointerdown', () => {
      this.machine.setFrame('machine0030');
      this.displayTarot();
      this.tHB.disableInteractive();
      this.tHB.destroy();
    });

    this.leverBoundary.disableInteractive();
    this.leverBoundary.destroy
  }

  displayTarot() {
    let clickedOnce = false;
    this.tarot = this.add.sprite(gameConfig.width / 2 + 10, gameConfig.height / 2, 'cards', 'backCard').setOrigin(.5, .5);
    this.tarot.setAngle(this.flip);
    this.tarot.setScale(1.5,1.5);
    this.tarot.setInteractive({
      useHandCursor: true,
    }).on('pointerdown', () => {

      if (!clickedOnce) {
        this.flipCard(this.tarot, 'cards', `${this.tCard}`);
        clickedOnce = true;
      } else {
        this.tarot.destroy();
        this.machine.anims.play('reset');
      }
    });

  }

  playDraw() {
    /*
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
      //console.log('destroy');
    } else if (!cDraw2.isPlaying) {
      cDraw2.destroy();
      //console.log('destroy');
    } else if (!cDraw3.isPlaying) {
      cDraw3.destroy();
      //console.log('destroy');
    } else if (!cDraw4.isPlaying) {
      cDraw4.destroy();
      //console.log('destroy');
    } else if (!cDraw5.isPlaying) {
      cDraw5.destroy();
      //console.log('destroy');
    }
    */
  }

  playShuffle() {
    /*
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
      console.log('destroy');
    } else if (!cShuffle2.isPlaying) {
      cShuffle2.destroy();
      console.log('destroy');
    } else if (!cShuffle3.isPlaying) {
      cShuffle3.destroy();
      console.log('destroy');
    } else if (!cShuffle4.isPlaying) {
      cShuffle4.destroy();
      console.log('destroy');
    }
*/
  }

  playGrowth() {
    /*
    let sfxVar = Math.floor(Math.random() * 4);
    if (sfxVar == 0) {
      //this.tGrow1.play();
      if (this.tGrow1.isPlaying) {
        return
      } else if (!this.tGrow1.isPlaying) {
        //this.tGrow1.destroy();
        //console.log('destroy');
      }
    } else if (sfxVar == 1) {
      //this.tGrow2.play();
      if (this.tGrow2.isPlaying) {
        return
      } else if (!this.tGrow2.isPlaying) {
        //this.tGrow2.destroy();
        console.log('destroy');
      }
    } else if (sfxVar == 2) {
      this.tGrow3.play();
      if (this.tGrow3.isPlaying) {
        return
      } else if (!this.tGrow3.isPlaying) {
        this.tGrow3.destroy();
        //console.log('destroy');
      }
    } else if (sfxVar == 3) {
      //this.tGrow4.play();
      if (this.tGrow4.isPlaying) {
        return
      } else if (!this.tGrow4.isPlaying) {
        this.tGrow4.destroy();
        //console.log('destroy');
      }
    }
 
    if (!tGrow1.isPlaying) {
      tGrow1.destroy();
      console.log('destroy');
    } else if (!tGrow2.isPlaying) {
      tGrow2.destroy();
      console.log('destroy');
    } else if (!tGrow3.isPlaying) {
      tGrow3.destroy();
      console.log('destroy');
    } else if (!tGrow4.isPlaying) {
      tGrow4.destroy();
      console.log('destroy');
    }
    */
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

    //game over check
    if (this.gameOver) {
      return;
    }

    if (this.hasStarted) {
      this.checkCardCount();
    }
    //LEVER MOTION

    this.leverBoundary.x = Phaser.Math.Clamp(this.leverBoundary.x, this.lockpoint, 326);
    //always move a little in the speed direction

    //sets a reset point that resets all lever values
    if (this.leverBoundary.x > this.leverResetPoint) {
      this.leverSpeed = 0;
      this.leverMovable = true;
    }

    if (this.leverMovable) {
      this.leverSpeed = 2 + ((this.leverBoundary.x) / 50);//its resistance increases as player pulls
    }

    this.leverBoundary.x += this.leverSpeed;

    this.boundInt = Phaser.Math.Snap.Ceil((this.leverBoundary.x), 1);

    let percDone = 1 - ((this.boundInt - 156) / (335 - 156));
    this.percDone = Phaser.Math.Clamp(percDone, 0, 1);

    if (this.boundInt > 0) {
      let progPerc = (Phaser.Math.Snap.Ceil((percDone) * 29, 1) + 31);
      progPerc = Phaser.Math.Clamp(progPerc, 31, 60);
      this.machine.setFrame('machine' + this.formatNum(progPerc));
    }

    if ((this.leverBoundary.x < this.leverIgnitePoint) && this.leverMovable) {
      this.leverMovable = false;
      if (this.hasStarted) {
        this.iC.processSelection(this.hand);
      } else {
        this.setRealCards();
        this.startTimer();
        this.hasStarted = true;
      }
      this.leverDrag.play();
      if (!this.leverDrag.isPlaying) {
        this.leverDrag.destroy();
        console.log('lever');
      }
    }
  }
}
