define(['directives', 'services'], function(directives){

    directives.directive('marketAwarenessHealthBeauties', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
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

                var loadAwareness=function(data,category){
                    scope.brandNames=new Array();
                    var count=0;
                    for(var i=0;i<data.data[0].brandInfo.length;i++){
                        if(data.data[0].brandInfo[i].parentCategoryID==category){
                            scope.brandNames[count]=data.data[0].brandInfo[i].brandName;
                            if(data.data[0].brandInfo[i].latestAwareness[1]>=data.data[0].brandInfo[i].previousAwareness[1]){
                                scope.valueRural[count]=data.data[0].brandInfo[i].previousAwareness[1];
                                scope.increaseRural[count]=data.data[0].brandInfo[i].latestAwareness[1]-data.data[0].brandInfo[i].previousAwareness[1];
                                scope.dropRural[count]=0;
                            }else{
                                scope.valueRural[count]=data.data[0].brandInfo[i].latestAwareness[1];
                                scope.dropRural[count]=data.data[0].brandInfo[i].previousAwareness[1]-data.data[0].brandInfo[i].latestAwareness[1];
                                scope.increaseRural[count]=0;
                            }
                            if(data.data[0].brandInfo[i].latestAwareness[0]>=data.data[0].brandInfo[i].previousAwareness[0]){
                                scope.valueUrban[count]=data.data[0].brandInfo[i].previousAwareness[0];
                                scope.increaseUrban[count]=data.data[0].brandInfo[i].latestAwareness[0]-data.data[0].brandInfo[i].previousAwareness[0];
                                scope.dropUrban[count]=0;
                            }else{
                                scope.valueUrban[count]=data.data[0].brandInfo[i].latestAwareness[0];
                                scope.dropUrban[count]=data.data[0].brandInfo[i].previousAwareness[0]-data.data[0].brandInfo[i].latestAwareness[0];
                                scope.increaseUrban[count]=0;
                            }
                            count++;
                        }
                    }
                    scope.chart1Series=[{
                        name:'Drop',data:scope.dropRural,color:'#D9534F'
                    },{
                        name:'Increase',data:scope.increaseRural,color:'#5CB85C'
                    },{
                        name:'Value',data:scope.valueRural,color:'#DDDDDD'
                    }];
                    scope.chart1Config={
                        options:{
                            chart:{type:'bar'},
                            plotOptions:{series:{stacking:'normal'}},
                            xAxis:{categories:scope.brandNames},
                            yAxis:{title:{text:''}
                        }
                    },
                        series:scope.chart1Series,
                        title:{text:Label.getContent('Rural')}
                    }
                    scope.chart2Series=[{
                        name:'Drop',data:scope.dropUrban,color:'#D9534F'
                    },{
                        name:'Increase',data:scope.increaseUrban,color:'#5CB85C'
                    },{
                        name:'Value',data:scope.valueUrban,color:'#DDDDDD'
                    }];
                    scope.chart2Config={
                        options:{
                            chart:{type:'bar'},
                            plotOptions:{series:{stacking:'normal'}},
                            xAxis:{categories:scope.brandNames},
                            yAxis:{title:{text:''}
                        }
                    },
                        series:scope.chart2Series,
                        title:{text:Label.getContent('Urban')}
                    }
                }

                var getResult =function(){
                    var url='/getMR-awarenessEvolution/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
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
                    loadAwareness(data,2);
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