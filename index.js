var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', socket => {
  socket.on('chat message', msg => {
    console.log('message: ' + msg)
    io.emit('chat message', msg)
  })
})

http.listen(3000, () => {
  console.log('Listening on *:3000')
})
