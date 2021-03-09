class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene")

        this.currentColor = GlobalData.colors[0]
        this.buttons = []
        this.colorShow
        this.whiteSprites = []
        this.allSprites = []
        this.noColorSprites = []
        this.animating = 0
    }

    setCurrentColor(colorCode) {
        this.currentColor = colorCode
        this.colorShow.setFillStyle(parseInt("0x" + colorCode), 1)
    }

    init() {
    }

    preload() {
        this.load.spritesheet("eye", "assets/tent/eye.png", {
            frameWidth: 300,
            frameHeight: 300
        })
        this.load.spritesheet("body", "assets/tent/body.png", {
            frameWidth: 300,
            frameHeight: 300
        })
        this.load.spritesheet("tent", "assets/tent/tent.png", {
            frameWidth: 300,
            frameHeight: 300
        })
        
        this.load.image("button", "assets/button.png")
    }

    create() {
        this.cameras.main.setBackgroundColor('#78716b')


        // -------------- Animations -----------------
        this.anims.create({
            key: "a-body",
            frames: this.anims.generateFrameNumbers("body", {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1,
            yoyo: 1
        })
        this.anims.create({
            key: "a-tent",
            frames: this.anims.generateFrameNumbers("tent", {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1,
            yoyo: 1
        })
        this.anims.create({
            key: "a-eye",
            frames: this.anims.generateFrameNumbers("eye", {start: 0, end: 3}),
            frameRate: 10
        })

        this.anims.create({
            key: "n-body",
            frames: this.anims.generateFrameNumbers("body", {start: 0, end: 0}),
            frameRate: 10
        })
        this.anims.create({
            key: "n-tent",
            frames: this.anims.generateFrameNumbers("tent", {start: 0, end: 0}),
            frameRate: 10
        })
        this.anims.create({
            key: "n-eye",
            frames: this.anims.generateFrameNumbers("eye", {start: 0, end: 0}),
            frameRate: 10
        })


        // -------------- Adding Tintable Sprites -----------------
        this.whiteSprites = [
            this.add.sprite(gWidth/2, gHeight/2, "body", 0),
            this.add.sprite(gWidth/2, gHeight/2, "tent", 0)
        ]

        this.noColorSprites = [
            this.add.sprite(gWidth/2, gHeight/2, "eye", 0)
        ]

        this.allSprites = []         
        this.allSprites = [this.whiteSprites[0], this.whiteSprites[1], this.noColorSprites[0]]

        for (let sprite of this.whiteSprites) {
            sprite.setInteractive()
            sprite.tintApplied = 0

            sprite.on("pointerdown", ()=> {
                if (this.animating) return


                sprite.setTint(parseInt("0x" + this.currentColor))
                sprite.tintApplied = 1

                if (this.allAreTinted()) {
                    this.animating = 1
                    this.animateAll()
                }
            })
        }

        this.whiteSprites[1].input.hitArea.setTo(0,140, 300, 300)
        this.whiteSprites[0].input.hitArea.setTo(0, 0, 300, 160)

        
        // -------------- Adding Buttons -----------------
        let n = GlobalData.colors.length
        for (let i = 0; i<n; i++) {

            let btn = new Button({
                scene: this, 
                x: gWidth*(0.1) + 80*i, 
                y: gHeight*0.9, 
                scale: 1.17,
                image: "button",
                onClick: ()=> {
                    this.setCurrentColor(GlobalData.colors[i])
                }
            })

            btn.setTint(parseInt("0x" + GlobalData.colors[i]))
            btn.buttonColor = GlobalData.colors[i]

            this.buttons.push(btn)
        }

        
        // -------------- Adding the rest of the UI elements -----------------
        this.add.text(gWidth*0.1-20, gHeight*0.9 -80, "Palette:")
        this.add.text(gWidth*0.9-50, gHeight*0.9 -80, "Color:")

        this.colorShow = this.add.rectangle(gWidth*0.9, 
            gHeight*0.9, 100, 100, 
            parseInt("0x"+this.currentColor))
    }

    allAreTinted() {
        return this.whiteSprites[0].tintApplied 
            && this.whiteSprites[1].tintApplied 
    }

    animateAll() {
        let rnd = Phaser.Math.Between(100,400)

        for (let sprite of this.allSprites) {
            this.tweens.add({
                targets: sprite,
                y: sprite.y - rnd,
                duration: 400,
                ease: "Quad",
                yoyo: 1,
                repeat: 2,
                onComplete: ()=> {
                    this.whiteSprites[0].play("n-body")
                    this.whiteSprites[1].play("n-tent")
                    this.noColorSprites[0].play("n-eye")

                    this.animating = 0
                }
            })
        }

        this.whiteSprites[0].play("a-body")
        this.whiteSprites[1].play("a-tent")
        this.noColorSprites[0].play("a-eye")
    }

    update() {
    }
}