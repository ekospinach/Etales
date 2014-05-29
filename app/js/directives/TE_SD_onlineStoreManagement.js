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

                var loadSelectCategory=function(category){
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
                                allProCatDecisions[i].proBrandsDecision[j].supportEmall=parseFloat(allProCatDecisions[i].proBrandsDecision[j].supportEmall).toFixed(2);
                                for(var k=0;k<allProCatDecisions[i].proBrandsDecision[j].proVarDecision.length;k++){
                                    allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].onlinePlannedVolume=allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].onlinePlannedVolume.toFixed(2);
                                    allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].onlinePrice=allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].onlinePrice.toFixed(2);
                                    //allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].pricePromotions.promo_Frequency=allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].pricePromotions.promo_Frequency.toFixed(2);
                                    //allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].pricePromotions.promo_Rate=allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].pricePromotions.promo_Rate.toFixed(2);
                                    if(allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].pricePromotions.promo_Rate>=0&&allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].pricePromotions.promo_Rate<=1){
                                        allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].pricePromotions.promo_Rate=(allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].pricePromotions.promo_Rate*100).toFixed(2);
                                    }
                                }
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
                    var categoryID,max,result,r1ContractExpend,r2ContractExpend;
                    var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a number'));
                    }
                    var url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/P/'+parseInt(PlayerInfo.getPlayer());
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){
                        max=data.data.budgetAvailable + data.data.budgetSpentToDate;
                        url='/getContractExpend/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+PlayerInfo.getPlayer()+'/1/brandName/varName';
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        r1ContractExpend = data.data.result;
                        url='/getContractExpend/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+PlayerInfo.getPlayer()+'/2/brandName/varName';
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        r2ContractExpend = data.data.result;
                        url="/producerExpend/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod())+'/'+parseInt(PlayerInfo.getPlayer())+'/'+brandName+'/'+location+'/'+tep;
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        if(parseInt(data.data.result)+parseInt(value)>max-r1ContractExpend-r2ContractExpend){
                            d.resolve(Label.getContent('Input range')+':0~'+(max-r1ContractExpend-r2ContractExpend-data.data.result));
                        }else{
                            d.resolve();
                        }
                    },function(data){
                        d.resolve(Label.getContent('fail'));
                    });
                    return d.promise;
                }

                scope.checkOrderVolumes=function(category,brandName,varName,location,additionalIdx,index,value){
                    var d=$q.defer();
                    var acMax=0;
                    if(category=="Elecssories"){
                        category=1;
                    }else{
                        category=2;
                    }
                    var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a number'));
                    }
                    var url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/P/'+parseInt(PlayerInfo.getPlayer());
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){
                        acMax=data.data.productionCapacity[category-1];
                        if(value>acMax||value<0){
                            d.resolve(Label.getContent('Input range')+':0~'+acMax);
                        }else{
                            d.resolve();
                        }
                    },function(){
                        console.log('fail');
                    })
                    return d.promise;
                }

                scope.checkFrequency=function(category,brandName,varName,location,additionalIdx,index,value){
                    var d=$q.defer();
                    var filter=/^[0-9]*[1-9][0-9]*$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a Integer'));
                    }
                    if(value>182||value<0){
                        d.resolve(Label.getContent('Input range')+':0~182');
                    }else{
                        d.resolve();
                    }
                    return d.promise;
                }

                scope.checkDepth=function(category,brandName,varName,location,additionalIdx,index,value){
                    var d=$q.defer();
                    var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a number'));
                    }
                    if(value>100||value<0){
                        d.resolve(Label.getContent('Input range')+':0~100');
                    }else{
                        d.resolve();
                    }
                    return d.promise;
                }

                scope.checkPrices=function(category,brandName,varName,location,additionalIdx,index,value){
                    var d=$q.defer();
                    var categoryID=0,max=0,currentUnitCost=0;
                    var url="";
                    var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a number'));
                    }
                    if(category=="Elecssories"){
                        categoryID=1;
                    }else{
                        categoryID=2;
                    }
                    var postData = {
                        period : PeriodInfo.getCurrentPeriod(),
                        seminar : SeminarInfo.getSelectedSeminar(),
                        brandName : brandName,
                        varName : varName,
                        catID : categoryID,
                        userRole :  2,
                        userID : PlayerInfo.getPlayer(),                              
                    }
                    $http({
                        method:'POST',
                        url:'/getCurrentUnitCost',
                        data:postData
                    }).then(function(data){
                        scope.currentUnitCost=data.data.result;
                        url='/getOneQuarterExogenousData/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+categoryID+'/1';
                        return $http({
                            method:'GET',
                            url:url
                        })
                    }).then(function(data){
                        if(value>data.data.MaxOnlinePriceVsCost*scope.currentUnitCost||value<data.data.MinOnlinePriceVsCost*scope.currentUnitCost){
                            d.resolve(Label.getContent('Input range')+':'+data.data.MinOnlinePriceVsCost*scope.currentUnitCost+'~'+data.data.MaxOnlinePriceVsCost*scope.currentUnitCost);
                        }else{
                            d.resolve();
                        }
                    },function(){
                        d.resolve(Label.getContent('fail'));
                    })
                    return d.promise;
                }


                scope.updateBrandDecision=function(category,brandName,location,tep,index){
                    var categoryID;
                    if(category=="Elecssories"){
                        categoryID=1;
                        if(location=="supportTraditionalTrade"||location=="advertisingOffLine"){
                            ProducerDecisionBase.setProducerDecisionBrand(categoryID,brandName,location,tep,scope.brandes[index][location][tep]);                           
                        }else{
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

                scope.updateVariantDecision=function(category,brandName,varName,location,additionalIdx,index,value){
                    console.log(value);
                    var categoryID;
                    if(category=="Elecssories"){
                        categoryID=1;
                    }else{
                        categoryID=2;
                    }
                    if(location=="pricePromotions"&&additionalIdx=="1"){
                        value=parseFloat(value)/100;
                    }
                    ProducerDecisionBase.setProducerDecisionValue(categoryID,brandName,varName,location,additionalIdx,value);                         
                }

                var showView=function(){
                    var d=$q.defer();
                    loadSelectCategory('Elecssories');
                    loadSelectCategory('HealthBeauty');
                    scope.isResultShown = true;
                    scope.isPageLoading = false;
                    return d.promise;       
                }

                scope.$watch('isPageShown', function(newValue, oldValue){
                    if(newValue==true) {
                        initializePage();
                    }
                });
                
                scope.$on('producerDecisionBaseChangedFromServer', function(event, data, newBase) {                    
                        //decision base had been updated, re-render the page with newBase
                        scope.pageBase = newBase;
                        showView();
                });

            }
        }
    }])
})