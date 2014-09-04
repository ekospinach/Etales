define(['directives', 'services'], function(directives){

    directives.directive('marketRetailerPerceptions', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                selectedPeriod : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/MR_retailerPerceptions.html',            
            link : function(scope, element, attrs){                                                                
                var initializePage = function(){
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var getResult =function(){
                    scope.latestPlayer1urban=new Array();scope.latestPlayer2urban=new Array();scope.latestPlayer3urban=new Array();scope.latestPlayer4urban=new Array();scope.latestPlayer5urban=new Array();scope.latestPlayer6urban=new Array();scope.latestPlayer1rural=new Array();scope.latestPlayer2rural=new Array();scope.latestPlayer3rural=new Array();scope.latestPlayer4rural=new Array();scope.latestPlayer5rural=new Array();scope.latestPlayer6rural=new Array();
                    scope.previousInfo=Label.getContent('Previous period');
                    scope.ruralTitle=Label.getContent('Rural');
                    scope.urbanTitle=Label.getContent('Urban');
                    var url='/getMR-retailerPerceptionEvolution/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+scope.selectedPeriod;
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

                var loadValue=function(data,store,market){
                    var array=_.find(data,function(obj){
                        return (obj.storeID==store&&obj.marketID==market)
                    });
                    return array;
                }

                var organiseArray = function(data){
                    var deferred = $q.defer();
                    for(var i=0;i<data.data[0].storeInfo.length;i++){
                        if(data.data[0].storeInfo[i].marketID==1){
                            switch(data.data[0].storeInfo[i].storeID){
                                // player's urban/rural data include 2 parts
                                // part1 : latestPerception value  point:(x,y,z,)==>z is the size of the circle e.g (previousPerception[1],previousPerception[0],size)
                                // part2 : previousPerception value ......

                                //function loadValue ==>find the rural value of this player

                                case 1:scope.latestPlayer1urban.push([data.data[0].storeInfo[i].latestPerception[1],data.data[0].storeInfo[i].latestPerception[0],10]);scope.latestPlayer1rural.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[0],10]);
                                scope.latestPlayer1urban.push([data.data[0].storeInfo[i].previousPerception[1],data.data[0].storeInfo[i].previousPerception[0],5]);scope.latestPlayer1rural.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[0],5]);break;
                                case 2:scope.latestPlayer2urban.push([data.data[0].storeInfo[i].latestPerception[1],data.data[0].storeInfo[i].latestPerception[0],10]);scope.latestPlayer2rural.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[0],10]);
                                scope.latestPlayer2urban.push([data.data[0].storeInfo[i].previousPerception[1],data.data[0].storeInfo[i].previousPerception[0],5]);scope.latestPlayer2rural.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[0],5]);break;
                                case 3:scope.latestPlayer3urban.push([data.data[0].storeInfo[i].latestPerception[1],data.data[0].storeInfo[i].latestPerception[0],10]);scope.latestPlayer3rural.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[0],10]);
                                scope.latestPlayer3urban.push([data.data[0].storeInfo[i].previousPerception[1],data.data[0].storeInfo[i].previousPerception[0],5]);scope.latestPlayer3rural.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[0],5]);break;
                                case 4:scope.latestPlayer4urban.push([data.data[0].storeInfo[i].latestPerception[1],data.data[0].storeInfo[i].latestPerception[0],10]);scope.latestPlayer4rural.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[0],10]);
                                scope.latestPlayer4urban.push([data.data[0].storeInfo[i].previousPerception[1],data.data[0].storeInfo[i].previousPerception[0],5]);scope.latestPlayer4rural.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[0],5]);break;
                                case 5:scope.latestPlayer5urban.push([data.data[0].storeInfo[i].latestPerception[1],data.data[0].storeInfo[i].latestPerception[0],10]);scope.latestPlayer5rural.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[0],10]);
                                scope.latestPlayer5urban.push([data.data[0].storeInfo[i].previousPerception[1],data.data[0].storeInfo[i].previousPerception[0],5]);scope.latestPlayer5rural.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[0],5]);break;
                                case 6:scope.latestPlayer6urban.push([data.data[0].storeInfo[i].latestPerception[1],data.data[0].storeInfo[i].latestPerception[0],10]);scope.latestPlayer6rural.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[0],10]);
                                scope.latestPlayer6urban.push([data.data[0].storeInfo[i].previousPerception[1],data.data[0].storeInfo[i].previousPerception[0],5]);scope.latestPlayer6rural.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[0],5]);break;
                                case 7:break;
                            }
                        }
                    }
                    scope.retailerPerceptionsSeries1=[{
                        name:Label.getContent('Retailer')+' 1',data:scope.latestPlayer1rural,color:'#3257A7'
                    },{
                        name:Label.getContent('Retailer')+' 2',data:scope.latestPlayer2rural,color:'#B11E22'
                    },{
                        name:Label.getContent('Traditional Trade'),data:scope.latestPlayer3rural,color:'#F6B920'
                    },{
                        name:Label.getContent('Supplier 1 Online'),data:scope.latestPlayer4rural,color:'#8B288B'
                    },{
                        name:Label.getContent('Supplier 2 Online'),data:scope.latestPlayer5rural,color:'#F05422'
                    },{
                        name:Label.getContent('Supplier 3 Online'),data:scope.latestPlayer6rural,color:'#329444'
                    }];
                    scope.retailerPerceptionsSeries2=[{
                        name:Label.getContent('Retailer')+' 1',data:scope.latestPlayer1urban,color:'#3257A7'
                    },{
                        name:Label.getContent('Retailer')+' 2',data:scope.latestPlayer2urban,color:'#B11E22'
                    },{
                        name:Label.getContent('Traditional Trade'),data:scope.latestPlayer3urban,color:'#F6B920'
                    },{
                        name:Label.getContent('Supplier 1 Online'),data:scope.latestPlayer4urban,color:'#8B288B'
                    },{
                        name:Label.getContent('Supplier 2 Online'),data:scope.latestPlayer5urban,color:'#F05422'
                    },{
                        name:Label.getContent('Supplier 3 Online'),data:scope.latestPlayer6urban,color:'#329444'
                    }];
                    scope.xTitle3=Label.getContent('Convenience');
                    scope.yTitle3=Label.getContent('Price Appeal');
                    scope.myModel="RetailerPerceptions"+scope.selectedPeriod;

                    deferred.resolve({msg:'Array is ready.'});                    
                    return deferred.promise;
                }


                scope.$watch('isPageShown', function(newValue, oldValue){
                    if(newValue==true) {
                        initializePage();
                    }
                })
                scope.$watch('selectedPeriod', function(newValue, oldValue){
                    if(newValue!=oldValue&&scope.isPageShown) {
                        initializePage();
                    }
                })

            }
        }
    }])
})