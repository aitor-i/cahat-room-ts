// export function joinRoom(username: string, roomName: string) {
//   let room = rooms.find((room) => room.getName() === roomName);
//   if (!room) {
//     const newRoom = new Room(roomName);
//     rooms.push(newRoom);
//     room = newRoom;
//   }

//   let client = room
//     .getClients()
//     .find((client) => client.getName() === username);

//   if (!client) {
//     client = new Client(username);
//     room.addClient(client);
//   }

//   const roomData: ChatRoomData = {
//     roomId: room.getId(),
//     userId: client.getId(),
//     messages: room.getMessages(),
//   };

//   return roomData;
// }
