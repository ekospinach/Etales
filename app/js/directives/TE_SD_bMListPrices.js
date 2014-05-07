define(['directives', 'services'], function(directives){

    directives.directive('supplierBMListPrices', ['ProducerDecisionBase','ProducerDecision','Label','SeminarInfo','$http','$location','$filter','PeriodInfo','$q','PlayerInfo', function(ProducerDecisionBase,ProducerDecision,Label, SeminarInfo, $http,$location,$filter, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                isReady : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/SD_bMListPrices.html',            
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
                    //ProducerDecisionBase.startListenChangeFromServer(); 
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
                scope.checkNextPriceBM=function(category,brandName,varName,location,additionalIdx,index,value){
                    var d=$q.defer();
                    var categoryID=0,max=0,currentUnitCost=0;
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
                        currentUnitCost=data.data.result;
                        if(value>4*currentUnitCost||value<0.5*currentUnitCost){
                            d.resolve(Label.getContent('Input range')+':'+0.5*currentUnitCost+'~'+4*currentUnitCost);
                        }else{
                            d.resolve();
                        }
                    },function(){
                        d.resolve(Label.getContent('fail'));
                    })
                    return d.promise;
                }

                scope.checkCurrentBM=function(category,brandName,varName,location,additionalIdx,index,value){
                    var d=$q.defer();
                    var categoryID=0,max=0,currentUnitCost=0;
                    var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a number'));
                    }
                    if(category=="Elecssories"){
                        categoryID=1;
                    }else{
                        categoryID=2;
                    }
                    var url='/checkProducerDecision/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+parseInt(PlayerInfo.getPlayer());
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){
                        if(data.data=="isReady"){
                            d.resolve(Label.getContent('Check Error'));
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
                        return $http({
                            method:'POST',
                            url:'/getCurrentUnitCost',
                            data:postData
                        });
                    }).then(function(data){
                        currentUnitCost=data.data.result;
                        if(value>4*currentUnitCost||value<0.5*currentUnitCost){
                            d.resolve(Label.getContent('Input range')+':'+0.5*currentUnitCost+'~'+4*currentUnitCost);
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
                                        products[count].nextPriceBM=parseFloat(products[count].nextPriceBM).toFixed(2);
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
                    if(scope.productes.length>1&&scope.producths.length>1){
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
                    }else{
                        return Label.getContent('Not sets'); 
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
                    loadSelectCategroy('Elecssories');
                    loadSelectCategroy('HealthBeauty');
                    scope.selectPacks=selectPacks;
                    scope.isResultShown = true;
                    scope.isPageLoading = false; 
                    //var categoryID=0,count=0,result=0,acMax=0,abMax=0,expend=0,avaiableMax=0;
                    // var url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/P/'+parseInt(PlayerInfo.getPlayer());
                    // $http({
                    //     method:'GET',
                    //     url:url
                    // }).then(function(data){
                    //     avaiableMax=data.data.budgetAvailable;
                    //     if(PeriodInfo.getCurrentPeriod()<=1){
                    //         abMax=data.data.budgetAvailable;
                    //     }else{
                    //         abMax=data.data.budgetAvailable+data.data.budgetSpentToDate;
                    //     }
                    //     acEleMax=data.data.productionCapacity[0];
                    //     acHeaMax=data.data.productionCapacity[1];
                    //     url="/producerExpend/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod())+'/'+parseInt(PlayerInfo.getPlayer())+'/brandName/location/1';
                    //     return  $http({
                    //         method:'GET',
                    //         url:url,
                    //     });
                    // }).then(function(data){
                    //     expend=data.data.result;
                    //     scope.surplusExpend=abMax-expend;
                    //     scope.percentageExpend=(abMax-expend)/abMax*100;
                    //     url="/productionResult/"+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+parseInt(PlayerInfo.getPlayer())+'/EName/varName';
                    //     return $http({
                    //         method:'GET',
                    //         url:url
                    //     });
                    // }).then(function(data){
                    //     scope.eleSurplusProduction=acEleMax-data.data.result;
                    //     scope.elePercentageProduction=(acEleMax-data.data.result)/acEleMax*100;
                    //     url="/productionResult/"+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+parseInt(PlayerInfo.getPlayer())+'/HName/varName';
                    //     return $http({
                    //         method:'GET',
                    //         url:url
                    //     });
                    // }).then(function(data){
                    //     scope.heaSurplusProduction=acHeaMax-data.data.result;
                    //     scope.heaPercentageProduction=(acHeaMax-data.data.result)/acHeaMax*100;
                    //     loadSelectCategroy('Elecssories');
                    //     loadSelectCategroy('HealthBeauty');
                    // }).then(function(){
                    //     scope.isResultShown = true;
                    //     scope.isPageLoading = false;  
                    //     scope.selectPacks=selectPacks;
                    // },function(data){
                    //     d.reject(Label.getContent('showView fail'));
                    // }); 
                    return d.promise;       
                }

                scope.submitDecision=function(){
                    var queryCondition={
                        producerID:parseInt(PlayerInfo.getPlayer()),
                        seminar:SeminarInfo.getSelectedSeminar(),
                        period:PeriodInfo.getCurrentPeriod()
                    }
                    $http({
                        method:'POST',
                        url:'/submitDecision',
                        data:queryCondition
                    }).then(function(data){
                        console.log(scope.isReady);
                        var postData={
                            period:PeriodInfo.getCurrentPeriod(),
                            seminar:SeminarInfo.getSelectedSeminar(),
                            draftedByCompanyID:PlayerInfo.getPlayer(),
                            producerID:PlayerInfo.getPlayer(),
                            retailerID:1
                        }
                        return $http({
                            method:'POST',
                            url:'/addContract',
                            data:postData
                        });
                    }).then(function(data){
                        postData={
                            period:PeriodInfo.getCurrentPeriod(),
                            seminar:SeminarInfo.getSelectedSeminar(),
                            draftedByCompanyID:PlayerInfo.getPlayer(),
                            producerID:PlayerInfo.getPlayer(),
                            retailerID:2
                        }
                        return $http({
                            method:'POST',
                            url:'/addContract',
                            data:postData
                        });
                    }).then(function(data){
                        var contractCode1='P'+PlayerInfo.getPlayer()+'andR1_'+SeminarInfo.getSelectedSeminar()+'_'+PeriodInfo.getCurrentPeriod();
                        (function multipleRequestShooter(products,idx){
                            postData={
                                contractCode:contractCode1,
                                brandName:products[idx].parentBrandName,
                                brandID:products[idx].parentBrandID,
                                varName:products[idx].varName,
                                varID:products[idx].varID
                            }
                            $http({
                                method:'POST',
                                url:'/addContractDetails',
                                data:postData
                            }).then(function(data){
                            
                            },function(data){

                            }).finally(function(){
                                if(idx<products.length-1){
                                    idx++;
                                    multipleRequestShooter(scope.productes,idx);
                                }
                            })
                        })(scope.productes,0);
                        var contractCode2='P'+PlayerInfo.getPlayer()+'andR1_'+SeminarInfo.getSelectedSeminar()+'_'+PeriodInfo.getCurrentPeriod();
                        (function multipleRequestShooter(products,idx){
                            postData={
                                contractCode:contractCode2,
                                brandName:products[idx].parentBrandName,
                                brandID:products[idx].parentBrandID,
                                varName:products[idx].varName,
                                varID:products[idx].varID
                            }
                            $http({
                                method:'POST',
                                url:'/addContractDetails',
                                data:postData
                            }).then(function(data){
                            
                            },function(data){

                            }).finally(function(){
                                if(idx<products.length-1){
                                    idx++;
                                    multipleRequestShooter(scope.producths,idx);
                                }
                            })
                        })(scope.producths,0);
                        var contractCode3='P'+PlayerInfo.getPlayer()+'andR2_'+SeminarInfo.getSelectedSeminar()+'_'+PeriodInfo.getCurrentPeriod();
                        (function multipleRequestShooter(products,idx){
                            postData={
                                contractCode:contractCode3,
                                brandName:products[idx].parentBrandName,
                                brandID:products[idx].parentBrandID,
                                varName:products[idx].varName,
                                varID:products[idx].varID
                            }
                            $http({
                                method:'POST',
                                url:'/addContractDetails',
                                data:postData
                            }).then(function(data){
                            
                            },function(data){

                            }).finally(function(){
                                if(idx<products.length-1){
                                    idx++;
                                    multipleRequestShooter(scope.productes,idx);
                                }
                            })
                        })(scope.productes,0);
                        var contractCode4='P'+PlayerInfo.getPlayer()+'andR2_'+SeminarInfo.getSelectedSeminar()+'_'+PeriodInfo.getCurrentPeriod();
                        (function multipleRequestShooter(products,idx){
                            postData={
                                contractCode:contractCode4,
                                brandName:products[idx].parentBrandName,
                                brandID:products[idx].parentBrandID,
                                varName:products[idx].varName,
                                varID:products[idx].varID
                            }
                            $http({
                                method:'POST',
                                url:'/addContractDetails',
                                data:postData
                            }).then(function(data){
                            
                            },function(data){

                            }).finally(function(){
                                if(idx<products.length-1){
                                    idx++;
                                    multipleRequestShooter(scope.producths,idx);
                                }else{
                                    scope.isCommitConfirmInfoShown=false;
                                }
                            })
                        })(scope.producths,0);
                    })
                }

                scope.$watch('isPageShown', function(newValue, oldValue){
                    if(newValue==true) {
                        initializePage();
                    }
                });
                // scope.$on('producerDecisionBaseChangedFromServer', function(event, newBase){
                //     ProducerDecisionBase.reload({producerID:parseInt(PlayerInfo.getPlayer()),period:PeriodInfo.getCurrentPeriod(),seminar:SeminarInfo.getSelectedSeminar()}).then(function(base){
                //         scope.pageBase = base; 
                //     }).then(function(){
                //         console.log('11111');
                //         return showView();
                //         console.log('2222');
                //     }), function(reason){
                //         console.log('from ctr: ' + reason);
                //     }, function(update){
                //         console.log('from ctr: ' + update);
                //     };
                // });

            }
        }
    }])
})