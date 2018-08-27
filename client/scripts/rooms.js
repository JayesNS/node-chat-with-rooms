const socket = io('http://localhost:3000')
const roomsElem = document.querySelector('#room-panel ul')
const usernameElem = document.querySelector('#nickname')

const newRoomAddButton = document.querySelector('#new-room-add')
newRoomAddButton.addEventListener('click', createRoom)
const newRoomNameInput = document.querySelector('#new-room-name')
newRoomNameInput.addEventListener('keypress', (event) => {
  if (event.keyCode === 13) {
    createRoom()
  }
})

socket.on('connect', () => {
  socket.emit('room list')
  socket.on('room list', (data) => {
    console.log(data)
  })
})

function createRoom() {
  const newRoomNameInput = document.querySelector('#new-room-name')
  const room = newRoomNameInput.value

  createRoomOnServer(room).then(() => {
    appendRoom(room)
    newRoomNameInput.value = ''
  })
}

function createRoomOnServer(room) {
  return new Promise((resolve, reject) => {
    resolve()
  })
}

function appendRoom(room) {
  let users = 0

  const roomElem = document.createElement('li')
  roomElem.className = 'room'

  const roomNameElem = document.createElement('div')
  roomNameElem.className = 'room-name'
  roomNameElem.appendChild(document.createTextNode(room))
  roomElem.appendChild(roomNameElem)

  const roomUsersElem = document.createElement('div')
  roomUsersElem.className = 'room-users badge'
  roomUsersElem.appendChild(document.createTextNode(users))
  roomElem.appendChild(roomUsersElem)

  roomElem.addEventListener('click', () => {
    console.log(usernameElem.value)
    if (usernameElem.value) {
      const url = `/${room}/${usernameElem.value}`
      location.href = url
    }
  })
  roomsElem.append(roomElem)
}
