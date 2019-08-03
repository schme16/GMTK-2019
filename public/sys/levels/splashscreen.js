//Add the level to the game
game.addLevel(() => {
	let level = {
		name: 'splash',
		objects: {},
		bgColour: 0x000000,
		containers: {
			stage: new PIXI.Container()
		},

		assets: {
			'logos': 'sys/img/assets/logos.json',
			'onlyOne': 'sys/img/assets/only-one-animation.json',
		},

		onLoad: (res) => {

			let gakkle = new PIXI.Sprite(res.gakkle.texture),
				gmtk = new PIXI.Sprite(res.gmtk.texture),
				theme = new PIXI.Sprite(res.theme.texture)
			
			//First logo shown
			gakkle.x = res.gakkle.spriteSourceSize.x
			gakkle.y = res.gakkle.spriteSourceSize.y

			//Second logo shown
			gmtk.x = res.gmtk.spriteSourceSize.x
			gmtk.y = res.gmtk.spriteSourceSize.y

			//Hide the gmtk logo
			gmtk.alpha = 0

			
			//Third set
			theme.x = (game.renderer.screen.width / 2) - (theme.width / 2)
			theme.y = 200

			//Hide the word theme
			theme.alpha = 0

			//Create the theme animation
			onlyOne = game.utilities.createAnimatedSprite(res.onlyOne)
			onlyOne.x = (game.renderer.screen.width / 2) - (onlyOne.width / 2)
			onlyOne.y = (game.renderer.screen.height / 2) - (onlyOne.height / 2)
			
			//Hide the theme logo
			onlyOne.alpha = 0

			//Set the last frame, it's got the biggest width
			onlyOne.gotoAndStop(-1)

			//Set it back, so we can play it layer
			onlyOne.gotoAndStop(0)

			//Set the animation speed for the animated logo
			onlyOne.animationSpeed  = 0.4


			level.containers.stage.addChild(gakkle)
			level.containers.stage.addChild(gmtk)
			level.containers.stage.addChild(onlyOne)
			level.containers.stage.addChild(theme)


			//Get the slideshow running
			setTimeout(() => {
				TweenLite.to(gakkle, 2, {alpha: 0, onComplete: () => {
					TweenLite.to(gmtk, 2, {alpha: 1, onComplete: () => {
						setTimeout(() => {
							TweenLite.to(gmtk, 2, {alpha: 0, onComplete: () => {
								onlyOne.alpha = 1
								TweenLite.to(theme, 1, {alpha: 1, onComplete: () => {
									onlyOne.gotoAndPlay(0)
									onlyOne.onComplete = () => {
										setTimeout(() => {
											game.loadLevel('menu')
										}, 1000)
									}
								}})
							}})
						}, 2000)
					}})
				}})
			}, 2000)
		},

		loop: (delta) => {
			
		},

		data: {}

	}

	return level
})