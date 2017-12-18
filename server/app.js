const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const request = require('request');

let clientPath = path.resolve(__dirname, '../client/dist');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(clientPath))

app.post('/', (req, res) => {
    if (req.body.email) {


        request.post({
                url: 'http://webapi.mymarketing.co.il/api/contacts',
                headers: {
                    'Authorization': '0XAEB2E75418F77FDCCC23D8C3D05A59329FC70785CD920E19B24F37430A4949DFA17F7DE74E4D6DAB87C04E9609E6F935'
                },
                form: {email: req.body.email}
            },
            (err, httpResponse, body) => {
                if(err) {
                    res.status(500).send({message: err})
                } else {
                    res.send(JSON.parse(body));
                }
            });

    } else {
        res.status(500).send({message: 'invalid payload!!'})
    }
})

app.get('/*', function (req, res) {
    res.sendFile(clientPath + '/index.html')
})

app.listen(3000, () => console.log('App listening on port 3000'))