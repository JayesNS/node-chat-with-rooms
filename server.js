const express = require('express')
const app = express()
const http = require('http').Server(app)
const sio = require('socket.io')()

const port = 3000

app.use(express.static('client'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
})
app.get('/room', (req, res) => {
  res.sendFile(__dirname + '/client/room.html');
})

http.listen(port, () => {
  console.log(`Running server at ${port}`)
})
sio.listen(http)

let connections = []
sio.on('connection', (socket) => {
  connections.push(socket)
  console.log('User connected to server')

  socket.emit('connection info', {
    users: connections.length
  })

  socket.on('disconnect', () => {
    console.log('User disconnected from server')
    connections.splice(connections.indexOf(socket), 1)
  })
})
