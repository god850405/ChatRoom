export class User{
    constructor({ sessionID,userName } = {}){
        this.sessionID = sessionID;
        this.userName = userName;
    }
}

export const Users = [];


//const toSocket = _.findWhere(io.sockets.sockets, {id: toId});
// 通過該連接對象（toSocket）與鏈接到這個對象的客戶端進行單獨通信
//toSocket.emit('message', {id:socket.id,message:toMsg});