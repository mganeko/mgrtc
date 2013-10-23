/*
var SSL_KEY = 'node.key';
var SSL_CERT = 'node.cert';
var fs = require('fs');
var option = {
 key : fs.readFileSync(SSL_KEY).toString(),
 cert : fs.readFileSync(SSL_CERT).toString()
};
*/

// create the socket server on the port
var io = require('socket.io').listen(9002);
//var io = require('socket.io').listen(9002, option);
console.log((new Date()) + " Server is listening on port 9002");

// This callback function is called every time a socket tries to connect to the server
io.sockets.on('connection', function(socket) {
  ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;
  console.log((new Date()) + ' Connection established. id==' + socket.id + '  ip=' + ip + '  transport=' + io.transports[socket.id].name);

  // ---- multi room ----
  socket.on('enter', function(roomname) {
    socket.set('roomname', roomname);
    socket.join(roomname);
    console.log('id=' + socket.id + ' enter room=' + roomname);
  });

  function emitMessage(type, message) {
    // ----- multi room ----
    var roomname;
    socket.get('roomname', function(err, _room) {
      roomname = _room;
    });

    if (roomname) {
      socket.broadcast.to(roomname).emit(type, message);
    }
    else {
      socket.broadcast.emit(type, message);
    }
  }

  // When a user send a SDP message, broadcast to all users in the room
  socket.on('message', function(message) {
    console.log((new Date()) + ' Received Message, broadcasting: ' + message);

    // ----- multi room ----
    emitMessage('message', message);

  });

  // When the user hangs up,  broadcast bye signal to all users in the room
  socket.on('disconnect', function() {
    // close user connection
    console.log((new Date()) + " Peer disconnected.");

    // ----- multi room ----
    emitMessage('user disconnected');

  });

});
