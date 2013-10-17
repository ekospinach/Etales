define(['app'], function(app) {

	app.controller('HomeCtrl',['$scope', '$http', function($scope, $http) {
		// You can access the scope of the controller from here
		$scope.welcomeMessage = 'hey this is HomeCtrl.js!';

		var socket = io.connect();
		socket.on('news', function(data){
			console.log(data);
			socket.emit('my other event', { my: 'test'});
			socket.emit('private message', 'userX', 'oh shit');
		}).on('user disconnected', function(data){
			console.log(data);
		}).on('connect', function () { // TIP: you can avoid listening on `connect` and listen on events directly too!
		    socket.emit('ferret', 'tobi', function (data) {
      			console.log(data); // data will be 'woot'
    		});
  		});
	}]);
});

