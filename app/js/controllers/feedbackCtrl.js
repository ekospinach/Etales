define(['app'], function(app) {
    app.controller('feedbackCtrl', ['$scope', '$q', '$rootScope', '$location', '$http', '$filter', 'Label', 'PlayerInfo', 'PeriodInfo', 'SeminarInfo', '$window', function($scope, $q, $rootScope, $location, $http, $filter, Label, PlayerInfo, PeriodInfo, SeminarInfo, $window) {


        var periods = new Array();
        $scope.periods = periods;

        $scope.typeList = [{
            value: 1,
            text: 'Normal Feedback'
        }, {
            value: 2,
            text: 'Extended Supplier'
        }, {
            value: 3,
            text: 'Extended Retailer'
        }];

        var url = "/seminarInfo/" + SeminarInfo.getSelectedSeminar().seminarCode;
        $http({
            method: 'GET',
            url: url
        }).then(function(data) {
            for (var i = data.data.currentPeriod; i >= -2; i--) {
                $scope.periods.push(i);
            }
            $scope.selectedType = 1;
            $scope.selectedPeriod = data.data.currentPeriod;
            $scope.selectLanguage = 'English';
        }, function() {
            console.log('fail');
        })

        $scope.msg = '';
        $scope.setPeriod = function(period) {
            // if ($scope.selectedPeriod&&$scope.selectedType) {
            //     var url = 'feedbackENG?seminar=' + SeminarInfo.getSelectedSeminar().seminarCode + '&period=' + ($scope.selectedPeriod - 1) + '&language=' + $scope.selectLanguage;
            //     $window.open(url);
            // } else {
            //     $scope.msg = $scope.msg = 'Please choose period.';
            // }

            var address='';
            if($scope.selectedType==1){
            	address='feedbackENG';
            }else if($scope.selectedType==2){
            	address='extendedFeedbackSupplier';
            }else if($scope.selectedType==3){
            	address='extendedFeedbackRetailer';
            }
            url=address+'?seminar=' + SeminarInfo.getSelectedSeminar().seminarCode + '&period=' + ($scope.selectedPeriod - 1) + '&language=' + $scope.selectLanguage;
            $window.open(url);

        }


    }]);
});