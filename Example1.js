class Example1 extends Phaser.Scene{
    constructor() {
        super({key:"Example1"});
    }

    preload(){
        this.load.image('Tower', 'assets/tower.png');
        this.load.image('Player', 'assets/player.png');
        this.load.image('Reticle','assets/reticle.png');
        this.load.image('Bullet', 'assets/ammo.png');
    }

    create(){
        
        playerBullets = this.physics.add.group({ classType: Bullet, runChileUpdate: true});

        this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);


        this.reticle = this.add.sprite(300 + 20, 400 + 20, 'Reticle');

        this.player = this.generatePlayer();
        //this.camera.follow(this.player);

        this.input.on('pointerdown', function(pointer){   
            this.add.image(pointer.x, pointer.y, 'Tower');

            var bullet = playerBullets.get().setActive(true).setVisible(true);

            if (bullet)
            {
                bullet.fire(this.player, this.reticle);
                this.physics.add.collider(enemy, bullet, enemyHitCallback);
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
            }
        }, this)

    }

    update(delta){
        //Movement handling
        this.movementHandler();
    }


    movementHandler(){

        this.player.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.reticle.x, this.reticle.y) + 1.6;

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
        var text  ='0';
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
         console.log("Enemy hp: ", enemyHit.health);
 
         // Kill enemy if health <= 0
         if (enemyHit.health <= 0)
         {
            enemyHit.setActive(false).setVisible(false);
         }
 
         // Destroy bullet
         bulletHit.setActive(false).setVisible(false);
     }
 } 