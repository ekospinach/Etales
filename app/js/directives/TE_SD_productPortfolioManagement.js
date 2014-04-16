define(['directives', 'services'], function(directives){

    directives.directive('supplierProductPortfolioManagement', ['ProducerDecisionBase','ProducerDecision','Label','SeminarInfo','$http','$location','$filter','PeriodInfo','$q','PlayerInfo', function(ProducerDecisionBase,ProducerDecision,Label, SeminarInfo, $http,$location,$filter, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/SD_productPortfolioManagement.html',            
            link : function(scope, element, attrs){                   

                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    scope.packs = [{
                        value: 1, text: Label.getContent('ECONOMY')
                    },{
                        value: 2, text: Label.getContent('STANDARD')
                    },{
                        value: 3, text: Label.getContent('PREMIUM')
                    }]; 
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
                    var count=0;
                    var products=new Array();
                    console.log(scope.pageBase);
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
                                        products[count].currentPriceEmall=parseFloat(products[count].currentPriceEmall).toFixed(2);
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

                scope.selectPacks = function(category,parentBrandName,varName) {
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

                };

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

                var calculateBrandID=function(proBrandsDecision,producerID){
                    var result=0,min=10*producerID+1,max=producerID*10+5;
                    var nums=new Array();
                    for(var i=0;i<proBrandsDecision.proBrandsDecision.length;i++){
                        if(proBrandsDecision.proBrandsDecision[i]!=undefined&&proBrandsDecision.proBrandsDecision[i].brandID!=undefined&&proBrandsDecision.proBrandsDecision[i].brandID!=0){
                            nums.push(proBrandsDecision.proBrandsDecision[i].brandID);                      
                        }
                    }
                    nums.sort(function(a,b){return a>b?1:-1});
                    //未到最大值
                    if(max!=nums[nums.length-1]){
                        result=nums[nums.length-1]+1;
                    }
                    //已经到最大值 最小值删除
                    else if(min!=nums[0]){
                        result=min;
                    }
                    else{
                        for(var i=0;i<nums.length-1;i++){
                            if(nums[i+1]-nums[i]!=1){
                                result=nums[i]+1;
                                break;
                            }
                        }
                    }
                    return result;
                }

                var calculateVarID=function(proVarDecision,parentBrandID){
                    var result=0;min=parentBrandID*10+1,max=parentBrandID*10+3;
                    var nums=new Array();
                    for(var i=0;i<proVarDecision.proVarDecision.length;i++){
                        if(proVarDecision.proVarDecision[i]!=undefined&&proVarDecision.proVarDecision[i].varID!=0){
                            nums.push(proVarDecision.proVarDecision[i].varID);
                        }
                    }
                    nums.sort(function(a,b){return a>b?1:-1});
                    //未到最大值
                    if(max!=nums[nums.length-1]){
                        result=nums[nums.length-1]+1;
                    }
                    //已经到最大值 最小值删除
                    else if(min!=nums[0]){
                        result=min;
                    }
                    else{
                        result=min+1;
                    }
                    return result;
                }

                scope.deleteProduct=function(category,brandName,varName){
                    if(category=="Elecssories"){
                        category=1;
                    }else{
                        category=2;
                    }
                    ProducerDecisionBase.deleteProduct(category,brandName,varName); 
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
                })

            }
        }
    }])
})