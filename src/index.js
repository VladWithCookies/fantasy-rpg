import Dungeon from './scenes/Dungeon';

const config = {
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade'
  },
  scene: [Dungeon],
};

new Phaser.Game(config);
