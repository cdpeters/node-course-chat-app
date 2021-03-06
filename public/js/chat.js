// io() is available to us because we loaded in socket.io.js, it is not native to the browser.
var socket = io();

function scrollToBottom() {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
};

// no access to a socket argument since we already have it above
socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('updateUserList', function (users) {
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

//////////////////////////// new message listener that  receives the new message from the server and creates the list item to be rendered to the client
socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  // html() returns the markup inside message-template
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();

  // var li = jQuery('<li></li>');
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);

  // jQuery('#messages').append(li);
});

//////////////////////////// new location message listener that receives the new message from the server and creates the list item with link to be rendered to the client
socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');

  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">here is where I is at</a>');
  // // safe methods below instead of template strings in the above two variables.
  // li.text(`${message.from} ${formattedTime}: `);
  // a.attr('href', message.url);
  // li.append(a);
  // jQuery('#messages').append(li);
});

/////////////////////////////////// create message listener that emits the created message on form submission (in the client) and sends it to the server
jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('');
  });
});

/////////////////////////////////// create location message listener that emits the created location message on button onclick (in the client) and sends it to the server
var locationButton = jQuery('#send-location');
// jQuery('#send-location').on is the same as the below:
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your stinky old browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending where you is being at on the world...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send where you is being at on the world');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send where you is being at on the world');
    alert('Unable to fetch location.');
  });
});
