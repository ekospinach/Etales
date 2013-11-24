define(['app','socketIO','routingConfig'], function(app) {

	app.controller('HomeCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth', function($scope, $http, ProducerDecisionBase,$rootScope,Auth) {
		// You can access the scope of the controller from here
		var userRoles = routingConfig.userRoles;

		var socket = io.connect('http://localhost');
		socket.on('AdminProcessLog', function(data){
			console.log('Log:' + data.msg + ', isError:' + data.isError);
		});

		$scope.testPassive = function(){
			console.log('testPassive');
		  var postData = {
		  	seminar : 'MAY',
		  	period : 0
		  }
		  $http({method:'POST', url:'/passiveSeminar', data: postData}).then(function(res){
		  	console.log('testPassive Success:' + res);
		  },function(res){
		  	console.log('testPassive Failed:' + res);
		  })			
		}

		$scope.testInitialise = function(){
			console.log('testIni');
		  var postData = {
		  	seminar : 'MAY',
		  }
		  $http({method:'POST', url:'/initialiseSeminar', data: postData}).then(function(res){
		  	console.log('testInitialise Success:' + res.data);
		  },function(res){
		  	console.log('testInitialise Failed:' + res.data);
		  })			
		}

		$scope.testAuth = function(){
			console.log(userRoles);
			console.log(routingConfig.accessLevels);
	        Auth.login({
	                username: 'MAY^' + userRoles.producer + '^1',
	                password: '110',
	                rememberme: true
	            },
	            function(res) {
	                console.log('login successfully, currentUser:' + $rootScope.user);
	            },
	            function(err) {
	            	console.log(err);
	            });			
		}

		$scope.logOut = function(){
			Auth.logout(function(res){
				console.log('just log out.');
			},function(err){
				console.log(err);
			});
		}
		
		$scope.showUser = function(){
			console.log($rootScope.user);
		}
		
		$scope.proNewDoc = function(){
			$http({method: 'GET', url: '/proNewDoc'}).then(function(res){
				console.log(res);
			},function(res){
				console.log(res);
			});
		}

		$scope.retNewDoc=function(){
			$http({method: 'GET', url: '/retNewDoc'}).then(function(res){
				console.log(res);
			},function(res){
				console.log(res);
			});
		}

		$scope.conNewDoc=function(){
			$http({method:'GET',url:'/conNewDoc'}).then(function(res){
				console.log(res);
			},function(res){
				console.log(res);
			});
		}

		$scope.conDetNewDoc=function(){
			$http({method:'GET',url:'/conDetNewDoc'}).then(function(res){
				console.log(res);
			},function(res){
				console.log(res);
			});			
		}

		$scope.variantHistoryNewDoc=function(){
			$http({method:'GET',url:'/variantHistoryNewDoc'}).then(function(res){
				console.log(res);
			},function(res){
				console.log(res);
			});		
		}

		$scope.brandHistoryNewDoc=function(){
			$http({method:'GET',url:'/brandHistoryNewDoc'}).then(function(res){
				console.log(res);
			},function(res){
				console.log(res);
			});		
		}

		$scope.companyHistoryNewDoc=function(){
			$http({method:'GET',url:'/companyHistoryNewDoc'}).then(function(res){
				console.log(res);
			},function(res){
				console.log(res);
			});		
		}

		$scope.quarterHistoryNewDoc=function(){
			$http({method:'GET',url:'/quarterHistoryNewDoc'}).then(function(res){
				console.log(res);
			},function(res){
				console.log(res);
			});	
		}

		$scope.seminarNewDoc=function(){
			$http({method:'GET',url:'/seminarNewDoc'}).then(function(res){
				console.log(res);
			},function(res){
				console.log(res);
			});				
		}

		$scope.setContractUser=function(userID){
			$rootScope.rootContractUserID=userID;
		}

		$scope.testPost = function(){
		  var queryCondition = {
		    seminar : 'MAY',
		    period : 0,
		    producerID : 1,
		    behaviour : 'updateCategory', 
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
		    varName : '',
		    location : 'investInDesign',
		    additionalIdx  : 1,
		    value : 333
		  }	

		  $http({method:'POST', url:'/producerDecision', data: queryCondition}).then(function(res){
		  	console.log('Success:' + res);
		  },function(res){
		  	console.log('Failed:' + res);
		  })
		}

		
		ProducerDecisionBase.reload({producerID:$rootScope.rootProducerID,period:$rootScope.rootPeriod,seminar:$rootScope.rootSeminar}).then(function(base){
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

