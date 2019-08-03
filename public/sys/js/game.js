const game = {
	renderer: new PIXI.Application({
		width: 1280,
		height: 720,
		backgroundColor: 0,
		resolution: window.devicePixelRatio || 1,
		view: $('canvas')[0]
	}),

	loadAssets: (assets, cb) => {
		let newAssets = {}
		
		for (var i in assets) {
			if (!game.res[i]) newAssets[i] = assets[i]
		}

		game.loader = new PIXI.Loader()
		for (var i in newAssets) {
			game.loader.add(i, newAssets[i])
		}

		game.loader.load((loader, res) => {

			//Find and remove assets that have already been loaded
			for (var i in res) {
				game.res[i] = true
				if (res[i].extension == 'json') {
					let resVar = game.res
					if (res[i].url.indexOf('-animation') > -1) resVar = {}
					for (var k in res[i].data.frames) {
						resVar[k] = res[i].data.frames[k]
						resVar[k].texture = res[i].textures[k]
					}
					if (res[i].url.indexOf('-animation') > -1) game.res[i] = resVar

				}
				else {
					game.res[i] = res[i]
				}
			}
			cb(game.res)
		})
	},

	loadLevel: (name) => {
		
		//Check the level exists
		if (game.levels[name]) {

			//unbind the gamepad, if it exists
			if (Controller.supported) {
				

			}


			//Set the level
			let level = game.levels[name]()

			//Fade the level out before loading
			TweenLite.to(game.renderer.stage, 1, {alpha: 0, onComplete: () => {
				
				//Remove all current items, to start fresh
				if (game.renderer.stage) game.renderer.stage.removeChildren()

				//Add the background colour
				var bg = new PIXI.Graphics()
					bg.beginFill((level.bgColour || game.renderer.renderer.backgroundColor))
					bg.drawRect(-10, -10, game.renderer.screen.width + 20, game.renderer.screen.height + 20, 0)
					game.renderer.stage.addChild(bg)

				//Remove the loop/ticker func, if it exists
				if (game.loop) {
					game.loop.stop()
				}

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
		for (var i in game.inputs.once) {
			game.inputs.once[i] = 0
		}
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


		//If controller support exists, bind to the events
		if (Controller.supported) {
			Controller.search()
			window.addEventListener('gc.controller.found', game.updateGamepadStatus, false)
			window.addEventListener('gc.controller.lost', game.updateGamepadStatus, false)
			window.addEventListener('gc.button.press', game.updateGamepadInputs, false)
			window.addEventListener('gc.button.release', game.updateGamepadInputs, false)
			window.addEventListener('gc.analog.start', game.updateGamepadInputs, false)
			window.addEventListener('gc.analog.hold', game.updateGamepadInputs, false)
			window.addEventListener('gc.analog.end', game.updateGamepadInputs, false)
		}

		//Bind to the keyboard events
		$(window).on('keydown keyup', game.updateKeyboardInputs);

	},

	//Updates the game.gamepad status
	updateGamepadStatus: (event) => {
		game.gamepad = Controller.getController(0)
		
		if (game.gamepad) {
			game.gamepad.watch()
		}
	},

	//Updates the inputs from the gamepad
	updateGamepadInputs: (event) => {
		if (game.gamepad && event && event.detail) {
			let det = event.detail
			switch (det.name) {

				case 'FACE_1':
					game.inputs.once.use = det.value
					game.inputs.state.use = det.value
				break
				case 'FACE_2':
					game.inputs.once.cancel = det.value
					game.inputs.state.cancel = det.value
				break


				case 'DPAD_UP':
					game.inputs.once.up = det.value
					game.inputs.state.up = det.value
				break

				case 'DPAD_DOWN':
					game.inputs.once.down = det.value
					game.inputs.state.down = det.value
				break

				case 'DPAD_LEFT':
					game.inputs.once.left = det.value
					game.inputs.state.left = det.value
				break

				case 'DPAD_RIGHT':
					game.inputs.once.right = det.value
					game.inputs.state.right = det.value
				break



				case 'LEFT_ANALOG_STICK':
					if (det.position.x <= 0) {
						game.inputs.once.left = -det.position.x
						game.inputs.state.left = -det.position.x
					}

					if (det.position.x >= 0) {
						game.inputs.once.right = det.position.x
						game.inputs.state.right = det.position.x						
					}

					if (det.position.y <= 0) {
						game.inputs.once.up = -det.position.y
						game.inputs.state.up = -det.position.y
					}

					if (det.position.y >= 0) {
						game.inputs.once.down = det.position.y
						game.inputs.state.down = det.position.y					
					}
					
				break			
			} 
		}		
	},

	//Updates the inputs from the keyboard
	updateKeyboardInputs: (e) => {
		let state = e.type == 'keydown'
		switch (e.code) {
			case 'KeyE':
				game.inputs.once.use = state
				game.inputs.state.use = state
			break
			case 'Escape':
				game.inputs.once.cancel = state
				game.inputs.state.cancel = state
			break


			case 'ArrowUp':
			case 'KeyW':
				game.inputs.once.up = state
				game.inputs.state.up = state
			break

			case 'ArrowDown':
			case 'KeyS':
				game.inputs.once.down = state
				game.inputs.state.down = state
			break

			case 'ArrowLeft':
			case 'KeyA':
				game.inputs.once.left = state
				game.inputs.state.left = state
			break

			case 'ArrowRight':
			case 'KeyD':
				game.inputs.once.right = state
				game.inputs.state.right = state
			break
		}
	},

	//some funcs that could help
	utilities: {
		createAnimatedSprite: (images) => {
			let textureArray = []
			for (let i in images) {
				textureArray.push(images[i].texture)
			}

			let animatedSprite = new PIXI.AnimatedSprite(textureArray)
			animatedSprite.autoUpdate = false
			animatedSprite.loop = false
			animatedSprite.gotoAndStop(0)
			return animatedSprite
		},

		shortAngleDist: (a0,a1) => {
			var max = Math.PI*2;
			var da = (a1 - a0) % max;
			return 2*da % max - da;
		},
		angleLerp: (a0,a1,t) => {
			return a0 + game.utilities.shortAngleDist(a0,a1)*t;
		}
	},

	//Holds all the levels
	levels: {},
	
	//Holds all the resources
	res: {},

	inputs: {
		once: {
			up: 0,
			down: 0,
			left: 0,
			right: 0,
			use: 0,
			cancel: 0,
		},

		state:{
			up: 0,
			down: 0,
			left: 0,
			right: 0,
			use: 0,
			cancel: 0,
		}
	},

	//Holds data that persists across levels, must be manually cleared
	data: {}
}


game.init()