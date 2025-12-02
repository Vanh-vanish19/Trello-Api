
export const inviteUserToBoardSocket = (socket) => {
  // lang nghe su kien client emit len
  socket.on('FE_USER_INVITED_TO_BOARD', (invitation) => {
    // emit nguoc lai 1 suk kien cho moi client khac tru thg hien tai roi gui ve fe check
    socket.broadcast.emit('BE_USER_INVITED_TO_BOARD', invitation)
  })
}