define(['directives', 'services'], function(directives){

    directives.directive('supplierOnlineStoreManagement', ['ProducerDecisionBase','ProducerDecision','Label','SeminarInfo','$http','$location','$filter','PeriodInfo','$q','PlayerInfo', function(ProducerDecisionBase,ProducerDecision,Label, SeminarInfo, $http,$location,$filter, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/SD_onlineStoreManagement.html',            
            link : function(scope, element, attrs){                   

                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;

                    scope.currentPeriod=PeriodInfo.getCurrentPeriod();
                    ProducerDecisionBase.startListenChangeFromServer(); 
                    ProducerDecisionBase.reload({producerID:parseInt(PlayerInfo.getPlayer()),period:PeriodInfo.getCurrentPeriod(),seminar:SeminarInfo.getSelectedSeminar()}).then(function(base){
                        scope.pageBase = base; 
                    }).then(function(){
                        return showView();
                    }), function(reason){
                        console.log('from ctr: ' + reason);
                    }, function(update){
                        console.log('from ctr: ' + update);
                    };                   
                }

                var loadSelectCategroy=function(category){
                    var d=$q.defer();
                    var count=0;
                    var brands=new Array();
                    var allProCatDecisions=_.filter(scope.pageBase.proCatDecision,function(obj){
                        if(category=="HealthBeauty"){
                            return (obj.categoryID==2);
                        }else{
                            return (obj.categoryID==1);
                        }
                    });
                    for(var i=0;i<allProCatDecisions.length;i++){
                        for(var j=0;j<allProCatDecisions[i].proBrandsDecision.length;j++){
                            if(allProCatDecisions[i].proBrandsDecision[j]!=undefined&&allProCatDecisions[i].proBrandsDecision[j].brandID!=undefined&&allProCatDecisions[i].proBrandsDecision[j].brandID!=0){
                                brands.push(allProCatDecisions[i].proBrandsDecision[j]);
                                count++;
                            }
                        }
                    }
                    if(count!=0){
                        result=1;
                        d.resolve();
                    }else{
                        d.reject(Label.getContent('load brands fail'));
                    }
                    if(category=="Elecssories"){
                        scope.brandes=brands;
                    }else{
                        scope.brandhs=brands;
                    }
                }

                scope.checkData=function(category,brandName,location,tep,index,value){
                    var d=$q.defer();
                    var categoryID,max,result;
                    var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a number'));
                    }
                    var url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/P/'+parseInt(PlayerInfo.getPlayer());
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){
                        max=data.data.budgetAvailable;
                        url="/producerExpend/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod())+'/'+parseInt(PlayerInfo.getPlayer())+'/'+brandName+'/'+location+'/'+tep;
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        if(parseInt(data.data.result)+parseInt(value)>max){
                            d.resolve(Label.getContent('Input range')+':0~'+(max-data.data.result));
                        }else{
                            d.resolve();
                        }
                    },function(data){
                        d.resolve(Label.getContent('fail'));
                    });
                    return d.promise;
                }

                scope.updateProducerDecision=function(category,brandName,location,tep,index){
                    var categoryID;
                    if(category=="Elecssories"){
                        categoryID=1;
                            if(location=="supportTraditionalTrade"||location=="advertisingOffLine"){
                            ProducerDecisionBase.setProducerDecisionBrand(categoryID,brandName,location,tep,scope.brandes[index][location][tep]);                           
                        }
                        else{
                            ProducerDecisionBase.setProducerDecisionBrand(categoryID,brandName,location,tep,scope.brandes[index][location]);                                                    
                        }
                    }
                    else{
                        categoryID=2;
                        if(location=="supportTraditionalTrade"||location=="advertisingOffLine"){
                            ProducerDecisionBase.setProducerDecisionBrand(categoryID,brandName,location,tep,scope.brandhs[index][location][tep]);                           
                        }
                        else{
                            ProducerDecisionBase.setProducerDecisionBrand(categoryID,brandName,location,tep,scope.brandhs[index][location]);                                                    
                        }
                    }
                }

                var showView=function(){
                    var d=$q.defer();
                    var categoryID=0,count=0,result=0,acMax=0,abMax=0,expend=0,avaiableMax=0;
                    var url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/P/'+parseInt(PlayerInfo.getPlayer());
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){
                        avaiableMax=data.data.budgetAvailable;
                        if(PeriodInfo.getCurrentPeriod()<=1){
                            abMax=data.data.budgetAvailable;
                        }else{
                            abMax=data.data.budgetAvailable+data.data.budgetSpentToDate;
                        }
                        acEleMax=data.data.productionCapacity[0];
                        acHeaMax=data.data.productionCapacity[1];
                        url="/producerExpend/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod())+'/'+parseInt(PlayerInfo.getPlayer())+'/brandName/location/1';
                        return  $http({
                            method:'GET',
                            url:url,
                        });
                    }).then(function(data){
                        expend=data.data.result;
                        scope.surplusExpend=abMax-expend;
                        scope.percentageExpend=(abMax-expend)/abMax*100;
                        url="/productionResult/"+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+parseInt(PlayerInfo.getPlayer())+'/EName/varName';
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        scope.eleSurplusProduction=acEleMax-data.data.result;
                        scope.elePercentageProduction=(acEleMax-data.data.result)/acEleMax*100;
                        url="/productionResult/"+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+parseInt(PlayerInfo.getPlayer())+'/HName/varName';
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        scope.heaSurplusProduction=acHeaMax-data.data.result;
                        scope.heaPercentageProduction=(acHeaMax-data.data.result)/acHeaMax*100;
                        loadSelectCategroy('Elecssories');
                        loadSelectCategroy('HealthBeauty');
                    }).then(function(){
                        scope.isResultShown = true;
                        scope.isPageLoading = false;  
                    },function(data){
                        d.reject(Label.getContent('showView fail'));
                    }); 
                    return d.promise;       
                }

                scope.$watch('isPageShown', function(newValue, oldValue){
                    if(newValue==true) {
                        initializePage();
                    }
                });
                scope.$on('producerDecisionBaseChangedFromServer', function(event, newBase){
                    ProducerDecisionBase.reload({producerID:parseInt(PlayerInfo.getPlayer()),period:PeriodInfo.getCurrentPeriod(),seminar:SeminarInfo.getSelectedSeminar()}).then(function(base){
                        scope.pageBase = base; 
                    }).then(function(){
                        return showView();
                    }), function(reason){
                        console.log('from ctr: ' + reason);
                    }, function(update){
                        console.log('from ctr: ' + update);
                    };
                });

            }
        }
    }])
})