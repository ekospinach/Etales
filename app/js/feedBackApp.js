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

            //Negotiation Results
            $scope.supplierNegotiationResults = {
                options: {
                    title:{
                        text:'Breakdown of Volume Discounts given by Suppliers',
                    },
                    chart: {
                        type: 'pie',
                        backgroundColor: 'transparent',
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x:0,
                        y:20
                    },
                    tooltip: {
                        formatter: function() {
                            var s = '<p><b>'+this.key+'</b></p>'+'<p>'+this.point.y.toFixed(2)+'($mln)</p>'+'<p>'+this.point.percentage.toFixed(2)+'%</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
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
                        {'name':'supplier-1',y:data.data.f_DiscountsValue[0].fcni_SuppliersCost[0].value,'color':'#3257A7'},
                        {'name':'supplier-2',y:data.data.f_DiscountsValue[0].fcni_SuppliersCost[1].value,'color':'#B11E22'},
                        {'name':'supplier-3',y:data.data.f_DiscountsValue[0].fcni_SuppliersCost[2].value,'color':'#F6B920'}
                    ]
                }],
                loading: false
            }

            $scope.retailerNegotiationResults = {
                options: {
                    title:{
                        text:'Breakdown of Volume Discounts given by Suppliers',
                    },
                    chart: {
                        type: 'pie',
                        backgroundColor: 'transparent',
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x:0,
                        y:20
                    },
                    tooltip: {
                        formatter: function() {
                            var s = '<p><b>'+this.key+'</b></p>'+'<p>'+this.point.y.toFixed(2)+'($mln)</p>'+'<p>'+this.point.percentage.toFixed(2)+'%</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
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
                        {'name':'retailer-1',y:data.data.f_DiscountsValue[0].fcni_RetailersBenefits[0].value,'color':'#8B288B'},
                        {'name':'retailer-2',y:data.data.f_DiscountsValue[0].fcni_RetailersBenefits[1].value,'color':'#F05422'}
                    ]
                }],
                loading: false
            }


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
                    backgroundColor: 'transparent',
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x:0,
                    y:20
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p><b>'+this.key+'</b></p>'+'<p>'+this.point.y.toFixed(2)+'($mln)</p>'+'<p>'+this.point.percentage.toFixed(2)+'%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
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
                    // {'name':'supplier-1',y:10,'color':'#3257A7'},
                    // {'name':'supplier-2',y:90,'color':'#B11E22'},
                    // {'name':'supplier-3',y:100,'color':'#F6B920'}
                    {'name':'retailer-2',y:90,'color':'#8B288B'},
                    {'name':'retailer-3',y:100,'color':'#F05422'}
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

