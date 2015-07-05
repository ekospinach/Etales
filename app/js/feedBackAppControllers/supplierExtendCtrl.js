var app = angular.module('supplierExtend', ['highcharts-ng', 'directive']);
app.controller('supplierExtendCtrl', ['$scope', '$http', '$q', 'Label', 'StaticValues', 'PlayerColor',
    function($scope, $http, $q, Label, StaticValues, PlayerColor) {
        function GetRequest() {
            var url = document.location.search; //获取url中"?"符后的字串
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        }
        var initPage = function() {
            var Request = GetRequest();

            var extendedFeedbackUrl = '/getExtendedFeedback/' + Request['seminar'] + '/' + Request['period'];
            var normalfeedbackUrl = '/getFeedBack/' + Request['seminar'] + '/' + Request['period'];
            var variantPerceptionEvolutionUrl = '/getMR-variantPerceptionEvolution/' + Request['seminar'] + '/' + Request['period'];
            var netMarketPricesUrl = '/getMR-netMarketPrices/' + Request['seminar'] + '/' + Request['period'];
            var awarenessUrl = '/getMR-awarenessEvolution/' + Request['seminar'] + '/' + Request['period'];

            $q.all([
                $http.get(extendedFeedbackUrl), $http.get(normalfeedbackUrl), $http.get(variantPerceptionEvolutionUrl), $http.get(netMarketPricesUrl), $http.get(awarenessUrl)
            ]).then(function(data) {
                $scope.feedback = data[0].data;
                $scope.normalfeedback = data[1].data;
                $scope.variantPerception = data[2].data[0];
                $scope.netMarketPrices = data[3].data[0];
                $scope.awareness = data[4].data[0];
                var language = 'ENG';
                if (Request['language'] != 'English')
                    language = 'CHN';
                Label.changeLanguage(language);
                $scope.Label = Label;
                $scope.PlayerColor= PlayerColor;
            });
        }
        initPage();
    }
]).config(function(LabelProvider) {
    //config default language
    LabelProvider.initialiseLanguage('ENG');
});