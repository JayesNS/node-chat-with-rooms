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

var rooms = {}
sio.sockets.on('connection', (socket) => {
  socket.emit('connection info', {rooms})

  socket.on('join room', (data) => {
    if (rooms[data.room] && rooms[data.room].users.includes(data.nickname)) {
      socket.disconnect()
    }

    socket.join(data.room)

    if (rooms[data.room]) {
      if (!rooms[data.room].users.includes(data.nickname)) {
        rooms[data.room].users.push(data.nickname)
      }
    } else {
      rooms[data.room] = {
        users: [data.nickname]
      }
    }

    socket.room = data.room
    socket.nickname = data.nickname

    socket.to(socket.room).emit('user joined', {
      nickname: socket.nickname,
      room: rooms[socket.room]
    })

    socket.emit('connection info', {
      room: rooms[socket.room]
    })
    socket.broadcast.emit('connection info', {rooms})
  })

  socket.on('message', (data) => {
    socket.to(socket.room).emit('new message', {
      message: data.message,
      author: socket.nickname
    })
  })

  socket.on('disconnect', () => {
    if (socket.room) {
      // Delete user from room list
      rooms[socket.room].users
        .splice(rooms[socket.room].users.indexOf(socket.nickname), 1)
      // Delete room if empty
      if (rooms[socket.room].users.length === 0) {
        delete rooms[socket.room]
      }
    }

    socket.broadcast.emit('connection info', {rooms})
    socket.to(socket.room).emit('user left', {
      nickname: socket.nickname,
      room: rooms[socket.room]
    })
  })
})
