var negotiationResultsCtrl=function($scope,$http,$q){
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
        
        //Negotiation Results
        $scope.supplierNegotiationResults = {
            options: {
                title:{
                    text:'Breakdown of Volume Discounts given by Suppliers',
                    style: {
                        'font-size':'16px'
                    }
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
                    {'name':'Supplier-1',y:$scope.feedBack.f_DiscountsValue[2].fcni_SuppliersCost[0].value,'color':'#3257A7'},
                    {'name':'Supplier-2',y:$scope.feedBack.f_DiscountsValue[2].fcni_SuppliersCost[1].value,'color':'#B11E22'},
                    {'name':'Supplier-3',y:$scope.feedBack.f_DiscountsValue[2].fcni_SuppliersCost[2].value,'color':'#F6B920'}
                ]
            }],
            loading: false
        }

        $scope.supplierNegotiationResultsTotal=($scope.feedBack.f_DiscountsValue[2].totalValue).toFixed(2);

        $scope.retailerNegotiationResults = {
            options: {
                title:{
                    text:'Breakdown of Volume Discounts received by Retailers',
                    style: {
                        'font-size':'16px'
                    }
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
                    {'name':'Retailer-1',y:$scope.feedBack.f_DiscountsValue[2].fcni_RetailersBenefits[0].value,'color':'#8B288B'},
                    {'name':'Retailer-2',y:$scope.feedBack.f_DiscountsValue[2].fcni_RetailersBenefits[1].value,'color':'#F05422'}
                ]
            }],
            loading: false
        }

        $scope.supplierPerformanceBonuses = {
            options: {
                title:{
                    text:'Breakdown of Performance Bonuses given by Suppliers',
                    style: {
                        'font-size':'16px'
                    }
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
                    {'name':'Supplier-1',y:$scope.feedBack.f_PerformanceBonusesValue[2].fcni_SuppliersCost[0].value,'color':'#3257A7'},
                    {'name':'Supplier-2',y:$scope.feedBack.f_PerformanceBonusesValue[2].fcni_SuppliersCost[1].value,'color':'#B11E22'},
                    {'name':'Supplier-3',y:$scope.feedBack.f_PerformanceBonusesValue[2].fcni_SuppliersCost[2].value,'color':'#F6B920'}
                ]
            }],
            loading: false
        }

        $scope.supplierPerformanceBonusesTotal=($scope.feedBack.f_PerformanceBonusesValue[2].totalValue).toFixed(2);

        $scope.retailerPerformanceBonuses = {
            options: {
                title:{
                    text:'Breakdown of Performance Bonuses received by Retailers',
                    style: {
                        'font-size':'16px'
                    }
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
                    {'name':'Retailer-1',y:$scope.feedBack.f_PerformanceBonusesValue[2].fcni_RetailersBenefits[0].value,'color':'#8B288B'},
                    {'name':'Retailer-2',y:$scope.feedBack.f_PerformanceBonusesValue[2].fcni_RetailersBenefits[1].value,'color':'#F05422'}
                ]
            }],
            loading: false
        }

        $scope.supplierOtherCompensation = {
            options: {
                title:{
                    text:'Breakdown of Other Compensation given by Suppliers',
                    style: {
                        'font-size':'16px'
                    }

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
                    {'name':'Supplier-1',y:$scope.feedBack.f_OtherCompensationsValue[2].fcni_SuppliersCost[0].value,'color':'#3257A7'},
                    {'name':'Supplier-2',y:$scope.feedBack.f_OtherCompensationsValue[2].fcni_SuppliersCost[1].value,'color':'#B11E22'},
                    {'name':'Supplier-3',y:$scope.feedBack.f_OtherCompensationsValue[2].fcni_SuppliersCost[2].value,'color':'#F6B920'}
                ]
            }],
            loading: false
        }

        $scope.supplierOtherCompensationTotal=($scope.feedBack.f_OtherCompensationsValue[2].totalValue).toFixed(2);

        $scope.retailerOtherCompensation = {
            options: {
                title:{
                    text:'Breakdown of Other Compensation received by Retailers',
                    style: {
                        'font-size':'16px'
                    }

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
                    {'name':'Retailer-1',y:$scope.feedBack.f_OtherCompensationsValue[2].fcni_RetailersBenefits[0].value,'color':'#8B288B'},
                    {'name':'Retailer-2',y:$scope.feedBack.f_OtherCompensationsValue[2].fcni_RetailersBenefits[1].value,'color':'#F05422'}
                ]
            }],
            loading: false
        }


        var termsofPayment=new Array();

        for(var i=0;i<$scope.feedBack.f_TransactionsPerTOP.length;i++){
            if($scope.feedBack.f_TransactionsPerTOP[i].categoryID==3){
                if($scope.feedBack.f_TransactionsPerTOP[i].topDays==0){
                    if($scope.feedBack.f_TransactionsPerTOP[i].value!=0){
                        termsofPayment.push({
                            name:'COD',
                            y:$scope.feedBack.f_TransactionsPerTOP[i].value
                        })
                    }
                }else{
                    if($scope.feedBack.f_TransactionsPerTOP[i].value!=0){
                        termsofPayment.push({
                            name:$scope.feedBack.f_TransactionsPerTOP[i].topDays*15+' Days',
                            y:$scope.feedBack.f_TransactionsPerTOP[i].value
                        })
                    }
                }
            }
        }


        $scope.termsofPayment = {
            options: {
                title:{
                    text:'Transaction Values by Terms of Payment',
                    style: {
                        'font-size':'16px'
                    }

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
                            format: '<p style="font-size:16px">{point.name}</br>'+'{point.y:.2f}($mln)</br>'+'{point.percentage:.2f}%</br></p>',
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
            }],
            loading: false
        }
    }

    $scope.$watch('feedBack', function(newValue, oldValue){
        if(newValue!=undefined) {
            initPage();
        }
    });
}