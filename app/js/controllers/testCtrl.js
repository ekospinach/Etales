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
        {
            name: 'John',
            data: [5, 3, 4, 7, 2]
        }, {
            name: 'Jane',
            data: [2, 2, 3, 2, 1]
        }, {
            name: 'Joe',
            data: [3, 4, 4, 2, 5]
        }
        /*{"name": "Some data", "data": [1, 2, 4, 7, 3],type: "column"},
        {"name": "Some data 3", "data": [3, 1, 5, 5, 2], type: "column"},
        {"name": "Some data 2", "data": [5, 2, 2, 3, 5], type: "column"},
        {"name": "My Super Column", "data": [1, 1, 2, 3, 2], type: "column"}*/
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

    $scope.addReport=function(){
    	var url="/addCrossSegmentSales";
    	$http({
    		method:'GET',
    		url:url
    	}).then(function(){
    		console.log('Success1');
    		url='/addEmallPrices';
    		return $http({
    			method:'GET',
    			url:url
    		});
    	}).then(function(){
    		console.log('Success2');
    		url='/addMarketSales';
    		return $http({
    			method:'GET',
    			url:url
    		});
    	}).then(function(){
    		console.log('Success3');
    		url='/addMarketShare';
    		return $http({
    			method:'GET',
    			url:url
    		});    		
    	}).then(function(){
    		console.log('Success4');
    		url='/addPerformanceHighlights';
    		return $http({
    			method:'GET',
    			url:url
    		});    		
    	}).then(function(){
    		console.log('Success5');
    		url='/addProductPortfolio';
    		return $http({
    			method:'GET',
    			url:url
    		});    		
    	}).then(function(){
    		console.log('Success6');
    		url='/addSegmentLeadership';
    		return $http({
    			method:'GET',
    			url:url
    		});    		
    	}).then(function(){
    		console.log('Success7');	
    	},function(){
    		console.log('fail');
    	})
    }

    $scope.addProducerReport=function(){
    	var url='/addSCR-consolidatedProfitAndLoss';
    	$http({
    		method:'GET',
    		url:url
    	}).then(function(){
    		console.log('Success1');
    		url='/addSCR-channelsProfitability';
    		return $http({
    			method:'GET',
    			url:url
    		});
    	}).then(function(){
    		console.log('Success2');
    		url='/addSCR-inventoryVolumes';
    		return $http({
    			method:'GET',
    			url:url
    		});
    	}).then(function(){
    		console.log('Success3');
    		url='/addSCR-keyPerformanceIndicators';
    		return $http({
    			method:'GET',
    			url:url
    		});    		
    	}).then(function(){
    		console.log('Success4');
    		url='/addSCR-negotiations';
    		return $http({
    			method:'GET',
    			url:url
    		});    		
    	}).then(function(){
    		console.log('Success5');
    		url='/addSCR-sharesCrossSegment';
    		return $http({
    			method:'GET',
    			url:url
    		});    		
    	}).then(function(){
    		console.log('Success6');	
    	},function(){
    		console.log('fail');
    	});
    }

    $scope.addRetailerReport=function(){
    	var url='/addRCR-consolidatedProfitAndLoss';
    	$http({
    		method:'GET',
    		url:url
    	}).then(function(){
    		console.log('Success1');
    		url='/addRCR-inventoryVolumes';
    		return $http({
    			method:'GET',
    			url:url
    		});
    	}).then(function(){
    		console.log('Success2');
    		url='/addRCR-keyPerformanceIndicators';
    		return $http({
    			method:'GET',
    			url:url
    		});
    	}).then(function(){
    		console.log('Success3');
    		url='/addRCR-negotiations';
    		return $http({
    			method:'GET',
    			url:url
    		});    		
    	}).then(function(){
    		console.log('Success4');
    		url='/addRCR-profitabilityBySupplier';
    		return $http({
    			method:'GET',
    			url:url
    		});    		
    	}).then(function(){
    		console.log('Success5');
    		url='/addRCR-sharesCrossSegment';
    		return $http({
    			method:'GET',
    			url:url
    		});    		
    	}).then(function(){
    		console.log('Success6');	
    	},function(){
    		console.log('fail');
    	});
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
                type: 'bar'
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            xAxis: {
            	categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: 'Total fruit consumption'
	            }
	        }
            /*tooltip: {
	        	shared: false,
	        	useHTML: true,
	        	headerFormat: '<small style="color: {series.color}>{series.name}</small><table>',
	        	pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
	        	'<td style="text-align: right"><b>{point.y} EUR</b></td></tr>',
	        	footerFormat: '</table>',
	        	valueDecimals: 2
	        }*/
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

