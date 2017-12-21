const express = require('express')
const fs = require('fs')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const path = require('path')
const request = require('request')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(path.resolve(__dirname, 'c_bu.db'));
const logDirectory = path.join(__dirname, 'log')
var rfs = require('rotating-file-stream')
const consoleLog = fs.createWriteStream(logDirectory + '/console.log', {flags: 'a'});
const port = 3000;

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
})

app.use(morgan('combined', {stream: accessLogStream}))

let clientPath = path.resolve(__dirname, '../client/dist');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(clientPath))

app.post('/', (req, res) => {
    if (req.body.email) {
        db.run(`INSERT INTO contacts(email) VALUES(?)`, [req.body.email], function (err) {
            if (err) {
                res.status(500).send({message: err.message})
            } else {
                res.send({id: this.lastID});
            }
        });
    } else {
        res.status(500).send({message: 'invalid payload!!'})
    }
})

const minutes = 3, the_interval = minutes * 60 * 1000;
setInterval(function () {
    db.all(`SELECT * FROM contacts WHERE synced='false'`, [], function (err, rows) {
        if (err) {
            console.log(err.message)
            consoleLog.write(err.message + '\n');
        } else {
            console.log(`syncing with active-trail (${rows.length})...`);
            consoleLog.write(`syncing with active-trail (${rows.length})...` + '\n');
            sendEmailsToActiveTrail(rows);
        }
    });
}, the_interval);


function sendEmailsToActiveTrail(list) {
    if (list.length > 0) {
        const email = list[0].email
        list.splice(0, 1)
        request.post({
                url: 'http://webapi.mymarketing.co.il/api/contacts',
                headers: {
                    'Authorization': '0XAEB2E75418F77FDCCC23D8C3D05A59329FC70785CD920E19B24F37430A4949DFA17F7DE74E4D6DAB87C04E9609E6F935'
                },
                form: {email: email}
            },
            (err, httpResponse, body) => {
                if (err) {
                    console.log('error', err);
                    consoleLog.write(err + '\n');
                } else {
                    // update db
                    console.log(`${email} synced!`);
                    consoleLog.write(`${email} synced!` + '\n');
                    db.run(`UPDATE contacts SET synced='true' WHERE email=?`, [email]);
                    setTimeout(() => {
                        sendEmailsToActiveTrail(list);
                    }, 500);
                }
            });
    }
}

app.get('/test', function (req, res) {
    res.send({a: 1})
})

app.get('/*', function (req, res) {
    res.sendFile(clientPath + '/index.html')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
    consoleLog.write(`App listening on port ${port}` + '\n');
})