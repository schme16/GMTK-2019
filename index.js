const express = require('express'),
	compression = require('compression'),
	app = express()


app.use(compression({level:9}))

app.use('/node_modules', express.static('node_modules'))

app.use(express.static('public'))


app.listen(process.env.PORT || 8888)