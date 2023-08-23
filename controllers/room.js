const io = require("../app");

io.on('connection', (socket) => {
   console.log('user connected');

 socket.on('join', ({ username, room }) => {
   socket.join(room);
   socket.emit('message', { username: 'Admin', message: `Welcome to the ${room} room!` });
   socket.broadcast.to(room).emit('message', { username: 'Admin', message: `${username} has joined the room!` });
   });

   socket.on('message', ({ username, message }) => {
    io.to(room).emit('message', { username, message });
   });

   socket.on('disconnect', () => {
    console.log('A user disconnected');
      if (room) {
        io.to(room).emit('message', { username: 'Admin', message: 'A user has left the room.' });
     }
   });
});

io.on('connection', (socket) => {
   console.log('user connected');

 socket.on('join', ({username, room}) => {
   socket.join(room);
 })
})
