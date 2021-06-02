//An actor is one of the characters in our scene
//they are automatically instantiated to be interactive
class Loading extends Phaser.Scene {
    constructor() {
        super("loadingScene");
    }
    preload() {
        this.load.image('1back','assets/cardBack.png');
        this.load.image('timer', 'assets/loading.png');
        this.load.atlas('cards','assets/cardSheet.png', 'assets/cardSheet.json');
        this.load.atlas('animachine','assets/machineAnim.png','assets/machineAnim.json');
        //this.load.bitmapFont('digital', 'assets/font/digital-7.ttf');
    }
    create() {
        let timeConfig = {
            fontSize: '100px',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        };
        
        this.remainText = this.add.text(0, gameConfig.height/2-50, "Loading", timeConfig);
        this.scene.start("tableScene");
    }
}