var config = {
    type: Phaser.AUTO,
    width:800,
    height:600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y : 200}
        }
    },
    scene: [ Example1, Example2 ]
};

var game = new Phaser.Game(config);

var bullet = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,

    initialize:

    //Bullet Constructor
    function Bullet(scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
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
        this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

        
    }

})