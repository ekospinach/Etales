define(['directives', 'services'], function(directives) {

    directives.directive('generalChannelPerspective', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q',
        function(Label, SeminarInfo, $http, PeriodInfo, $q) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/GR_channelPerspective.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        console.log('message');

                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label         = Label;
                        getResult();
                    }

                    var getResult = function() {

                        //switching('showPerformance');
                        var url = '/performanceHighlights/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;

                        $http({
                            method: 'GET',
                            url: url,
                            //tracker: scope.loadingTracker
                        }).then(function(data) {
                            return organiseArray(data.data[0]);
                        }).then(function(data) {                                          

                            scope.isResultShown = true;
                            scope.isPageLoading = false;

                        }, function(data) {
                            // if(!scope.logs){scope.logs = [];}
                            // scope.logs.push(data.msg);                                            
                        });
                    }

                    var organiseArray = function(data) {
                        var deferred = $q.defer();

                        //if(data.data[0] == "XXXXX"){ deferred.reject({msg:'XXXXX'}); }
                        if (data) {
                        	var players=new Array();
                        	var categories=new Array();
                        	for(var i=0;i<6;i++){
                        		for(j=0;j<data.storeInfo[i].storeCategoryInfo.length;j++){
                        			categories.push({
                    					'storeID':data.storeInfo[i].storeID,
                    					'categoryID':data.storeInfo[i].storeCategoryInfo[j].categoryID,
                    					'salesVolume':data.storeInfo[i].storeCategoryInfo[j].grph_ConsumersOffTakeVolume,
                    					'salesValue':data.storeInfo[i].storeCategoryInfo[j].grph_ConsumersOffTakeValue,
                    					'shareVolume':data.storeInfo[i].storeCategoryInfo[j].grph_ConsumersOffTakeVolumeShare,
                    					'shareValue':data.storeInfo[i].storeCategoryInfo[j].grph_ConsumersOffTakeValueShare
                    				});
                        		}
                    			players.push({'category':categories});
                        	}
                        	scope.players=players;



                            deferred.resolve({
                                msg: 'Array is ready.'
                            });
                        } else {
                            deferred.reject({
                                msg: 'data.data[0] is undefined'
                            });
                        }
                        return deferred.promise;
                    }

                    scope.$watch('isPageShown', function(newValue, oldValue) {
                        console.log('watch is actived');
                        if (newValue == true) {
                            initializePage();
                        }
                    })
                    scope.$watch('selectedPeriod', function(newValue, oldValue) {
                        if (newValue != oldValue && scope.isPageShown) {
                            initializePage();
                        }
                    })
                }
            }
        }
    ])
})