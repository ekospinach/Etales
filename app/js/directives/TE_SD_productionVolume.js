define(['directives', 'services'], function(directives){

    directives.directive('supplierProductionVolume', ['ProducerDecisionBase','ProducerDecision','Label','SeminarInfo','$http','$location','$filter','PeriodInfo','$q','PlayerInfo', function(ProducerDecisionBase,ProducerDecision,Label, SeminarInfo, $http,$location,$filter, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/SD_productionVolume.html',            
            link : function(scope, element, attrs){                   

                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;

                    scope.currentPeriod=PeriodInfo.getCurrentPeriod();
                    scope.packs = [{
                        value: 1, text: Label.getContent('ECONOMY')
                    },{
                        value: 2, text: Label.getContent('STANDARD')
                    },{
                        value: 3, text: Label.getContent('PREMIUM')
                    }]; 
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
                scope.checkProduction=function(category,brandName,varName,location,additionalIdx,index,value){
                    var d = $q.defer(); 
                    var categoryID,max,result;
                    var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a number'));
                    }
                    if(category=="Elecssories"){
                        categoryID=1;
                    }else{
                        categoryID=2;
                    }   
                    var url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/P/'+parseInt(PlayerInfo.getPlayer());
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){
                        max=data.data.productionCapacity[categoryID-1];
                        url="/productionResult/"+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+parseInt(PlayerInfo.getPlayer())+'/'+brandName+'/'+varName;
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        if(parseInt(data.data.result)+parseInt(value)>max){
                            d.resolve(Label.getContent('Input range')+':0~'+(max-parseInt(data.data.result)));
                        }else{
                            d.resolve();
                        }
                    },function(){
                        d.resolve(Label.getContent('fail'));
                    })
                    return d.promise;
                }

                var loadSelectCategroy=function(category){
                    var count=0;
                    var products=new Array();
                    var allProCatDecisions=_.filter(scope.pageBase.proCatDecision,function(obj){
                        if(category=="HealthBeauty"){
                            return (obj.categoryID==2);
                        }else{
                            return (obj.categoryID==1);
                        }
                    });
                    for(var i=0;i<allProCatDecisions.length;i++){
                        for(var j=0;j<allProCatDecisions[i].proBrandsDecision.length;j++){
                            if(allProCatDecisions[i].proBrandsDecision[j].brandID!=undefined&&allProCatDecisions[i].proBrandsDecision[j].brandID!=0){
                                for(var k=0;k<allProCatDecisions[i].proBrandsDecision[j].proVarDecision.length;k++){
                                    if(allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID!=0&&allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID!=undefined){
                                        products.push(allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k]);
                                        products[count].category=category;
                                        products[count].parentBrandName=allProCatDecisions[i].proBrandsDecision[j].brandName;
                                        if(products[count].packFormat=="ECONOMY"){
                                            products[count].packFormat=1;
                                        }
                                        else if(products[count].packFormat=="STANDARD"){
                                            products[count].packFormat=2;
                                        }
                                        else if(products[count].packFormat=="PREMIUM"){
                                            products[count].packFormat=3;
                                        }
                                        products[count].currentPriceBM=parseFloat(products[count].currentPriceBM).toFixed(2);
                                        count++;
                                    }
                                }
                            }
                        }
                    }
                    if(category=="Elecssories"){
                        scope.productes=products;
                    }else{
                        scope.producths=products;
                    }
                }

                var selectPacks = function(category,parentBrandName,varName) {
                    var selected,postion=-1;
                    if(category=="Elecssories"){
                        for(var i=0;i<scope.productes.length;i++){
                            if(scope.productes[i].parentBrandName==parentBrandName&&scope.productes[i].varName==varName){
                                selected = $filter('filter')(scope.packs, {value: scope.productes[i].packFormat});
                                postion=i;
                                break;
                            }
                        }
                        if(postion!=-1){
                            return (scope.productes[postion].packFormat && selected.length) ? selected[0].text : Label.getContent('Not set'); 
                        }
                        else{
                            return Label.getContent('Not set'); 
                        }
                    }else{
                        for(var i=0;i<scope.producths.length;i++){
                            if(scope.producths[i].parentBrandName==parentBrandName&&scope.producths[i].varName==varName){
                                selected = $filter('filter')(scope.packs, {value: scope.producths[i].packFormat});
                                postion=i;
                                break;
                            }
                        }
                        if(postion!=-1){
                            return (scope.producths[postion].packFormat && selected.length) ? selected[0].text : Label.getContent('Not set'); 
                        }
                        else{
                            return Label.getContent('Not set'); 
                        }
                    }
                }

                var loadByCategroy=function(category){
                    return _.filter(scope.pageBase.proCatDecision,function(obj){
                        if(category=="HealthBeauty"){
                            return (obj.categoryID==2);
                        }else{
                            return (obj.categoryID==1);
                        }
                    });
                }

                scope.updateProducerDecision=function(category,brandName,varName,location,additionalIdx,index){
                    var categoryID;
                    if(location=="composition"){
                        if(category=="Elecssories"){
                            categoryID=1;
                            ProducerDecisionBase.setProducerDecisionValue(categoryID,brandName,varName,location,additionalIdx,scope.productes[index][location][additionalIdx]);                         
                        }
                        else{
                            categoryID=2;
                            ProducerDecisionBase.setProducerDecisionValue(categoryID,brandName,varName,location,additionalIdx,scope.producths[index][location][additionalIdx]);                         
                        }
                    }
                    else{
                        if(category=="Elecssories"){
                            categoryID=1;
                            ProducerDecisionBase.setProducerDecisionValue(categoryID,brandName,varName,location,additionalIdx,scope.productes[index][location]);                                                    
                        }
                        else{
                            categoryID=2;
                            ProducerDecisionBase.setProducerDecisionValue(categoryID,brandName,varName,location,additionalIdx,scope.producths[index][location]);                                                    
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
                        scope.selectPacks=selectPacks;
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