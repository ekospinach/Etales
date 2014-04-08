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

    $scope.mySeries=[{
    	data: [[97,36,10],[94,74,10],[68,76,10],[64,87,10],[68,27,10],[74,99,10],[7,93,10],[51,69,10],[38,23,10],[57,86,10]]
    }, {
    	data: [[25,10,10],[2,75,10],[11,54,10],[86,55,10],[5,3,10],[90,63,10],[91,33,10],[97,3,10],[15,67,10],[54,25,10]]
    }, {
    	data: [[47,47,10],[20,12,10],[6,76,10],[38,30,10],[57,98,10],[61,17,10],[83,60,10],[67,78,10],[64,12,10],[30,77,10]]
    }];

    $scope.myProducts=[
    	['ELAN1_A','ELAN1_B','ELAN1_C','ELAN1_D','ELAN1_E','ELAN1_F','ELAN1_G','ELAN1_H','ELAN1_I','ELAN1_J'],
    	['ELAN2_A','ELAN2_B','ELAN2_C','ELAN2_D','ELAN2_E','ELAN2_F','ELAN2_G','ELAN2_H','ELAN2_I','ELAN2_J'],
    	['ELAN3_A','ELAN3_B','ELAN3_C','ELAN3_D','ELAN3_E','ELAN3_F','ELAN3_G','ELAN3_H','ELAN3_I','ELAN3_J']
    ]


 tooltip: {
 	formatter: function() {
 		var s = '<p><b>'+this.series.name+'</b></p>'+'<p>'+$scope.change1s[this.series._i][this.point.x]+' '+Label.getContent('over previous period')+'</p>';
 		return s;
 	},
 	shared: false,
 	useHTML: true
 },
  //   $scope.chartConfig = {
  //       chart: {
  //       	type: 'bubble',
		// },
  //       series: [{
	 //        data: [[97,36,79],[94,74,60],[68,76,58],[64,87,56],[68,27,73],[74,99,42],[7,93,87],[51,69,40],[38,23,33],[57,86,31]]
	 //    }, {
	 //        data: [[25,10,87],[2,75,59],[11,54,8],[86,55,93],[5,3,58],[90,63,44],[91,33,17],[97,3,56],[15,67,48],[54,25,81]]
	 //    }, {
	 //        data: [[47,47,21],[20,12,4],[6,76,91],[38,30,60],[57,98,64],[61,17,80],[83,60,13],[67,78,75],[64,12,10],[30,77,82]]
	 //    }],
  //       title: {
  //           text: 'Hello'
  //       },
  //       loading: false
  //   }


		$scope.Label = Label;
	}]);

});

