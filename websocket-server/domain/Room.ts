import {Room} from '../room'

export class Rooms { 
    rooms: Room[] = [];
    getRooms () { 
        return this.rooms
    }

    setRooms(room: Room) {
        this.rooms.push(room)   
    
    }
}
