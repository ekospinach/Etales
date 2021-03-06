var app=angular.module('feedback',['highcharts-ng']);
app.controller('negotiationResultsCtrl', ['$scope','$http','$q',function($scope,$http,$q) {
    var initPage=function(){
        var url='/getFeedBack/MAY/0';
        $http({
            method:'GET',
            url:url
        }).then(function(data){
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
                        enabled:false
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
                                distance:-100,
                                rotation:0,
                                color:'white',
                                format: '<p style="font-size:17px;line-hight:20px">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
                                useHTML:true
                            },
                            showInLegend: true
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    data: [
                        {'name':'Supplier-1',y:data.data.f_DiscountsValue[0].fcni_SuppliersCost[0].value,'color':'#3257A7'},
                        {'name':'Supplier-2',y:data.data.f_DiscountsValue[0].fcni_SuppliersCost[1].value,'color':'#B11E22'},
                        {'name':'Supplier-3',y:data.data.f_DiscountsValue[0].fcni_SuppliersCost[2].value,'color':'#F6B920'}
                    ]
                }],
                loading: false
            }

            $scope.retailerNegotiationResults = {
                options: {
                    title:{
                        text:'Breakdown of Volume Discounts received by Retailers',
                    },
                    chart: {
                        type: 'pie',
                        backgroundColor: 'transparent',
                    },
                    legend: {
                        enabled:false
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
                                distance:-100,
                                rotation:0,
                                color:'white',
                                format: '<p style="font-size:17px;line-hight:20px">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
                                useHTML:true
                            },
                            showInLegend: true
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    data: [
                        {'name':'Retailer-1',y:data.data.f_DiscountsValue[0].fcni_RetailersBenefits[0].value,'color':'#8B288B'},
                        {'name':'Retailer-2',y:data.data.f_DiscountsValue[0].fcni_RetailersBenefits[1].value,'color':'#F05422'}
                    ]
                }],
                loading: false
            }

            $scope.supplierPerformanceBonuses = {
                options: {
                    title:{
                        text:'Breakdown of Performance Bonuses given by Suppliers',
                    },
                    chart: {
                        type: 'pie',
                        backgroundColor: 'transparent',
                    },
                    legend: {
                        enabled:false
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
                                distance:-100,
                                rotation:0,
                                color:'white',
                                format: '<p style="font-size:17px;line-hight:20px">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
                                useHTML:true
                            },
                            showInLegend: true
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    data: [
                        {'name':'Supplier-1',y:data.data.f_PerformanceBonusesValue[0].fcni_SuppliersCost[0].value,'color':'#3257A7'},
                        {'name':'Supplier-2',y:data.data.f_PerformanceBonusesValue[0].fcni_SuppliersCost[1].value,'color':'#B11E22'},
                        {'name':'Supplier-3',y:data.data.f_PerformanceBonusesValue[0].fcni_SuppliersCost[2].value,'color':'#F6B920'}
                    ]
                }],
                loading: false
            }

            $scope.retailerPerformanceBonuses = {
                options: {
                    title:{
                        text:'Breakdown of Performance Bonuses received by Retailers',
                    },
                    chart: {
                        type: 'pie',
                        backgroundColor: 'transparent',
                    },
                    legend: {
                        enabled:false
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
                                distance:-100,
                                rotation:0,
                                color:'white',
                                format: '<p style="font-size:17px;line-hight:20px">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
                                useHTML:true
                            },
                            showInLegend: true
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    data: [
                        {'name':'Retailer-1',y:data.data.f_PerformanceBonusesValue[0].fcni_RetailersBenefits[0].value,'color':'#8B288B'},
                        {'name':'Retailer-2',y:data.data.f_PerformanceBonusesValue[0].fcni_RetailersBenefits[1].value,'color':'#F05422'}
                    ]
                }],
                loading: false
            }

            $scope.supplierOtherCompensation = {
                options: {
                    title:{
                        text:'Breakdown of Other Compensation given by Suppliers',
                    },
                    chart: {
                        type: 'pie',
                        backgroundColor: 'transparent',
                    },
                    legend: {
                        enabled:false
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
                                distance:-100,
                                rotation:0,
                                color:'white',
                                format: '<p style="font-size:17px;line-hight:20px">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
                                useHTML:true
                            },
                            showInLegend: true
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    data: [
                        {'name':'Supplier-1',y:data.data.f_OtherCompensationsValue[0].fcni_SuppliersCost[0].value,'color':'#3257A7'},
                        {'name':'Supplier-2',y:data.data.f_OtherCompensationsValue[0].fcni_SuppliersCost[1].value,'color':'#B11E22'},
                        {'name':'Supplier-3',y:data.data.f_OtherCompensationsValue[0].fcni_SuppliersCost[2].value,'color':'#F6B920'}
                    ]
                }],
                loading: false
            }

            $scope.retailerOtherCompensation = {
                options: {
                    title:{
                        text:'Breakdown of Other Compensation received by Retailers',
                    },
                    chart: {
                        type: 'pie',
                        backgroundColor: 'transparent',
                    },
                    legend: {
                        enabled:false
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
                                distance:-100,
                                rotation:0,
                                color:'white',
                                format: '<p style="font-size:17px;line-hight:20px">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
                                useHTML:true
                            },
                            showInLegend: true
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    data: [
                        {'name':'Retailer-1',y:data.data.f_OtherCompensationsValue[0].fcni_RetailersBenefits[0].value,'color':'#8B288B'},
                        {'name':'Retailer-2',y:data.data.f_OtherCompensationsValue[0].fcni_RetailersBenefits[1].value,'color':'#F05422'}
                    ]
                }],
                loading: false
            }

            $scope.termsofPayment = {
                options: {
                    title:{
                        text:'Transaction Values by Terms of Payment',
                    },
                    chart: {
                        type: 'pie',
                        backgroundColor: 'transparent',
                    },
                    legend: {
                        enabled:false
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
                                distance:-80,
                                rotation:0,
                                color:'white',
                                format: '<p style="font-size:17px;line-hight:20px">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
                                useHTML:true
                            },
                            showInLegend: true
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    data: [
                        {'name':'30 Days',y:data.data.f_TransactionsPerTOP[2].value,'color':'#3257A7'},
                        {'name':'45 Days',y:data.data.f_TransactionsPerTOP[3].value,'color':'#B11E22'},
                        {'name':'60 Days',y:data.data.f_TransactionsPerTOP[4].value,'color':'#F6B920'},
                        {'name':'90 Days',y:data.data.f_TransactionsPerTOP[6].value,'color':'#329444'}
                    ]
                }],
                loading: false
            }

        });
    }

    $scope.initPage=initPage;
    initPage();
}]);

