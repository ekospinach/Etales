var app=angular.module('feedback',['highcharts-ng']);
app.controller('negotiationResultsCtrl', ['$scope','$http','$q',function($scope,$http,$q) {
    function GetRequest() {
       var url = document.location.search; //获取url中"?"符后的字串
       var theRequest = new Object();
       if (url.indexOf("?") != -1) {
          var str = url.substr(1);
          strs = str.split("&");
          for(var i = 0; i < strs.length; i ++) {
             theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
          }
       }
       return theRequest;
    }
    var initPage=function(){
        var Request = GetRequest();
        var url='/getFeedBack/'+Request['seminar']+'/'+Request['period'];
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
                                format: '<p class="p-font">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
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
                                format: '<p class="p-font">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
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
                                format: '<p class="p-font">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
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
                                format: '<p class="p-font">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
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
                                format: '<p class="p-font">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
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
                                format: '<p class="p-font">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
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
                                format: '<p class="p-font">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
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

            //Sales Results
            $scope.salesVolumeElecssoriesPrevious = {
                options: {
                    title:{
                        text:'Sales Volumes',
                    },
                    chart: {
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    legend: {
                        enabled:false
                    },
                    yAxis: {
                        title: {
                            text: 'mln units'
                        }
                    },
                    xAxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        title: {
                            text: 'Period'
                        }
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: false
                        }
                    }
                },
                series: [{
                    name: 'Tokyo',
                    data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    name: 'London',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                }],
                loading: false
            }

        });
    }

    //$scope.initPage=initPage;
    initPage();
}]);

// var negotiationResultsCtrl=function($scope,$http){
//         var initPage=function(){
//         var url='/getFeedBack/MAY/0';
//         $http({
//             method:'GET',
//             url:url
//         }).then(function(data){
//             //Negotiation Results
//             $scope.supplierNegotiationResults = {
//                 options: {
//                     title:{
//                         text:'Breakdown of Volume Discounts given by Suppliers',
//                     },
//                     chart: {
//                         type: 'pie',
//                         backgroundColor: 'transparent',
//                     },
//                     legend: {
//                         enabled:false
//                     },
//                     tooltip: {
//                         formatter: function() {
//                             var s = '<p><b>'+this.key+'</b></p>'+'<p>'+this.point.y.toFixed(2)+'($mln)</p>'+'<p>'+this.point.percentage.toFixed(2)+'%</p>';
//                             return s;
//                         },
//                         shared: false,
//                         useHTML: true
//                     },
//                     plotOptions: {
//                         pie: {
//                             dataLabels: {
//                                 distance:-100,
//                                 rotation:0,
//                                 color:'white',
//                                 format: '<p class="p-font">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
//                                 useHTML:true
//                             },
//                             showInLegend: true
//                         }
//                     }
//                 },
//                 series: [{
//                     type: 'pie',
//                     data: [
//                         {'name':'Supplier-1',y:data.data.f_DiscountsValue[0].fcni_SuppliersCost[0].value,'color':'#3257A7'},
//                         {'name':'Supplier-2',y:data.data.f_DiscountsValue[0].fcni_SuppliersCost[1].value,'color':'#B11E22'},
//                         {'name':'Supplier-3',y:data.data.f_DiscountsValue[0].fcni_SuppliersCost[2].value,'color':'#F6B920'}
//                     ]
//                 }],
//                 loading: false
//             }

//             $scope.retailerNegotiationResults = {
//                 options: {
//                     title:{
//                         text:'Breakdown of Volume Discounts received by Retailers',
//                     },
//                     chart: {
//                         type: 'pie',
//                         backgroundColor: 'transparent',
//                     },
//                     legend: {
//                         enabled:false
//                     },
//                     tooltip: {
//                         formatter: function() {
//                             var s = '<p><b>'+this.key+'</b></p>'+'<p>'+this.point.y.toFixed(2)+'($mln)</p>'+'<p>'+this.point.percentage.toFixed(2)+'%</p>';
//                             return s;
//                         },
//                         shared: false,
//                         useHTML: true
//                     },
//                     plotOptions: {
//                         pie: {
//                             dataLabels: {
//                                 distance:-100,
//                                 rotation:0,
//                                 color:'white',
//                                 format: '<p class="p-font">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
//                                 useHTML:true
//                             },
//                             showInLegend: true
//                         }
//                     }
//                 },
//                 series: [{
//                     type: 'pie',
//                     data: [
//                         {'name':'Retailer-1',y:data.data.f_DiscountsValue[0].fcni_RetailersBenefits[0].value,'color':'#8B288B'},
//                         {'name':'Retailer-2',y:data.data.f_DiscountsValue[0].fcni_RetailersBenefits[1].value,'color':'#F05422'}
//                     ]
//                 }],
//                 loading: false
//             }

