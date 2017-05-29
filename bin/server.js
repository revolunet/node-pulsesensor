var five = require("johnny-five"),
    express = require("express"),
    app = express(),
    http = require("http"),
    server = require('http').Server(app);
    io = require('socket.io')(server);

app.use(express.static('public'));
server.listen(8082);



function notify(socket, value) {
  socket.emit('pulse', value)
}


var board = new five.Board();

board.on("ready", function() {

  board.info('Board', 'ready');

  var sensor = new five.Sensor({
    pin: "A0",
    freq: 10
  });

  var currentSocket;

  sensor.scale([ 0, 100 ]).on("change", function() {
    if (currentSocket) {
      notify(currentSocket, this.scaled);
    }
  });

  io.on('connection', function(socket){

    currentSocket = socket;

    board.info('socket.io', 'connection');

  });


});
