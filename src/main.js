'use strict';

let gameConfig = {
  type: Phaser.AUTO, //auto render
  width: 500,
  height: 500,
  scene: [Loading, Table], //scenes
};

let game = new Phaser.Game(gameConfig);//instantiate game

//All user experience based settings(i.e. gamespeed, difficulty, etc)
let settings = {

}

let green_value = 1;

let blue_value = 0.5;

let timeLeft = 59;