define(['directives', 'services'], function(directives){

    directives.directive('retailerMarketing', ['RetailerDecisionBase','RetailerDecision','Label','SeminarInfo','$http','$location','$filter','PeriodInfo','$q','PlayerInfo', function(RetailerDecisionBase,RetailerDecision,Label, SeminarInfo, $http,$location,$filter, PeriodInfo, $q,PlayerInfo){
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
            templateUrl : '../../partials/singleReportTemplate/RD_marketing.html',            
            link : function(scope, element, attrs){                   

                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    scope.packs = [{
                        value: 1, text: Label.getContent('SL_BASE')
                    },{
                        value: 2, text: Label.getContent('SL_FAIR')
                    },{
                        value: 3, text: Label.getContent('SL_MEDIUM')
                    },{
                        value: 4, text: Label.getContent('SL_ENHANCED')
                    },{
                        value: 5, text: Label.getContent('SL_PREMIUM')
                    }]; 

                    scope.currentPeriod=scope.selectedPeriod;                    
					RetailerDecisionBase.reload({retailerID:parseInt(scope.selectedPlayer),period:scope.selectedPeriod,seminar:SeminarInfo.getSelectedSeminar().seminarCode}).then(function(base){
						scope.pageBase = base;
					}).then(function(){
						return showView();
					}), function(reason){
						console.log('from ctr: ' + reason);
					}, function(update){
						console.log('from ctr: ' + update);
					};                 
                }

                scope.checkBudget=function(marketID,location,additionalIdx,value){
					var d=$q.defer();
					var max=expend=reportExpend=0;
					var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
					if(!filter.test(value)){
						d.resolve(Label.getContent('Input a number'));
					}
					var url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(scope.selectedPeriod-1)+'/R/'+parseInt(scope.selectedPlayer);
		      		$http({
		      			method:'GET',
		      			url:url
		      		}).then(function(data){
		      			max=data.data.budgetAvailable+data.data.budgetSpentToDate;
		      			url="/retailerExpend/"+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(scope.selectedPeriod)+'/'+parseInt(scope.selectedPlayer)+'/'+marketID+'/'+location+'/'+additionalIdx;
		      			return $http({
		      				method:'GET',
		      				url:url
		      			});
		      		}).then(function(data){
		      			expend=data.data.result;
		      			url='/getPlayerReportOrderExpend/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+scope.selectedPeriod+'/R/'+scope.selectedPlayer;
	                    return $http({
	                        method:'GET',
	                        url:url
	                    });
	                }).then(function(data){
	                	reportExpend=data.data.result;

	                    url='/getRetailerAdditionalBudget/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+scope.selectedPeriod+'/'+PlayerInfo.getPlayer();
	                    return $http({
	                        method:'GET',
	                        url:url
	                    });
	                }).then(function(data){
	                    additionalBudget =data.data;

		      			if(value>max + additionalBudget - expend - reportExpend){
		      				d.resolve(Label.getContent('Input range')+':0~'+(Math.floor((max-expend-reportExpend) * 100) / 100));
		      			}else{
		      				d.resolve();
		    			}
		      		},function(){
		      			d.resolve(Label.getContent('fail'));
		      		});
		      		return d.promise;
				}

				scope.updateRetailerDecision=function(location,additionalIdx){
					RetailerDecisionBase.setRetailerDecisionBase(location,additionalIdx,scope.pageBase[location][additionalIdx],'retailerMarketing');
				}

				scope.updateMarketingDecision=function(marketID,location,postion,additionalIdx,index){
					if(location=="localAdvertising"){
						RetailerDecisionBase.setMarketDecisionBase(marketID,location,additionalIdx,scope.markets[index][location][additionalIdx],'retailerMarketing');					
					}else if(location=="categorySurfaceShare"){
						RetailerDecisionBase.setMarketDecisionBase(marketID,location,additionalIdx,(scope.markets[index][location][additionalIdx])/100,'retailerMarketing');
						scope.markets[index][location][1-additionalIdx]=((100-scope.markets[index][location][additionalIdx])).toFixed(2);					
					}else{
						RetailerDecisionBase.setMarketDecisionBase(marketID,location,postion,scope.markets[index][location],'retailerMarketing');										
					}
				}

				var selectPacks = function(marketID) {
					
					var selected,postion=-1;
					for(var i=0;i<scope.markets.length;i++){
						if(scope.markets[i].marketID==marketID){
							selected = $filter('filter')(scope.packs, {value: scope.markets[i].serviceLevel});
							postion=i;
							break;
						}
					}
					if(postion!=-1){
						return (scope.markets[postion].serviceLevel && selected.length) ? selected[0].text : Label.getContent('Not set'); 
					}
					else{
						return Label.getContent('Not set');	
					}
				};

                var showView=function(){
                    var d=$q.defer();
	      			var markets=new Array();
					for(var i=0;i<scope.pageBase.retMarketDecision.length;i++){
		      			if(scope.pageBase.retMarketDecision[i].marketID==1){
		      				scope.pageBase.retMarketDecision[i].marketName="Urban";			
		      			}else if(scope.pageBase.retMarketDecision[i].marketID==2){
		      				scope.pageBase.retMarketDecision[i].marketName="Rural";
		      			}
		      			if(scope.pageBase.retMarketDecision[i].serviceLevel=="SL_BASE"){
		      				scope.pageBase.retMarketDecision[i].serviceLevel=1;
		      			}else if(scope.pageBase.retMarketDecision[i].serviceLevel=="SL_FAIR"){
		      				scope.pageBase.retMarketDecision[i].serviceLevel=2;
		      			}else if(scope.pageBase.retMarketDecision[i].serviceLevel=="SL_MEDIUM"){
		      				scope.pageBase.retMarketDecision[i].serviceLevel=3;
		      			}else if(scope.pageBase.retMarketDecision[i].serviceLevel=="SL_ENHANCED"){
		      				scope.pageBase.retMarketDecision[i].serviceLevel=4;
		      			}else if(scope.pageBase.retMarketDecision[i].serviceLevel=="SL_PREMIUM"){
		      				scope.pageBase.retMarketDecision[i].serviceLevel=5;
		      			}
		      			if(scope.pageBase.retMarketDecision[i].categorySurfaceShare[0]>=0&&scope.pageBase.retMarketDecision[i].categorySurfaceShare[0]<=1){
		      				scope.pageBase.retMarketDecision[i].categorySurfaceShare[0]*=100;
		      				scope.pageBase.retMarketDecision[i].categorySurfaceShare[0]=scope.pageBase.retMarketDecision[i].categorySurfaceShare[0].toFixed(2);
		      			}
		      			if(scope.pageBase.retMarketDecision[i].categorySurfaceShare[1]>=0&&scope.pageBase.retMarketDecision[i].categorySurfaceShare[1]<=1){
		      				scope.pageBase.retMarketDecision[i].categorySurfaceShare[1]*=100;
		      				scope.pageBase.retMarketDecision[i].categorySurfaceShare[1]=scope.pageBase.retMarketDecision[i].categorySurfaceShare[1].toFixed(2);
		      			}				      			
		      			markets.push(scope.pageBase.retMarketDecision[i]);
		      		}
		      		scope.markets=markets;
		      		scope.selectPacks=selectPacks;
	      			scope.isResultShown = true;
                    scope.isPageLoading = false; 
		      		return d.promise;      
                }

                scope.$watch('isPageShown', function(newValue, oldValue){
                    if(newValue==true) {
                        initializePage();
                    }
                });

	            scope.$on('retailerDecisionBaseChangedFromServer', function(event, data, newBase) {  
                	if(data.page=="retailerMarketing"){
                        scope.pageBase = newBase;
                        showView();
                    }
	            });				

            }
        }
    }])
})
