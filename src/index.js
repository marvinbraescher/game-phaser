import Phaser from "phaser";
//import logoImg from "./assets/logo.png";
import mapJSON from "./assets/map.json";
import mapPNG from "./assets/tilemap.png";
import water from "./assets/water.png";
import playerPNG from"./assets/player.png";
import enemyPNG from"./assets/enemy.png";
import Enemies from "./Emenies";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  backgroundColor: '#2d2d2d',
  width: 650,
  height:500,
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


var c =0;
var text;
var timedEvent;

function preload() {
    this.load.image("background", water);
    this.load.image("tiles", mapPNG);
    this.load.tilemapTiledJSON("map", mapJSON);
    this.load.spritesheet("player",playerPNG, {frameWidth:32, frameHeight:32})
    this.load.spritesheet("enemy",enemyPNG, {frameWidth:10, frameHeight:32})
    

}

function create() {
    
    const map = this.make.tilemap({key: "map"});
    const tileset = map.addTilesetImage("assets", "tiles");

    this.add.image(650,650, "background");

    const ground = map.createLayer("ground", tileset, 0 , 0);
    const objectCollider = map.createLayer("objectCollider", tileset, 0,0);
    const aboveObject = map.createLayer("aboveObject", tileset, 0,0);

    objectCollider.setCollisionByProperty({"collider" : true});
    ground.setCollisionByProperty({"collider" : true});
    aboveObject.setDepth(11);
    
    const spawnPoint = map.findObject(
      "player",
      objects => objects.name === "spawningPoint"

    )

    player = this.physics.add.sprite(spawnPoint.x,spawnPoint.y,"player");
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, objectCollider);

    this.enemies = map.createFromObjects("enemy", "enemy", {});
    this.enemiesGroup = new Enemies(this.physics.world, this, [], this.enemies)
    
    
   // this.physics.add.collider(this.enemiesGroup,objectCollider)
    this.physics.add.collider(this.enemiesGroup,ground)
    
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
      anims.create({
        key: "idle",
        frames: anims.generateFrameNames("enemy",  { frames: [1,2,3]}),
        frameRate: 10,
        repeat: -1,
        
      });


      var camera = this.cameras.main;
      camera.startFollow(player);
      camera.setZoom(1);
      camera.setBounds(0,0,map.withInPixels, map.heightInPixels);

      text = this.add.text(400, 32, 'Click to create animations', { color: '#00ff00', fontSize: '20px' , fontFamily: 'Fantasy'})
      .setOrigin(1.5, 0.5);
    timedEvent = this.time.addEvent({ delay: 2000, callback: onEvent, callbackScope: this, loop: true });
   
}
function update(){

  text.setText('\nScore: ' + c);
    player.body.setVelocity(0);
    cursors = this.input.keyboard.createCursorKeys();
    
    //Score aumenta se estiver andando;

    if(cursors.left.isDown ||cursors.right.isDown||cursors.up.isDown|| cursors.down.isDown){
      timedEvent.paused = false;
    }else{
      timedEvent.paused = true;
    }


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

/*function enemyFollow(player, enemiesGroup){
  this.physics.moveToObject(this.enemiesGroup, this.player, 100);
}*/

function onEvent ()
{
   c++;
 
}


function hitEnemy(player, enemyGroup) {
  alert("your score is: " +c)
  c=0;
  this.scene.restart();
}