const params = getParams()
const socket = io('http://localhost:3000', {
    query: {
        room: params.room,
    }
})

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

socket.on('connect', () => {
  appendMessage(`Connected to chat as ${params.username}`)

})

socket.on('disconnect', () => {
    appendMessage('Disconnected from chat')
})

// Functions
function setRoomUsers(users) {
  roomUsersElem.textContent = users
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
      sendMessageToServer(data.message, data.author).then((data) => {
        appendMessage(data.message, data.author)
        messageInput.value = ''
      })
  }
}

function sendMessageToServer(message, author) {
  return new Promise((resolve, reject) => {
    resolve({message, author})
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
