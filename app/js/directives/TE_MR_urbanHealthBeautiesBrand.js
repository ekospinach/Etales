define(['directives', 'services'], function(directives){

    directives.directive('marketUrbanHealthBeautiesBrand', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            //templateUrl : '../../partials/singleReportTemplate/MR_brand.html',            
            templateUrl : '../../partials/singleReportTemplate/MR_urbanHealthBeautiesBrand.html',            
            link : function(scope, element, attrs){                                                                
                var initializePage = function(){
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var loadBrandPerceptions=function(data,category,market){
                    for(var i=0;i<data.data[0].variantInfo.length;i++){
                        if(category==data.data[0].variantInfo[i].parentCategoryID&&market==data.data[0].variantInfo[i].marketID){
                            //variantInfo[].parentCompanyID decide the player
                            //quality data (variantInfo[].latestPerception[1],variantInfo[].latestPerception[0],fullName)--> use fullName to pop the info of this circle
                            //prices data (1,latestPerception[2],fullName) -->use num '1' to posit all the circle in line . and use fullName to pop the info of this circle
                            switch(data.data[0].variantInfo[i].parentCompanyID){
                                case 1:scope.quality1s.push([data.data[0].variantInfo[i].latestPerception[0],data.data[0].variantInfo[i].latestPerception[1],data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName]);scope.price1s.push([1,data.data[0].variantInfo[i].latestPerception[2],data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName]);break;
                                case 2:scope.quality2s.push([data.data[0].variantInfo[i].latestPerception[0],data.data[0].variantInfo[i].latestPerception[1],data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName]);scope.price2s.push([1,data.data[0].variantInfo[i].latestPerception[2],data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName]);break;
                                case 3:scope.quality3s.push([data.data[0].variantInfo[i].latestPerception[0],data.data[0].variantInfo[i].latestPerception[1],data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName]);scope.price3s.push([1,data.data[0].variantInfo[i].latestPerception[2],data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName]);break;
                                case 5:scope.quality5s.push([data.data[0].variantInfo[i].latestPerception[0],data.data[0].variantInfo[i].latestPerception[1],data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName]);scope.price5s.push([1,data.data[0].variantInfo[i].latestPerception[2],data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName]);break;
                                case 6:scope.quality6s.push([data.data[0].variantInfo[i].latestPerception[0],data.data[0].variantInfo[i].latestPerception[1],data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName]);scope.price6s.push([1,data.data[0].variantInfo[i].latestPerception[2],data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName]);break;
                            }
                        }
                    }
                    scope.mySeries1=[{
                        name:Label.getContent('Supplier')+' 1',data:scope.quality1s,color:'#3257A7'
                    },{
                        name:Label.getContent('Supplier')+' 2',data:scope.quality2s,color:'#B11E22'
                    },{
                        name:Label.getContent('Supplier')+' 3',data:scope.quality3s,color:'#F6B920'
                    },{
                        name:Label.getContent('Retailer')+' 1',data:scope.quality5s,color:'#8B288B'
                    },{
                        name:Label.getContent('Retailer')+' 2',data:scope.quality6s,color:'#F05422'
                    }];
                    scope.mySeries2=[{
                        name:Label.getContent('Supplier')+' 1',data:scope.price1s,color:'#3257A7'
                    },{
                        name:Label.getContent('Supplier')+' 2',data:scope.price2s,color:'#B11E22'
                    },{
                        name:Label.getContent('Supplier')+' 3',data:scope.price3s,color:'#F6B920'
                    },{
                        name:Label.getContent('Retailer')+' 1',data:scope.price5s,color:'#8B288B'
                    },{
                        name:Label.getContent('Retailer')+' 2',data:scope.price6s,color:'#F05422'
                    }];
                    scope.myModel=category+" "+market;
                }

                var getResult =function(){
                    scope.quality1s=new Array();scope.quality2s=new Array();scope.quality3s=new Array();scope.quality5s=new Array();scope.quality6s=new Array();scope.price1s=new Array();scope.price2s=new Array();scope.price3s=new Array();scope.price5s=new Array();scope.price6s=new Array();
                    var url='/getMR-variantPerceptionEvolution/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1);
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
                    scope.xTitle1=Label.getContent("Performance");
                    scope.yTitle1=Label.getContent("Gentleness");
                    scope.yTitle2=Label.getContent("Price Appeal");
                    loadBrandPerceptions(data,2,1);
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