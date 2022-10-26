import { Scene } from 'phaser';

import background from 'assets/dungeon/background.png';
import { SCREEN_WIDTH, SCREEN_HEIGHT, DEFAULT_X_VELOCITY, DEFAULT_Y_VELOCITY } from 'constants';

export default class Dungeon extends Scene {
  constructor() {
    super('Dungeon');
  }

  preload() {
    this.load.image('player', 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Pan_Blue_Circle.png');
    this.load.image('background', background);
  }

  create() {
    console.log(background);
    this.container = this.add.container(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.background = this.add.tileSprite(0, 0, 32, 32, 'background');

    this.container.add(this.background);

    this.player = this.physics.add
      .sprite(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 'player')
      .setScale(0.1);

    this.player.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-DEFAULT_X_VELOCITY);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(DEFAULT_X_VELOCITY);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.space.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-DEFAULT_Y_VELOCITY);
    }
  }
}
