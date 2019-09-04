const { FuseBox } = require('fuse-box');

const fuse = FuseBox.init({
  homeDir: '../src',
  output: '../bundle/$name.js',
});

fuse.bundle('etherscan-api').instructions(`> Client.ts`);

fuse.run();