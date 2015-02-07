var todoApp = angular.module('todoApp', []);

function mainController($scope, $http) {
	
	var socket = io.connect(); 
	socket.on("connect",function(){
    console.log('connect');
  });
	

	socket.on("broadcastTodo",function(todo)
		{
			$scope.todos.push(todo);
			$scope.$apply();
		});


	socket.on("broadcastDeleteTodo",function(todoId)
		{
			for(var i = $scope.todos.length - 1; i >= 0; i--) {
			    if($scope.todos[i]._id === todoId) {
			       $scope.todos.splice(i, 1);
			    }
			}
			
			$scope.$apply();
		});

	$scope.formData = {};

	
	// when landing on the page, get all todos and show them
	$http.get('/api/catFact')
		.success(function(data) {
			$scope.catFact = angular.fromJson(angular.fromJson(data)).facts[0];
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

		
	
	// when landing on the page, get all todos and show them
	$http.get('/api/todos')
		.success(function(data) {
			$scope.todos = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// when submitting the add form, send the text to the node API
	$scope.createTodo = function() {
		$http.post('/api/todos', $scope.formData)
			.success(function(data) {
				
				socket.emit("newTodo",{text:$scope.formData.text});
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.todos = data;

			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// delete a todo after checking it
	$scope.deleteTodo = function(id) {
		$http.delete('/api/todos/' + id)
			.success(function(data) {
				socket.emit("deleteTodo",id);
				$scope.todos = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}