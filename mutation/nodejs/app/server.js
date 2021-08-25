const express = require('express')
const https = require('https')
const fs = require('fs')
const bodyParser = require('body-parser')
const yaml = require('js-yaml')

const app = express()
app.use(bodyParser.json())
const port = 8443

const IMAGE = process.env.IMAGE || 'quay.io/bitnami/nginx'

const options = {
  cert: fs.readFileSync('/certs/tls.crt'),
  key: fs.readFileSync('/certs/tls.key')
}

app.post('/', (req, res) => {
  if (req.body.request === undefined || req.body.request.uid === undefined) {
    res.status(400).send()
    return
  }

  const allowed = true
  const code = 200
  const message = ''
  const uid = req.body.request.uid
  const object = req.body.request.object
  console.log('#############################################')
  console.log(JSON.stringify(req.body.request, null, 2)) // debug

  const toPatch = []
  toPatch.push({ op: 'replace', path: '/spec/containers/0/image', value: IMAGE})

  const review = {
    apiVersion: 'admission.k8s.io/v1',
    kind: 'AdmissionReview',
    response: {
      uid: uid,
      allowed: allowed,
      status: {
        code: code,
        message: message
      }
    }
  }
  if (toPatch.length > 0) {
    const dataAsString = JSON.stringify(toPatch)
    const buff = Buffer.from(dataAsString.toString(), 'utf8')
    const patch = buff.toString('base64')
    review.response.patchType = 'JSONPatch'
    review.response.patch = patch
  }
  console.log('response', JSON.stringify(review, null, 2))
  res.send(review)
})

const server = https.createServer(options, app)

server.listen(port, () => {
  console.log(`mutating controller running on port ${port}/`) // debug
})