//             $scope.supplierPerformanceBonuses = {
//                 options: {
//                     title:{
//                         text:'Breakdown of Performance Bonuses given by Suppliers',
//                     },
//                     chart: {
//                         type: 'pie',
//                         backgroundColor: 'transparent',
//                     },
//                     legend: {
//                         enabled:false
//                     },
//                     tooltip: {
//                         formatter: function() {
//                             var s = '<p><b>'+this.key+'</b></p>'+'<p>'+this.point.y.toFixed(2)+'($mln)</p>'+'<p>'+this.point.percentage.toFixed(2)+'%</p>';
//                             return s;
//                         },
//                         shared: false,
//                         useHTML: true
//                     },
//                     plotOptions: {
//                         pie: {
//                             dataLabels: {
//                                 distance:-100,
//                                 rotation:0,
//                                 color:'white',
//                                 format: '<p class="p-font">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
//                                 useHTML:true
//                             },
//                             showInLegend: true
//                         }
//                     }
//                 },
//                 series: [{
//                     type: 'pie',
//                     data: [
//                         {'name':'Supplier-1',y:data.data.f_PerformanceBonusesValue[0].fcni_SuppliersCost[0].value,'color':'#3257A7'},
//                         {'name':'Supplier-2',y:data.data.f_PerformanceBonusesValue[0].fcni_SuppliersCost[1].value,'color':'#B11E22'},
//                         {'name':'Supplier-3',y:data.data.f_PerformanceBonusesValue[0].fcni_SuppliersCost[2].value,'color':'#F6B920'}
//                     ]
//                 }],
//                 loading: false
//             }

//             $scope.retailerPerformanceBonuses = {
//                 options: {
//                     title:{
//                         text:'Breakdown of Performance Bonuses received by Retailers',
//                     },
//                     chart: {
//                         type: 'pie',
//                         backgroundColor: 'transparent',
//                     },
//                     legend: {
//                         enabled:false
//                     },
//                     tooltip: {
//                         formatter: function() {
//                             var s = '<p><b>'+this.key+'</b></p>'+'<p>'+this.point.y.toFixed(2)+'($mln)</p>'+'<p>'+this.point.percentage.toFixed(2)+'%</p>';
//                             return s;
//                         },
//                         shared: false,
//                         useHTML: true
//                     },
//                     plotOptions: {
//                         pie: {
//                             dataLabels: {
//                                 distance:-100,
//                                 rotation:0,
//                                 color:'white',
//                                 format: '<p class="p-font">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
//                                 useHTML:true
//                             },
//                             showInLegend: true
//                         }
//                     }
//                 },
//                 series: [{
//                     type: 'pie',
//                     data: [
//                         {'name':'Retailer-1',y:data.data.f_PerformanceBonusesValue[0].fcni_RetailersBenefits[0].value,'color':'#8B288B'},
//                         {'name':'Retailer-2',y:data.data.f_PerformanceBonusesValue[0].fcni_RetailersBenefits[1].value,'color':'#F05422'}
//                     ]
//                 }],
//                 loading: false
//             }

//             $scope.supplierOtherCompensation = {
//                 options: {
//                     title:{
//                         text:'Breakdown of Other Compensation given by Suppliers',
//                     },
//                     chart: {
//                         type: 'pie',
//                         backgroundColor: 'transparent',
//                     },
//                     legend: {
//                         enabled:false
//                     },
//                     tooltip: {
//                         formatter: function() {
//                             var s = '<p><b>'+this.key+'</b></p>'+'<p>'+this.point.y.toFixed(2)+'($mln)</p>'+'<p>'+this.point.percentage.toFixed(2)+'%</p>';
//                             return s;
//                         },
//                         shared: false,
//                         useHTML: true
//                     },
//                     plotOptions: {
//                         pie: {
//                             dataLabels: {
//                                 distance:-100,
//                                 rotation:0,
//                                 color:'white',
//                                 format: '<p class="p-font">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
//                                 useHTML:true
//                             },
//                             showInLegend: true
//                         }
//                     }
//                 },
//                 series: [{
//                     type: 'pie',
//                     data: [
//                         {'name':'Supplier-1',y:data.data.f_OtherCompensationsValue[0].fcni_SuppliersCost[0].value,'color':'#3257A7'},
//                         {'name':'Supplier-2',y:data.data.f_OtherCompensationsValue[0].fcni_SuppliersCost[1].value,'color':'#B11E22'},
//                         {'name':'Supplier-3',y:data.data.f_OtherCompensationsValue[0].fcni_SuppliersCost[2].value,'color':'#F6B920'}
//                     ]
//                 }],
//                 loading: false
//             }

