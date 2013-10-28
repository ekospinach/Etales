define(['app','socketIO'], function(app) {

	app.controller('HomeCtrl',['$scope', '$http', 'ProducerDecisionBase', function($scope, $http, ProducerDecisionBase) {
		// You can access the scope of the controller from here
		$scope.welcomeMessage = 'hey this is HomeCtrl.js!';

		$scope.newDoc = function(){
			$http({method: 'GET', url: '/newDoc'}).then(function(res){
				console.log(res);
			},function(res){
				console.log(res);
			});
		}

		$scope.testPost = function(){
		  var queryCondition = {
		    seminar : 'MAY',
		    period : 0,
		    producerID : 1,
		    behaviour : 'updateVariant', 
		    /* 
		    switch(behaviour) case...
		    addProductNewBrand : categoryID
		    addProdcutExistedBrand : categoryID,brandName
		    deleteProduct : categoryID,brandName,varName
		    deleteBrand : categoryID,brandName
		    updateVariant : categoryID,brandName,varName,location,value[,addtionalIdx]
		    updateBrand : categoryID,brandName,varName,location,value[,addtionalIdx]
		    updateCategory : category,location,value
		    */
		    categoryID : 1,
		    brandName : 'EGEND1',
		    varName : '_A',
		    location : 'production',
		    additionalIdx  : 1,
		    value : 8888
		  }	

		  $http({method:'POST', url:'/producerDecision', data: queryCondition}).then(function(res){
		  	console.log('Success:' + res);
		  },function(res){
		  	console.log('Failed:' + res);
		  })
		}

		var socket = io.connect('http://localhost:8888');
		socket.on('baseChanged', function(data){
			console.log(data);
		});
		
		ProducerDecisionBase.reload({period:'0', seminar:'MAY', producerID:1}).then(function(base){
			$scope.pageBase = base;
			console.log($scope.pageBase);
			$scope.pageBase = ProducerDecisionBase.getPara();
			console.log($scope.pageBase);
			ProducerDecisionBase.setSomething('TEST');	
			
		}, function(reason){
			console.log('from ctr: ' + reason);
		}, function(update){
			console.log('from ctr: ' + update);
		})

		$scope.$on('producerDecisionBaseChanged', function(event, newBase){
			$scope.pageBase = newBase;
			console.log($scope.pageBase);			
		});
		
		$scope.$on('producerDecisionBaseChangedFromServer', function(event, newBase){
			$scope.pageBase = newBase;
			console.log('Changed from server side:');
			ProducerDecisionBase.reload({period:'0', seminar:'MAY', producerID:1}).then(function(base){
				
				ProducerDecisionBase.setSomething('SERVER');			

			}, function(reason){
				console.log('from ctr: ' + reason);
			}, function(update){
				console.log('from ctr: ' + update);
			})	
		});

	}]);
});

