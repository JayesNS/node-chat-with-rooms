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

let rooms = []
sio.sockets.on('connection', (socket) => {
  socket.on('join room', (data) => {
    socket.join(data.room)

    if (rooms[data.room]) {
      if (!rooms[data.room]['users'].includes(data.nickname)) {
        rooms[data.room]['users'].push(data.nickname)
      }
    } else {
      rooms[data.room] = {
        users: [data.nickname]
      }
    }

    console.log(rooms)

    socket.room = data.room
    socket.nickname = data.nickname

    socket.to(socket.room).emit('user joined', {
      nickname: socket.nickname
    })
  })

  socket.on('message', (data) => {
    socket.to(socket.room).emit('new message', {
      message: data.message,
      author: socket.nickname
    })
  })

  socket.on('room list', () => {
    emitRoomList(socket)
  })
  socket.on('connected to server', () => {
    emitRoomList(sio)
  })

  socket.on('disconnect', () => {
    socket.to(socket.room).emit('user left', {
      nickname: socket.nickname
    })
  })
})

function emitRoomList(socket) {
  socket.emit('room list', {
    rooms
  })
}
