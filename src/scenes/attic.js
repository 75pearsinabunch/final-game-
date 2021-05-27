class Attic extends Phaser.Scene{
    constructor(){
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
    preload(){
        this.load.image('attic', 'assets/attic.png');
        this.load.image('machine', 'assets/blender/machine.png');
    }
    create(){
        this.attic = this.add.sprite(0, 0, 'attic').setOrigin(0, 0);
        this.machine = this.add.sprite(0, 0, 'machine').setOrigin(0, 0);
        this.talk = this.cache.json.get('talk');
        this.dialogbox = this.add.sprite(this.DBOX_X - 100, this.DBOX_Y, 'dialogbox').setOrigin(0);
        this.talkText = this.add.bitmapText(this.TEXT_X, this.TEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE);
        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE);
        cursors = this.input.mousePointer;
        this.typeText();
        console.log("intro scene");
    }

    update() {
        if (cursors.isDown && !this.talkTyping) {
            this.typeText();
        }
    }
    typeText() {
        this.talkTyping = true;
        this.talkText.text = '';
        this.nextText.text = '';
        if (this.talkLine > this.talk[this.talkConvo].length - 1) {
            this.talkLine = 0;
            this.talkConvo++;
            console.log("to title scene");
            this.scene.start("loadingScene");
        }

        if (this.talkConvo >= this.talk.length) {
            console.log('End of Conversations');
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