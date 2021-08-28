const express = require('express')
const https = require('https')
const http = require('http')
const fs = require('fs')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const defaultReplacer = '{"ghcr.io/rawkode/klustered:v2":"quay.io/csantanapr/klustered:v2"}'
const REPLACER = process.env.REPLACER || defaultReplacer
const imagesToReplace = JSON.parse(REPLACER)
console.log('Replacing pod images:')
console.log(JSON.stringify(imagesToReplace, null, 2))

app.get('/', (req, res) => res.json({ images: imagesToReplace }))

app.post('/', (req, res) => {
  if (req.body.request === undefined || req.body.request.uid === undefined) {
    res.status(400).send()
    return
  }
  const uid = req.body.request.uid
  const object = req.body.request.object
  const toPatch = []
  object.spec.containers.forEach((value, index, arr) => {
    for (const [original, replace] of Object.entries(imagesToReplace)) {
      if (value.image === original) {
        console.log(`replacing container[${index}] ${value.image} with ${replace}`)
        toPatch.push({ op: 'replace', path: `/spec/containers/${index}/image`, value: replace })
      }
    }
  })
  const allowed = true
  const code = 200
  const message = ''

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
    console.log(JSON.stringify(toPatch, null, 2)) // debug
    const dataAsString = JSON.stringify(toPatch)
    const buff = Buffer.from(dataAsString.toString(), 'utf8')
    const patch = buff.toString('base64')
    review.response.patchType = 'JSONPatch'
    review.response.patch = patch
  }
  res.send(review)
})

const port = process.env.PORT || '8443'
let server = {}
if (port !== '8080') {
  const options = {
    cert: fs.readFileSync('/certs/tls.crt'),
    key: fs.readFileSync('/certs/tls.key')
  }
  server = https.createServer(options, app)
} else {
  server = http.createServer(app)
}

server.listen(port, () => {
  console.log(`mutating controller running on port ${port}/`)
})
