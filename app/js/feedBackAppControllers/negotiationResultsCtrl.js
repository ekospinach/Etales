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
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: [{
                    type: 'pie',
                    data: [
                        {'name':'Supplier-1',y:data.data.f_DiscountsValue[2].fcni_SuppliersCost[0].value,'color':'#3257A7'},
                        {'name':'Supplier-2',y:data.data.f_DiscountsValue[2].fcni_SuppliersCost[1].value,'color':'#B11E22'},
                        {'name':'Supplier-3',y:data.data.f_DiscountsValue[2].fcni_SuppliersCost[2].value,'color':'#F6B920'}
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
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: [{
                    type: 'pie',
                    data: [
                        {'name':'Retailer-1',y:data.data.f_DiscountsValue[2].fcni_RetailersBenefits[0].value,'color':'#8B288B'},
                        {'name':'Retailer-2',y:data.data.f_DiscountsValue[2].fcni_RetailersBenefits[1].value,'color':'#F05422'}
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
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: [{
                    type: 'pie',
                    data: [
                        {'name':'Supplier-1',y:data.data.f_PerformanceBonusesValue[2].fcni_SuppliersCost[0].value,'color':'#3257A7'},
                        {'name':'Supplier-2',y:data.data.f_PerformanceBonusesValue[2].fcni_SuppliersCost[1].value,'color':'#B11E22'},
                        {'name':'Supplier-3',y:data.data.f_PerformanceBonusesValue[2].fcni_SuppliersCost[2].value,'color':'#F6B920'}
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
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: [{
                    type: 'pie',
                    data: [
                        {'name':'Retailer-1',y:data.data.f_PerformanceBonusesValue[2].fcni_RetailersBenefits[0].value,'color':'#8B288B'},
                        {'name':'Retailer-2',y:data.data.f_PerformanceBonusesValue[2].fcni_RetailersBenefits[1].value,'color':'#F05422'}
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
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: [{
                    type: 'pie',
                    data: [
                        {'name':'Supplier-1',y:data.data.f_OtherCompensationsValue[2].fcni_SuppliersCost[0].value,'color':'#3257A7'},
                        {'name':'Supplier-2',y:data.data.f_OtherCompensationsValue[2].fcni_SuppliersCost[1].value,'color':'#B11E22'},
                        {'name':'Supplier-3',y:data.data.f_OtherCompensationsValue[2].fcni_SuppliersCost[2].value,'color':'#F6B920'}
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
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: [{
                    type: 'pie',
                    data: [
                        {'name':'Retailer-1',y:data.data.f_OtherCompensationsValue[2].fcni_RetailersBenefits[0].value,'color':'#8B288B'},
                        {'name':'Retailer-2',y:data.data.f_OtherCompensationsValue[2].fcni_RetailersBenefits[1].value,'color':'#F05422'}
                    ]
                }],
                loading: false
            }


            var termsofPayment=new Array();

            for(var i=0;i<data.data.f_TransactionsPerTOP.length;i++){
                if(data.data.f_TransactionsPerTOP[i].categoryID==3){
                    if(data.data.f_TransactionsPerTOP[i].topDays==0){
                        if(data.data.f_TransactionsPerTOP[i].value!=0){
                            termsofPayment.push({
                                name:'Immediately',
                                y:data.data.f_TransactionsPerTOP[i].value
                            })
                        }
                    }else{
                        if(data.data.f_TransactionsPerTOP[i].value!=0){
                            termsofPayment.push({
                                name:data.data.f_TransactionsPerTOP[i].topDays*15+' Days',
                                y:data.data.f_TransactionsPerTOP[i].value
                            })
                        }
                    }
                }
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
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle'
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
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: [{
                    type: 'pie',
                    data:termsofPayment
                    // data: [
                    //     {'name':'30 Days',y:data.data.f_TransactionsPerTOP[2].value,'color':'#3257A7'},
                    //     {'name':'45 Days',y:data.data.f_TransactionsPerTOP[3].value,'color':'#B11E22'},
                    //     {'name':'60 Days',y:data.data.f_TransactionsPerTOP[4].value,'color':'#F6B920'},
                    //     {'name':'90 Days',y:data.data.f_TransactionsPerTOP[6].value,'color':'#329444'}
                    // ]
                }],
                loading: false
            }
        });
    }

    //$scope.initPage=initPage;
    initPage();
}]);
