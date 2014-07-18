define(['app','socketIO','routingConfig'], function(app) {
	app.controller('overviewReportCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth','$anchorScroll','$q','PlayerInfo','SeminarInfo','PeriodInfo','Label','RoleInfo',
	 function($scope, $http, ProducerDecisionBase,$rootScope,Auth,$anchorScroll,$q,PlayerInfo,SeminarInfo,PeriodInfo,Label,RoleInfo) {


	    // $scope.isResultShown=false;
	    // $scope.isPageInit=true;
	    
	    $scope.selectedPeriod = PeriodInfo.getCurrentPeriod()-1;
	    var loadFeedBack=function(){
			var url='/getFeedBack/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+$scope.selectedPeriod;
			$http({
	            method:'GET',
	            url:url
	        }).then(function(data){   
	            $scope.feedBack=data.data;                                                                      
	        },function(){
	            console.log('fail');
	        });
		}
		loadFeedBack();
	}]);
});
