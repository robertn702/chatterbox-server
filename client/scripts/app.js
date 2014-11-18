// YOUR CODE HERE:

var app = {

  serverURL: 'http://127.0.0.1:3000/classes/messages',
  postMessageData: null,
  getMessageData: null,
  username: null,
  friends: [],
  rooms: ['lobby'],
  currentRoom: 'lobby',

  init: function(){
    setInterval(this.fetch.bind(this), 1500);
  },

  changeRoom: function(){
    $('.messages-header').text(app.currentRoom+ ' Messages');
  },

  display: function(){
    var messages = this.getMessageData;

    $('.messages-container').html('');


    for (var i = 0; i < messages.results.length; i++) {
      var user = _.escape(messages.results[i].username);
      var message = _.escape(messages.results[i].text);
      if (this.friends.indexOf(user) !== -1) {
        message = '<div class=""><strong><a href="#">'+ user + '</a>: ' + message + '</strong></div>';
      } else {
        message = '<div class=""><a href="#">'+ user + '</a>: ' + message + '</div>';
      }
      if (app.currentRoom === 'lobby') {
        $('.messages-container').append(message);
      } else if (messages.results[i].room === app.currentRoom) {
        $('.messages-container').append(message);
      }
    }
  },

  fetch: function(){
    $.ajax({
      url: app.serverURL,
      type: 'GET',
      data: {
        order: '-createdAt',
        limit: 30
      },
      success: function (data) {
        console.log('chatterbox: Messages retrieved');
        app.getMessageData = JSON.parse(data);
        app.display();
      },
      error: function (data) {
        console.error('chatterbox: Failed to retrieve messages');
      }
    });
  },

  createJSON: function(){
    var result = {};
    result.username = app.username;
    result.room = app.currentRoom;
    result.text = $('.send-message').val();
    console.log(result.text);
    result.roomname = undefined; // TODO
    app.postMessageData = result;
  },

  send: function(){
    $.ajax({
      url: app.serverURL,
      type: 'POST',
      data: JSON.stringify(app.postMessageData),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        app.fetch();
        // update();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  }

};

$(document).ready(function(){
  app.username = window.location.search.split("=")[1];
  app.init();

  $('.send-message').on('keydown', function(e){
    if (e.keyCode === 13) {
      app.createJSON();
      app.send();
      $(this).val('');
    }
  });

  $('.create-room').on('keydown', function(e){
    if (e.keyCode === 13) {

      var room = '<div class="separate"><li><a href="#">'
                 + $(this).val()
                 +'</a></li><button class="delete">x'
                 +'</button></div>';

      $('#rooms-list').append(room);
      app.rooms.push($(this).val())
      $(this).val('');
    }
  });

  $(document).on('click', '.delete', function(e){
    $(this).parent().remove();
    app.friends.splice(app.friends.indexOf($(this).parent().first('li').text()), 1);
    app.rooms.splice(app.rooms.indexOf($(this).parent().first('a').text()), 1);
  });

  // TODO: FIX ADDING FRIENDS REPEATEDLY
  $(document).on('click', 'section a', function(e){
    var friend = '<div class="separate"><li>'
               + $(this).text()
               +'</li><button class="delete">x'
               +'</button></div>';

    // if (!$('#friends-list').contains($(this).text())) {
      $('#friends-list').append(friend);
      app.friends.push($(this).text());
    // }
    // if (!$.contains($('#friends-list'), $(this))) {
    //   $('#friends-list').append(friend);
    // }
    //
    // if (!$('#friends-list:contains('+$(this).text()+')')) {
    //   $('#friends-list').append(friend);
    // }
  });

  $('#rooms-list').on('click', 'a', function(){
    app.currentRoom = $(this).text();
    app.changeRoom();
  });

});
