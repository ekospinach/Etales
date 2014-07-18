define(['directives', 'services'], function(directives){

    directives.directive('marketAwarenessElecssories', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
selectedPeriod : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/MR_awarenessElecssories.html',            
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
                    for(var i=0;i<data.data[0].brandInfo.length;i++){
                        if(data.data[0].brandInfo[i].parentCategoryID==category&&data.data[0].brandInfo[i].marketID==market){
                            scope.brandNames[count]=data.data[0].brandInfo[i].brandName;
                            switch(market){
                                case 1:
                                if(data.data[0].brandInfo[i].latestAwareness>=data.data[0].brandInfo[i].previousAwareness){
                                    scope.valueRural[count]=data.data[0].brandInfo[i].previousAwareness*100;
                                    scope.increaseRural[count]=(data.data[0].brandInfo[i].latestAwareness-data.data[0].brandInfo[i].previousAwareness)*100;
                                    scope.dropRural[count]=0;
                                }else{
                                    scope.valueRural[count]=data.data[0].brandInfo[i].latestAwareness*100;
                                    scope.dropRural[count]=(data.data[0].brandInfo[i].previousAwareness-data.data[0].brandInfo[i].latestAwareness)*100;
                                    scope.increaseRural[count]=0;
                                };break;
                                case 2:
                                if(data.data[0].brandInfo[i].latestAwareness>=data.data[0].brandInfo[i].previousAwareness){
                                    scope.valueUrban[count]=data.data[0].brandInfo[i].previousAwareness*100;
                                    scope.increaseUrban[count]=(data.data[0].brandInfo[i].latestAwareness-data.data[0].brandInfo[i].previousAwareness)*100;
                                    scope.dropUrban[count]=0;
                                }else{
                                    scope.valueUrban[count]=data.data[0].brandInfo[i].latestAwareness*100;
                                    scope.dropUrban[count]=(data.data[0].brandInfo[i].previousAwareness-data.data[0].brandInfo[i].latestAwareness)*100;
                                    scope.increaseUrban[count]=0;
                                };break;

                            }
                            count++;
                        }
                    }
                    switch(market){
                        case 1:
                        scope.awarenessElecssories1Series=[{
                            name:'Drop',data:scope.dropRural,color:'#D9534F'
                        },{
                            name:'Increase',data:scope.increaseRural,color:'#5CB85C'
                        },{
                            name:'Value',data:scope.valueRural,color:'#428BCA'
                        }];
                        scope.awarenessElecssories1Config={
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
                            series:scope.awarenessElecssories1Series,
                            credits: {
                                enabled: false
                            },
                            title:{text:Label.getContent('Rural')}
                        };break;
                        case 2:
                        scope.awarenessElecssories2Series=[{
                            name:'Drop',data:scope.dropUrban,color:'#D9534F'
                        },{
                            name:'Increase',data:scope.increaseUrban,color:'#5CB85C'
                        },{
                            name:'Value',data:scope.valueUrban,color:'#428BCA'
                        }];
                        scope.awarenessElecssories2Config={
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
                            series:scope.awarenessElecssories2Series,
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
                    scope.valueRural=new Array();scope.valueUrban=new Array();scope.dropRural=new Array();scope.dropUrban=new Array();scope.increaseRural=new Array();scope.increaseUrban=new Array();
                    loadAwareness(data,1,1);
                    loadAwareness(data,1,2);
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