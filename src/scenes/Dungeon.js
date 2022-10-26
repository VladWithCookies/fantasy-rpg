import { Scene } from 'phaser';

import { SCREEN_HEIGHT, DEFAULT_X_VELOCITY, DEFAULT_Y_VELOCITY, TILE_SIZE } from 'constants';
import background from 'assets/dungeon/background.png';
import ground from 'assets/dungeon/ground.png';

export default class Dungeon extends Scene {
  constructor() {
    super('Dungeon');
  }

  preload() {
    this.load.image('player', 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Pan_Blue_Circle.png');
    this.load.image('background', background);
    this.load.image('ground', ground);
  }

  create() {
    const width = 2000;
    const height = SCREEN_HEIGHT;
    const centerX = width / 2;
    const centerY = height / 2;

    const groundY = height - TILE_SIZE / 2;
    const groundWidth = width + TILE_SIZE / 4;

    const backgroundX = - centerX;
    const backgroundY = - (centerY + 8);

    const container = this.add.container(width, height);
    const background = this.add.tileSprite(backgroundX, backgroundY, width, height, 'background');

    container.add(background);

    this.ground = this.add.tileSprite(centerX, groundY, groundWidth, TILE_SIZE, 'ground');
    this.physics.add.existing(this.ground);
    this.ground.body.immovable = true;
    this.ground.body.allowGravity = false;

    this.player = this.physics.add.sprite(200, 200, 'player').setScale(0.1);
    this.player.setCollideWorldBounds(true);

    this.physics.world.setBounds(0, 0, width, height);
    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.startFollow(this.player, true, 0.5, 0.5);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.physics.collide(this.player, this.ground);

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
