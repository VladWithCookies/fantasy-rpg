import { SCREEN_WIDTH, SCREEN_HEIGHT } from './constants';
import Dungeon from './scenes/Dungeon';

const config = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 2000 },
      enableBody: true,
    },
  },
  scene: [Dungeon],
};

new Phaser.Game(config);
