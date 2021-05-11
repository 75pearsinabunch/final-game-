'use strict';

let gameConfig = {
  width: 500,
  height: 500,
  type: Phaser.AUTO, //auto render
  scene:[Table], //scenes
};

let game = new Phaser.Game(gameConfig);//instantiate game

//All user experience based settings(i.e. gamespeed, difficulty, etc)
let settings = {

}
