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

let rooms = []

socket.on('connect', () => {

})
socket.on('connection info', (data) => {
  roomsElem.textContent = ''
  for(roomName in data.rooms) {
    rooms = data.rooms
    let room = data.rooms[roomName]
    appendRoom(roomName, room.users.length)
  }
})

function createRoom() {
  const newRoomNameInput = document.querySelector('#new-room-name')
  const room = newRoomNameInput.value

  if (Object.keys(rooms).includes(room)) {
    alert('Room already exists')
    return
  }

  if (!usernameElem.value) {
    alert('Insert nickname')
  } else if (!room) {
    alert('Insert room name')
  } else {
    location.href = `/${room}/${usernameElem.value}`
  }
}

function appendRoom(room, users=0) {
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
    if (usernameElem.value) {
      location.href = `/${room}/${usernameElem.value}`
    } else {
      alert('Insert nickname')
    }
  })
  roomsElem.append(roomElem)
}
