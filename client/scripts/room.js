const params = getParams()
const socket = io('http://localhost:3000')

const roomNameElem = document.querySelector('#room-name')
roomNameElem.textContent = params.room
const roomUsersElem = document.querySelector('#room-users')

const sendMessageButton = document.querySelector('#send-new-message')
sendMessageButton.addEventListener('click', sendMessage)
const messageInput = document.querySelector('#new-message')
messageInput.addEventListener('keypress', (event) => {
  if (event.keyCode === 13) {
    sendMessage()
  }
})

socket.emit('join room', {
  room: params.room,
  nickname: params.username
})

socket.on('connect', () => {
  appendMessage(`Connected to chat as ${params.username}`)

  setRoomUsers(1)
  socket.on('user joined', (data) => {
    setRoomUsers(getRoomUsers() + 1)
    appendMessage(`User ${data.nickname} joined`)
  })
  socket.on('user left', (data) => {
    appendMessage(`User ${data.nickname} left`)
  })

  socket.on('new message', (data) => {
    appendMessage(data.message, data.author)
  })

  socket.emit('connected to server')

  socket.on('disconnect', () => {
    appendMessage('Disconnected from chat')
  })
})

// Functions
function setRoomUsers(users) {
  roomUsersElem.textContent = users
}
function getRoomUsers() {
  return parseInt(roomUsersElem.textContent)
}

function appendMessage(message, author) {
  const messagesElem = document.querySelector('#messages')
  const messageElem = document.createElement('li')

  if (author) {
    const authorElem = document.createElement('span')
    const authorText = document.createTextNode(author)
    authorElem.appendChild(authorText)
    messageElem.appendChild(authorElem)
    messageElem.appendChild(document.createTextNode(': '))
  }

  const messageText = document.createTextNode(message)
  messageElem.appendChild(messageText)

  messagesElem.appendChild(messageElem)

  messagesElem.scrollTo(0, messagesElem.scrollHeight+messageElem.clientHeight)
}

function sendMessage() {
  let messageInput = document.querySelector('#new-message')
  const data = {
    message: messageInput.value,
    author: params.username
  }

  if (messageInput.value) {
    sendMessageToServer(data.message, data.author)
    appendMessage(data.message, data.author)
    messageInput.value = ''
  }
}

function sendMessageToServer(message, author) {
  socket.emit('message', {
    message
  })
}

function getParams() {
  let result = location.pathname
  result = decodeURIComponent(result)
  result = result.match(/[^\/].+[^\/]/)[0]
  result = result.split('/')
  return {
    room: result[0],
    username: result[1]
  }
}
