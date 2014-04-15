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

                var getResult =function(){
                    var url='/SCR-inventoryVolumes/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
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