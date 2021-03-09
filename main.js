// --------------------- GAME CONFIG --------------------- 
var gWidth = 1100
var gHeight = 800
var gGravity = 2
var gDV

let gameConfig = {
    type: Phaser.WEBGL,
    scale: {
        parent: 'game-container',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: gWidth,
        height: gHeight
    },
    autoStart: false,
    physics: {
        default: 'matter',
        matter: {
            debug: false
            ,
            gravity: {y: gGravity}
        }
    },
    render: {
        antialias: true
    }
}

// --------------------- SCENES --------------------- 
let game = new Phaser.Game(gameConfig)
game.scene.add("GameScene", GameScene)

//game.scene.start("SelectScene")
game.scene.start("GameScene")

let gs = game.scene. getScene("GameScene")

