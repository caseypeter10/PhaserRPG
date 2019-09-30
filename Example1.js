var enemy = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,

    initialize:

    // enemy constructor
    function enemy(scene)
    {
        Phaser.GameObjects.Image.call(this, scene,0,0, 'Enemy');
        this.speed = 1;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setPosition(200,200);
        this.setSize(32,32,true);
        this.setActive(true);
        this.setVisible(true);
    },

    update: function(delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
    }

})

var bullet = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,

    initialize:

    //Bullet Constructor
    function bullet(scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Bullet');
        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
    },

    fire: function(shooter, target)
    {
        this.setPosition(shooter.x, shooter.y); 
        this.rotation = shooter.rotation;
        this.direction = Math.atan( (target.x-this.x) / (target.y - this.y));
        
        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= shooter.y)
        {
            //console.log("this.player.rotation in movement handler = " + this.player.rotation);

            console.log("shooter.direction is: " + shooter.direction);

            this.xSpeed = this.speed*Math.sin(this.direction);           
            this.ySpeed = this.speed*Math.cos(this.direction);            
            console.log("ySpeed is: " + this.ySpeed);
        }
        else
        {
            console.log("shooter.rotation in else is: " + shooter.rotation);

            this.xSpeed = -1*(this.speed*Math.sin(this.direction));
            console.log("this.direction is: " + this.direction);
            console.log("xSpeed is:" + this.xSpeed);
            console.log("bullet this.direction is: " + this.direction);
            this.ySpeed = -1*(this.speed*Math.cos(this.direction));
            console.log("ySpeed is: " + this.ySpeed);
        }

        this.born = 0; // Time since new bullet spawned
    },

    update: function(time, delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

});


class Example1 extends Phaser.Scene{
    constructor() {
        super({key:"Example1"});
    }

    preload(){
        this.load.image('Tower', 'assets/tower.png');
        this.load.image('Player', 'assets/player.png');
        this.load.image('Reticle','assets/reticle.png');
        this.load.image('Bullet', 'assets/ammo.png');
        this.load.image('Enemy', 'assets/monster.png');
    }

    create(){
        
        this.playerBullets = this.physics.add.group({ classType: bullet, runChildUpdate: true});
        this.enemyBullets = this.physics.add.group({classType: bullet, runChildUpdate: true});
        this.enemies = this.physics.add.group({classType: enemy, runChildUpdate: true });

        this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);


        this.reticle = this.add.sprite(300 + 20, 400 + 20, 'Reticle');

        var enemyA = this.enemies.get().setActive(true).setVisible(true);

        enemyA.setPosition(200, 200);

        this.player = this.generatePlayer();
        //this.camera.follow(this.player);

        this.input.on('pointerdown', function(pointer, reticle){   
            //this.add.image(pointer.x, pointer.y, 'Enemy');

            var bullet = this.playerBullets.get().setActive(true).setVisible(true);

            if (bullet)
            {
                console.log("This.player.rotation before bullet.fire: " + this.player.rotation);
                bullet.fire(this.player, this.reticle);
                this.physics.add.collider(enemyA, bullet, enemyHitCallback);
            }
        }, this);

        this.input.keyboard.on('keyup_P', function(event){
            var physicsImage = this.physics.add.image(this.image.x, this.image.y, 'Tower');
            physicsImage.setVelocity(Phaser.Math.RND.integerInRange(-100,100),-300);
        }, this);

        this.input.keyboard.on('keyup', function(e){
            if(e.key == "2"){
                this.scene.start("Example2");
            }
            if(e.key == "3"){
                this.scene.start("Example3");
            }
        }, this)
        this.showLabels();

        this.input.on('pointermove', function(pointer){
            {
                this.reticle.x = pointer.x;
                this.reticle.y = pointer.y;
                //console.log("this.reticle.x = " + this.reticle.x);
                //console.log("this.reticle.y = " + this.reticle.y);
            }
        }, this)

    }

    update(delta){
        //Movement handling
        this.movementHandler();
    }


    movementHandler(){

        this.player.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.reticle.x, this.reticle.y);
        //console.log("this.player.rotation in movement handler = " + this.player.rotation);

        if(this.key_A.isDown){
            this.player.x--;
        }
        if(this.key_W.isDown){
            this.player.y--;
        }
        if(this.key_S.isDown){
            this.player.y++;
        }
        if(this.key_D.isDown){
            this.player.x++;
        }
    }

    generatePlayer(){
        // Generate the player
        var player = this.add.sprite(300, 400, 'Player');
        //player.body.collideWorldBounds = false;
        player.alive = true;

        player.name = 'Krod';
        player.level = 1;

        player.health = 100;
        player.vitality = 100;
        player.strength = 25;
        player.speed = 125;

        return player;
    }

    showLabels(){
        var text  ='9';
        var style = {font: '10px Arial', fill: '#fff', align: 'center'};
        this.notificationLabel = this.add.text( 25, 25, text, style);

        var style = {font: '10px Arial', fill: '#fff', align: 'center'};
        this.xpLabel = this.add.text(25, 550, text, style);
    
        var style = { font: '20px Arial', fill: '#fff', align: 'center' };
        this.healthLabel = this.add.text(225, 575, text, style);

        var style = { font: '10px Arial', fill: '#fff', align: 'center' };
        this.goldLabel = this.add.text(725, 25, text, style);

        var style = { font: '10px Arial', fill: '#fff', align: 'center' };
        this.spellLabel = this.add.text(230, 575, text, style);
    }

    levelUp(){
        this.player.level++;
        this.player.vitality += 5;
        this.player.health += 5;
        this.player.strength += 1;
        this.player.speed += 1;
        this.xp -= this.xpToNext;
        this.xpToNext = Math.floor(this.xpToNext * 1.1);
        this.notification = this.player.name + ' has advanced to level ' + this.player.level + '!';
    }   
}

function enemyHitCallback(enemyHit, bulletHit)
{
     // Reduce health of enemy
     if (bulletHit.active === true && enemyHit.active === true)
     {
         enemyHit.health = enemyHit.health - 1;
         console.log("Enemy hp: blart", enemyHit.health);
 
         // Kill enemy if health <= 0
         //if (enemyHit.health <= 0)
         //{
         enemyHit.setActive(false).setVisible(false);
         //}
 
         // Destroy bullet
         bulletHit.setActive(false).setVisible(false);
     }
 } 