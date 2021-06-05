class Title extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }

    preload() {
        this.load.path = "./assets/";

        this.load.json('dialog', 'json/dialog.json');
        this.load.json('talk', 'json/talk.json');

        this.load.image('dialogbox', 'dialogbox.png');

        this.load.bitmapFont('gem_font', 'font/gem.png', 'font/gem.xml');
    }

    create() {
        this.add.bitmapText(gameConfig.width/2, gameConfig.height/2 - 32, 'gem_font', 'THE TOWER OF DESTINY', 32).setOrigin(0.5);
        this.add.bitmapText(gameConfig.width/2, gameConfig.height/2+64, 'gem_font', 'Click to start', 16).setOrigin(0.5);

        cursors = this.input.mousePointer;
    }

    update() {
        if(cursors.isDown) {
            this.scene.start("loadingScene");
        }
    }
}