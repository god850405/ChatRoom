import Message from "./Message.mjs";
import { Users } from "./User.mjs";
export class Room{
    constructor({ roomID, title, password, owner } = {}){
        this.roomID = roomID || Math.floor(Math.random()*900000000) + 100000000;
        this.title = title;
        this.password = password;
        this.owner = owner;
        this.users = [];
        this.count = 0;
        this.messages = [
            new Message({
                userName: "system",
                message: "Welcome!",
                type: "text"
            })
        ];
    }
    create(io, socket){
        socket.join(this.roomID);        
        const [user] = Users.filter(user=>user.sessionID===socket.id);
        io.to(this.roomID).emit('alert-message', `${user.userName} 已經加入聊天室`);
        socket.emit('alert-message', `您已經加入 ${this.title} 聊天室`);
        this.count++;
    }
    join(io, socket, password){
        const alreadyExist = this.users.includes(socket.id);
        const hasPassword = this.password !== '' || this.password !==undefined;
        const wrongPassword = this.password!==password;
        if(alreadyExist){
            socket.emit("alert-message", '加入失敗，用戶已在聊天室內');
        }
        else if(hasPassword && wrongPassword){
            socket.emit("alert-message", '加入失敗，密碼錯誤');
        }
        else{
            socket.join(this.roomID);  
            this.users.push(socket.id);  
            const [user] = Users.filter(user=>user.sessionID===socket.id);
            socket.emit('alert-message', `您已經加入 ${this.title} 聊天室`);
            io.to(this.roomID).emit('alert-message', `${user.userName} 已經加入聊天室`);    
            socket.emit('get-room-all-message', this.messages);
        }        
        this.count++;
    }
    leave(io, socket){
        users = this.users.filter(user!==socket.id);
        const [user] = Users.filter(user=>user.sessionID===socket.id);
        io.to(this.roomID).emit('alert-message', `${user.userName}  已經離開聊天室`);
        this.count--;
    }
    post(io, socket, msg){
        const [user] = Users.filter(user=>user.sessionID===socket.id); 
        const message = new Message({userName:user.userName,...msg});       
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
