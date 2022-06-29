import Message from "./Message.mjs";
import { Users } from "./User.mjs";
import { MessageType } from "../types/index.mjs"
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
                type: MessageType.TEXT
            })
        ];
    }
    create(io, socket){
        socket.join(this.roomID);        
        const [user] = Users.filter(user=>user.sessionID===socket.id);
        const message = new Message({
            userName:'notification',
            message:`${user.userName} 已經加入聊天室`,
            type:MessageType.TEXT
        });
        this.post(io,message);
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
            socket.emit('set-current-room',this.title);
            socket.emit('get-room-all-message',this.messages);
            const message = new Message({
                userName:'notification',
                message:`${user.userName} 已經加入聊天室`,
                type:MessageType.TEXT
            });
            this.post(io,message); 
            this.count++;
        }        
    }
    leave(io, socket){
        this.users = this.users.filter(x=>x!==socket.id);
        const [user] = Users.filter(x=>x.sessionID===socket.id);
        const message = new Message({
            userName:'notification',
            message:`${user.userName} 已經離開聊天室`,
            type:MessageType.TEXT
        });
        this.post(io,message);
        this.count--;
    }
    post(io, message){     
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
    }),
    new Room({
        roomID:'group',
        title:'群組聊天室',
        password:'',
        owner:'system'
    })
];
