const express = require('express'),
	app = express()



app.use('/node_modules', express.static('node_modules'))
app.use(express.static('public'))


app.listen(process.env.PORT || 8888)