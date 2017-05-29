var five = require("johnny-five"),
    express = require("express"),
    app = express(),
    http = require("http"),
    server = require('http').Server(app);
    io = require('socket.io')(server);

app.use(express.static('public'));
server.listen(8082);

var board = new five.Board();

board.on("ready", function() {
  board.info('Board', 'ready');
  io.on('connection', function(socket){
    board.info('socket.io', 'connection');

    var led = new five.Led(13);

    var sensor = new five.Sensor({
      pin: "A0",
      freq: 10
    });

    sensor.scale([0, 100]).on("change", function() {
      socket.emit('pulse', this.scaled)
    });

    board.repl.inject({
      led: led,
      sensor: sensor,
      socket: socket
    });

  });
});
