define(['directives', 'services'], function(directives){

    directives.directive('supplierMarketResearchOrders', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                isReady: '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/SD_marketResearchOrders.html',            
            link : function(scope, element, attrs){                                                                
                var initializePage = function(){
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var getResult =function(){
                    //switching('showPerformance');
                    var url='/currentPeriod/'+SeminarInfo.getSelectedSeminar().seminarCode;
                    $http({
                        method:'GET',
                        url:url,
                        //tracker: scope.loadingTracker
                    }).then(function(data){   
                        return organiseArray(data);
                    }).then(function(data){
                        scope.isResultShown = true;
                        scope.isPageLoading = false;                                                                         
                    },function(){
                        console.log('fail');
                    });
                }

                var organiseArray = function(data){
                    var deferred = $q.defer();

                    var reportPrices=data.data.reportPrice;
                    
                    var players=_.find(data.data.producers,function(obj){
                        return (obj.producerID==PlayerInfo.getPlayer());
                    })

                    var playerStatus=_.find(players.reportPurchaseStatus,function(obj){
                        return (obj.period==PeriodInfo.getCurrentPeriod())
                    });
                    var playDatas=new Array();
                    playDatas.push({'name':'Awareness','realName':'awareness','reportPrice':reportPrices.awareness,'playerStatus':playerStatus.awareness});
                    playDatas.push({'name':'Brand Perceptions','realName':'brandPerceptions','reportPrice':reportPrices.brandPerceptions,'playerStatus':playerStatus.brandPerceptions});
                    playDatas.push({'name':'Retailer Perceptions','realName':'retailerPerceptions','reportPrice':reportPrices.retailerPerceptions,'playerStatus':playerStatus.retailerPerceptions});
                    playDatas.push({'name':'Market Share By Consumer Segment','realName':'marketShareByConsumerSegment','reportPrice':reportPrices.marketShareByConsumerSegment,'playerStatus':playerStatus.marketShareByConsumerSegment});
                    playDatas.push({'name':'Sales By Consumer Segment','realName':'salesByConsumerSegment','reportPrice':reportPrices.salesByConsumerSegment,'playerStatus':playerStatus.salesByConsumerSegment});
                    playDatas.push({'name':'Market Share ByShopper Segment','realName':'marketShareByShopperSegment','reportPrice':reportPrices.marketShareByShopperSegment,'playerStatus':playerStatus.marketShareByShopperSegment});
                    playDatas.push({'name':'Sales By Shopper Segment','realName':'salesByShopperSegment','reportPrice':reportPrices.salesByShopperSegment,'playerStatus':playerStatus.salesByShopperSegment});
                    playDatas.push({'name':'BM Retailer Prices','realName':'BMRetailerPrices','reportPrice':reportPrices.BMRetailerPrices,'playerStatus':playerStatus.BMRetailerPrices});
                    playDatas.push({'name':'Promotion Intensity','realName':'promotionIntensity','reportPrice':reportPrices.promotionIntensity,'playerStatus':playerStatus.promotionIntensity});
                    playDatas.push({'name':'Supplier Intelligence','realName':'supplierIntelligence','reportPrice':reportPrices.supplierIntelligence,'playerStatus':playerStatus.supplierIntelligence});
                    playDatas.push({'name':'Retailer Intelligence','realName':'retailerIntelligence','reportPrice':reportPrices.retailerIntelligence,'playerStatus':playerStatus.retailerIntelligence});
                    playDatas.push({'name':'Forecasts','realName':'forecasts','reportPrice':reportPrices.forecasts,'playerStatus':playerStatus.forecasts});

                    scope.playDatas=playDatas;

                    deferred.resolve({msg:'Array is ready.'});                    
                    return deferred.promise;
                }


                scope.submitOrder=function(name,value){
                    var postData={
                        player:'Producer',
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

                scope.checkBudget=function(price,value){
                    var d = $q.defer(); 
                    var categoryID = 0,
                    abMax = 0,
                    productExpend = 0,
                    r1ContractExpend = 0,
                    r2ContractExpend = 0,
                    reportExpend = 0;
                    if(value){
                        var url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/P/' + parseInt(PlayerInfo.getPlayer());
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data){
                            abMax = data.data.budgetAvailable + data.data.budgetSpentToDate;
                            url = "/producerExpend/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (PeriodInfo.getCurrentPeriod()) + '/' + parseInt(PlayerInfo.getPlayer()) + '/brandName/location/1';
                            return $http({
                                method: 'GET',
                                url: url,
                            });
                        }).then(function(data) {
                            productExpend = data.data.result;
                            url='/getContractExpend/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+PeriodInfo.getCurrentPeriod()+'/'+PlayerInfo.getPlayer()+'/1/brandName/varName';
                            return $http({
                                method:'GET',
                                url:url
                            });
                        }).then(function(data){
                            r1ContractExpend = data.data.result;
                            url='/getContractExpend/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+PeriodInfo.getCurrentPeriod()+'/'+PlayerInfo.getPlayer()+'/2/brandName/varName';
                            return $http({
                                method:'GET',
                                url:url
                            });
                        }).then(function(data){
                            r2ContractExpend = data.data.result;
                            url='/getPlayerReportOrderExpend/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+PeriodInfo.getCurrentPeriod()+'/P/'+PlayerInfo.getPlayer();
                            return $http({
                                method:'GET',
                                url:url
                            });
                        }).then(function(data){
                            reportExpend=data.data.result;
                            if(abMax-productExpend-r1ContractExpend-r2ContractExpend-reportExpend<price){
                                d.resolve(Label.getContent('Not enough budget'));
                            }else{
                                d.resolve();
                            }
                        },function(data){
                            console.log('fail');
                        })

                    }else{
                        d.resolve();
                    }
                    return d.promise;  
                }

                scope.$watch('isPageShown', function(newValue, oldValue){
                    if(newValue==true) {
                        initializePage();
                    }
                })

                scope.$on('producerMarketResearchOrdersChanged', function(event, data, newSeminarData) {  
                    getResult();  
                });

            }
        }
    }])
})