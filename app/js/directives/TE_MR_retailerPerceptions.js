define(['directives', 'services'], function(directives){

    directives.directive('marketRetailerPerceptions', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
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
                    scope.player1es=new Array();scope.player2es=new Array();scope.player3es=new Array();scope.player4es=new Array();scope.player5es=new Array();scope.player6es=new Array();scope.player1hs=new Array();scope.player2hs=new Array();scope.player3hs=new Array();scope.player4hs=new Array();scope.player5hs=new Array();scope.player6hs=new Array();
                    var url='/getMR-retailerPerceptionEvolution/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
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
                    console.log(array);
                    return array;
                }

                var organiseArray = function(data){
                    var deferred = $q.defer();
                    for(var i=0;i<data.data[0].storeInfo.length;i++){
                        if(data.data[0].storeInfo[i].marketID==1){
                            switch(data.data[0].storeInfo[i].storeID){
                                case 1:scope.player1es.push([data.data[0].storeInfo[i].latestPerception[1],data.data[0].storeInfo[i].latestPerception[0],10]);scope.player1hs.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[0],10]);break;
                                case 2:scope.player2es.push([data.data[0].storeInfo[i].latestPerception[1],data.data[0].storeInfo[i].latestPerception[0],10]);scope.player2hs.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[0],10]);break;
                                case 3:scope.player3es.push([data.data[0].storeInfo[i].latestPerception[1],data.data[0].storeInfo[i].latestPerception[0],10]);scope.player3hs.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[0],10]);break;
                                case 4:scope.player4es.push([data.data[0].storeInfo[i].latestPerception[1],data.data[0].storeInfo[i].latestPerception[0],10]);scope.player4hs.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[0],10]);break;
                                case 5:scope.player5es.push([data.data[0].storeInfo[i].latestPerception[1],data.data[0].storeInfo[i].latestPerception[0],10]);scope.player5hs.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[0],10]);break;
                                case 6:scope.player6es.push([data.data[0].storeInfo[i].latestPerception[1],data.data[0].storeInfo[i].latestPerception[0],10]);scope.player6hs.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[0],10]);break;
                                case 7:break;
                            }
                        }
                    }
                    scope.retailerPerceptionsSeries1=[{
                        name:Label.getContent('Retailer')+' 1',data:scope.player1es,color:'#3257A7'
                    },{
                        name:Label.getContent('Retailer')+' 2',data:scope.player2es,color:'#B11E22'
                    },{
                        name:Label.getContent('Traditional Trade'),data:scope.player3es,color:'#F6B920'
                    },{
                        name:Label.getContent('Supplier 1 Online'),data:scope.player4es,color:'#8B288B'
                    },{
                        name:Label.getContent('Supplier 2 Online'),data:scope.player5es,color:'#F05422'
                    },{
                        name:Label.getContent('Supplier 3 Online'),data:scope.player6es,color:'#329444'
                    }];
                    scope.retailerPerceptionsSeries2=[{
                        name:Label.getContent('Retailer')+' 1',data:scope.player1hs,color:'#3257A7'
                    },{
                        name:Label.getContent('Retailer')+' 2',data:scope.player2hs,color:'#B11E22'
                    },{
                        name:Label.getContent('Traditional Trade'),data:scope.player3hs,color:'#F6B920'
                    },{
                        name:Label.getContent('Supplier 1 Online'),data:scope.player4hs,color:'#8B288B'
                    },{
                        name:Label.getContent('Supplier 2 Online'),data:scope.player5hs,color:'#F05422'
                    },{
                        name:Label.getContent('Supplier 3 Online'),data:scope.player6hs,color:'#329444'
                    }];
                    scope.myModel="RetailerPerceptions";

                    deferred.resolve({msg:'Array is ready.'});                    
                    return deferred.promise;
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