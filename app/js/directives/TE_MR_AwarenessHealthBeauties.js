define(['directives', 'services'], function(directives){

    directives.directive('marketAwarenessHealthBeauties', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerColor', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerColor){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                selectedPeriod : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/MR_awarenessHealthBeauties.html',            
            link : function(scope, element, attrs){                                                                
                var initializePage = function(){
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var loadAwareness=function(data,category,market){
                    scope.brandNames=new Array();
                    var count=0;
                    /*
                        if latestAwareness>=previousAwareness
                        then value =previousAwareness;
                        increase=latestAwareness-previousAwareness;
                        drop=0;
                        else
                        then value =latestAwareness;
                        drop=previousAwareness-latestAwareness;
                        increase=0;
                    */
                    for(var i=0;i<data.brandInfo.length;i++){
                        if(data.brandInfo[i].parentCategoryID==category&&data.brandInfo[i].marketID==market){
                            scope.brandNames[count]=data.brandInfo[i].brandName;
                            switch(market){
                                case 1:
                                if(data.brandInfo[i].latestAwareness>=data.brandInfo[i].previousAwareness){
                                    scope.valueRural[count]=data.brandInfo[i].previousAwareness*100;
                                    scope.increaseRural[count]=(data.brandInfo[i].latestAwareness-data.brandInfo[i].previousAwareness)*100;
                                    scope.dropRural[count]=0;
                                }else{
                                    scope.valueRural[count]=data.brandInfo[i].latestAwareness*100;
                                    scope.dropRural[count]=(data.brandInfo[i].previousAwareness-data.brandInfo[i].latestAwareness)*100;
                                    scope.increaseRural[count]=0;
                                };break;
                                case 2:
                                if(data.brandInfo[i].latestAwareness>=data.brandInfo[i].previousAwareness){
                                    scope.valueUrban[count]=data.brandInfo[i].previousAwareness*100;
                                    scope.increaseUrban[count]=(data.brandInfo[i].latestAwareness-data.brandInfo[i].previousAwareness)*100;
                                    scope.dropUrban[count]=0;
                                }else{
                                    scope.valueUrban[count]=data.brandInfo[i].latestAwareness*100;
                                    scope.dropUrban[count]=(data.brandInfo[i].previousAwareness-data.brandInfo[i].latestAwareness)*100;
                                    scope.increaseUrban[count]=0;
                                };break;

                            }
                            count++;
                        }
                    }
                    switch(market){
                        case 1:
                        scope.awarenessHealthBeauties1Series=[{
                            name:Label.getContent('Drop'),data:scope.dropRural,color:PlayerColor.getColors()[1]
                        },{
                            name:Label.getContent('Increase'),data:scope.increaseRural,color:PlayerColor.getColors()[5]
                        },{
                            name:Label.getContent('Awareness Value'),data:scope.valueRural,color:PlayerColor.getColors()[0]
                        }];
                        scope.awarenessHealthBeauties1Config={
                            options:{
                                chart:{type:'bar'},
                                tooltip: {
                                    valueDecimals: 2
                                },
                                plotOptions:{series:{stacking:'normal'}},
                                xAxis:{categories:scope.brandNames},
                                yAxis:{title:{text:'%'}
                            }
                        },
                            series:scope.awarenessHealthBeauties1Series,
                            credits: {
                                enabled: false
                            },
                            title:{text:Label.getContent('Rural')}
                        };break;
                        case 2:
                        scope.awarenessHealthBeauties2Series=[{
                            name:Label.getContent('Drop'),data:scope.dropUrban,color:PlayerColor.getColors()[1]
                        },{
                            name:Label.getContent('Increase'),data:scope.increaseUrban,color:PlayerColor.getColors()[5]
                        },{
                            name:Label.getContent('Awareness Value'),data:scope.valueUrban,color:PlayerColor.getColors()[0]
                        }];
                        scope.awarenessHealthBeauties2Config={
                            options:{
                                chart:{type:'bar'},
                                tooltip: {
                                    valueDecimals: 2
                                },
                                plotOptions:{series:{stacking:'normal'}},
                                xAxis:{categories:scope.brandNames},
                                yAxis:{title:{text:'%'}
                            }
                        },
                            series:scope.awarenessHealthBeauties2Series,
                            credits: {
                                enabled: false
                            },
                            title:{text:Label.getContent('Urban')}
                        };break;
                    }
                }

                var getResult =function(){
                    var url='/getMR-awarenessEvolution/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+scope.selectedPeriod;
                    $http({
                        method:'GET',
                        url:url,
                        //tracker: scope.loadingTracker
                    }).then(function(data){   
                        return organiseArray(data.data[0]);
                    }).then(function(data){
                        scope.isResultShown = true;
                        scope.isPageLoading = false;                                                                         
                    },function(){
                        console.log('fail');
                    });
                }

                var organiseArray = function(data){
                    var deferred = $q.defer();
                    scope.valueRural=new Array();scope.valueUrban=new Array();scope.dropRural=new Array();scope.dropUrban=new Array();scope.increaseRural=new Array();scope.increaseUrban=new Array();
                    loadAwareness(data,2,1);
                    loadAwareness(data,2,2);
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