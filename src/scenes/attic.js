class Attic extends Phaser.Scene {
    constructor() {
        super("atticScene");
        this.DBOX_X = 0;
        this.DBOX_Y = 400;
        this.DBOX_FONT = 'gem_font';
        this.TEXT_X = 50;
        this.TEXT_Y = 445;
        this.TEXT_SIZE = 20;
        this.TEXT_MAX_WIDTH = 715;
        this.NEXT_TEXT = '[CLICK]';
        this.NEXT_X = 490;
        this.NEXT_Y = 490;
        this.LETTER_TIMER = 10;
        this.talkConvo = 0;
        this.talkLine = 0;
        this.talkSpeaker = null;
        this.talkTyping = false;
        this.talkText = null;
        this.nextText = null;
        this.tweenDuration = 500;
        this.OFFSCREEN_X = -500;
        this.OFFSCREEN_Y = 1000;
    }
    preload() {
        this.load.image('attic', 'assets/attic.png');
        this.load.image('big', 'assets/big_hand.png');

    }
    create() {
        let sfxConfig = {
            mute: false,
            volume: 0.5,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        }
        this.click = this.sound.add('click', sfxConfig);
        let footsteps = this.sound.add('footsteps', sfxConfig);
        footsteps.play();
        
        this.attic = this.add.sprite(0, 0, 'attic').setOrigin(0, 0);
        this.body = this.add.sprite(gameConfig.width / 2, 160, 'body', 'body0000').setOrigin(0, 0).setScale(0.5, 0.5);
        this.lever = this.add.sprite(gameConfig.width / 2, 160, 'handle', 'machine0000').setOrigin(0, 0).setScale(0.5, 0.5);

        var circle = new Phaser.Geom.Circle(430, 375, 14);//  Create a large circle, then draw the angles on it
        var graphics = this.add.graphics();
        graphics.lineStyle(1, 0xFFFFFF, 1); // white lines
        graphics.strokeCircleShape(circle);// make the circle
        graphics.beginPath();
        for (var a = 0; a < 360; a += 22.5) {
            graphics.moveTo(430, 375);
            var p = Phaser.Geom.Circle.CircumferencePoint(circle, Phaser.Math.DegToRad(a));
            graphics.lineTo(p.x, p.y);
        }
        graphics.strokePath(); // lines visiblity
        this.big = this.add.sprite(430, 375, 'big').setOrigin(.5, 1).setScale(0.10, 0.1);
        var r1 = this.add.circle(430, 375, 4, 0x000000);
        this.talk = this.cache.json.get('talk');
        this.dialogbox = this.add.sprite(this.DBOX_X - 100, this.DBOX_Y, 'dialogbox').setOrigin(0);
        this.talkText = this.add.bitmapText(this.TEXT_X, this.TEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE);
        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE);
        cursors = this.input.mousePointer;
        this.typeText();
    }

    update() {
        if (cursors.isDown && !this.talkTyping) {
            this.typeText();
            this.click.play();
        }
    }
    typeText() {
        this.talkTyping = true;
        this.talkText.text = '';
        this.nextText.text = '';
        if (this.talkLine > this.talk[this.talkConvo].length - 1) {
            this.talkLine = 0;
            this.talkConvo++;
            this.scene.start("tableScene");
        }

        if (this.talkConvo >= this.talk.length) {
            this.dialogbox.visible = false;
        } else {
            this.talkSpeaker = this.talk[this.talkConvo][this.talkLine]['speaker'];
            if (this.talk[this.talkConvo][this.talkLine]['newSpeaker']) {
                this.tweens.add({
                    targets: this[this.talkSpeaker],
                    x: this.DBOX_X + 50,
                    duration: this.tweenDuration,
                    ease: 'Linear'
                });
            }
            this.talkLines = this.talk[this.talkConvo][this.talkLine]['speaker'].toUpperCase() + this.talk[this.talkConvo][this.talkLine]['talk'];
            let currentChar = 0;
            this.textTimer = this.time.addEvent({
                delay: this.LETTER_TIMER,
                repeat: this.talkLines.length - 1,
                callback: () => {
                    this.talkText.text += this.talkLines[currentChar];
                    currentChar++;
                    if (this.textTimer.getRepeatCount() == 0) {
                        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, this.NEXT_TEXT, this.TEXT_SIZE).setOrigin(1);
                        this.talkTyping = false;
                        this.textTimer.destroy();
                    }
                },
                callbackScope: this
            });
            this.talkText.maxWidth = this.TEXT_MAX_WIDTH;
            this.talkLine++;
        }
    }
}