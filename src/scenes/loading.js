//An actor is one of the characters in our scene
//they are automatically instantiated to be interactive
class Loading extends Phaser.Scene {
    constructor() {
        super("loadingScene");
    }

    preload() {
      let timeConfig = {
          fontSize: '100px',
          align: 'center',
          padding: {
              top: 5,
              bottom: 5,
          },
          fixedWidth: 0
      };
      this.remainText = this.add.text(0, gameConfig.height / 2, "Loading", timeConfig).setOrigin(0, 0.5);


        this.load.path = 'assets/';//shortens future path names


        this.load.atlas('cards', 'cardSheet.png', 'cardSheet.json');
        this.load.atlas('body', 'body.png', 'body.json');
        this.load.atlas('handle', 'handle.png', 'handle.json');
        this.load.image('big', 'big_hand.png');
        
      // this.load.audio('cDraw1', 'audio/CardDraw-01.wav');
      // this.load.audio('cDraw2', 'audio/CardDraw-02.wav');
      // this.load.audio('cDraw3', 'audio/CardDraw-03.wav');
      // this.load.audio('cDraw4', 'audio/CardDraw-04.wav');
      // this.load.audio('cDraw5', 'audio/CardDraw-05.wav');

      // this.load.audio('cShuffle1', 'audio/CardShuffle-01.wav');
      // this.load.audio('cShuffle2', 'audio/CardShuffle-02.wav');
      // this.load.audio('cShuffle3', 'audio/CardShuffle-03.wav');
      // this.load.audio('cShuffle4', 'audio/CardShuffle-04.wav');

      // this.load.audio('tGrow1', 'audio/Rumble-01.wav');
      // this.load.audio('tGrow2', 'audio/Rumble-02.wav');
      // this.load.audio('tGrow3', 'audio/Rumble-03.wav');
      // this.load.audio('tGrow4', 'audio/Rumble-04.wav');

      this.load.audio('leverDrag', 'audio/LeverDrag.wav');
    }

    create() {
        //this.scene.start("introScene");
        //this.scene.start("atticScene");
        this.scene.start("tableScene");
    }

    // playDraw() {
    //   //---CARD SELECT AUDIO---
    //   let selectConfig = {
    //     mute: false,
    //     volume: 0.3,
    //     rate: 1,
    //     detune: 0,
    //     seek: 0,
    //     loop: false,
    //     delay: 0
    //   }
    //   let cDraw1 = this.sound.add('cDraw1', selectConfig);
    //   let cDraw2 = this.sound.add('cDraw2', selectConfig);
    //   let cDraw3 = this.sound.add('cDraw3', selectConfig);
    //   let cDraw4 = this.sound.add('cDraw4', selectConfig);
    //   let cDraw5 = this.sound.add('cDraw5', selectConfig);
    
    
    //   let sfxVar = Math.floor(Math.random() * 5);
    //   if (sfxVar == 0) {
    //     cDraw1.play();
    //   } else if (sfxVar == 1) {
    //     cDraw2.play();
    //   } else if (sfxVar == 2) {
    //     cDraw3.play();
    //   } else if (sfxVar == 3) {
    //     cDraw4.play();
    //   } else if (sfxVar == 4) {
    //     cDraw5.play();
    //   }
    
    //   if (!cDraw1.isPlaying) {
    //     cDraw1.destroy();
    //     console.log('destroy');
    //   } else if (!cDraw2.isPlaying) {
    //     cDraw2.destroy();
    //     console.log('destroy');
    //   } else if (!cDraw3.isPlaying) {
    //     cDraw3.destroy();
    //     console.log('destroy');
    //   } else if (!cDraw4.isPlaying) {
    //     cDraw4.destroy();
    //     console.log('destroy');
    //   } else if (!cDraw5.isPlaying) {
    //     cDraw5.destroy();
    //     console.log('destroy');
    //   }
      
    // }
    
    // playShuffle() {
    //   //---DISAPPROVE AUDIO---
    //   let shuffleConfig = {
    //     mute: false,
    //     volume: 1,
    //     rate: 1,
    //     detune: 0,
    //     seek: 0,
    //     loop: false,
    //     delay: 0
    //   }
    //   let cShuffle1 = this.sound.add('cShuffle1', shuffleConfig);
    //   let cShuffle2 = this.sound.add('cShuffle2', shuffleConfig);
    //   let cShuffle3 = this.sound.add('cShuffle3', shuffleConfig);
    //   let cShuffle4 = this.sound.add('cShuffle4', shuffleConfig);
    
    //   let sfxVar = Math.floor(Math.random() * 4);
    //   if (sfxVar == 0) {
    //     cShuffle1.play();
    //   } else if (sfxVar == 1) {
    //     cShuffle2.play();
    //   } else if (sfxVar == 2) {
    //     cShuffle3.play();
    //   } else if (sfxVar == 3) {
    //     cShuffle4.play();
    //   }
    
    //   if (!cShuffle1.isPlaying) {
    //     cShuffle1.destroy();
    //     console.log('destroy');
    //   } else if (!cShuffle2.isPlaying) {
    //     cShuffle2.destroy();
    //     console.log('destroy');
    //   } else if (!cShuffle3.isPlaying) {
    //     cShuffle3.destroy();
    //     console.log('destroy');
    //   } else if (!cShuffle4.isPlaying) {
    //     cShuffle4.destroy();
    //     console.log('destroy');
    //   }
  
    // }
    
    // playGrowth() {
      
    //   let sfxVar = Math.floor(Math.random() * 4);
    //   if (sfxVar == 0) {
    //     this.tGrow1.play();
    //   } else if (sfxVar == 1) {
    //     this.tGrow2.play();
    //   } else if (sfxVar == 2) {
    //     this.tGrow3.play();
    //   } else if (sfxVar == 3) {
    //     this.tGrow4.play();
        
    //   }
    
    //   if (!tGrow1.isPlaying) {
    //     tGrow1.destroy();
    //     console.log('destroy');
    //   } else if (!tGrow2.isPlaying) {
    //     tGrow2.destroy();
    //     console.log('destroy');
    //   } else if (!tGrow3.isPlaying) {
    //     tGrow3.destroy();
    //     console.log('destroy');
    //   } else if (!tGrow4.isPlaying) {
    //     tGrow4.destroy();
    //     console.log('destroy');
    //   }
      
    // }
 
}