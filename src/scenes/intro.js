class Intro extends Phaser.Scene{
    constructor(){
        super("introScene");
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
        this.dialogConvo = 0;			
        this.dialogLine = 0;			
        this.dialogSpeaker = null;		
        this.dialogTyping = false;		
        this.dialogText = null;			
        this.nextText = null;			
        this.tweenDuration = 500;
        this.OFFSCREEN_X = -500;        
        this.OFFSCREEN_Y = 1000;
    }
    preload(){
        this.load.image('intro', 'assets/intro.png');
    }
    create(){
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
        let doorOpen = this.sound.add('doorOpen', sfxConfig);
        doorOpen.play();
        
        this.intro = this.add.sprite(0, 0, 'intro').setOrigin(0,0);

        this.dialog = this.cache.json.get('dialog');
        this.dialogbox = this.add.sprite(this.DBOX_X-100, this.DBOX_Y, 'dialogbox').setOrigin(0);
        this.dialogText = this.add.bitmapText(this.TEXT_X, this.TEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE);
        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE);
        cursors = this.input.mousePointer;
        this.typeText();
    }
    update() {
        if(cursors.isDown && !this.dialogTyping) {
            this.typeText();
            this.click.play();
        }
    }
    typeText() {
        this.dialogTyping = true;

        this.dialogText.text = '';
        this.nextText.text = '';

        if(this.dialogLine > this.dialog[this.dialogConvo].length - 1) {
            this.dialogLine = 0;
            this.scene.start("atticScene");
        }

        if(this.dialogConvo >= this.dialog.length) {
            console.log('End of Conversations');
            this.dialogbox.visible = false;

        } else {
            this.dialogSpeaker = this.dialog[this.dialogConvo][this.dialogLine]['speaker'];
            if(this.dialog[this.dialogConvo][this.dialogLine]['newSpeaker']) {
                this.tweens.add({
                    targets: this[this.dialogSpeaker],
                    x: this.DBOX_X + 50,
                    duration: this.tweenDuration,
                    ease: 'Linear'
                });
            }
            this.dialogLines = this.dialog[this.dialogConvo][this.dialogLine]['speaker'].toUpperCase() + this.dialog[this.dialogConvo][this.dialogLine]['dialog'];
            let currentChar = 0; 
            this.textTimer = this.time.addEvent({
                delay: this.LETTER_TIMER,
                repeat: this.dialogLines.length - 1,
                callback: () => { 
                    this.dialogText.text += this.dialogLines[currentChar];
                    currentChar++;
                    if(this.textTimer.getRepeatCount() == 0) {
                        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, this.NEXT_TEXT, this.TEXT_SIZE).setOrigin(1);
                        this.dialogTyping = false;
                        this.textTimer.destroy();
                    }
                },
                callbackScope: this 
            });
            this.dialogText.maxWidth = this.TEXT_MAX_WIDTH;
            this.dialogLine++;
        }
    }
}