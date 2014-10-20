define(['directives', 'services'], function(directives){

    directives.directive('marketUrbanHealthBeautiesBrand', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerColor', function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerColor){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                selectedPeriod : '='
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
                    for(var i=0;i<data.variantInfo.length;i++){
                        if(category==data.variantInfo[i].parentCategoryID&&market==data.variantInfo[i].marketID){
                            //variantInfo[].parentCompanyID decide the player
                            //quality data (variantInfo[].latestPerception[1],variantInfo[].latestPerception[0],fullName)--> use fullName to pop the info of this circle
                            //prices data (1,latestPerception[2],fullName) -->use num '1' to posit all the circle in line . and use fullName to pop the info of this circle
                            switch(data.variantInfo[i].parentCompanyID){
                                case 1:scope.quality1s.push([data.variantInfo[i].latestPerception[0],data.variantInfo[i].latestPerception[1],data.variantInfo[i].parentBrandName+data.variantInfo[i].variantName]);scope.price1s.push([1,data.variantInfo[i].latestPerception[2],data.variantInfo[i].parentBrandName+data.variantInfo[i].variantName]);break;
                                case 2:scope.quality2s.push([data.variantInfo[i].latestPerception[0],data.variantInfo[i].latestPerception[1],data.variantInfo[i].parentBrandName+data.variantInfo[i].variantName]);scope.price2s.push([1,data.variantInfo[i].latestPerception[2],data.variantInfo[i].parentBrandName+data.variantInfo[i].variantName]);break;
                                case 3:scope.quality3s.push([data.variantInfo[i].latestPerception[0],data.variantInfo[i].latestPerception[1],data.variantInfo[i].parentBrandName+data.variantInfo[i].variantName]);scope.price3s.push([1,data.variantInfo[i].latestPerception[2],data.variantInfo[i].parentBrandName+data.variantInfo[i].variantName]);break;
                                case 5:scope.quality5s.push([data.variantInfo[i].latestPerception[0],data.variantInfo[i].latestPerception[1],data.variantInfo[i].parentBrandName+data.variantInfo[i].variantName]);scope.price5s.push([1,data.variantInfo[i].latestPerception[2],data.variantInfo[i].parentBrandName+data.variantInfo[i].variantName]);break;
                                case 6:scope.quality6s.push([data.variantInfo[i].latestPerception[0],data.variantInfo[i].latestPerception[1],data.variantInfo[i].parentBrandName+data.variantInfo[i].variantName]);scope.price6s.push([1,data.variantInfo[i].latestPerception[2],data.variantInfo[i].parentBrandName+data.variantInfo[i].variantName]);break;
                            }
                        }
                    }
                    scope.mySeries1=[{
                        name:Label.getContent('Supplier')+' 1',data:scope.quality1s,color:PlayerColor.getColors()[0]
                    },{
                        name:Label.getContent('Supplier')+' 2',data:scope.quality2s,color:PlayerColor.getColors()[1]
                    },{
                        name:Label.getContent('Supplier')+' 3',data:scope.quality3s,color:PlayerColor.getColors()[2]
                    },{
                        name:Label.getContent('Retailer')+' 1',data:scope.quality5s,color:PlayerColor.getColors()[4]
                    },{
                        name:Label.getContent('Retailer')+' 2',data:scope.quality6s,color:PlayerColor.getColors()[5]
                    }];
                    scope.mySeries2=[{
                        name:Label.getContent('Supplier')+' 1',data:scope.price1s,color:PlayerColor.getColors()[0]
                    },{
                        name:Label.getContent('Supplier')+' 2',data:scope.price2s,color:PlayerColor.getColors()[1]
                    },{
                        name:Label.getContent('Supplier')+' 3',data:scope.price3s,color:PlayerColor.getColors()[2]
                    },{
                        name:Label.getContent('Retailer')+' 1',data:scope.price5s,color:PlayerColor.getColors()[4]
                    },{
                        name:Label.getContent('Retailer')+' 2',data:scope.price6s,color:PlayerColor.getColors()[5]
                    }];
                    scope.myModel=category+"_"+market+'_'+scope.selectedPeriod;

                }

                var getResult =function(){
                    scope.quality1s=new Array();scope.quality2s=new Array();scope.quality3s=new Array();scope.quality5s=new Array();scope.quality6s=new Array();scope.price1s=new Array();scope.price2s=new Array();scope.price3s=new Array();scope.price5s=new Array();scope.price6s=new Array();
                    var url='/getMR-variantPerceptionEvolution/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+scope.selectedPeriod;
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
                scope.$watch('selectedPeriod', function(newValue, oldValue){
                    if(newValue!=oldValue&&scope.isPageShown) {
                        initializePage();
                    }
                })

            }
        }
    }])
})