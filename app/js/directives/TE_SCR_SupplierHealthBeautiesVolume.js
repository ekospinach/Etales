define(['directives', 'services'], function(directives){
    directives.directive('supplierHealthBeautiesVolume', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/SCR_supplierHealthBeautiesVolume.html',            
            link : function(scope, element, attrs){                   
                                             
                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var loadVolume=function(data,category){
		    		scope.products=new Array();
		    		var varName,brandName,initial,production,sales,discontinued,closing;
		    		for(var i=0;i<data.data[0].scrviv_Initial.length;i++){
		    			if(data.data[0].scrviv_Initial[i].parentCategoryID==category){
		    				varName=data.data[0].scrviv_Initial[i].variantName;
		    				brandName=data.data[0].scrviv_Initial[i].parentBrandName;
		    				initial=data.data[0].scrviv_Initial[i];

		    				production=_.find(data.data[0].scrviv_Production,function(obj){
		    					return (obj.variantName==varName&&obj.parentBrandName==brandName);
		    				});
		    				sales=_.find(data.data[0].scrviv_Sales,function(obj){
		    					return (obj.variantName==varName&&obj.parentBrandName==brandName);
		    				});
		    				discontinued=_.find(data.data[0].scrviv_Discontinued,function(obj){
		    					return (obj.variantName==varName&&obj.parentBrandName==brandName);
		    				});
		    				closing=_.find(data.data[0].scrviv_Closing,function(obj){
		    					return (obj.variantName==varName&&obj.parentBrandName==brandName);
		    				});
		    				scope.products.push({'fullName':brandName+varName,'initial':initial,'production':production,'sales':sales,'discontinued':discontinued,'closing':closing});
		    			}
		    		}
		    	}
                var loadMarketVolume=function(data,category,market){
                    var varName,brandName,r1Order,r1Sales,r2Order,r2Sales,r3Order,r3Sales,onlineOrder,onlineSales;
                    for(var i=0;i<data.data[0].scrviv_Orders.length;i++){
                        if(data.data[0].scrviv_Orders[i].marketID==market&&data.data[0].scrviv_Orders[i].parentCategoryID==category){
                            varName=data.data[0].scrviv_Orders[i].variantName;
                            brandName=data.data[0].scrviv_Orders[i].parentBrandName;
                            switch(data.data[0].scrviv_Orders[i].marketID){
                                case 1:
                                var product=_.find(scope.urbanProductNames,function(obj){
                                    return (obj.varName==varName&&obj.brandName==brandName);
                                });
                                if(product==undefined){
                                    scope.urbanProductNames.push({'varName':varName,'brandName':brandName});
                                }break;
                                case 2:
                                var product=_.find(scope.ruralProductNames,function(obj){
                                    return (obj.varName==varName&&obj.brandName==brandName);
                                });
                                if(product==undefined){
                                    scope.ruralProductNames.push({'varName':varName,'brandName':brandName});
                                }break;
                            }  
                        }  
                    }
                    if(market==1){
                        for(var i=0;i<scope.urbanProductNames.length;i++){
                            varName=scope.urbanProductNames[i].varName;
                            brandName=scope.urbanProductNames[i].brandName;
                            var orders=_.filter(data.data[0].scrviv_Orders,function(obj){
                                return (obj.variantName==varName&&obj.parentBrandName==brandName);
                            })
                            for(var j=0;j<orders.length;j++){
                                switch(orders[j].accountID){
                                    case 1:r1Order=orders[j].value;break;
                                    case 2:r2Order=orders[j].value;break;
                                    case 3:r3Order=orders[j].value;break;
                                    case 4:onlineOrder=orders[j].value;break;
                                    case 5:break;
                                }
                            }
                            var sales=_.filter(data.data[0].scrviv_Shipments,function(obj){
                                return (obj.variantName==varName&&obj.parentBrandName==brandName);
                            });
                            for(var j=0;j<sales.length;j++){
                                switch(sales[j].accountID){
                                    case 1:r1Sales=sales[j].value;break;
                                    case 2:r2Sales=sales[j].value;break;
                                    case 3:r3Sales=sales[j].value;break;
                                    case 4:onlineSales=sales[j].value;break;
                                    case 5:break;
                                }
                            }
                            scope.urbanProducts.push({'varName':varName,'brandName':brandName,'r1Order':r1Order,'r2Order':r2Order,'r3Order':r3Order,'onlineOrder':onlineOrder,'r1Sales':r1Sales,'r2Sales':r2Sales,'r3Sales':r3Sales,'onlineSales':onlineSales});
                        }
                    }else{
                        for(var i=0;i<scope.ruralProductNames.length;i++){
                            varName=scope.ruralProductNames[i].varName;
                            brandName=scope.ruralProductNames[i].brandName;
                            var orders=_.filter(data.data[0].scrviv_Orders,function(obj){
                                return (obj.variantName==varName&&obj.parentBrandName==brandName);
                            })
                            for(var j=0;j<orders.length;j++){
                                switch(orders[j].accountID){
                                    case 1:r1Order=orders[j].value;break;
                                    case 2:r2Order=orders[j].value;break;
                                    case 3:r3Order=orders[j].value;break;
                                    case 4:onlineOrder=orders[j].value;break;
                                    case 5:break;
                                }
                            }
                            var sales=_.filter(data.data[0].scrviv_Shipments,function(obj){
                                return (obj.variantName==varName&&obj.parentBrandName==brandName);
                            });
                            for(var j=0;j<sales.length;j++){
                                switch(sales[j].accountID){
                                    case 1:r1Sales=sales[j].value;break;
                                    case 2:r2Sales=sales[j].value;break;
                                    case 3:r3Sales=sales[j].value;break;
                                    case 4:onlineSales=sales[j].value;break;
                                    case 5:break;
                                }
                            }
                            scope.ruralProducts.push({'varName':varName,'brandName':brandName,'r1Order':r1Order,'r2Order':r2Order,'r3Order':r3Order,'onlineOrder':onlineOrder,'r1Sales':r1Sales,'r2Sales':r2Sales,'r3Sales':r3Sales,'onlineSales':onlineSales});
                        }
                    }     
                }

                var getResult =function(){
                    var url='/SCR-inventoryVolumes/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
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
                    loadVolume(data,2);
                    scope.urbanProducts=new Array();
                    scope.ruralProducts=new Array();
                    scope.urbanProductNames=new Array();
                    scope.ruralProductNames=new Array();
                    loadMarketVolume(data,2,1);
                    loadMarketVolume(data,2,2);
                
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