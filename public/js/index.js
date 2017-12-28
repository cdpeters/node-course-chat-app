      // io() is available to us because we loaded in socket.io.js, it is not native to the browser.
      var socket = io();

      // no access to a socket argument since we already have it above
      socket.on('connect', function () {
        console.log('Connected to server');
      });

      socket.on('disconnect', function () {
        console.log('Disconnected from server');
      });

      socket.on('newMessage', function (message) {
        console.log('Received message', message);
      });
