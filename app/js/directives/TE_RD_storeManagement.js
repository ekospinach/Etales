define(['directives', 'services'], function(directives){

    directives.directive('retailerStoreManagement', ['RetailerDecisionBase','RetailerDecision','Label','SeminarInfo','$http','$location','$filter','PeriodInfo','$q','PlayerInfo','$modal', function(RetailerDecisionBase,RetailerDecision,Label, SeminarInfo, $http,$location,$filter, PeriodInfo, $q,PlayerInfo,$modal){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                selectedPeriod : '=',
                selectedPlayer : '=',
                isContractDeal:'=',
                isContractFinalized:'=',
                isDecisionCommitted:'='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/RD_storeManagement.html',            
            link : function(scope, element, attrs){                   

                var initializePage = function() {
                    console.log('initializePage some small...');
                    scope.isPageLoading = true;
                    scope.isResultShown = false;
                    scope.Label = Label;
                    scope.showView = showView;
                    scope.currentPeriod = scope.selectedPeriod;
                    RetailerDecisionBase.getStore({
                        retailerID: parseInt(scope.selectedPlayer),
                        period: scope.selectedPeriod,
                        seminar: SeminarInfo.getSelectedSeminar().seminarCode
                    }).then(function(base) {
                        showView(base);
                        scope.isResultShown = true;
                        scope.isPageLoading = false;
                    }),
                    function(reason) {
                        console.log('from ctr: ' + reason);
                    },
                    function(update) {
                        console.log('from ctr: ' + update);
                    };
                }


                /*
                1. Order Volume：0~当前市场的Market Size(市场大小），
                Market Size =  quarterHistoryInfoSchema({seminar, period}).categoryview[当前产品的category-1].categoryMarketView[当前market-1].segmentsVolumes[4] (4 = Total, 0,1,2,3分别为该市场的4个细分市场）
                */
                scope.checkOrderVolume=function(category,market,brandName,varName,location,postion,addtionalIdx,value){
                    if(market=="Urban"){
                        market=1;
                    }else if(market=="Rural"){
                        market=2;
                    }
                    if(category=="Elecssories"){
                        category=1;
                    }else {
                        category=2;
                    }
                    var d=$q.defer();
                    var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a number'));
                    }else{
                        d.resolve();
                    }
                    // var url='/quarterHistoryInfo/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(scope.selectedPeriod-1);
                    // $http({
                    //     method:'GET',
                    //     url:url
                    // }).then(function(data){
                    //     console.log(data.data.categoryView[category-1].categoryMarketView[market-1].segmentsVolumes[4]);
                    //     if(value>data.data.categoryView[category-1].categoryMarketView[market-1].segmentsVolumes[4]){
                    //         d.resolve(Label.getContent('Input range')+':0~'+data.data.categoryView[category-1].categoryMarketView[market-1].segmentsVolumes[4]);
                    //     }else{
                    //         d.resolve();
                    //     }
                    // });
                    return d.promise;
                }
                /*Shelf space : 0~ 100%，每次给某一个市场内的某个产品分配份额或者减少份额，右上角的该市场的货架进度条 Avaiable Shelf space必须进行进行相应的减少或者增加。该市场内所有产品的份额相加不能大于100%。
                Retailer这里的两个进度条跟Producer有不同，Producer为Avaiable budeget和Avaiable capacity（根据不同category有两个不同的capacity进度条，label也要相应变化）分别是Avaiable budget和Avaiable Shelf space （根据不同市场显示两个不同的shelf space进度条，label也要相应变换）
                */
                scope.checkShelfSpace=function(category,market,brandName,varName,location,postion,addtionalIdx,value){
                    var d=$q.defer();
                    var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a number'));
                    }
                    if(value>100||value<5){
                        d.resolve(Label.getContent('Input range')+':5~100');
                    }else{
                        if(market=="Urban"){
                            market=1;
                        }else if(market=="Rural"){
                            market=2;
                        }
                        if(category=="Elecssories"){
                            category=1;
                        }else {
                            category=2;
                        }
                        var url="/retailerShelfSpace/"+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(scope.selectedPeriod)+'/'+parseInt(scope.selectedPlayer)+'/'+market+'/'+category+'/'+brandName+'/'+varName;
                        $http({
                            method:'GET',
                            url:url
                        }).then(function(data){
                            var exclude=Math.round(data.data.exclude*100*100)/100;

                            if(value>100-exclude){
                                d.resolve(Label.getContent('Input range')+':0~'+(100-exclude));
                            }else{
                                d.resolve();
                            }
                        })
                    }
                    return d.promise;
                }

                /*
                3.Retailer Price:  暂定为 0.5*listPrice ~ 3*listPrice。该产品listPrice获取方式（最后搞一个单独的函数）：
                if 该产品为Producer生产的普通老产品，则listPrice=varianthistory 该产品最近历史数据里的pv_NextPriceBM
                if 该产品为Producer当前阶段退出的新产品，则listPrice = 该产品生产商Step1中决定的Current BM Price
                if 该产品为Retailer自己生产的private label，则listPrice= 该产品的UnitCost（当前产品的Unitcost计算方法请求路由app.get('/productionCost’)获取，该服务还没完成）
                */
                scope.checkRetailerPrice=function(category,market,brandName,varName,location,postion,addtionalIdx,dateOfBirth,value){
                    if(market=="Urban"){
                        market=1;
                    }else if(market=="Rural"){
                        market=2;
                    }
                    if(category=="Elecssories"){
                        category=1;
                    }else {
                        category=2;
                    }
                    var d=$q.defer();
                    var url="",max=0;
                    var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a number'));
                    }
                    if(brandName.substring(brandName.length-1)<4){
                        //producer product
                        var url='/producerVariantBM/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+scope.selectedPeriod+'/'+brandName.substring(brandName.length-1)+'/'+category+'/'+brandName+'/'+varName;
                        $http({
                            method:'GET',
                            url:url
                        }).then(function(data){
                            max=data.data.result;
                            url='/getOneQuarterExogenousData/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+category+'/'+market + '/' + scope.selectedPeriod;
                            return $http({
                                method:'GET',
                                url:url
                            });
                        }).then(function(data){
                            if(value>max*data.data.MaxRetailPriceVsNetBMPrice||value<data.data.MinRetailPriceVsNetBMPrice*max){
                                d.resolve(Label.getContent('Input range')+':'+(Math.floor(data.data.MinRetailPriceVsNetBMPrice*max * 100) / 100)+'~'+(Math.floor(data.data.MaxRetailPriceVsNetBMPrice*max * 100) / 100));
                            }else{
                                d.resolve();
                            }
                        },function(data){
                            d.resolve(data.data.result);
                        });
                    }else{
                        //retailer variant
                        var postData = {
                            period : scope.selectedPeriod,
                            seminar : SeminarInfo.getSelectedSeminar().seminarCode,
                            brandName : brandName,
                            varName : varName,
                            catID : category,
                            userRole :  4,                      
                            userID : scope.selectedPlayer
                        };

                        $http({
                            method:'POST',
                            url:'/getCurrentUnitCost',
                            data:postData
                        }).then(function(data){
                            currentUnitCost=data.data.result;
                            url='/getOneQuarterExogenousData/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+category+'/'+market + '/' + scope.selectedPeriod;
                            return $http({
                                method:'GET',
                                url:url
                            });
                        }).then(function(data){
                            if(data.data && currentUnitCost){
                                if(value>data.data.MaxBMPriceVsCost*currentUnitCost||value<data.data.MinBMPriceVsCost*currentUnitCost){
                                    d.resolve(Label.getContent('Input range')+':'+(Math.floor(data.data.MinBMPriceVsCost*currentUnitCost * 100) / 100) +'~'+(Math.floor(data.data.MaxPLPriceVsCost*currentUnitCost * 100) / 100));
                                }else{
                                    d.resolve();
                                }                                
                            } else {
                                d.resolve('validation value undefined.');
                            }
                        },function(){
                            d.resolve(Label.getContent('fail'));
                        });
                    }
                    return d.promise;
                        
                }
                /*0-182*/
                scope.checkPromototionFrequency=function(pointer){
                    var d=$q.defer();
                    var filter=/^\d+$/;
                    var value=pointer.$data;
                    var rate=pointer.$$nextSibling.$data;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a Integer'));
                    }
                    if(value>26||value<0){
                        d.resolve(Label.getContent('Input range')+':0~26');
                    }else if(value==0&&rate!=0){
                        d.resolve(Label.getContent('check PromototionFrequency Error'));
                    }else{
                        d.resolve();
                    }
                    return d.promise;
                }
                /*0-100%*/
                scope.checkReductionRate=function(pointer){
                    var d=$q.defer();
                    var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
                    var value=pointer.$data;
                    var frequency=pointer.$$prevSibling.$data;

                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a number'));
                    }
                    if(value>100||value<0){
                        d.resolve(Label.getContent('Input range')+':0~100');
                    }else if(value==0&&frequency!=0){
                        d.resolve(Label.getContent('check ReductionRate Error'));
                    }else{
                        d.resolve();
                    }
                    return d.promise;               
                }

                scope.saveOrder=function(category,market,product){
                    if(market=="Urban"){
                        market=1;
                    }else if(market=="Rural"){
                        market=2;
                    }
                    if(category=="Elecssories"){
                        category=1;
                    }else {
                        category=2;
                    }
                    RetailerDecisionBase.saveOrder(category,market,product,'retailerStoreManagement');
                }

                var showView = function(data){
                    scope.RuralHelthBeautiesProducts = data.RuralHelthBeautiesProducts;
                    scope.UrbanHelthBeautiesProducts = data.UrbanHelthBeautiesProducts;
                    scope.RuralElecssoriesProducts = data.RuralElecssoriesProducts;
                    scope.UrbanElecssoriesProducts = data.UrbanElecssoriesProducts;
                    scope.RuralHelthBeautiesOrderProducts = data.RuralHelthBeautiesOrderProducts;
                    scope.UrbanHelthBeautiesOrderProducts = data.UrbanHelthBeautiesOrderProducts;
                    scope.RuralElecssoriesOrderProducts = data.RuralElecssoriesOrderProducts;
                    scope.UrbanElecssoriesOrderProducts = data.UrbanElecssoriesOrderProducts;
                }

                scope.open = function(category, market) {
                    scope.category = category;
                    scope.market = market;
                    if (category == 'HealthBeauties') {
                        if (market == 'Rural') {
                            scope.orderProducts = scope.RuralHelthBeautiesOrderProducts;
                        } else {
                            scope.orderProducts = scope.UrbanHelthBeautiesOrderProducts;
                        }
                    } else {
                        if (market == 'Rural') {
                            scope.orderProducts = scope.RuralElecssoriesOrderProducts;
                        } else {
                            scope.orderProducts = scope.UrbanElecssoriesOrderProducts;
                        }
                    }
                    var modalInstance = $modal.open({
                        templateUrl: '../../partials/modal/retailerOrderModal.html',
                        controller: retailerOrderModalCtrl
                    });

                    modalInstance.result.then(function() {
                        console.log('retailerNewProductModal');
                    })
                };
                
                var retailerOrderModalCtrl=function($rootScope,$scope,$modalInstance,Label,SeminarInfo,RoleInfo,PeriodInfo,PlayerInfo,ProducerDecisionBase){
                    $scope.Label=Label;
                    $scope.pageBase=scope.pageBase;
                    $scope.category=scope.category;
                    $scope.market=scope.market;
                    $scope.orderProducts=scope.orderProducts;
                    /*set add function is lauch new Brand*/
                    var close = function () {
                        $modalInstance.dismiss('cancel');
                        RetailerDecisionBase.getStore({retailerID:parseInt(scope.selectedPlayer),period:scope.selectedPeriod,seminar:SeminarInfo.getSelectedSeminar().seminarCode}).then(function(base){
                            showView(base);
                        }), function(reason){
                            console.log('from ctr: ' + reason);
                        }, function(update){
                            console.log('from ctr: ' + update);
                        };
                    };
                    var addOrders=function(market){
                        var ordersProducts=new Array();
                        for(var i=0;i<$scope.orderProducts.length;i++){
                            if($scope.orderProducts[i].select){
                                ordersProducts.push($scope.orderProducts[i]);
                            }
                        }
                        for(i=0;i<ordersProducts.length;i++){
                            ordersProducts[i].order=0,
                            ordersProducts[i].retailerPrice=(ordersProducts[i].currentPriceBM==undefined ? -1 : ordersProducts[i].currentPriceBM),
                            ordersProducts[i].shelfSpace=0,
                            ordersProducts[i].pricePromotions={
                                promo_Frequency:0,
                                promo_Rate:0
                            }
                        }
                        if(market=="Urban"){
                            RetailerDecisionBase.addOrders(1,ordersProducts,'retailerStoreManagement');
                        }
                        else{
                            RetailerDecisionBase.addOrders(2,ordersProducts,'retailerStoreManagement');
                        }
                        close();
                    }
                    $scope.close=close;
                    $scope.addOrders=addOrders;
                }

                
                scope.deleteOrder=function(category,market,brandName,varName){
                    if(market=="Urban"){
                        market=1;
                    }else{
                        market=2;
                    }
                    if(category=="Elecssories"){
                        category=1;
                    }else{
                        category=2;
                    }
                    RetailerDecisionBase.deleteOrder(market,category,brandName,varName,'retailerStoreManagement');
                }

                scope.$watch('isPageShown', function(newValue, oldValue){
                    if(newValue==true) {
                        initializePage();
                    }
                });

                scope.$on('retailerDecisionBaseChangedFromServer', function(event, data, newBase) {  
                    if(data.page=="retailerStoreManagement"){
                        showView(newBase);
                    }
                });
            }
        }
    }])
})
