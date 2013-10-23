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
var io = require('socket.io').listen(9001);
//var io = require('socket.io').listen(9001, option);
console.log((new Date()) + " Server is listening on port 9001");

// This callback function is called every time a socket tries to connect to the server
io.sockets.on('connection', function(socket) {
  ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;
  console.log((new Date()) + ' Connection established. id==' + socket.id + '  ip=' + ip + '  transport=' + io.transports[socket.id].name);

  // When a user send a SDP message, broadcast to all users in the room
  socket.on('message', function(message) {
    console.log((new Date()) + ' Received Message, broadcasting: ' + message);
    socket.broadcast.emit('message', message);
  });

  // When the user hangs up,  broadcast bye signal to all users in the room
  socket.on('disconnect', function() {
    // close user connection
    console.log((new Date()) + " Peer disconnected.");
    socket.broadcast.emit('user disconnected');
  });

});
