define(['directives', 'services'], function(directives){

    directives.directive('retailerMarketResearchOrders', ['RetailerDecisionBase','Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(RetailerDecisionBase,Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
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
                    showView();                    
                }

                var showView =function(){
                    RetailerDecisionBase.reload({retailerID:parseInt(PlayerInfo.getPlayer()),period:PeriodInfo.getCurrentPeriod(),seminar:SeminarInfo.getSelectedSeminar().seminarCode}).then(function(base){
                        scope.pageBase = base;
                    }).then(function(){
                        return getResult();
                    }), function(reason){
                        console.log('from ctr: ' + reason);
                    }, function(update){
                        console.log('from ctr: ' + update);
                    }; 
                } 

                var getResult=function(){
                    //switching('showPerformance');
                    var url='/getOneQuarterExogenousData/'+SeminarInfo.getSelectedSeminar().seminarCode+'/1/1/'+(PeriodInfo.getCurrentPeriod()-1);
                    $http({
                        method:'GET',
                        url:url,
                        //tracker: scope.loadingTracker
                    }).then(function(data){   
                        scope.marketPrices=data.data.MarketStudiesPrices;
                        var playDatas=new Array();
                        playDatas.push({'name':'Awareness','realName':'awareness','reportPrice':scope.marketPrices[0],'playerStatus':scope.pageBase.marketResearchOrder[0]});
                        playDatas.push({'name':'Brand Perceptions','realName':'brandPerceptions','reportPrice':scope.marketPrices[1],'playerStatus':scope.pageBase.marketResearchOrder[1]});
                        playDatas.push({'name':'Retailer Perceptions','realName':'retailerPerceptions','reportPrice':scope.marketPrices[2],'playerStatus':scope.pageBase.marketResearchOrder[2]});
                        playDatas.push({'name':'Market Share By Consumer Segment','realName':'marketShareByConsumerSegment','reportPrice':scope.marketPrices[3],'playerStatus':scope.pageBase.marketResearchOrder[3]});
                        playDatas.push({'name':'Sales By Consumer Segment','realName':'salesByConsumerSegment','reportPrice':scope.marketPrices[4],'playerStatus':scope.pageBase.marketResearchOrder[4]});
                        playDatas.push({'name':'Market Share ByShopper Segment','realName':'marketShareByShopperSegment','reportPrice':scope.marketPrices[5],'playerStatus':scope.pageBase.marketResearchOrder[5]});
                        playDatas.push({'name':'Sales By Shopper Segment','realName':'salesByShopperSegment','reportPrice':scope.marketPrices[6],'playerStatus':scope.pageBase.marketResearchOrder[6]});
                        playDatas.push({'name':'BM Retailer Prices','realName':'BMRetailerPrices','reportPrice':scope.marketPrices[7],'playerStatus':scope.pageBase.marketResearchOrder[7]});
                        playDatas.push({'name':'Promotion Intensity','realName':'promotionIntensity','reportPrice':scope.marketPrices[8],'playerStatus':scope.pageBase.marketResearchOrder[8]});
                        playDatas.push({'name':'Supplier Intelligence','realName':'supplierIntelligence','reportPrice':scope.marketPrices[9],'playerStatus':scope.pageBase.marketResearchOrder[9]});
                        playDatas.push({'name':'Retailer Intelligence','reaPlName':'retailerIntelligence','reportPrice':scope.marketPrices[10],'playerStatus':scope.pageBase.marketResearchOrder[10]});
                        playDatas.push({'name':'Forecasts','realName':'forecasts','reportPrice':scope.marketPrices[11],'playerStatus':scope.pageBase.marketResearchOrder[11]});
                        scope.playDatas=playDatas;

                    }).then(function(data){
                        scope.isResultShown = true;
                        scope.isPageLoading = false;                                                                         
                    },function(){
                        console.log('fail');
                    });
                }

                scope.checkBudget=function(price,value){
                    var d = $q.defer(); 
                    // var abMax=0,expend=0,reportExpend=0;
                    // if(value){
                    //     var url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/R/'+parseInt(PlayerInfo.getPlayer());
                    //     $http({
                    //         method:'GET',
                    //         url:url
                    //     }).then(function(data){
                    //         abMax=data.data.budgetAvailable+data.data.budgetSpentToDate;
                    //         url="/retailerExpend/"+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod())+'/'+parseInt(PlayerInfo.getPlayer())+'/-1/location/1';
                    //         return $http({
                    //             method:'GET',
                    //             url:url
                    //         });
                    //     }).then(function(data){
                    //         expend=data.data.result;
                    //         url='/getPlayerReportOrderExpend/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+PeriodInfo.getCurrentPeriod()+'/R/'+PlayerInfo.getPlayer();
                    //         return $http({
                    //             method:'GET',
                    //             url:url
                    //         });
                    //     }).then(function(data){
                    //         reportExpend=data.data.result;
                    //         if(abMax-expend-reportExpend<price){
                    //             d.resolve(Label.getContent('Not enough budget'));
                    //         }else{
                    //             d.resolve();
                    //         }
                    //     },function(data){
                    //         console.log('fail');
                    //     });
                    // }else{
                    //     d.resolve();
                    // }
                    d.resolve();
                    return d.promise;  
                }

                scope.submitOrder=function(additionalIdx,value){
                    // var postData={
                    //     player:'Retailer',
                    //     playerID:PlayerInfo.getPlayer(),
                    //     period:PeriodInfo.getCurrentPeriod(),
                    //     seminarCode:SeminarInfo.getSelectedSeminar().seminarCode,
                    //     name:name,
                    //     value:value
                    // }
                    
                    // $http({
                    //     method:'POST',
                    //     url:'/submitOrder',
                    //     data:postData
                    // }).then(function(data){
                    //     console.log('success');
                    // },function(){
                    //     console.log('fail');
                    // })
                    RetailerDecisionBase.setMarketResearchOrders(additionalIdx,value);                         

                }


                scope.$watch('isPageShown', function(newValue, oldValue){
                    if(newValue==true) {
                        initializePage();
                    }
                })

                scope.$on('retailerMarketResearchOrdersChanged', function(event, data) {  
                    showView();  
                });
                
            }
        }
    }])
})