define(['directives', 'services'], function(directives){

    directives.directive('retailerStoreManagement', ['RetailerDecisionBase','RetailerDecision','Label','SeminarInfo','$http','$location','$filter','PeriodInfo','$q','PlayerInfo', function(RetailerDecisionBase,RetailerDecision,Label, SeminarInfo, $http,$location,$filter, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/RD_storeManagement.html',            
            link : function(scope, element, attrs){                   

                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    scope.open=open;
                    scope.close=close;
                    scope.showView=showView;
                    scope.currentPeriod=PeriodInfo.getCurrentPeriod();
                    RetailerDecisionBase.startListenChangeFromServer();
                    RetailerDecisionBase.reload({retailerID:parseInt(PlayerInfo.getPlayer()),period:PeriodInfo.getCurrentPeriod(),seminar:SeminarInfo.getSelectedSeminar()}).then(function(base){
                        scope.pageBase = base;
                    }).then(function(){
                        return showView('Elecssories','Rural');
                    }), function(reason){
                        console.log('from ctr: ' + reason);
                    }, function(update){
                        console.log('from ctr: ' + update);
                    };                 
                }

                var loadSelectCategroy=function(market,category){
                    var retMarketDecisions=_.filter(scope.pageBase.retMarketDecision,function(obj){
                        return (obj.marketID==market);
                    });
                    return _.filter(retMarketDecisions[0].retMarketAssortmentDecision,function(obj){
                        return (obj.categoryID==category);
                    })
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
                    }else if(category=="HealthBeauty"){
                        category=2;
                    }
                    var d=$q.defer();
                    var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a number'));
                    }
                    var max=0;
                    
                    var url='/quarterHistoryInfo/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
                    $http({method:'GET',url:url}).then(function(data){
                        max=data.data.categoryView[category-1].categoryMarketView[market-1].segmentsVolumes[4];
                        if(value>max||value<0){
                            d.resolve(Label.getContent('Input range')+':0~'+max);
                        }else{
                            d.resolve();
                        }
                    },function(){
                        d.resolve(Label.getContent('fail'));
                    })
                    return d.promise;
                }
                /*Shelf space : 0~剩余的货架份额。总货架份额（每个市场，每个阶段）= 100%，每次给某一个市场内的某个产品分配份额或者减少份额，右上角的该市场的货架进度条 Avaiable Shelf space必须进行进行相应的减少或者增加。该市场内所有产品的份额相加不能大于100%。
                Retailer这里的两个进度条跟Producer有不同，Producer为Avaiable budeget和Avaiable capacity（根据不同category有两个不同的capacity进度条，label也要相应变化）分别是Avaiable budget和Avaiable Shelf space （根据不同市场显示两个不同的shelf space进度条，label也要相应变换）
                */
                scope.checkShelfSpace=function(category,market,brandName,varName,location,postion,addtionalIdx,value){
                    if(market=="Urban"){
                        market=1;
                    }else if(market=="Rural"){
                        market=2;
                    }
                    if(category=="Elecssories"){
                        category=1;
                    }else if(category=="HealthBeauty"){
                        category=2;
                    }
                    var d=$q.defer(),max=0;
                    var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a number'));
                    }
                
                    var url="/retailerShelfSpace/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod())+'/'+parseInt(PlayerInfo.getPlayer())+'/'+market+'/'+category+'/'+brandName+'/'+varName;
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){
                        max=100-data.data.exclude*100;
                        if(value>max||value<0){
                            d.resolve(Label.getContent('Input range')+':0~'+max);
                        }else{
                            d.resolve();
                        }
                    })
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
                    }else if(category=="HealthBeauty"){
                        category=2;
                    }
                    var d=$q.defer();
                    var url="",max=0;
                    var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a number'));
                    }
                    if(brandName.substring(brandName.length-1)<4){
                        //producer
                        if(dateOfBirth<PeriodInfo.getCurrentPeriod()){//old variant
                            url="/variantHistoryInfo/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+brandName+'/'+varName;
                            $http({method:'GET',url:url}).then(function(data){
                                max=data.data.supplierView[0].nextPriceBM;
                                if(value>max*3||value<0.5*max){
                                    d.resolve(Label.getContent('Input range')+':'+0.5*max+'~'+3*max);
                                }else{
                                    d.resolve();
                                }
                            },function(){
                                d.resolve(Label.getContent('fail'));
                            })
                        }else{//new variant
                            url='/producerVariantBM/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+brandName.substring(brandName.length-1)+'/'+category+'/'+brandName+'/'+varName;
                            $http({
                                method:'GET',
                                url:url
                            }).then(function(data){
                                max=data.data.result;
                                if(value>max*3||value<0.5*max){
                                    d.resolve(Label.getContent('Input range')+':'+0.5*max+'~'+3*max);
                                }else{
                                    d.resolve();
                                }
                            });
                        }
                    }else{
                        //retailer variant
                        var postData = {
                            period : PeriodInfo.getCurrentPeriod(),
                            seminar : SeminarInfo.getSelectedSeminar(),
                            brandName : brandName,
                            varName : varName,
                            catID : category,
                            userRole :  4,                      
                            userID : PlayerInfo.getPlayer(),
                        }   
                        $http({
                            method:'POST',
                            url:'/getCurrentUnitCost',
                            data:postData
                        }).then(function(data){
                            currentUnitCost=data.data.result;
                            if(value>3*currentUnitCost||value<0.5*currentUnitCost){
                                d.resolve(Label.getContent('Input range')+':'+0.5*currentUnitCost+'~'+3*currentUnitCost);
                            }else{
                                d.resolve();
                            }
                        },function(){
                            d.resolve(Label.getContent('fail'));
                        })
                    }
                    return d.promise;
                        
                }
                /*0-26*/
                scope.checkPromototionFrequency=function(value){
                    var d=$q.defer();
                    var filter=/^\d+$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a Integer'));
                    }
                    if(value>26||value<0){
                        d.resolve(Label.getContent('Input range')+':0~26');
                    }else{
                        d.resolve();
                    }
                    return d.promise;
                }
                /*1-100%*/
                scope.checkReductionRate=function(value){
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

                scope.updateRetailerDecision=function(category,market,brandName,varName,location,postion,addtionalIdx,value){
                    if(market=="Urban"){
                        market=1;
                    }else if(market=="Rural"){
                        market=2;
                    }
                    if(category=="Elecssories"){
                        category=1;
                    }else if(category=="HealthBeauty"){
                        category=2;
                    }
                    if(location=="pricePromotions"&&postion=="promo_Frequency"){
                        RetailerDecisionBase.setRetailerDecision(category,market,brandName,varName,location,postion,value);                  
                    }else if(location=="pricePromotions"&&postion=="promo_Rate"){
                        RetailerDecisionBase.setRetailerDecision(category,market,brandName,varName,location,postion,value/100);
                    }else if(location=="shelfSpace"){
                        RetailerDecisionBase.setRetailerDecision(category,market,brandName,varName,location,postion,value/100);                 
                    }else{
                        RetailerDecisionBase.setRetailerDecision(category,market,brandName,varName,location,postion,value);                   
                    }
                }

                // var showView=function(category,market){
                //     var d=$q.defer();
                //     var categoryID=0,count=0,result=0,expend=0,marketID=0;
                //     scope.category=category;scope.market=market;
                //     if(category=="HealthBeauties"){
                //         category=2;
                //     }else{
                //         category=1;
                //     }
                //     if(market=="Rural"){
                //         market=2;
                //     }else{
                //         market=1;
                //     }
                //     var orderProducts=new Array();
                //     var url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/R/'+parseInt(PlayerInfo.getPlayer());
                //     $http({
                //         method:'GET',
                //         url:url
                //     }).then(function(data){
                //         if(PeriodInfo.getCurrentPeriod()>=2){
                //             abMax=data.data.budgetAvailable+data.data.budgetSpentToDate;
                //         }else{
                //             abMax=data.data.budgetAvailable;
                //         }
                //         scope.abMax=abMax;
                //         url="/retailerExpend/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod())+'/'+parseInt(PlayerInfo.getPlayer())+'/-1/location/1';
                //         return $http({
                //             method:'GET',
                //             url:url
                //         });
                //     }).then(function(data){
                //         expend=data.data.result;
                //         scope.surplusExpend=abMax-expend;
                //         scope.percentageExpend=(abMax-expend)/abMax*100;
                //         url="/retailerShelfSpace/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod())+'/'+parseInt(PlayerInfo.getPlayer())+'/-1/0/brandName/varName';
                //         return $http({
                //             method:'GET',
                //             url:url
                //         });
                //     }).then(function(data){
                //         scope.surplusShelf=new Array();
                //         scope.percentageShelf=new Array();
                //         scope.surplusShelf[0]=new Array();
                //         scope.surplusShelf[1]=new Array();
                //         scope.percentageShelf[0]=new Array();
                //         scope.percentageShelf[1]=new Array();
                //         scope.surplusShelf[0][0]=data.data.result[0][0];
                //         scope.surplusShelf[0][1]=data.data.result[0][1];
                //         scope.surplusShelf[1][0]=data.data.result[1][0];
                //         scope.surplusShelf[1][1]=data.data.result[1][1];
                //         scope.percentageShelf[0][0]=(1-scope.surplusShelf[0][0])*100;
                //         scope.percentageShelf[0][1]=(1-scope.surplusShelf[0][1])*100;
                //         scope.percentageShelf[1][0]=(1-scope.surplusShelf[1][0])*100;
                //         scope.percentageShelf[1][1]=(1-scope.surplusShelf[1][1])*100;
                //         scope.showSurplusShelf=scope.percentageShelf[market-1][category-1];
                //         scope.showPercentageShelf=scope.percentageShelf[market-1][category-1];

                //         var allRetCatDecisions=loadSelectCategroy(market,category);
                //         var products=new Array();
                //         for(var i=0;i<allRetCatDecisions.length;i++){
                //             for(var j=0;j<allRetCatDecisions[i].retVariantDecision.length;j++){
                //                 if(allRetCatDecisions[i].retVariantDecision[j].brandID!=0&&allRetCatDecisions[i].retVariantDecision[j].variantID!=0){
                //                     if(allRetCatDecisions[i].retVariantDecision[j].pricePromotions.promo_Rate>=0&&allRetCatDecisions[i].retVariantDecision[j].pricePromotions.promo_Rate<1){
                //                         allRetCatDecisions[i].retVariantDecision[j].pricePromotions.promo_Rate*=100;
                //                     }
                //                     if(allRetCatDecisions[i].retVariantDecision[j].shelfSpace>=0&&allRetCatDecisions[i].retVariantDecision[j].shelfSpace<1){
                //                         allRetCatDecisions[i].retVariantDecision[j].shelfSpace*=100;
                //                         allRetCatDecisions[i].retVariantDecision[j].shelfSpace=parseFloat(allRetCatDecisions[i].retVariantDecision[j].shelfSpace).toFixed(2);
                //                     }
                //                     allRetCatDecisions[i].retVariantDecision[j].retailerPrice=parseFloat(allRetCatDecisions[i].retVariantDecision[j].retailerPrice).toFixed(2);
                //                     products.push(allRetCatDecisions[i].retVariantDecision[j]);
                //                     count++;
                //                 }
                //             }
                //         }
                //         scope.products=products;
                //         //添加retailer load
                //         url='/retailerProducts/'+parseInt(PlayerInfo.getPlayer())+'/'+PeriodInfo.getCurrentPeriod()+'/'+SeminarInfo.getSelectedSeminar()+'/'+category;
                //         return $http({
                //             method:'GET',
                //             url:url
                //         });
                //     }).then(function(data){
                //         for(var i=0;i<data.data.length;i++){
                //             if(data.data[i].brandID!=0&&data.data[i].varID!=0){
                //                 data.data[i].variantID=data.data[i].varID;
                //                 data.data[i].select=false;
                //                 orderProducts.push(data.data[i]);
                //             }
                //         }
                //         var urls=new Array();
                //         var checkurls=new Array();
                //         for(i=0;i<3;i++){
                //             urls[i]='/producerProducts/'+(i+1)+'/'+PeriodInfo.getCurrentPeriod()+'/'+SeminarInfo.getSelectedSeminar()+'/'+category;
                //             checkurls[i]='/checkProducerDecision/'+SeminarInfo.getSelectedSeminar()+'/'+(i+1);
                //         }
                //         (function multipleRequestShooter(checkurls,urls,idx){
                //             $http({
                //                 method:'GET',
                //                 url:checkurls[idx]
                //             }).then(function(data){
                //                 if(data.data=="unReady"){
                //                     urls[idx]="/";
                //                 }
                //                 return $http({
                //                     method:'GET',
                //                     url:urls[idx]
                //                 });
                //             }).then(function(data){
                //                 if(data.data.length<100){
                //                     for(var j=0;j<data.data.length;j++){
                //                         if(data.data[j].brandID!=undefined&&data.data[j].brandID!=0&&data.data[j].varID!=0){
                //                             data.data[j].variantID=data.data[j].varID;
                //                             data.data[j].select=false;
                //                             orderProducts.push(data.data[j]);
                //                         }
                //                     }
                //                 }
                //             },function(data){

                //             }).finally(function(){
                //                 if(idx!=2){
                //                     idx++;
                //                     multipleRequestShooter(checkurls,urls,idx);
                //                 }else{
                //                     scope.orderProducts=orderProducts;
                //                     var indexs=new Array();
                //                     for(i=0;i<scope.orderProducts.length;i++){
                //                         for(j=0;j<scope.products.length;j++){
                //                             if(scope.orderProducts[i].brandName==scope.products[j].brandName&&scope.orderProducts[i].varName==scope.products[j].varName){
                //                                 indexs.push(i);
                //                             }
                //                         }
                //                     }
                //                     for(i=indexs.length-1;i>=0;i--){
                //                         scope.orderProducts.splice(indexs[i],1);
                //                     }
                //                     d.resolve();
                //                 }
                //             })
                //         })(checkurls,urls,0);
                //     }).then(function(){
                //         scope.isResultShown = true;
                //         scope.isPageLoading = false;   
                //     },function(){
                //         d.reject(Label.getContent('showView fail'));
                //     });
                //     return d.promise;
                // }

                var showView=function(category,market){
                    var d=$q.defer();
                    var categoryID=0,count=0,result=0,expend=0,marketID=0;
                    scope.category=category;scope.market=market;
                    if(category=="HealthBeauties"){
                        category=2;
                    }else{
                        category=1;
                    }
                    if(market=="Rural"){
                        market=2;
                    }else{
                        market=1;
                    }
                    var orderProducts=new Array();
                    var allRetCatDecisions=loadSelectCategroy(market,category);
                    var products=new Array();
                    for(var i=0;i<allRetCatDecisions.length;i++){
                        for(var j=0;j<allRetCatDecisions[i].retVariantDecision.length;j++){
                            if(allRetCatDecisions[i].retVariantDecision[j].brandID!=0&&allRetCatDecisions[i].retVariantDecision[j].variantID!=0){
                                if(allRetCatDecisions[i].retVariantDecision[j].pricePromotions.promo_Rate>=0&&allRetCatDecisions[i].retVariantDecision[j].pricePromotions.promo_Rate<1){
                                    allRetCatDecisions[i].retVariantDecision[j].pricePromotions.promo_Rate*=100;
                                }
                                if(allRetCatDecisions[i].retVariantDecision[j].shelfSpace>=0&&allRetCatDecisions[i].retVariantDecision[j].shelfSpace<1){
                                    allRetCatDecisions[i].retVariantDecision[j].shelfSpace*=100;
                                    allRetCatDecisions[i].retVariantDecision[j].shelfSpace=parseFloat(allRetCatDecisions[i].retVariantDecision[j].shelfSpace).toFixed(2);
                                }
                                allRetCatDecisions[i].retVariantDecision[j].order=parseFloat(allRetCatDecisions[i].retVariantDecision[j].order).toFixed(2);
                                allRetCatDecisions[i].retVariantDecision[j].retailerPrice=parseFloat(allRetCatDecisions[i].retVariantDecision[j].retailerPrice).toFixed(2);
                                products.push(allRetCatDecisions[i].retVariantDecision[j]);
                                count++;
                            }
                        }
                    }
                    scope.products=products;
                    //添加retailer load
                    var url='/retailerProducts/'+parseInt(PlayerInfo.getPlayer())+'/'+PeriodInfo.getCurrentPeriod()+'/'+SeminarInfo.getSelectedSeminar()+'/'+category;
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){
                        for(var i=0;i<data.data.length;i++){
                            if(data.data[i].brandID!=0&&data.data[i].varID!=0){
                                data.data[i].variantID=data.data[i].varID;
                                data.data[i].select=false;
                                orderProducts.push(data.data[i]);
                            }
                        }
                        var urls=new Array();
                        var checkurls=new Array();
                        for(i=0;i<3;i++){
                            urls[i]='/producerProducts/'+(i+1)+'/'+PeriodInfo.getCurrentPeriod()+'/'+SeminarInfo.getSelectedSeminar()+'/'+category;
                            checkurls[i]='/checkProducerDecision/'+SeminarInfo.getSelectedSeminar()+'/'+(i+1);
                        }
                        (function multipleRequestShooter(checkurls,urls,idx){
                            $http({
                                method:'GET',
                                url:checkurls[idx]
                            }).then(function(data){
                                // if(data.data=="unReady"){
                                //     urls[idx]="/";
                                // }
                                return $http({
                                    method:'GET',
                                    url:urls[idx]
                                });
                            }).then(function(data){
                                if(data.data.length<100){
                                    for(var j=0;j<data.data.length;j++){
                                        if(data.data[j].brandID!=undefined&&data.data[j].brandID!=0&&data.data[j].varID!=0){
                                            data.data[j].variantID=data.data[j].varID;
                                            data.data[j].select=false;
                                            orderProducts.push(data.data[j]);
                                        }
                                    }
                                }
                            },function(data){

                            }).finally(function(){
                                if(idx!=2){
                                    idx++;
                                    multipleRequestShooter(checkurls,urls,idx);
                                }else{
                                    scope.orderProducts=orderProducts;
                                    var indexs=new Array();
                                    for(i=0;i<scope.orderProducts.length;i++){
                                        for(j=0;j<scope.products.length;j++){
                                            if(scope.orderProducts[i].brandName==scope.products[j].brandName&&scope.orderProducts[i].varName==scope.products[j].varName){
                                                indexs.push(i);
                                            }
                                        }
                                    }
                                    for(i=indexs.length-1;i>=0;i--){
                                        scope.orderProducts.splice(indexs[i],1);
                                    }
                                    scope.isResultShown = true;
                                    scope.isPageLoading = false;
                                    d.resolve();
                                }
                            })
                        })(checkurls,urls,0); 
                    },function(){
                        d.reject(Label.getContent('showView fail'));
                    });
                    return d.promise;
                }

                var open = function () {
                    scope.shouldBeOpen = true;
                };
                var close = function () {
                    scope.shouldBeOpen = false;
                    RetailerDecisionBase.reload({retailerID:parseInt(PlayerInfo.getPlayer()),period:PeriodInfo.getCurrentPeriod(),seminar:SeminarInfo.getSelectedSeminar()}).then(function(base){
                        scope.pageBase = base;
                    }).then(function(){
                        return showView(scope.category,scope.market);
                    }), function(reason){
                        console.log('from ctr: ' + reason);
                    }, function(update){
                        console.log('from ctr: ' + update);
                    };
                };
                scope.addOrders=function(market){
                    var ordersProducts=new Array();
                    for(var i=0;i<scope.orderProducts.length;i++){
                        if(scope.orderProducts[i].select){
                            ordersProducts.push(scope.orderProducts[i]);
                        }
                    }
                    for(i=0;i<ordersProducts.length;i++){
                        ordersProducts[i].order=0,
                        ordersProducts[i].retailerPrice=0,
                        ordersProducts[i].shelfSpace=0,
                        ordersProducts[i].pricePromotions={
                            promo_Frequency:0,
                            promo_Rate:0
                        }
                    }
                    if(market=="Urban"){
                        RetailerDecisionBase.addOrders(1,ordersProducts);
                    }
                    else{
                        RetailerDecisionBase.addOrders(2,ordersProducts);
                    }
                    close();
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
                    RetailerDecisionBase.deleteOrder(market,category,brandName,varName);
                    close();
                }

                scope.$watch('isPageShown', function(newValue, oldValue){
                    if(newValue==true) {
                        initializePage();
                    }
                });
                scope.$on('retailerDecisionBaseChangedFromServer', function(event, newBase){
                    RetailerDecisionBase.reload({retailerID:parseInt(PlayerInfo.getPlayer()),period:PeriodInfo.getCurrentPeriod(),seminar:SeminarInfo.getSelectedSeminar()}).then(function(base){
                        scope.pageBase = base;
                    }).then(function(){
                        return showView(scope.category,scope.market);
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
