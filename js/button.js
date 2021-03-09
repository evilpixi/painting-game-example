class Button extends Phaser.GameObjects.Image {    
  constructor({scene, 
      x=0, 
      y=0, 
      image, 
      text="", 
      textConfig={},
      scale=1, 
      onClick = ()=>{}
      }) 
  {
      super(scene, x, y, image)
      scene.add.existing(this)
      
      this.startScale = scale
      this.setScale(this.startScale)

      this.text
      if (text) {
          this.text = scene.add.text(x, y, text, textConfig)
          this.text.setOrigin(0.5)
          this.text.setScale(this.startScale)
      }

      this.setInteractive()
      this.setScrollFactor(0)

      this.isDown = false
      this.on("pointerover", ()=>{
          scene.tweens.add({
              targets: this.text? [this, this.text] : this,
              duration: 100,
              scale: this.startScale * 1.1,
              ease: 'Back'
          })
      })
      this.on("pointerout", ()=>{
          scene.tweens.add({
              targets: this.text? [this, this.text] : this,
              duration: 100,
              scale: this.startScale,
              ease: 'Back'
          })
      })
      this.on("pointerdown", ()=>{
          this.isDown = true
          scene.tweens.add({
              targets: this.text? [this, this.text] : this,
              duration: 100,
              scale: this.startScale * 0.8,
              ease: 'Back'
          })
      })
      this.on("pointerup", ()=>{
          this.isDown = false
          scene.tweens.add({
              targets: this.text? [this, this.text] : this,
              duration: 100,
              scale: this.startScale,
              ease: 'Back',
              onComplete: ()=> {
                  onClick.call()
              }
          })
      })
  }
}