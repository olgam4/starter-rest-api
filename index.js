const express = require('express')
const app = express()
const cyclic = require('cyclic-dynamodb')
const db = cylic('stormy-cyan-hareCyclicDB')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
// var options = {
//   dotfiles: 'ignore',
//   etag: false,
//   extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
//   index: ['index.html'],
//   maxAge: '1m',
//   redirect: false
// }
// app.use(express.static('public', options))
// #############################################################################

// Create or Update an item
app.post('/:col', async (req, res) => {

  const col = req.params.col
  const api = req.body.api
  
  console.log(col, api)
  
  if (api !== process.env.MDP) {
     res.json('woop').end()
  }
  
  const id = Math.random(0, 100).toString()
  
  const item = await db.collection(col).set(id, req.body.email)
  
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

// Get a full listing
app.get('/:col/:api', async (req, res) => {
  const col = req.params.col
  const api = req.params.api
  
  if (api !== process.env.MDP) return
  
  console.log(`list collection: ${col} with params: ${JSON.stringify(req.params)}`)
  const items = await db.collection(col).list()
  console.log(JSON.stringify(items, null, 2))
  res.json(items).end()
})

// Catch all handler for all other request.
app.use('*', (req, res) => {
  res.json({ msg: 'no route handler found' }).end()
})

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`index.js listening on ${port}`)
})
