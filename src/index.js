import Phaser from "phaser";
//import logoImg from "./assets/logo.png";
import mapJSON from "./assets/map.json";
import mapPNG from "./assets/tilemap.png";
import water from "./assets/water.png";
import playerPNG from"./assets/player.png";
import enemyPNG from"./assets/player.png";
import Enemies from "./Emenies";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 600,
  height:600,
  physics:{
      default:"arcade",
      arcade: {
          gravity:{y: 0}
      }
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  }
};

const game = new Phaser.Game(config);
let player;
var cursors;
var enemies;
function preload() {
    this.load.image("background", water);
    this.load.image("tiles", mapPNG);
    this.load.tilemapTiledJSON("map", mapJSON);
    this.load.spritesheet("player",playerPNG, {frameWidth:32, frameHeight:32})
    

}

function create() {
    
    const map = this.make.tilemap({key: "map"});
    const tileset = map.addTilesetImage("assets", "tiles");

    this.add.image(650,650, "background");

    const ground = map.createLayer("ground", tileset, 0 , 0);
    const objectCollider = map.createLayer("objectCollider", tileset, 0,0);
    const aboveObject = map.createLayer("aboveObject", tileset, 0,0);

    objectCollider.setCollisionByProperty({"collider" : true});
    aboveObject.setDepth(11);
    
    const spawnPoint = map.findObject(
      "player",
      objects => objects.name === "spawningPoint"

    )

    player = this.physics.add.sprite(spawnPoint.x,spawnPoint.y,"player");
    
    this.physics.add.collider(player, objectCollider);

    this.enemies = map.createFromObjects("enemy", "enemy", {});
    this.enemiesGroup = new Enemies(this.physics.world, this, [], this.enemies)
    
    this.physics.add.collider(this.enemiesGroup,objectCollider)
    this.physics.add.collider(this.enemiesGroup, player, hitEnemy, null, this)


    const anims = this.anims;
    anims.create({
      key: "left",
      frames: anims.generateFrameNames("player", { frames: [3,4,5]}),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "right",
      frames: anims.generateFrameNames("player",  { frames: [6,7,8]}),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "front",
      frames: anims.generateFrameNames("player",  { frames: [1]}),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "back",
      frames: anims.generateFrameNames("player",  { frames: [9,10,11]}),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
        key: "idle",
        frames: anims.generateFrameNames("player",  { frames: [1]}),
        frameRate: 10,
        repeat: -1,
      });

      var camera = this.cameras.main;
      camera.startFollow(player);
      camera.setZoom(1);
      camera.setBounds(0,0,map.withInPixels, map.heightInPixels);
}
function update(){
    player.body.setVelocity(0);
    cursors = this.input.keyboard.createCursorKeys();
   // kill = false;
  
   // this.physics.moveToObject(this.enemiesGroup, player, 100);
 
   // console.log(kill)
   //console.log(hitEnemy)
    //console.log(player.x)
    //console.log(this.enemies[0].x)
    //console.log(this.enemiesGroup)
    
    if (cursors.left.isDown) {
      player.body.setVelocityX(-200);
    } else if (cursors.right.isDown) {
      player.body.setVelocityX(200);
    } 
    if (cursors.up.isDown) {
      player.body.setVelocityY(-200);
    } else if (cursors.down.isDown) {
      player.body.setVelocityY(200);
    }

    if (cursors.left.isDown) {
        player.anims.play("left", true);
      } else if (cursors.right.isDown) {
        player.anims.play("right", true);
      } else if (cursors.up.isDown) {
        player.anims.play("back", true);
      } else if (cursors.down.isDown) {
        player.anims.play("front", true);
      } else {
          //player.anims.stop();
        player.anims.play("idle", true);
  
      }
}

function enemyFollow(player, enemiesGroup){
  this.physics.moveToObject(this.enemiesGroup, this.player, 100);
}


function hitEnemy(player, enemyGroup) {
// var kill = true;
  this.scene.restart();
}