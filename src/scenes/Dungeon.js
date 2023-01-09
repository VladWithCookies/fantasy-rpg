import { Scene } from 'phaser';

import { SCREEN_HEIGHT, DEFAULT_X_VELOCITY, DEFAULT_Y_VELOCITY, TILE_SIZE } from 'constants';
import ground from 'assets/textures/grey-bricks.png';
import background from 'assets/textures/black-bricks.png';
import skeleton from 'assets/spritesheets/skeleton.png';
import skeletonMage from 'assets/spritesheets/skeleton-mage.png';

export default class Dungeon extends Scene {
  constructor() {
    super('Dungeon');
  }

  preload() {
    this.load.image('ground', ground);
    this.load.image('background', background);
    this.load.spritesheet('player', skeletonMage, { frameWidth: 624 / 4, frameHeight: 236 });
    this.load.spritesheet('skeleton', skeleton, { frameWidth: 432 / 4, frameHeight: 212 })
  }

  createLevel() {
    this.width = 2000;
    this.height = SCREEN_HEIGHT;

    const centerX = this.width / 2;
    const centerY = this.height / 2;

    const groundY = this.height - TILE_SIZE / 2;
    const groundWidth = this.width + TILE_SIZE / 2;

    const backgroundX = - centerX;
    const backgroundY = - (centerY + 8);

    const container = this.add.container(this.width, this.height);
    const background = this.add.tileSprite(backgroundX, backgroundY, this.width, this.height, 'background');

    container.add(background);

    this.ground = this.add.tileSprite(centerX, groundY, groundWidth, TILE_SIZE, 'ground');
    this.physics.add.existing(this.ground);
    this.ground.body.immovable = true;
    this.ground.body.allowGravity = false;
    this.physics.world.setBounds(0, 0, this.width, this.height);
  }

  createPlayer() {
    this.player = this.physics.add.sprite(700, 200, 'player');
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'player-idle',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1
    });

    this.player.anims.play('player-idle', true);
  }

  createEnemies() {
    this.skeleton = this.physics.add.sprite(100, 200, 'skeleton');
    this.skeleton.setCollideWorldBounds(true);

    this.anims.create({
      key: 'skeleton-move',
      frames: this.anims.generateFrameNumbers('skeleton', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    this.skeleton.anims.play('skeleton-move', true);

    this.skeleton.move = this.tweens.add({
      targets: this.skeleton,
      x: 500,
      ease: 'Linear',
      duration: 3000,
      repeat: -1,
      yoyo: true,
      flipX: true
    });
  }

  createCamera() {
    this.cameras.main.setBounds(0, 0, this.width, this.height);
    this.cameras.main.startFollow(this.player, true, 0.5, 0.5);
  }

  createControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  updatePlayer() {
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

  updateEnemies() {
    if (Phaser.Math.Distance.BetweenPoints(this.player, this.skeleton) < 200) {
      this.skeleton.move.stop();
      this.skeleton.flipX = this.skeleton.x > this.player.x;

      if (this.player.x < this.skeleton.x && this.skeleton.body.velocity.x >= 0) {
        this.skeleton.body.velocity.x = -200;
      } else if (this.player.x > this.skeleton.x && this.skeleton.body.velocity.x <= 0) {
        this.skeleton.body.velocity.x = 200;
      }

      if (this.physics.overlap(this.player, this.skeleton)) {
        this.cameras.main.shake(300, 0.002);
        this.player.immune = true;

        this.time.addEvent({
          delay: 300,
          callback: () => {
            if (this.player.x < this.skeleton.x) {
              this.player.body.setVelocityX(2 * -DEFAULT_X_VELOCITY);
            } else if (this.player.x > this.skeleton.x) {
              this.player.body.setVelocityX(2 * DEFAULT_X_VELOCITY);
            }

            this.player.immune = false;
          }
        });
      }
    }
  }

  create() {
    this.createLevel();
    this.createPlayer();
    this.createEnemies();
    this.createCamera();
    this.createControls();
  }

  update() {
    this.physics.collide(this.player, this.ground);
    this.physics.collide(this.skeleton, this.ground);

    this.updatePlayer();
    this.updateEnemies();
  }
}
