io.of("/").adapter.on("create-room", (room) => {
   console.log(`room ${room} was created`);
});


io.of("/").adapter.on("join-room", (room, id) => {
   console.log(`socket ${id} has joined room ${room}`);
});

