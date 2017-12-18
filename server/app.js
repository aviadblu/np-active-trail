const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')

let clientPath = path.resolve(__dirname, '../client/dist');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(clientPath))

app.post('/', (req, res) => {
    res.send(req.body)
})

app.get('/*', function (req, res) {
    res.sendFile(clientPath + '/index.html')
})

app.listen(3000, () => console.log('App listening on port 3000'))