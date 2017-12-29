const express = require('express');
const path = require('path');
// web sockets allow for a direct path for communication from server to client or client to server (either direction!). Socket.io makes it easy to set up a server that supports web sockets.
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage,generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

// behind the scenes express uses http node module. We're going to use http to configure express to support web sockets. General approach for creating a server: initialize the server, create middleware and define routes, call app.listen.
var app = express();
var server = http.createServer(app);
// io will be used for communication (emmitting and listening for events).
var io = socketIO(server);

app.use(express.static(publicPath));

// web sockets are a persistent technology. The server-client communication channel is kept open for as long as both of them want to. If either shuts down then the connected is dropped. However, the client will continue to reconnect when the server shuts down.
// socket represents an individual socket.
// this file contains node server code therefore we can use arrow functions since we're not writing code for the client in this file
io.on('connection', (socket) => {
  console.log('New user connected');

  // socket.emit emits to a single connection, io.emit emits to every connection
  socket.emit('newMessage', generateMessage('Peary the Ringleader', 'Welcome to Guus Gossip! Where geese get phresh on the hot topics of today.'));

  socket.broadcast.emit('newMessage', generateMessage('Peary the Ringleader', 'New user joined'));

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);

    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Peary the Ringleader', coords.latitude, coords.longitude));
  });



  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
