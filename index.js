const fs = require('fs')
const express = require('express');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

//http & socket port
var server = express()
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
var io = socketIO(server, {
    cors: {
        origin: "*",
        credentials: true
    }
});
var messages = [
    {
        name: "System",
        message: "Welcome!" ,
        type:'text',
        time:ToDateTime(new Date())
    }
]
var typing = false
var timer = null
    //用 socket 方式取得
io.on('connection', function(socket) {
    console.log('user connected')
    socket.emit("allMessage", messages)

    socket.on("sendMessage", function(message) {
        console.log(message)
        messages.push(message)
        io.emit("newMessage", message)
    })

    socket.on('sendTyping', function() {
        console.log('typing')
        typing = true
        io.emit("someoneIsTyping", typing)
        clearTimeout(timer)
        timer = setTimeout(() => {
            typing = false
            io.emit("someoneIsTyping", typing)
        }, 3000)
    })
})

function ToDateTime(date,separate=`-`){
    const result = new Date(date);
    const _yyyy = result.getFullYear();
    const _MM = result.getMonth()+1;const MM = PadLeft(_MM,2,'0');
    const _dd = result.getDate();const dd = PadLeft(_dd,2,'0');
    const _hh = result.getHours();const hh = PadLeft(_hh,2,'0');
    const _mm = result.getMinutes();const mm = PadLeft(_mm,2,'0');
    const _ss = result.getSeconds();const ss = PadLeft(_ss,2,'0');
    return `${_yyyy}${separate}${MM}${separate}${dd} ${hh}:${mm}:${ss}`;
}

function PadLeft(self,n , str){
    if (typeof(n) !=='number' || isNaN(n)) return '';
    let selfStr = `${self}`;
    let leftStr = '';
    for (let i =0 ; i<5 ;i++){
        leftStr += str;
    }
    return (leftStr + selfStr).slice(-n);
}