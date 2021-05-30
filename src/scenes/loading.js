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
        this.load.bitmapFont('digital', 'assets/font/digital-7.ttf');
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
        this.timer = this.add.image(game.config.width / 2, game.config.height / 2, 'timer');
        this.timer.setDisplaySize(game.config.width, game.config.height);
        console.log("loading scene");

        this.timeText = this.add.text(gameConfig.width/2-110, gameConfig.height/2-50, '0:',timeConfig);
        timeLeft = 59;
        this.remainText = this.add.text(gameConfig.width/2, gameConfig.height/2-50, timeLeft, timeConfig);
    
        this.timing = this.time.addEvent({
            delay: 1000, // time in ms
            paused: false, // timer continues even when clicked off if set to false
            loop: true, // repeats
            callback:()=> {
                timeLeft -= 1;
            }
        });
    }

    update() {
        this.remainText.text = timeLeft;

        if(timeLeft == 59){
            this.scene.start('tableScene');
        }
    }

}