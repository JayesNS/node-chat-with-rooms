const express = require('express')
const app = express()
const http = require('http').Server(app)
const sio = require('socket.io')()

const port = 3000

app.use(express.static('client'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/rooms.html');
})
app.get('/:room/:username', (req, res) => {
  res.sendFile(__dirname + '/client/room.html');
})

http.listen(port, () => {
  console.log(`Running server at ${port}`)
})
sio.listen(http)

sio.on('connection', (socket) => {
  var data = socket.handshake.query
  socket.join(data.room)

  socket.on('disconnect', () => {

  })
})
