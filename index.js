var fs = require('fs')
    // var https = require('https')
    // 如果不需要用 https 的話，要改成引用 http 喔
var http = require('http')
var socketio = require('socket.io')
var app = require('express')();

//https 的一些設定，如果不需要使用 ssl 加密連線的話，把內容註解掉就好
var options = {
    // key: fs.readFileSync('這個網域的 ssl key 位置'),
    // cert: fs.readFileSync('這個網域的 ssl fullchain 位置')
}
const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

//http & socket port
var server = http.createServer(app); //option
server.listen(PORT)
var io = socketio(server, {
    cors: {
        origin: "*",
        credentials: true
    }
});
app.use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    //  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// //用 api 方式取得
// app.get('/', function(req, res) {
//     res.sendFile(INDEX);
//     // let messages = 'hellow world'
//     // res.send(messages);
// })

var messages = [
    { name: "Marcus", message: "Welcome!" }
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