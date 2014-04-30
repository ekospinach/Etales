define(['directives', 'services'], function(directives){

    directives.directive('retailerMarketResearchOrders', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
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
                    //switching('showPerformance');
                    var url='/currentPeriod/'+SeminarInfo.getSelectedSeminar();
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
                    
                    var players=_.find(data.data.retailers,function(obj){
                        return (obj.retailerID==PlayerInfo.getPlayer());
                    })

                    var playerStatus=_.find(players.reportPurchaseStatus,function(obj){
                        return (obj.period==PeriodInfo.getCurrentPeriod())
                    });
                    var playDatas=new Array();
                    playDatas.push({'name':'Awareness','realName':'awareness','reportPrice':reportPrices.awareness,'playerStatus':playerStatus.awareness});
                    playDatas.push({'name':'BrandPerceptions','realName':'brandPerceptions','reportPrice':reportPrices.brandPerceptions,'playerStatus':playerStatus.brandPerceptions});
                    playDatas.push({'name':'RetailerPerceptions','realName':'retailerPerceptions','reportPrice':reportPrices.retailerPerceptions,'playerStatus':playerStatus.retailerPerceptions});
                    playDatas.push({'name':'MarketShareByConsumerSegment','realName':'marketShareByConsumerSegment','reportPrice':reportPrices.marketShareByConsumerSegment,'playerStatus':playerStatus.marketShareByConsumerSegment});
                    playDatas.push({'name':'SalesByConsumberSegment','realName':'salesByConsumberSegment','reportPrice':reportPrices.salesByConsumberSegment,'playerStatus':playerStatus.salesByConsumberSegment});
                    playDatas.push({'name':'MarketShareByShopperSegment','realName':'marketShareByShopperSegment','reportPrice':reportPrices.marketShareByShopperSegment,'playerStatus':playerStatus.marketShareByShopperSegment});
                    playDatas.push({'name':'SalesByShopperSegment','realName':'salesByShopperSegment','reportPrice':reportPrices.salesByShopperSegment,'playerStatus':playerStatus.salesByShopperSegment});
                    playDatas.push({'name':'BMRetailerPrices','realName':'BMRetailerPrices','reportPrice':reportPrices.BMRetailerPrices,'playerStatus':playerStatus.BMRetailerPrices});
                    playDatas.push({'name':'PromotionIntensity','realName':'promotionIntensity','reportPrice':reportPrices.promotionIntensity,'playerStatus':playerStatus.promotionIntensity});
                    playDatas.push({'name':'SupplierIntelligence','realName':'supplierIntelligence','reportPrice':reportPrices.supplierIntelligence,'playerStatus':playerStatus.supplierIntelligence});
                    playDatas.push({'name':'RetailerIntelligence','realName':'retailerIntelligence','reportPrice':reportPrices.retailerIntelligence,'playerStatus':playerStatus.retailerIntelligence});
                    playDatas.push({'name':'Forcasts','realName':'forcasts','reportPrice':reportPrices.forcasts,'playerStatus':playerStatus.forcasts});

                    scope.playDatas=playDatas;
                    deferred.resolve({msg:'Array is ready.'});                    
                    return deferred.promise;
                }

                scope.submitOrder=function(){
                    var postData={
                        player:'Retailer',
                        playerID:PlayerInfo.getPlayer(),
                        period:PeriodInfo.getCurrentPeriod(),
                        seminarCode:SeminarInfo.getSelectedSeminar(),
                        data:scope.playDatas
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
            }
        }
    }])
})