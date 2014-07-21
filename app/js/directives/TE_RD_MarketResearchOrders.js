define(['directives', 'services'], function(directives){

    directives.directive('retailerMarketResearchOrders', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                isReady : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/RD_marketResearchOrders.html',            
            link : function(scope, element, attrs){                                                                
                var initializePage = function(){
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var getResult =function(){
                    var reportStatus={};
                    var prices={};
                    var url='/getSeminarReportPurchaseStatus/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+PeriodInfo.getCurrentPeriod()+'/R/'+parseInt(PlayerInfo.getPlayer());
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){   
                        reportStatus=data.data;
                        url='/getReportPrice/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+PeriodInfo.getCurrentPeriod();
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        prices=data.data;
                        return organiseArray(reportStatus,prices)
                        
                    }).then(function(data){
                        scope.isResultShown = true;
                        scope.isPageLoading = false;                                                                         
                    },function(){
                        console.log('fail');
                    });
                }

                var organiseArray = function(reportStatus,prices){
                    var deferred = $q.defer();

                    var playDatas=new Array();
                    playDatas.push({'name':'Awareness','realName':'awareness','reportPrice':prices[0],'playerStatus':reportStatus.awareness});
                    playDatas.push({'name':'Brand Perceptions','realName':'brandPerceptions','reportPrice':prices[1],'playerStatus':reportStatus.brandPerceptions});
                    playDatas.push({'name':'Retailer Perceptions','realName':'retailerPerceptions','reportPrice':prices[2],'playerStatus':reportStatus.retailerPerceptions});
                    playDatas.push({'name':'Market Share By Consumer Segment','realName':'marketShareByConsumerSegment','reportPrice':prices[3],'playerStatus':reportStatus.marketShareByConsumerSegment});
                    playDatas.push({'name':'Sales By Consumer Segment','realName':'salesByConsumerSegment','reportPrice':prices[4],'playerStatus':reportStatus.salesByConsumerSegment});
                    playDatas.push({'name':'Market Share ByShopper Segment','realName':'marketShareByShopperSegment','reportPrice':prices[5],'playerStatus':reportStatus.marketShareByShopperSegment});
                    playDatas.push({'name':'Sales By Shopper Segment','realName':'salesByShopperSegment','reportPrice':prices[6],'playerStatus':reportStatus.salesByShopperSegment});
                    playDatas.push({'name':'BM Retailer Prices','realName':'BMRetailerPrices','reportPrice':prices[7],'playerStatus':reportStatus.BMRetailerPrices});
                    playDatas.push({'name':'Promotion Intensity','realName':'promotionIntensity','reportPrice':prices[8],'playerStatus':reportStatus.promotionIntensity});
                    playDatas.push({'name':'Supplier Intelligence','realName':'supplierIntelligence','reportPrice':prices[9],'playerStatus':reportStatus.supplierIntelligence});
                    playDatas.push({'name':'Retailer Intelligence','realName':'retailerIntelligence','reportPrice':prices[10],'playerStatus':reportStatus.retailerIntelligence});
                    playDatas.push({'name':'Forecasts','realName':'forecasts','reportPrice':prices[11],'playerStatus':reportStatus.forecasts});
                    playDatas.push({'name':'Sales By Channel','realName':'salesByChannel','reportPrice':prices[12],'playerStatus':reportStatus.salesByChannel});

                    scope.playDatas=playDatas;

                    deferred.resolve({msg:'Array is ready.'});                    
                    return deferred.promise;
                }

                scope.checkBudget=function(price,value){
                    var d = $q.defer(); 
                    var abMax=0,expend=0,reportExpend=0;
                    if(value){
                        var url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/R/'+parseInt(PlayerInfo.getPlayer());
                        $http({
                            method:'GET',
                            url:url
                        }).then(function(data){
                            abMax=data.data.budgetAvailable+data.data.budgetSpentToDate;
                            url="/retailerExpend/"+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod())+'/'+parseInt(PlayerInfo.getPlayer())+'/-1/location/1';
                            return $http({
                                method:'GET',
                                url:url
                            });
                        }).then(function(data){
                            expend=data.data.result;
                            url='/getPlayerReportOrderExpend/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+PeriodInfo.getCurrentPeriod()+'/R/'+PlayerInfo.getPlayer();
                            return $http({
                                method:'GET',
                                url:url
                            });
                        }).then(function(data){
                            reportExpend=data.data.result;

                            url='/getRetailerAdditionalBudget/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+PeriodInfo.getCurrentPeriod()+'/'+PlayerInfo.getPlayer();
                            return $http({
                                method:'GET',
                                url:url
                            });
                        }).then(function(data){
                            additionalBudget =data.data;

                            if(abMax + additionalBudget -expend-reportExpend<price){
                                d.resolve(Label.getContent('Not enough budget'));
                            }else{
                                d.resolve();
                            }
                        },function(data){
                            console.log('fail');
                        });
                    }else{
                        d.resolve();
                    }
                    return d.promise;  
                }

                scope.submitOrder=function(name,value){
                    var postData={
                        player:'Retailer',
                        playerID:PlayerInfo.getPlayer(),
                        period:PeriodInfo.getCurrentPeriod(),
                        seminarCode:SeminarInfo.getSelectedSeminar().seminarCode,
                        name:name,
                        value:value
                    }
                    
                    $http({
                        method:'POST',
                        url:'/submitOrder',
                        data:postData
                    }).then(function(data){
                        console.log('success');
                    },function(){
                        console.log('fail');
                    })
                }


                scope.$watch('isPageShown', function(newValue, oldValue){
                    if(newValue==true) {
                        initializePage();
                    }
                })

                scope.$on('retailerMarketResearchOrdersChanged', function(event, data) {  
                    getResult();  
                });
                
            }
        }
    }])
})