define(['app','socketIO','routingConfig','bootstrap'], function(app) {

	app.controller('testCtrl',['$scope', '$http','$location', 'ProducerDecisionBase','$rootScope','Auth','Label', function($scope, $http,$location, ProducerDecisionBase,$rootScope,Auth,Label) {
		// You can access the scope of the controller from here
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";		
		var userRoles = routingConfig.userRoles;

		var socket = io.connect('http://localhost');
		socket.on('AdminProcessLog', function(data){
			console.log('Log:' + data.msg + ', isError:' + data.isError);
		});

		$scope.testUnitCost = function(){
			var postData = {
			    period : 1,
			    seminar : 'MAY',
			    brandName : 'EGEND1',
			    varName : '_A',
			    catID : 1,
			    userRole :  userRoles.producer,
			    userID : 1,				
			}
		  $http({method:'POST', url:'/getCurrentUnitCost', data: postData}).then(function(res){
		  	console.log('testUnitCost Success:' + res.data);
		  },function(res){
		  	console.log('testUnitCost Failed:' + res.data);
		  })				
		}

		$scope.testExportPost=function(){
			$http({
				method:'POST',
				url:'/excel',
				data:''
			}).then(function(){
				console.log('Success');
			},function(){
				console.log('fail');
			});
		}

		$scope.testExport=function(){
			window.location = '/excel';
		}

		$scope.testPassive = function(period){
		  var postData = {
		  	seminar : 'MAY',
		  	period : period
		  }
		  $http({method:'POST', url:'/passiveSeminar', data: postData}).then(function(res){
		  	console.log('testPassive Success:' + res);
		  },function(res){
		  	console.log('testPassive Failed:' + res);
		  })			
		}

		$scope.setCurrentPeriod = function(period){
		  var postData = {
		  	seminar : 'MAY',
		  	period : period
		  }
		  $http({method:'POST', url:'/setCurrentPeriod', data: postData}).then(function(res){
		  	console.log('testPassive Success:' + res);
		  },function(res){
		  	console.log('testPassive Failed:' + res);
		  })			
		}		

		$scope.importPassiveDecision = function(period){
		  var postData = {
		  	seminar : 'MAY',
		  	period : period
		  }
		  $http({method:'POST', url:'/getPassiveDecision', data: postData}).then(function(res){
		  	console.log('testPassive Success:' + res);
		  },function(res){
		  	console.log('testPassive Failed:' + res);
		  })			
		}		

		$scope.exportPassiveDecision = function(period){
		  var postData = {
		  	seminar : 'MAY',
		  	period : period
		  }
		  $http({method:'POST', url:'/setPassiveDecision', data: postData}).then(function(res){
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

		$scope.testInitialiseRetailer=function(){
			console.log('retailer1');
			var postData = {
			  	seminar : 'MAY',
			}
			$http({method:'POST', url:'/initialiseSeminarRetailer', data: postData}).then(function(res){
				console.log('testInitialise Success:' + res.data);
			},function(res){
			  	console.log('testInitialise Failed:' + res.data);
			})	
		}
		$scope.testRun = function(period) {
			console.log('run:' + period);
		  var postData = {
		  	seminar : 'MAY',
		  	period : period
		  }
		  $http({method:'POST', url:'/runSeminar', data: postData}).then(function(res){
		  	console.log('testInitialise Success:' + res.data);
		  },function(res){
		  	console.log('testInitialise Failed:' + res.data);
		  })				
		}

		$scope.testImportResult = function(period) {
			console.log('run:' + period);
		  var postData = {
		  	seminar : 'MAY',
		  	period : period
		  }
		  $http({method:'POST', url:'/importResult', data: postData}).then(function(res){
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

		$scope.testAuthRetailer = function(){
			console.log(userRoles);
			console.log(routingConfig.accessLevels);
	        Auth.login({
	                username: 'MAY^' + userRoles.retailer + '^1',
	                password: '210',
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

		$scope.testLabel = function(){
			//console.log(Label.getLabel('test'));
			console.log(Label.getContent('Value Rotation Index Sales value per 1% of shelf space'));
		}

		$scope.setLanguage = function(value){
			Label.changeLanguage(value);
			console.log('current:' + Label.getCurrentLanguage());
		}
		$scope.chartTypes = [
        {"id": "line", "title": "Line"},
        {"id": "spline", "title": "Smooth line"},
        {"id": "area", "title": "Area"},
        {"id": "areaspline", "title": "Smooth area"},
        {"id": "column", "title": "Column"},
        {"id": "bar", "title": "Bar"},
        {"id": "pie", "title": "Pie"},
        {"id": "scatter", "title": "Scatter"}
    ];

    $scope.dashStyles = [
        {"id": "Solid", "title": "Solid"},
        {"id": "ShortDash", "title": "ShortDash"},
        {"id": "ShortDot", "title": "ShortDot"},
        {"id": "ShortDashDot", "title": "ShortDashDot"},
        {"id": "ShortDashDotDot", "title": "ShortDashDotDot"},
        {"id": "Dot", "title": "Dot"},
        {"id": "Dash", "title": "Dash"},
        {"id": "LongDash", "title": "LongDash"},
        {"id": "DashDot", "title": "DashDot"},
        {"id": "LongDashDot", "title": "LongDashDot"},
        {"id": "LongDashDotDot", "title": "LongDashDotDot"}
    ];

    $scope.chartSeries = [
        {"name": "Some data", "data": [1, 2, 4, 7, 3]},
        {"name": "Some data 3", "data": [3, 1, null, 5, 2], connectNulls: true},
        {"name": "Some data 2", "data": [5, 2, 2, 3, 5], type: "column"},
        {"name": "My Super Column", "data": [1, 1, 2, 3, 2], type: "column"}
    ];

    $scope.chartStack = [
        {"id": '', "title": "No"},
        {"id": "normal", "title": "Normal"},
        {"id": "percent", "title": "Percent"}
    ];

    $scope.addPoints = function () {
        var seriesArray = $scope.chartConfig.series;
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20])
    };

    $scope.addSeries = function () {
        var rnd = []
        for (var i = 0; i < 10; i++) {
            rnd.push(Math.floor(Math.random() * 20) + 1)
        }
        $scope.chartConfig.series.push({
            data: rnd
        })
    }

    $scope.removeRandomSeries = function () {
        var seriesArray = $scope.chartConfig.series;
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray.splice(rndIdx, 1)
    }

    $scope.removeSeries = function(id) {
        var seriesArray = $scope.chartConfig.series;
        seriesArray.splice(id, 1)
    }

    $scope.toggleHighCharts = function () {
        this.chartConfig.useHighStocks = !this.chartConfig.useHighStocks
    }

    $scope.chartConfig = {
        options: {
            chart: {
                type: 'areaspline'
            },
            plotOptions: {
                series: {
                    stacking: ''
                }
            }
        },
        series: $scope.chartSeries,
        title: {
            text: 'Hello'
        },
        credits: {
            enabled: true
        },
        loading: false
    }


		$scope.Label = Label;
	}]);

});

