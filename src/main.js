'use strict';

let gameConfig = {
  type: Phaser.AUTO, //auto render
  width: 500,
  height: 500,
  scene: [Table], //scenes
};

let game = new Phaser.Game(gameConfig);//instantiate game

//All user experience based settings(i.e. gamespeed, difficulty, etc)
let settings = {

}


let value = 1;