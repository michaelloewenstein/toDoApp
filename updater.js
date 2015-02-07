module.exports = function(server)
{
	var socketio = require("socket.io");

	var io = socketio.listen(server);
	io.sockets.on('connection', function(socket)
		{
			socket.on("newTodo",function(data){
				socket.broadcast.emit("broadcastTodo", data);
			})

			socket.on("deleteTodo",function(data){
				socket.broadcast.emit("broadcastDeleteTodo", data);
			})

		});
}