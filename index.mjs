import Message from "./models/Message.mjs";
import { Room, Rooms} from "./models/Room.mjs";
import { User, Users} from "./models/User.mjs";
import { Response, ToDateTime, PadLeft } from "./utils/Common.mjs";
import fs from 'fs'
import express from 'express';
import { Server } from "socket.io";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const INDEX = "index.html";
var server = express().use((req, res) => {
        res.sendFile(INDEX, { root: __dirname })
    }).listen(PORT, () => console.log(`Listening on ${PORT}`));
    
export const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});

io.on("connection", function (socket) {
    console.log('連線成功:',socket.id);
    socket.on("addUser", function (userName) {
        if(users.filter(user=>user.name === userName) > 0)
        {       
            socket.socket(socket.id).emit("addUserSuccess", Response(true,'','新增成功'));
        }
        else{
            socket.socket(socket.id).emit("addUserFail", Response(false,'','名稱已存在'));
        }
    });
    socket.on("join", function (m) {
        
    });
    socket.on("leave", function () {
        
    });
    socket.on("post", function (m) {
        
    });
    socket.on("disconnect", function () {
        
    });

    const all = new Room({
        roomID : 'all',
        title : '全頻聊天室',
        password : '',
        owner : 'system'
    })
    Rooms.push(all);

    socket.emit("allMessage", all.messages);

    socket.on("sendMessage", function (message) {

        all.messages.push(message);
        io.emit("newMessage", message);
    });
});
