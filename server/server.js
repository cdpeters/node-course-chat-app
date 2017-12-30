const express = require('express');
const path = require('path');
// web sockets allow for a direct path for communication from server to client or client to server (either direction!). Socket.io makes it easy to set up a server that supports web sockets.
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

// behind the scenes express uses http node module. We're going to use http to configure express to support web sockets. General approach for creating a server: initialize the server, create middleware and define routes, call app.listen.
var app = express();
var server = http.createServer(app);
// io will be used for communication (emmitting and listening for events).
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

// web sockets are a persistent technology. The server-client communication channel is kept open for as long as both of them want to. If either shuts down then the connected is dropped. However, the client will continue to reconnect when the server shuts down.
// socket represents an individual socket.
// this file contains node server code therefore we can use arrow functions since we're not writing code for the client in this file
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('User Name and Flock Name are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    // socket.leave() leaves a room

    // socket.emit emits to a single connection, io.emit emits to every connection
    socket.emit('newMessage', generateMessage('Admin Guus', 'Welcome to GuusGab! Where geese get phresh on the hot topics of today.'));

    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin Guus', `${params.name} has joined the ${params.room} flock.`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });


  ///////////////////////////////// user leaves (disconnects)
  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin Guus', `${user.name} has left the ${user.room} flock.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
