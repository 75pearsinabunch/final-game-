class Table extends Phaser.Scene{
  constructor(){
    super('tableScene')
  }

  preload(){

  }

  create(){
    //using event system from prof Altice's example
    //https://newdocs.phaser.io/docs/3.54.0/Phaser.Input.Events
    this.mouse = this.input.activePointer;

    //creating "square" object for tests
    this.square = this.add.rectangle(width/2, height/2, 100, 100)
  }

  update(){
    console.log(this.mouse.active);
  }
}