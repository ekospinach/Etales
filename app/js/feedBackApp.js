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
                title:{
                    text:'Breakdown of Volume Discounts given by Suppliers',
                },
                chart: {
                    type: 'pie',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false

                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x:0,
                    y:20
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
                    ['supplier-1', 10],
                    ['supplier-2', 90],
                    ['supplier-3', 100]
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

