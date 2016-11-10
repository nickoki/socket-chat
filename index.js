var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

mongoose.connect("mongodb://localhost/socket-chat")
mongoose.Promise = global.Promise

var Message = mongoose.model("Message", new mongoose.Schema({
  body: String,
  timestamp: Date
}))


app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get('/api/messages', function(req, res) {
  Message.find({}).lean().exec().then(messages => {
    res.json(messages)
  })
})

io.on('connection', socket => {
  socket.on('chat message', msg => {
    console.log('message: ' + msg)
    io.emit('chat message', msg)
    if (msg) {
      Message.create({
        body: msg,
        timestamp: Date.now()
      })
    }
  })
})

http.listen(3000, () => {
  console.log('Listening on *:3000')
})
