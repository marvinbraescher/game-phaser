class Enemy extends Phaser.Physics.Arcade.Sprite{


    constructor(scene,x ,y){

        //pegar nosso monstrinho chamado slime para aplicar no game
        super(scene,x,y,'enemy', 0)
        this.scene = scene


        // habilitando as fisicas do mundo
        this.scene.physics.world.enable(this)

        //adiciona nosso player na cena
        this.scene.add.existing(this)

        //setting time to enemy moves
        var delayS = 200;
        this.timeEvent = this.scene.time.addEvent({
            delay: delayS,
            callback: this.move,
            loop: true,
            callbackScope: this
        })
    }

    move(){
        const randNumber = Math.floor(Math.random() * 4 + 1)
        switch(randNumber){
            case 1: 
                this.setVelocityX(500)
                break
            case 2: 
                this.setVelocityX(-500)
                break
            case 3: 
                this.setVelocityY(500)
                break
            case 4: 
                this.setVelocityY(-500)
                break
            default: 
                this.setVelocityX(500)
        }

        this.scene.time.addEvent({
            delay:500,
            callback: () => {
                this.setVelocity(0)
            },
            callbackScope: this,
        })
    }

  

}

export default Enemy