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
                    scope.latestPlayer1es=new Array();scope.latestPlayer2es=new Array();scope.latestPlayer3es=new Array();scope.latestPlayer4es=new Array();scope.latestPlayer5es=new Array();scope.latestPlayer6es=new Array();scope.latestPlayer1hs=new Array();scope.latestPlayer2hs=new Array();scope.latestPlayer3hs=new Array();scope.latestPlayer4hs=new Array();scope.latestPlayer5hs=new Array();scope.latestPlayer6hs=new Array();scope.previousPlayer1es=new Array();scope.previousPlayer2es=new Array();scope.previousPlayer3es=new Array();scope.previousPlayer4es=new Array();scope.previousPlayer5es=new Array();scope.previousPlayer6es=new Array();scope.previousPlayer1hs=new Array();scope.previousPlayer2hs=new Array();scope.previousPlayer3hs=new Array();scope.previousPlayer4hs=new Array();scope.previousPlayer5hs=new Array();scope.previousPlayer6hs=new Array();
                    var url='/getMR-retailerPerceptionEvolution/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1);
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
                                case 1:scope.latestPlayer1es.push([data.data[0].storeInfo[i].latestPerception[1],data.data[0].storeInfo[i].latestPerception[0],10]);scope.latestPlayer1hs.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[0],10]);
                                scope.previousPlayer1es.push([data.data[0].storeInfo[i].previousPerception[1],data.data[0].storeInfo[i].previousPerception[0],10]);scope.latestPlayer1hs.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[0],10]);break;
                                case 2:scope.latestPlayer2es.push([data.data[0].storeInfo[i].latestPerception[1],data.data[0].storeInfo[i].latestPerception[0],10]);scope.latestPlayer2hs.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[0],10]);
                                scope.previousPlayer2es.push([data.data[0].storeInfo[i].previousPerception[1],data.data[0].storeInfo[i].previousPerception[0],10]);scope.latestPlayer2hs.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[0],10]);break;
                                case 3:scope.latestPlayer3es.push([data.data[0].storeInfo[i].latestPerception[1],data.data[0].storeInfo[i].latestPerception[0],10]);scope.latestPlayer3hs.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[0],10]);
                                scope.previousPlayer3es.push([data.data[0].storeInfo[i].previousPerception[1],data.data[0].storeInfo[i].previousPerception[0],10]);scope.latestPlayer3hs.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[0],10]);break;
                                case 4:scope.latestPlayer4es.push([data.data[0].storeInfo[i].latestPerception[1],data.data[0].storeInfo[i].latestPerception[0],10]);scope.latestPlayer4hs.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[0],10]);
                                scope.previousPlayer4es.push([data.data[0].storeInfo[i].previousPerception[1],data.data[0].storeInfo[i].previousPerception[0],10]);scope.latestPlayer4hs.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[0],10]);break;
                                case 5:scope.latestPlayer5es.push([data.data[0].storeInfo[i].latestPerception[1],data.data[0].storeInfo[i].latestPerception[0],10]);scope.latestPlayer5hs.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[0],10]);
                                scope.previousPlayer5es.push([data.data[0].storeInfo[i].previousPerception[1],data.data[0].storeInfo[i].previousPerception[0],10]);scope.latestPlayer5hs.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[0],10]);break;
                                case 6:scope.latestPlayer6es.push([data.data[0].storeInfo[i].latestPerception[1],data.data[0].storeInfo[i].latestPerception[0],10]);scope.latestPlayer6hs.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).latestPerception[0],10]);
                                scope.previousPlayer6es.push([data.data[0].storeInfo[i].previousPerception[1],data.data[0].storeInfo[i].previousPerception[0],10]);scope.latestPlayer6hs.push([loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[1],loadValue(data.data[0].storeInfo,data.data[0].storeInfo[i].storeID,2).previousPerception[0],10]);break;
                                case 7:break;
                            }
                        }
                    }
                    scope.retailerPerceptionsSeries1=[{
                        name:Label.getContent('Retailer')+' 1',data:scope.latestPlayer1es,color:'#3257A7'
                    },{
                        name:Label.getContent('Retailer')+' 2',data:scope.latestPlayer2es,color:'#B11E22'
                    },{
                        name:Label.getContent('Traditional Trade'),data:scope.latestPlayer3es,color:'#F6B920'
                    },{
                        name:Label.getContent('Supplier 1 Online'),data:scope.latestPlayer4es,color:'#8B288B'
                    },{
                        name:Label.getContent('Supplier 2 Online'),data:scope.latestPlayer5es,color:'#F05422'
                    },{
                        name:Label.getContent('Supplier 3 Online'),data:scope.latestPlayer6es,color:'#329444'
                    },{
                        name:Label.getContent('pre')+' '+Label.getContent('Retailer')+' 1',data:scope.previousPlayer1es,color:'#4682b4'
                    },{
                        name:Label.getContent('pre')+' '+Label.getContent('Retailer')+' 2',data:scope.previousPlayer2es,color:'#a0522d'
                    },{
                        name:Label.getContent('pre')+' '+Label.getContent('Traditional Trade'),data:scope.previousPlayer3es,color:'#daa520'
                    },{
                        name:Label.getContent('pre')+' '+Label.getContent('Supplier 1 Online'),data:scope.previousPlayer4es,color:'#8b008b'
                    },{
                        name:Label.getContent('pre')+' '+Label.getContent('Supplier 2 Online'),data:scope.previousPlayer5es,color:'#d2691e'
                    },{
                        name:Label.getContent('pre')+' '+Label.getContent('Supplier 3 Online'),data:scope.previousPlayer6es,color:'#2e8b57'
                    }];
                    scope.retailerPerceptionsSeries2=[{
                        name:Label.getContent('Retailer')+' 1',data:scope.latestPlayer1hs,color:'#3257A7'
                    },{
                        name:Label.getContent('Retailer')+' 2',data:scope.latestPlayer2hs,color:'#B11E22'
                    },{
                        name:Label.getContent('Traditional Trade'),data:scope.latestPlayer3hs,color:'#F6B920'
                    },{
                        name:Label.getContent('Supplier 1 Online'),data:scope.latestPlayer4hs,color:'#8B288B'
                    },{
                        name:Label.getContent('Supplier 2 Online'),data:scope.latestPlayer5hs,color:'#F05422'
                    },{
                        name:Label.getContent('Supplier 3 Online'),data:scope.latestPlayer6hs,color:'#329444'
                    },{
                        name:Label.getContent('pre')+' '+Label.getContent('Retailer')+' 1',data:scope.previousPlayer1hs,color:'#4682b4'
                    },{
                        name:Label.getContent('pre')+' '+Label.getContent('Retailer')+' 2',data:scope.previousPlayer2hs,color:'#a0522d'
                    },{
                        name:Label.getContent('pre')+' '+Label.getContent('Traditional Trade'),data:scope.previousPlayer3hs,color:'#daa520'
                    },{
                        name:Label.getContent('pre')+' '+Label.getContent('Supplier 1 Online'),data:scope.previousPlayer4hs,color:'#8b008b'
                    },{
                        name:Label.getContent('pre')+' '+Label.getContent('Supplier 2 Online'),data:scope.previousPlayer5hs,color:'#d2691e'
                    },{
                        name:Label.getContent('pre')+' '+Label.getContent('Supplier 3 Online'),data:scope.previousPlayer6hs,color:'#2e8b57'
                    }];
                    scope.xTitle3=Label.getContent('Convenience');
                    scope.yTitle3=Label.getContent('Price Appeal');
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