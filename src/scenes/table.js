class Table extends Phaser.Scene{
  constructor(){
    super('tableScene')
  }

  preload(){
    this.load.path= 'assets/';//shortens future path names
    this.load.image('cards', 'cardBack.png');
  }

  create(){
    //using event system from prof Altice's example
    //https://newdocs.phaser.io/docs/3.54.0/Phaser.Input.Events
    this.mouse = this.input.activePointer;

    //creating "square" object for tests
    this.square = this.add.rectangle(game.width/2, game.height/2, 100, 100,  0x6666ff);
  }

  update(){
    console.log(this.mouse.active);
  }
}