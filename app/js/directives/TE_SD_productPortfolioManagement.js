define(['directives', 'services'], function(directives){

    directives.directive('supplierProductPortfolioManagement', ['ProducerDecisionBase','ProducerDecision','Label','SeminarInfo','$http','$location','$filter','PeriodInfo','$q','PlayerInfo','$modal', function(ProducerDecisionBase,ProducerDecision,Label, SeminarInfo, $http,$location,$filter, PeriodInfo, $q,PlayerInfo,$modal){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                isReady:'='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/SD_productPortfolioManagement.html',            
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
                    scope.parameter="NewBrand";/*default add new Brand*/
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
                    
                    if(scope.productes.length>1&&scope.producths.length>1){
                        if(category=="Elecssories"){
                            for(var i=0;i<scope.productes.length;i++){
                                if(scope.productes[i].parentBrandName==parentBrandName&&scope.productes[i].varName==varName){
                                    selected = $filter('filter')(scope.packs, {value: scope.productes[i].packFormat});
                                    postion=i;
                                    break;
                                }
                            }
                            if(postion!=-1&&selected!=undefined){
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
                            if(postion!=-1&&selected!=undefined){
                                return (scope.producths[postion].packFormat && selected.length) ? selected[0].text : Label.getContent('Not set'); 
                            }
                            else{
                                return Label.getContent('Not set'); 
                            }
                        }
                    }else{
                        return Label.getContent('Not set'); 
                    }
                    
                }

                scope.checkDesign=function(category,brandName,varName,location,additionalIdx,index,value){
                    var d = $q.defer(); 
                    var categoryID=0,max=0;
                    var filter=/^[0-9]*[1-9][0-9]*$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a Integer'));
                    }
                    var url='/checkProducerDecision/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+parseInt(PlayerInfo.getPlayer());
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){
                        if(data.data=="isReady"){
                            d.resolve(Label.getContent('Check Error'));
                        }
                        url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/P/'+parseInt(PlayerInfo.getPlayer());
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        if(category=="Elecssories"){
                            categoryID=1;
                            max=data.data.acquiredDesignLevel[categoryID-1];
                            if(value<1||value>max){
                                d.resolve(Label.getContent('Input range')+':1~'+max);
                            }else{
                                d.resolve();
                            }
                        }else{
                            categoryID=2;
                            max=data.data.acquiredTechnologyLevel[categoryID-1];
                            if(value<1||value>max){
                                d.resolve(Label.getContent('Input range')+':1~'+max);
                            }else{
                                d.resolve();
                            }
                        }
                    },function(){
                        d.resolve(Label.getContent('fail'));
                    });
                    return d.promise;
                }

                scope.checkTechnology=function(category,brandName,varName,location,additionalIdx,index,value){
                    var d=$q.defer();
                    var categoryID=0,max=0;
                    var filter=/^[0-9]*[1-9][0-9]*$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a Integer'));
                    }
                    var url='/checkProducerDecision/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+parseInt(PlayerInfo.getPlayer());
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){
                        if(data.data=="isReady"){
                            d.resolve(Label.getContent('Check Error'));
                        }
                        url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/P/'+parseInt(PlayerInfo.getPlayer());
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        if(category=="Elecssories"){
                            categoryID=1;
                            max=data.data.acquiredTechnologyLevel[categoryID-1];
                            if(value<1||value>max){
                                d.resolve(Label.getContent('Input range')+':1~'+max);
                            }else{
                                d.resolve();
                            }
                        }else{
                            categoryID=2;
                            max=data.data.acquiredTechnologyLevel[categoryID-1];
                            if(value<1||value>max){
                                d.resolve(Label.getContent('Input range')+':1~'+max);
                            }else{
                                d.resolve();
                            }
                        }
                    },function(){
                        console.log('fail');
                    });
                    return d.promise;
                }

                scope.checkValue=function(category,brandName,varName,location,additionalIdx,index,value){
                    var d=$q.defer();
                    var max=0;
                    var filter=/^[0-9]*[1-9][0-9]*$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a Integer'));
                    }
                    var url='/checkProducerDecision/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+parseInt(PlayerInfo.getPlayer());
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){
                        if(data.data=="isReady"){
                            d.resolve(Label.getContent('Check Error'));
                        }
                        url="/producerCurrentDecision/"+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+parseInt(PlayerInfo.getPlayer())+'/'+brandName+'/'+varName;
                        return $http({
                                method:'GET',
                                url:url
                        });
                    }).then(function(data){
                        max=data.data.composition[1]+2;
                        if(value<1||value>max){
                            d.resolve(Label.getContent('Input range')+':1~'+max);
                        }else{
                            d.resolve();
                        }
                    },function(){
                        d.resolve(Label.getContent('fail'));
                    });
                    return d.promise;
                }

                scope.openProductModal = function () {
                    var modalInstance=$modal.open({
                        templateUrl:'../../partials/modal/supplierNewProductModal.html',
                        controller:supplierNewProductModalCtrl
                    });

                    modalInstance.result.then(function(){
                        console.log('supplierNewProductModal');
                    })
                };
                var supplierNewProductModalCtrl=function($rootScope,$scope,$modalInstance,Label,SeminarInfo,RoleInfo,PeriodInfo,PlayerInfo,ProducerDecisionBase){
                    $scope.Label=Label;
                    $scope.pageBase=scope.pageBase;
                    var setAddNewBrand=function(){
                        $scope.parameter="NewBrand";/*add new Brand*/
                        $scope.newBrand=true;
                        $scope.newVariant=false;
                        $scope.lauchNewCategory=1;
                        setBrandName($scope.lauchNewCategory);
                    } 
                    var setAddNewProUnderBrand=function(){
                        $scope.parameter="ExistedBrand";/*add new product under existed Brand*/
                        $scope.newBrand=false;
                        $scope.newVariant=true;
                        $scope.addNewCategory=1;
                        loadAllBrand($scope.addNewCategory);
                    }
                    var setBrandName=function(category){
                        if(category==1){
                            category="Elecssories";
                            $scope.brandFirstName="E";
                            $scope.lauchNewCategory=1;
                        }else{
                            category="HealthBeauty";
                            $scope.brandFirstName="H";
                            $scope.lauchNewCategory=2;
                        }
                        $scope.brandLastName=parseInt(PlayerInfo.getPlayer());/*need check*/
                    }
                    var cancel = function () {
                        ProducerDecisionBase.reload({producerID:parseInt(PlayerInfo.getPlayer()),period:PeriodInfo.getCurrentPeriod(),seminar:SeminarInfo.getSelectedSeminar()}).then(function(base){
                            scope.pageBase = base; 
                        }).then(function(){
                            return showView();
                        }), function(reason){
                            console.log('from ctr: ' + reason);
                        }, function(update){
                            console.log('from ctr: ' + update);
                        };
                    };
                    var loadByCategroy=function(category){
                        return _.filter($scope.pageBase.proCatDecision,function(obj){
                            if(category=="HealthBeauty"){
                                return (obj.categoryID==2);
                            }else{
                                return (obj.categoryID==1);
                            }
                        });
                    }
                    var loadAllBrand=function(category){
                        $scope.addNewCategory=category;
                        if(category==1){
                            category="Elecssories";
                        }else{
                            category="HealthBeauty";
                        }
                        var allCatProDecisions=loadByCategroy(category);
                        var allBrands=new Array();
                        for(var i=0;i<allCatProDecisions.length;i++){
                            for(var j=0;j<allCatProDecisions[i].proBrandsDecision.length;j++){
                                if(allCatProDecisions[i].proBrandsDecision[j]!=undefined&&allCatProDecisions[i].proBrandsDecision[j].brandID!=undefined&&allCatProDecisions[i].proBrandsDecision[j].brandID!=0){
                                    allBrands.push({'BrandID':allCatProDecisions[i].proBrandsDecision[j].brandID,'BrandName':allCatProDecisions[i].proBrandsDecision[j].brandName});                            
                                }
                            }   
                        }
                        $scope.allBrands=allBrands;
                        $scope.addChooseBrand=allBrands[0].BrandID;
                    }
                    var showbubleMsg = function(content, status){
                        $scope.bubleMsg = ' ' + content;
                        switch(status){
                            case 1: 
                                $scope.bubleClassName = 'alert alert-danger'; 
                                $scope.bubleTitle = Label.getContent('Error')+'!';
                                break;
                            case 2: 
                                $scope.bubleClassName = 'alert alert-success'; 
                                $scope.bubleTitle = Label.getContent('Success')+'!';
                                break;
                            case 3:
                                $scope.bubleClassName = 'alert alert-block'; 
                                $scope.bubleTitle = Label.getContent('Warning')+'!';
                                break;              
                            default:
                             $scope.bubleClassName = 'alert'; 
                        }
                        $scope.infoBuble = true;
                    }
                    var addNewProduct=function(parameter){
                        var newBrand=new ProducerDecision();
                        var nullDecision=new ProducerDecision();
                        nullDecision.packFormat="ECONOMY";
                        nullDecision.dateOfBirth=0;
                        nullDecision.dateOfDeath=0;
                        nullDecision.composition=new Array(1,1,1);
                        nullDecision.production=0;
                        nullDecision.currentPriceBM=0;
                        nullDecision.discontinue=false;
                        nullDecision.nextPriceBM=0;
                        nullDecision.parentBrandID=0;
                        nullDecision.varName="";/*need check*/
                        nullDecision.varID=0;/*need check*/
                        nullDecision.onlinePrice=0;
                        nullDecision.onlinePlannedVolume=0;
                        nullDecision.pricePromotions={
                            promo_Frequency : 0, //range: 0~52
                            promo_Rate : 0 //0~1        
                        };

                        var newproducerDecision=new ProducerDecision();
                        newproducerDecision.packFormat="ECONOMY";
                        newproducerDecision.dateOfBirth=PeriodInfo.getCurrentPeriod();
                        newproducerDecision.dateOfDeath=10;
                        newproducerDecision.composition=new Array(1,1,1);
                        newproducerDecision.production=0;
                        newproducerDecision.currentPriceBM=0;
                        newproducerDecision.discontinue=false;
                        newproducerDecision.nextPriceBM=0;
                        newproducerDecision.onlinePrice=0;
                        newproducerDecision.onlinePlannedVolume=0;
                        newproducerDecision.pricePromotions={
                            promo_Frequency : 0, //range: 0~52
                            promo_Rate : 0 //0~1        
                        };
                        var url="";
                        if(parameter=="NewBrand"){/*lauch new Brand*/
                            var proBrandsDecision=_.find($scope.pageBase.proCatDecision,function(obj){
                                return (obj.categoryID==$scope.lauchNewCategory);
                            });
                            newBrand.brandID=calculateBrandID(proBrandsDecision,PlayerInfo.getPlayer());
                            newBrand.brandName=$scope.brandFirstName+myForm[1][1].value+parseInt(PlayerInfo.getPlayer());
                            newBrand.paranetCompanyID=PlayerInfo.getPlayer();
                            newBrand.dateOfDeath=10;
                            newBrand.dateOfBirth=PeriodInfo.getCurrentPeriod();
                            newBrand.advertisingOffLine=new Array(0,0);
                            newBrand.advertisingOnLine=0;
                            newBrand.supportEmall=0;
                            newBrand.supportTraditionalTrade=new Array(0,0);
                            newBrand.proVarDecision=new Array();
                            newproducerDecision.parentBrandID=newBrand.brandID;
                            newproducerDecision.varName='_'+myForm[1][2].value;/*need check*/
                            newproducerDecision.varID=10*newBrand.brandID+1;/*need check*/
                            //need add 2 null vars
                            newBrand.proVarDecision.push(newproducerDecision,nullDecision,nullDecision);

                            url="/checkProducerProduct/"+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+parseInt(PlayerInfo.getPlayer())+'/'+$scope.lauchNewCategory+'/brand/'+newBrand.brandName+'/'+newproducerDecision.varName;
                            $http({
                                method:'GET',
                                url:url
                            }).then(function(data){
                                ProducerDecisionBase.addProductNewBrand(newBrand,$scope.lauchNewCategory);
                                showbubleMsg(Label.getContent('Add new brand successful'),2);
                                cancel();
                            },function(data){
                                showbubleMsg(Label.getContent('Add new brand fail')+','+Label.getContent(data.data.message),1);
                            })
                        }else{/*add new product under existed Brand*/
                            var proBrandsDecision=_.find($scope.pageBase.proCatDecision,function(obj){
                                return (obj.categoryID==$scope.addNewCategory);
                            });
                            newproducerDecision.parentBrandID=parseInt(myForm[1][4].value);
                            newproducerDecision.varName='_'+myForm[1][5].value;/*need check*/
                            var proVarDecision=_.find(proBrandsDecision.proBrandsDecision,function(obj){
                                return (obj.brandID==newproducerDecision.parentBrandID);
                            });
                            newproducerDecision.varID=calculateVarID(proVarDecision,newproducerDecision.parentBrandID);//121;/*need check*/
                            var newBrandName=""; 
                            for(var i=0;i<$scope.allBrands.length;i++){
                                if($scope.allBrands[i].BrandID==newproducerDecision.parentBrandID){
                                    newBrandName=$scope.allBrands[i].BrandName;
                                    break;
                                }
                            }
                            url="/checkProducerProduct/"+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+parseInt(PlayerInfo.getPlayer())+'/'+$scope.lauchNewCategory+'/variant/'+newBrandName+'/'+newproducerDecision.varName;
                            
                            $http({
                                method:'GET',
                                url:url
                            }).then(function(data){
                                ProducerDecisionBase.addProductExistedBrand(newproducerDecision,$scope.addNewCategory,newBrandName);
                                showbubleMsg(Label.getContent('Add new variant successful'),2);
                                cancel();
                            },function(data){
                                showbubleMsg(Label.getContent('Add new variant fail')+','+Label.getContent(data.data.message),1);
                            })
                        }
                    }
                    $scope.setAddNewBrand=setAddNewBrand;
                    $scope.setAddNewProUnderBrand=setAddNewProUnderBrand;
                    $scope.addNewProduct=addNewProduct;
                    $scope.setBrandName=setBrandName;
                    $scope.loadAllBrand=loadAllBrand;
                    $scope.loadByCategroy=loadByCategroy;
                    $scope.showbubleMsg=showbubleMsg;
                    setAddNewBrand();
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

                    var cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                    $scope.cancel=cancel;
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
                    loadSelectCategroy('Elecssories');
                    loadSelectCategroy('HealthBeauty');
                    scope.selectPacks=selectPacks;
                    scope.isResultShown = true;
                    scope.isPageLoading = false;  
                    // var categoryID=0,count=0,result=0,acMax=0,abMax=0,expend=0,avaiableMax=0;
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
                        console.log('successful');
                    },function(err){
                        console.log('fail');
                    })
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