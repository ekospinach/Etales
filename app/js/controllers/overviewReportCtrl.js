define(['app','socketIO','routingConfig'], function(app) {
	app.controller('overviewReportCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth','$anchorScroll','$q','PlayerInfo','SeminarInfo','PeriodInfo','Label','RoleInfo',
	 function($scope, $http, ProducerDecisionBase,$rootScope,Auth,$anchorScroll,$q,PlayerInfo,SeminarInfo,PeriodInfo,Label,RoleInfo) {

	 	$rootScope.loginCss="";
	    $rootScope.loginFooter="bs-footer";
	    $rootScope.loginLink="footer-links";
	    $rootScope.loginDiv="container";

	    $scope.isResultShown=false;
	    $scope.isPageInit=true;
	    var periods=new Array();
	    $scope.periods=periods;
	    
	    var url="/currentPeriod/"+SeminarInfo.getSelectedSeminar().seminarCode;
		$http({
			method:'GET',
			url:url
		}).then(function(data){
			for (var i=data.data.currentPeriod;i>=0;i--){
				$scope.periods.push(i);
			}
			$scope.selectedPeriod = data.data.currentPeriod;
		},function(){
			console.log('fail');
		})

		$scope.msg = '';		
		$scope.setPeriod = function(period){
			if(!period){
				$scope.msg = 'Please choose period.';
			}else{
				var url='/getFeedBack/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(parseInt($scope.selectedPeriod)-1);
				$http({
                    method:'GET',
                    url:url
                }).then(function(data){   
                    $scope.feedBack=data.data;  
                    $scope.isPageInit=false;
					$scope.isResultShown=true;                                                                      
                },function(){
                    console.log('fail');
                });
			}
		}
	}]);
});
