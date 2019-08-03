const game = {
	renderer: new PIXI.Application({
		width: 1280,
		height: 720,
		backgroundColor: 0x1099bb,
		resolution: window.devicePixelRatio || 1,
		view: $('canvas')[0]
	}),

	loadAssets: (assets, cb) => {
		for (var i in assets) {
			if (game.res[i]) delete assets[i]
		}
		game.loader = new PIXI.Loader()
		for (var i in assets) game.loader.add(i, assets[i])
		game.loader.load((loader, res) => {

			//Find and remove assets that have already been loaded
			for (var i in res) {
				if (res[i].extension == 'json') {
					for (var k in res[i].data.frames) {
						game.res[k] = res[i].data.frames[k]
						game.res[k].texture = res[i].textures[k]
					}
				}
				else {
					game.res[i] = res[i]
				}
			}
			cb(res)
		})
	},

	loadLevel: (name) => {
		
		//Check the level exists
		if (game.levels[name]) {

			//unbind the gamepad, if it exists
			if (game.gamepad) {
				game.gamepad.unbind(Gamepad.Event.CONNECTED)
				game.gamepad.unbind(Gamepad.Event.DISCONNECTED)
				game.gamepad.unbind(Gamepad.Event.UNSUPPORTED)
				game.gamepad.unbind(Gamepad.Event.BUTTON_DOWN)
				game.gamepad.unbind(Gamepad.Event.BUTTON_UP)
				game.gamepad.unbind(Gamepad.Event.AXIS_CHANGED)
				game.gamepad.unbind(Gamepad.Event.TICK)			}


			//Set the level
			let level = game.levels[name]()

			//Fade the level out before loading
			TweenLite.to(game.renderer.stage, 1, {alpha: 0, onComplete: () => {

				//Remove the loop/ticker func, if it exists
				if (game.loop) {
					game.loop.stop()
				}

				//Remove all current items, to start fresh
				if (game.renderer.stage) game.renderer.stage.removeChildren()
					
				//Add all the assets, then load them
				game.loadAssets(level.assets, () => {

					//Fire the levels on load func
					level.onLoad(game.res)

					//Add the levels stage as the primary stage
					game.renderer.stage.addChild(level.containers.stage)


					//Create a new game loop/ticker
					game.loop = new PIXI.Ticker({autoStart: true})
					game.loop.start()

					//Add the levels loop to the stack
					game.loop.add(level.loop)
					game.loop.add(game.loopFunc)

					TweenLite.to(game.renderer.stage, 1, {alpha: 1})
				})
			}})				
		}
		else {
			alert('Level: ' + name + ' not found...')
		}
	},

	addLevel: (data) => {
		var level = data(game.__c)
		game.levels[level.name] = data
	},

	loopFunc: (delta) => {
		game.renderer.render(game.renderer.stage)
		game.resize()
	},

	//Resize the canvas, keep aspect ratio
	resize: () => {
		if (game.renderer._oldHeight != window.innerWidth || game.renderer._oldWidth != window.innerHeight) {
			game.renderer._oldHeight = window.innerWidth
			game.renderer._oldWidth = window.innerHeight

			//Try the width first
			let width = window.innerWidth - 20,
				height = width * 0.5625 // 9/16

			//if that doesn't fit, switch to height
			if (height > innerHeight - 20) {
				height = innerHeight - 20
				width = height * 1.7777777777777777 // 16/9
			}

			//Set new the canvas size
			game.renderer.view.style.width = width + 'px'
			game.renderer.view.style.height = height + 'px'
		}
	},

	//Run all the stuff needed to set the engin up
	init: () => {
		game.resize()
		game.gamepad = new Gamepad()
		let testGamepad = game.gamepad.init()
		if (!testGamepad) game.gamepad = false
	},

	//Holds all the levels
	levels: {},
	
	//Holds all the resources
	res: {},

	//Holds data that persists across levels, must be manually cleared
	data: {}
}


game.init()