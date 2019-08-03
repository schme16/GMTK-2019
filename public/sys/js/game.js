const game = {
	renderer: new PIXI.Application({
		width: 1280,
		height: 720,
		backgroundColor: 0x1099bb,
		resolution: window.devicePixelRatio || 1,
		view: $('canvas')[0]
	}),

	loadAssets: (assets, cb) => {
		game.loader = new PIXI.Loader()
		for (var i in assets) game.loader.add(i, assets[i])
		game.loader.load(cb)
	},

	loadLevel: (name) => {
		let level = game.levels[name]
		//Check the level exists
		if (level) {
			TweenLite.to(game.renderer.stage, 1, {alpha: 0, onComplete: () => {
				console.log(11111)
				//Remove the loop/ticker func, if it exists
				if (game.loop) game.loop.destroy()

				//Add all the assets, then load them
				game.loadAssets(level.assets, (loader, res) => {

					//Fire the levels on load func
					level.onLoad(res)

					//Add the levels stage as the primary stage
					game.renderer.stage = level.containers.stage

					game.renderer.stage.alpha = 0

					//Create a new game loop/ticker
					game.loop = new PIXI.Ticker({autoStart: true})
					game.loop.start()

						game.loop.add(level.loop)
						game.loop.add((delta) => {
							game.renderer.render(game.renderer.stage)
						})
					TweenLite.to(game.renderer.stage, 1, {alpha: 1})
				})
			}})				
		}
		else {
			alert('Level: ' + name + ' not found...')
		}
	},

	addLevel: (data) => {

		game.levels[data.name] = data
	},

	levels: {}
}


