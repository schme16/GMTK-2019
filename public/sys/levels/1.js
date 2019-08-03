(() => {
	let level = {
		name: 1,
		containers: {
			stage: new PIXI.Container()
		},

		assets: {
			'bunny': 'sys/img/assets/bunny.png'
		},

		onLoad: (res) => {

			// Create a 5x5 grid of bunnies
			for (let i = 0; i < 25; i++) {

				const bunny = new PIXI.Sprite(res.bunny.texture);
				bunny.anchor.set(0.5);
				bunny.x = (i % 5) * 40;
				bunny.y = Math.floor(i / 5) * 40
				level.containers.stage.addChild(bunny)
			}


			// Move containers.stage to the center
			level.containers.stage.x = game.renderer.screen.width / 2
			level.containers.stage.y = game.renderer.screen.height / 2

			// Center bunny sprite in local containers.stage coordinates
			level.containers.stage.pivot.x = level.containers.stage.width / 2
			level.containers.stage.pivot.y = level.containers.stage.height / 2
		},

		loop: (delta) => {
			level.containers.stage.rotation -= 0.01 * delta
		}

	}


	//Add the level to the game
	game.addLevel(level)
})()