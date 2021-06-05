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

        this.load.atlas('cards', 'assets/cardSheet.png', 'assets/cardSheet.json');
        this.load.atlas('animachine', 'assets/machineAnim.png', 'assets/machineAnim.json');
        this.load.atlas('cards', 'assets/cardSheet.png', 'assets/cardSheet.json');
        
        this.load.image('big', 'assets/big_hand.png');
        this.load.path = 'assets/';//shortens future path names

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

    create() {
        //this.scene.start("introScene");
        this.scene.start("tableScene");
    }
}