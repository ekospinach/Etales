var app = angular.module('feedback', ['highcharts-ng', 'directive']);
app.controller('feedBackCtrl', ['$scope', '$http', '$q', 'Label', 'StaticValues', 'PlayerColor',
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
            var url = '/getFeedBack/' + Request['seminar'] + '/' + Request['period'];
            $http({
                method: 'GET',
                url: url
            }).then(function(data) {
                $scope.feedBack = data.data;
            });
        }
        $scope.newLabel=Label;
        initPage();
    }
]).config(function(LabelProvider) {
            //config default language
    LabelProvider.initialiseLanguage('CHN');
});