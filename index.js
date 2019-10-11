require('dotenv').config()
const path = require('path')
const db = require('./src/db-connection')
const recordService = new(require('./src/services/record.service'))()
const expireService = new(require('./src/services/expire.service'))()

const app = require('fastify')()
app.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  wildcard: false
})

app.setNotFoundHandler((request, reply) => {
  reply
    .code(404)
    .type('text/plain')
    .send('The URL provided has either expired or does not exist :(')
})

app.get('/:id', (req, res) => {
  recordService.getUrl(req.params.id)
    .then(url => res.redirect(url || '/?r=Invalid Or Expired'))
})

app.get('/info/:id', async (req, res) => {
  try {
    return await recordService.getById(req.params.id)
  } catch (err) {
    const e = new Error()
    e.statusCode = 404
    e.message = err.message
    throw e
  }
})

app.post('/create', async (req, res) => {
  try {
    recordService.validate(req.body)
    const id = await recordService.create(req.body)
    return {
      id
    }
  } catch (err) {
    const e = new Error()
    e.statusCode = 400
    e.message = err.message
    throw e
  }
})

app.listen(process.env.PORT)
  .then(() => console.log(`Server listening on ${process.env.PORT}`))
  .catch(err => {
    console.error('Unable to start server', err)
    process.exit(1)
  })
