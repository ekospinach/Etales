var app=angular.module('feedback',['highcharts-ng']);
app.controller('feedBackCtrl', ['$scope','$http','$q',function($scope,$http,$q) {
    var initPage=function(){
        $scope.phones="hello";
        var url='/getFeedBack/MAY/0';
        $http({
            method:'GET',
            url:url
        }).then(function(data){
            $scope.data=data.data;
        });
    }

    var loadNegotiationResults=function(){
        $scope.chartConfig = {
            options: {
                chart: {
                    type: 'pie',
                     plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false

                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                }
            },
            series: [{
                type: 'pie',
                data: [
                    ['foo', 10],
                    ['bar', 90],
                    ['baz', 100]
                ]
            }],

            loading: false
        }
      }

      $scope.initPage=initPage;

      initPage();
      loadNegotiationResults();
    }
]);

