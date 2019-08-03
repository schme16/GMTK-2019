//Add the level to the game
game.addLevel(() => {
	let level = {
		name: 'menu',
		objects: {},
		bgColour: 0xffffff,
		containers: {
			stage: new PIXI.Container()
		},

		assets: {
			'ui': 'sys/img/assets/ui.json'
		},

		onLoad: (res) => {

			let newGame = new PIXI.Sprite(res['buttons_newGame-01'].texture)
			
			newGame.x = (game.renderer.screen.width / 2) - (newGame.width / 2)
			newGame.y = (game.renderer.screen.height / 2) - (newGame.height / 2)
			
			//Make the button interactive, and give it the right cursor
			newGame.interactive = newGame.buttonMode = true


			newGame.on('click', level.startNewGame)


			level.containers.stage.addChild(newGame)
		},

		loop: (delta) => {
			
		},

		startNewGame: () => {
			game.loadLevel('weapon-room')
		},

	}

	return level
})