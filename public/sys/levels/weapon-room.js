//Add the level to the game
game.addLevel((i) => {
	let level = {
		name: 'weapon-room',
		objects: {},
		bgColour: 0xffffff,
		containers: {
			stage: new PIXI.Container()
		},

		assets: {
			'player': 'sys/img/assets/player.png',
			'weapons': 'sys/img/assets/weapons.json'
		},

		onLoad: (res) => {
			let data = game.data,
				stage =	level.containers.stage


			data.player = new PIXI.Sprite(res.player.texture)
			data.player.pivot = {x: data.player.width / 2, y: data.player.height / 2}
			data.player._x = data.player.x = (game.renderer.screen.width / 2) - (data.player.width / 2)
			data.player._y = data.player.y = (game.renderer.screen.height / 2) - (data.player.height / 2)
			data.player._rotation = data.player.rotation = 0
			 
			data.player.speed = 6

			stage.addChild(data.player)
		},

		loop: (delta) => {
			let data = game.data,
				angle,
				speed = (data.player.speed)

				data.player.last = {x: data.player.x, y: data.player.y}

			if (game.inputs.state.up) {
				data.player._y -= ((speed * game.inputs.state.up) * delta)
				data.player.last.changed = true
			}

			if (game.inputs.state.down) {
				data.player._y += ((speed * game.inputs.state.down) * delta)
				data.player.last.changed = true
			}

			if (game.inputs.state.left) {
				data.player._x -= ((speed * game.inputs.state.left) * delta)
				data.player.last.changed = true
			}

			if (game.inputs.state.right) {
				data.player._x += ((speed * game.inputs.state.right) * delta)
				data.player.last.changed = true
			}


			data.player.rotation = game.utilities.angleLerp(data.player.rotation, data.player._rotation, 0.5)
			if (Math.abs(data.player.y - data.player._y) > data.player.speed) data.player.y = lerp(data.player.y, data.player._y, delta * 0.15)
			if (Math.abs(data.player.x - data.player._x) > data.player.speed) data.player.x = lerp(data.player.x, data.player._x, delta * 0.15)

			if (data.player.last.changed) {
				let r = Math.atan2(data.player.last.y - data.player.y, data.player.last.x - data.player.x);

				
    			data.player._rotation = r
			}
		},
		data: {
			weapons: {

			}
		}
	}

	return level
})