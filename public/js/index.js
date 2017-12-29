var socket = io();

jQuery('#join-room-form').on('submit', function (e) {
  // e is an event argument. preventDefault() prevents the page going through the refresh process which is the default behavior for this event
  e.preventDefault();

  var nameTextbox = jQuery('[name=name]');
  var roomTextbox = jQuery('[name=room]');

  socket.emit('joinSubmitValidate', {
    name: nameTextbox.val(),
    room: roomTextbox.val()
  });
});

modules.exports = {socket};
