define(['directives', 'services'], function(directives){

    directives.directive('generalCrossSegmentSales', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                generalCrossSegmentSalesSelectedPeriod : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/GR_crossSegmentSales.html',            
            link : function(scope, element, attrs){                                                                
                var initializePage = function(){
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var getResult =function(){
                    //switching('showPerformance');
                    var url='/crossSegmentSales/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+scope.generalCrossSegmentSalesSelectedPeriod;

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
                    
                    scope.priceSensitives=new Array();
                    scope.valueForMoneies=new Array();
                    scope.fashions=new Array();
                    scope.freakses=new Array();
                    for(var i=0;i<4;i++){
                        scope.priceSensitives[i]=new Array();
                        scope.valueForMoneies[i]=new Array();
                        scope.fashions[i]=new Array();
                        scope.freakses[i]=new Array();
                    }

                    for(var i=0;i<4;i++){
                        /*
                            data push info
                        
                            data[0]    {'categoryID':1,'marketID':1} 
                            data[1]    {'categoryID':1,'marketID':2} 
                            data[2]    {'categoryID':2,'marketID':1} 
                            data[3]    {'categoryID':2,'marketID':2} 

                            data[x][0] BMS
                            data[x][1] NETIZENS
                            data[x][2] MIXED
                            data[x][3] ALLSHOPPERS

                        */
                        //priceSensitives
                        scope.priceSensitives[0].push(data.data[0].categoryInfo[0].marketInfo[0].segmentInfo[0].shopperInfo[i].grcss_CrossSegmentsVolumes);
                        scope.priceSensitives[1].push(data.data[0].categoryInfo[0].marketInfo[1].segmentInfo[0].shopperInfo[i].grcss_CrossSegmentsVolumes);
                        scope.priceSensitives[2].push(data.data[0].categoryInfo[1].marketInfo[0].segmentInfo[0].shopperInfo[i].grcss_CrossSegmentsVolumes);
                        scope.priceSensitives[3].push(data.data[0].categoryInfo[1].marketInfo[1].segmentInfo[0].shopperInfo[i].grcss_CrossSegmentsVolumes);
                        //valueForMoneies
                        scope.valueForMoneies[0].push(data.data[0].categoryInfo[0].marketInfo[0].segmentInfo[1].shopperInfo[i].grcss_CrossSegmentsVolumes);
                        scope.valueForMoneies[1].push(data.data[0].categoryInfo[0].marketInfo[1].segmentInfo[1].shopperInfo[i].grcss_CrossSegmentsVolumes);
                        scope.valueForMoneies[2].push(data.data[0].categoryInfo[1].marketInfo[0].segmentInfo[1].shopperInfo[i].grcss_CrossSegmentsVolumes);
                        scope.valueForMoneies[3].push(data.data[0].categoryInfo[1].marketInfo[1].segmentInfo[1].shopperInfo[i].grcss_CrossSegmentsVolumes);
                        //fashions
                        scope.fashions[0].push(data.data[0].categoryInfo[0].marketInfo[0].segmentInfo[2].shopperInfo[i].grcss_CrossSegmentsVolumes);
                        scope.fashions[1].push(data.data[0].categoryInfo[0].marketInfo[1].segmentInfo[2].shopperInfo[i].grcss_CrossSegmentsVolumes);
                        scope.fashions[2].push(data.data[0].categoryInfo[1].marketInfo[0].segmentInfo[2].shopperInfo[i].grcss_CrossSegmentsVolumes);
                        scope.fashions[3].push(data.data[0].categoryInfo[1].marketInfo[1].segmentInfo[2].shopperInfo[i].grcss_CrossSegmentsVolumes);
                        //freakses
                        scope.freakses[0].push(data.data[0].categoryInfo[0].marketInfo[0].segmentInfo[3].shopperInfo[i].grcss_CrossSegmentsVolumes);
                        scope.freakses[1].push(data.data[0].categoryInfo[0].marketInfo[1].segmentInfo[3].shopperInfo[i].grcss_CrossSegmentsVolumes);
                        scope.freakses[2].push(data.data[0].categoryInfo[1].marketInfo[0].segmentInfo[3].shopperInfo[i].grcss_CrossSegmentsVolumes);
                        scope.freakses[3].push(data.data[0].categoryInfo[1].marketInfo[1].segmentInfo[3].shopperInfo[i].grcss_CrossSegmentsVolumes);
                    }
                                        
                    scope.crossSegment1Series = [                 
                        {"name": Label.getContent('B&M Only'), "data": [scope.priceSensitives[0][0],scope.valueForMoneies[0][0],scope.fashions[0][0],scope.freakses[0][0]], type: "column",color:'#D9534F'},
                        {"name": Label.getContent('Online Only'), "data": [scope.priceSensitives[0][1],scope.valueForMoneies[0][1],scope.fashions[0][1],scope.freakses[0][1]], type: "column",color:'#428BCA'},
                        {"name": Label.getContent('Mixed'), "data": [scope.priceSensitives[0][2],scope.valueForMoneies[0][2],scope.fashions[0][2],scope.freakses[0][2]], type: "column",color:'#5CB85C'},
                    ];

                    scope.crossSegment1Config = {
                        options: {
                            xAxis: {
                                categories: [Label.getContent('Price Sensitive'), Label.getContent('Value for Money'), Label.getContent('Fashion'), Label.getContent('Freaks')]
                            },
                            yAxis:{
                                title:{text:"units mln"}
                            },
                            chart: {
                                type: 'areaspline'
                            },
                            tooltip: {
                                valueDecimals: 2
                            }, 
                            plotOptions: {
                                series: {
                                    stacking: ''
                                }
                            }
                        },
                        series: scope.crossSegment1Series,
                        title: {
                            text: Label.getContent('Elecssories')+' - '+Label.getContent('Urban')
                        },
                        subtitle: {
                            text: '<p class="text-center" style="font-size:16px">'+Label.getContent('Consumer Segments')+'</p>',
                            useHTML:true,
                        },
                        credits: {
                            enabled: false
                        },
                        loading: false
                    }

                    scope.crossSegment2Series = [                 
                        {"name": Label.getContent('B&M Only'), "data": [scope.priceSensitives[1][0],scope.valueForMoneies[1][0],scope.fashions[1][0],scope.freakses[1][0]], type: "column",color:'#D9534F'},
                        {"name": Label.getContent('Online Only'), "data": [scope.priceSensitives[1][1],scope.valueForMoneies[1][1],scope.fashions[1][1],scope.freakses[1][1]], type: "column",color:'#428BCA'},
                        {"name": Label.getContent('Mixed'), "data": [scope.priceSensitives[1][2],scope.valueForMoneies[1][2],scope.fashions[1][2],scope.freakses[1][2]], type: "column",color:'#5CB85C'},
                    ];

                    scope.crossSegment2Config = {
                        options: {
                            xAxis: {
                                categories: [Label.getContent('Price Sensitive'), Label.getContent('Value for Money'), Label.getContent('Fashion'), Label.getContent('Freaks')]
                            },
                            yAxis:{
                                title:{text:"units mln"}
                            },
                            chart: {
                                type: 'areaspline'
                            },
                            tooltip: {
                                valueDecimals: 2
                            }, 
                            plotOptions: {
                                series: {
                                    stacking: ''
                                }
                            }
                        },
                        series: scope.crossSegment2Series,
                        title: {
                            text: Label.getContent('Elecssories')+' - '+Label.getContent('Rural')
                        },
                        subtitle: {
                            text: '<p class="text-center" style="font-size:16px">'+Label.getContent('Consumer Segments')+'</p>',
                            useHTML:true,
                        },
                        credits: {
                            enabled: false
                        },
                        loading: false
                    }

                    scope.crossSegment3Series = [                 
                        {"name": Label.getContent('B&M Only'), "data": [scope.priceSensitives[2][0],scope.valueForMoneies[2][0],scope.fashions[2][0],scope.freakses[2][0]], type: "column",color:'#D9534F'},
                        {"name": Label.getContent('Online Only'), "data": [scope.priceSensitives[2][1],scope.valueForMoneies[2][1],scope.fashions[2][1],scope.freakses[2][1]], type: "column",color:'#428BCA'},
                        {"name": Label.getContent('Mixed'), "data": [scope.priceSensitives[2][2],scope.valueForMoneies[2][2],scope.fashions[2][2],scope.freakses[2][2]], type: "column",color:'#5CB85C'},
                    ];

                    scope.crossSegment3Config = {
                        options: {
                            xAxis: {
                                categories: [Label.getContent('Price Sensitive'), Label.getContent('Value for Money'), Label.getContent('Health Conscious'), Label.getContent('Impatient')]
                            },
                            yAxis:{
                                title:{text:"units mln"}
                            },
                            chart: {
                                type: 'areaspline'
                            },
                            tooltip: {
                                valueDecimals: 2
                            }, 
                            plotOptions: {
                                series: {
                                    stacking: ''
                                }
                            }
                        },
                        series: scope.crossSegment3Series,
                        title: {
                            text: Label.getContent('HealthBeauties')+' - '+Label.getContent('Urban')
                        },
                        subtitle: {
                            text: '<p class="text-center" style="font-size:16px">'+Label.getContent('Consumer Segments')+'</p>',
                            useHTML:true,
                        },
                        credits: {
                            enabled: false
                        },
                        loading: false
                    }

                    scope.crossSegment4Series = [                 
                        {"name": Label.getContent('B&M Only'), "data": [scope.priceSensitives[3][0],scope.valueForMoneies[3][0],scope.fashions[3][0],scope.freakses[3][0]], type: "column",color:'#D9534F'},
                        {"name": Label.getContent('Online Only'), "data": [scope.priceSensitives[3][1],scope.valueForMoneies[3][1],scope.fashions[3][1],scope.freakses[3][1]], type: "column",color:'#428BCA'},
                        {"name": Label.getContent('Mixed'), "data": [scope.priceSensitives[3][2],scope.valueForMoneies[3][2],scope.fashions[3][2],scope.freakses[3][2]], type: "column",color:'#5CB85C'},
                    ];

                    scope.crossSegment4Config = {
                        options: {
                            xAxis: {
                                categories: [Label.getContent('Price Sensitive'), Label.getContent('Value for Money'), Label.getContent('Health Conscious'), Label.getContent('Impatient')]
                            },
                            yAxis:{
                                title:{text:"units mln"}
                            },
                            chart: {
                                type: 'areaspline'
                            },
                            tooltip: {
                                valueDecimals: 2
                            }, 
                            plotOptions: {
                                series: {
                                    stacking: ''
                                }
                            }
                        },
                        series: scope.crossSegment4Series,
                        title: {
                            text: Label.getContent('HealthBeauties')+' - '+Label.getContent('Rural')
                        },
                        subtitle: {
                            text: '<p class="text-center" style="font-size:16px">'+Label.getContent('Consumer Segments')+'</p>',
                            useHTML:true,
                        },
                        credits: {
                            enabled: false
                        },
                        loading: false
                    }
                
                    deferred.resolve({msg:'Array is ready.'});                    
                    return deferred.promise;
                }


                scope.$watch('isPageShown', function(newValue, oldValue){
                    if(newValue==true) {
                        initializePage();
                    }
                })

                scope.$watch('generalCrossSegmentSalesSelectedPeriod', function(newValue, oldValue){
                    if(newValue!=oldValue&&scope.isPageShown) {
                        initializePage();
                    }
                })

            }
        }
    }])
})