//             $scope.retailerOtherCompensation = {
//                 options: {
//                     title:{
//                         text:'Breakdown of Other Compensation received by Retailers',
//                     },
//                     chart: {
//                         type: 'pie',
//                         backgroundColor: 'transparent',
//                     },
//                     legend: {
//                         enabled:false
//                     },
//                     tooltip: {
//                         formatter: function() {
//                             var s = '<p><b>'+this.key+'</b></p>'+'<p>'+this.point.y.toFixed(2)+'($mln)</p>'+'<p>'+this.point.percentage.toFixed(2)+'%</p>';
//                             return s;
//                         },
//                         shared: false,
//                         useHTML: true
//                     },
//                     plotOptions: {
//                         pie: {
//                             dataLabels: {
//                                 distance:-100,
//                                 rotation:0,
//                                 color:'white',
//                                 format: '<p class="p-font">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
//                                 useHTML:true
//                             },
//                             showInLegend: true
//                         }
//                     }
//                 },
//                 series: [{
//                     type: 'pie',
//                     data: [
//                         {'name':'Retailer-1',y:data.data.f_OtherCompensationsValue[0].fcni_RetailersBenefits[0].value,'color':'#8B288B'},
//                         {'name':'Retailer-2',y:data.data.f_OtherCompensationsValue[0].fcni_RetailersBenefits[1].value,'color':'#F05422'}
//                     ]
//                 }],
//                 loading: false
//             }

//             $scope.termsofPayment = {
//                 options: {
//                     title:{
//                         text:'Transaction Values by Terms of Payment',
//                     },
//                     chart: {
//                         type: 'pie',
//                         backgroundColor: 'transparent',
//                     },
//                     legend: {
//                         enabled:false
//                     },
//                     tooltip: {
//                         formatter: function() {
//                             var s = '<p><b>'+this.key+'</b></p>'+'<p>'+this.point.y.toFixed(2)+'($mln)</p>'+'<p>'+this.point.percentage.toFixed(2)+'%</p>';
//                             return s;
//                         },
//                         shared: false,
//                         useHTML: true
//                     },
//                     plotOptions: {
//                         pie: {
//                             dataLabels: {
//                                 distance:-80,
//                                 rotation:0,
//                                 color:'white',
//                                 format: '<p class="p-font">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
//                                 useHTML:true
//                             },
//                             showInLegend: true
//                         }
//                     }
//                 },
//                 series: [{
//                     type: 'pie',
//                     data: [
//                         {'name':'30 Days',y:data.data.f_TransactionsPerTOP[2].value,'color':'#3257A7'},
//                         {'name':'45 Days',y:data.data.f_TransactionsPerTOP[3].value,'color':'#B11E22'},
//                         {'name':'60 Days',y:data.data.f_TransactionsPerTOP[4].value,'color':'#F6B920'},
//                         {'name':'90 Days',y:data.data.f_TransactionsPerTOP[6].value,'color':'#329444'}
//                     ]
//                 }],
//                 loading: false
//             }

//             //Sales Results
//             $scope.salesVolumeElecssoriesPrevious = {
//                 options: {
//                     title:{
//                         text:'Sales Volumes',
//                     },
//                     chart: {
//                         type: 'line',
//                         backgroundColor: 'transparent',
//                     },
//                     legend: {
//                         enabled:false
//                     },
//                     yAxis: {
//                         title: {
//                             text: 'mln units'
//                         }
//                     },
//                     xAxis: {
//                         categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//                         title: {
//                             text: 'Period'
//                         }
//                     },
//                     plotOptions: {
//                         line: {
//                             dataLabels: {
//                                 enabled: true
//                             },
//                             enableMouseTracking: false
//                         }
//                     }
//                 },
//                 series: [{
//                     name: 'Tokyo',
//                     data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
//                 }, {
//                     name: 'London',
//                     data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
//                 }],
//                 loading: false
//             }

//         });
//     }

//     //$scope.initPage=initPage;
//     initPage();
// }



