import Message from "./models/Message.mjs";
import { Room, Rooms} from "./models/Room.mjs";
import { User, Users} from "./models/User.mjs";
import { ToDateTime, PadLeft } from "./utils/Common.mjs";
import cors from 'cors'
import express from 'express';
import { Server } from "socket.io";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const INDEX = "index.html";
var server = express()
    .use(cors())
    .get('/checkUserName/:username', (req, res) => {
        const username = req.params.username;        
        res.send(Users.filter(user=>user===username).length>0);
    })    
    .get('/getRoom', (req, res) => {
        res.send(Rooms);
    })    
    .use('/',(req, res) => {
        res.sendFile(INDEX, { root: __dirname })
    }).listen(PORT, () => console.log(`Listening on ${PORT}`));
    
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});

io.on("connection", function (socket) {
    console.log('連線成功:',socket.id);

    socket.on("add-user", (userName) => {
        if(Users.filter(user=>user.name === userName) > 0)
        {       
            socket.emit("add-user-fail", '名稱已存在');
        }
        else{
            Users.push(
                new User({sessionID:socket.id,userName:userName})
            );
        }
    });
    
    socket.on('create-room', ({title,password} = obj) => {        
        const [user] = Users.filter(user=>user.sessionID===sessionID);
        const room = new Room({title:title,password:password,owner:user.userName});
        room.create(io,socket);
    })

    socket.on("join", ({roomID,password} = obj) => {
        const [room] = Rooms.filter(room=>room.roomID===roomID);
        room.join(io,socket,password);
    });
    socket.on("leave", (roomID) => {
        const [room] = Rooms.filter(room=>room.roomID===roomID);
        room.leave(io,socket);
    });
    socket.on("post", ({roomID,message} = obj) => {
        const [room] = Rooms.filter(room=>room.roomID===roomID);
        room.post(io,message);
    });
    socket.on("disconnect", () => {
        
    });
});
