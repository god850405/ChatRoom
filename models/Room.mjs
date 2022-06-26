import Message from "./Message.mjs";
import { Users } from "./User.mjs";
import { Response, ToDateTime } from "../utils/Common.mjs";
export class Room{
    constructor({ title,password,owner } = {}){
        this.roomID = Math.floor(Math.random()*900000000) + 100000000;
        this.title = title;
        this.password = password;
        this.owner = owner;
        this.users = [];
        this.messages = [
            new Message({
                userName: "system",
                message: "Welcome!",
                type: "text",
                time: ToDateTime(new Date()),
            })
        ];
    }
    join(io,socket,password){
        const alreadyExist = this.users.includes(socket.id);
        const hasPassword = this.password !== '' || this.password !==undefined;
        const wrongPassword = this.password!==password;
        if(alreadyExist){
            socket.emit("room-join-fail", Response(false,'','加入失敗，用戶已在聊天室內'));
        }
        else if(hasPassword && wrongPassword){
            socket.emit("room-join-fail", Response(false,'','加入失敗，密碼錯誤'));
        }
        else{
            socket.join(this.roomID);  
            this.users.push(sessionID);    
            const [user] = Users.filter(user=>user.sessionID===sessionID);
            socket.emit('join-room-message', `您已經加入 ${room.title} 聊天室`);
            io.to(this.roomID).emit('room-brocast', `${user.userName} 已經加入聊天室`);    
            socket.emit('get-room-all-message', this.messages);
        }        
    }
    leave(io,socket){
        users = this.users.filter(user!==socket.id);
        const [user] = Users.filter(user=>user.sessionID===sessionID);
        io.to(this.roomID).emit('room-brocast', `${user.userName}  已經離開聊天室`);
    }
    post(io,message){
        this.messages.push(message);
        io.to(this.roomID).emit('room-brocast', message);
    }   
}
export const Rooms = [
    new Room({
        roomID : 'all',
        title : '全頻聊天室',
        password : '',
        owner : 'system'
    })
];
