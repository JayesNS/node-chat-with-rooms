const socket = io('http://localhost:3000')

socket.on('connect', () => {
  socket.on('rooms info', (data) => {
    console.log(data)
  })
})
