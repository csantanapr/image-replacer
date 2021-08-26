const express = require('express')
const https = require('https')
const http = require('http')
const fs = require('fs')
const bodyParser = require('body-parser')
const yaml = require('js-yaml')

const app = express()
app.use(bodyParser.json())


const ALLOWED = process.env.ALLOWED === 'true' ? true : false


const MESSAGE=`Deleting MutatingWebHooks are ALLOWED = ${ALLOWED}`
console.log(MESSAGE)
app.get('/', (req, res) => res.json({ status: MESSAGE }));

app.post('/', (req, res) => {
  if (req.body.request === undefined || req.body.request.uid === undefined) {
    res.status(400).send()
    return
  }
  const code = 200
  const message = 'This Carlos from the other side'
  const uid = req.body.request.uid
  const object = req.body.request.object
  console.log('#############################################')
  console.log('request', JSON.stringify(req.body.request, null, 2)) // debug

  const review = {
    apiVersion: 'admission.k8s.io/v1',
    kind: 'AdmissionReview',
    response: {
      uid: uid,
      allowed: ALLOWED,
      status: {
        code: code,
        message: message
      }
    }
  }
  console.log('response', JSON.stringify(review, null, 2))
  res.send(review)
})

const port = process.env.PORT || '8443'
var options = {}
var server = {}
if (port !== '8080') {
  options = {
    cert: fs.readFileSync('/certs/tls.crt'),
    key: fs.readFileSync('/certs/tls.key')
  }
  server = https.createServer(options, app)
} else {
  server = http.createServer(app)
}




server.listen(port, () => {
  console.log(`validating controller running on port ${port}/`) // debug
})
