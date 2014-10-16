var shareOfShoppersCtrl=function($scope,$http){
    function GetRequest() {
       var url = document.location.search; //获取url中"?"符后的字串
       var theRequest = new Object();
       if (url.indexOf("?") != -1) {
          var str = url.substr(1);
          strs = str.split("&");
          for(var i = 0; i < strs.length; i ++) {
             theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
          }
       }
       return theRequest;
    }

    function newChartData(searchKeys){
        var chartSeries = new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},
                                        {name:'Supplier-2',data:new Array(),color:'#B11E22'},
                                        {name:'Supplier-3',data:new Array(),color:'#F6B920'},
                                        {name:'Supplier-4',data:new Array(),color:'#329444'},
                                        {name:'Retailer-1',data:new Array(),color:'#8B288B'},
                                        {name:'Retailer-2',data:new Array(),color:'#F05422'},
                                        {name:'Retailer-3',data:new Array(),color:'#00AFEF'});

        return {
            searchKeys : {shopperKind : searchKeys.shopperKind, marketID : searchKeys.marketID, categoryID : searchKeys.categoryID},
            chartSeries : chartSeries
        }
    }
    var initPage=function(){
        var Request = GetRequest();
        var url='/getFeedBack/'+Request['seminar']+'/'+Request['period'];
        var periodsShown=new Array();

        for(var i=-3;i<=Request['period'];i++){
            periodsShown.push(i);
        }
        var E_urbanOnline = newChartData({ shopperKind : 'NETIZENS', marketID : 1, categoryID : 1});
        var E_urbanBM     = newChartData({ shopperKind : 'BMS', marketID : 1, categoryID : 1});
        var E_urbanMixed  = newChartData({ shopperKind : 'MIXED', marketID : 1, categoryID : 1});
        var E_urbanTotal  = newChartData({ shopperKind : 'ALLSHOPPERS', marketID : 1, categoryID : 1});

        var E_ruralOnline = newChartData({ shopperKind : 'NETIZENS', marketID : 2, categoryID : 1});
        var E_ruralBM     = newChartData({ shopperKind : 'BMS', marketID : 2, categoryID : 1});
        var E_ruralMixed  = newChartData({ shopperKind : 'MIXED', marketID : 2, categoryID : 1});
        var E_ruralTotal  = newChartData({ shopperKind : 'ALLSHOPPERS', marketID : 2, categoryID : 1});
        
        var H_urbanOnline = newChartData({ shopperKind : 'NETIZENS', marketID : 1, categoryID : 2});
        var H_urbanBM     = newChartData({ shopperKind : 'BMS', marketID : 1, categoryID : 2});
        var H_urbanMixed  = newChartData({ shopperKind : 'MIXED', marketID : 1, categoryID : 2});
        var H_urbanTotal  = newChartData({ shopperKind : 'ALLSHOPPERS', marketID : 1, categoryID : 2});

        var H_ruralOnline = newChartData({ shopperKind : 'NETIZENS', marketID : 2, categoryID : 2});
        var H_ruralBM     = newChartData({ shopperKind : 'BMS', marketID : 2, categoryID : 2});
        var H_ruralMixed  = newChartData({ shopperKind : 'MIXED', marketID : 2, categoryID : 2});
        var H_ruralTotal  = newChartData({ shopperKind : 'ALLSHOPPERS', marketID : 2, categoryID : 2});

        var allChartsData = [];
        allChartsData.push(E_urbanOnline, E_urbanBM, E_urbanMixed, E_urbanTotal, E_ruralOnline, E_ruralBM, E_ruralMixed, E_ruralTotal,
                      H_urbanOnline, H_urbanBM, H_urbanMixed, H_urbanTotal, H_ruralOnline, H_ruralBM, H_ruralMixed, H_ruralTotal);
    
        for(var j=0;j<periodsShown.length;j++){
            for(var i=0;i<$scope.feedBack.f_ShoppersShare.length;i++){
                if($scope.feedBack.f_ShoppersShare[i].period==periodsShown[j]){

                    allChartsData.forEach(function(singleChartData){
                        if ((singleChartData.searchKeys.shopperKind == $scope.feedBack.f_ShoppersShare[i].shopperKind) 
                            && (singleChartData.searchKeys.marketID == $scope.feedBack.f_ShoppersShare[i].marketID)
                            && (singleChartData.searchKeys.categoryID == $scope.feedBack.f_ShoppersShare[i].categoryID)){

                            singleChartData.chartSeries[$scope.feedBack.f_ShoppersShare[i].storeID - 1].data.push($scope.feedBack.f_ShoppersShare[i].value * 100);
                        }
                    });
                }
            }
        }

        //Category E:
        $scope.E_urbanOnlineShareOfShoppers={
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: 'Period'
                    }
                },
                yAxis:{
                    title: {
                        text: '%'
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: E_urbanOnline.chartSeries,
            title: {
                text: 'Online Only'
            },
            loading: false
        }
        $scope.E_urbanBMShareOfShoppers={
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: 'Period'
                    }
                },
                yAxis:{
                    title: {
                        text: '%'
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: E_urbanBM.chartSeries,
            title: {
                text: 'B & M Only'
            },
            loading: false
        }
        $scope.E_urbanMixedShareOfShoppers={
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: 'Period'
                    }
                },
                yAxis:{
                    title: {
                        text: '%'
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: E_urbanMixed.chartSeries,
            title: {
                text: 'Mixed'
            },
            loading: false
        }
        $scope.E_urbanTotalShareOfShoppers={
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: 'Period'
                    }
                },
                yAxis:{
                    title: {
                        text: '%'
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: E_urbanTotal.chartSeries,
            title: {
                text: 'Total'
            },
            loading: false
        }
        $scope.E_ruralOnlineShareOfShoppers={
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: 'Period'
                    }
                },
                yAxis:{
                    title: {
                        text: '%'
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: E_ruralOnline.chartSeries,
            title: {
                text: 'Online Only'
            },
            loading: false
        }
        $scope.E_ruralBMShareOfShoppers={
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: 'Period'
                    }
                },
                yAxis:{
                    title: {
                        text: '%'
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: E_ruralBM.chartSeries,
            title: {
                text: 'B & M Only'
            },
            loading: false
        }
        $scope.E_ruralMixedShareOfShoppers={
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: 'Period'
                    }
                },
                yAxis:{
                    title: {
                        text: '%'
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: E_ruralMixed.chartSeries,
            title: {
                text: 'Mixed'
            },
            loading: false
        }

        $scope.E_ruralTotalShareOfShoppers={
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: 'Period'
                    }
                },
                yAxis:{
                    title: {
                        text: '%'
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: E_ruralTotal.chartSeries,
            title: {
                text: 'Total'
            },
            loading: false
        }


        //Category H:
        $scope.H_urbanOnlineShareOfShoppers={
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: 'Period'
                    }
                },
                yAxis:{
                    title: {
                        text: '%'
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: H_urbanOnline.chartSeries,
            title: {
                text: 'Online Only'
            },
            loading: false
        }
        $scope.H_urbanBMShareOfShoppers={
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: 'Period'
                    }
                },
                yAxis:{
                    title: {
                        text: '%'
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: H_urbanBM.chartSeries,
            title: {
                text: 'B & M Only'
            },
            loading: false
        }
        $scope.H_urbanMixedShareOfShoppers={
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: 'Period'
                    }
                },
                yAxis:{
                    title: {
                        text: '%'
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: H_urbanMixed.chartSeries,
            title: {
                text: 'Mixed'
            },
            loading: false
        }
        $scope.H_urbanTotalShareOfShoppers={
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: 'Period'
                    }
                },
                yAxis:{
                    title: {
                        text: '%'
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: H_urbanTotal.chartSeries,
            title: {
                text: 'Total'
            },
            loading: false
        }
        $scope.H_ruralOnlineShareOfShoppers={
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: 'Period'
                    }
                },
                yAxis:{
                    title: {
                        text: '%'
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: H_ruralOnline.chartSeries,
            title: {
                text: 'Online Only'
            },
            loading: false
        }
        $scope.H_ruralBMShareOfShoppers={
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: 'Period'
                    }
                },
                yAxis:{
                    title: {
                        text: '%'
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: H_ruralBM.chartSeries,
            title: {
                text: 'B & M Only'
            },
            loading: false
        }
        $scope.H_ruralMixedShareOfShoppers={
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: 'Period'
                    }
                },
                yAxis:{
                    title: {
                        text: '%'
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: H_ruralMixed.chartSeries,
            title: {
                text: 'Mixed'
            },
            loading: false
        }

        $scope.H_ruralTotalShareOfShoppers={
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: 'Period'
                    }
                },
                yAxis:{
                    title: {
                        text: '%'
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: H_ruralTotal.chartSeries,
            title: {
                text: 'Total'
            },
            loading: false
        }
    }
    $scope.$watch('feedBack', function(newValue, oldValue){
        if(newValue!=undefined) {
            console.log(newValue);
            initPage();
        }
    });
}

