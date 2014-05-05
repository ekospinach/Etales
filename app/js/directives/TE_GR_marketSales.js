define(['directives', 'services'], function(directives){

    directives.directive('generalMarketSales', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/GR_marketSales.html',            
            link : function(scope, element, attrs){                                                                
                var initializePage = function(){
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var getResult =function(){
                    //switching('showPerformance');
                    var url='/marketSales/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);

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
                    scope.totals=new Array();scope.totalChanges=new Array();scope.rurals=new Array();scope.ruralChanges=new Array();scope.urbans=new Array();scope.urbanChanges=new Array();scope.prices=new Array();scope.priceChanges=new Array();scope.values=new Array();scope.valueChanges=new Array();scope.fashions=new Array();scope.fashionChanges=new Array();scope.freakss=new Array();scope.freaksChanges=new Array();scope.bms=new Array();scope.bmChanges=new Array();scope.onlines=new Array();scope.onlineChanges=new Array();scope.mixeds=new Array();scope.mixedChanges=new Array();
                    for(var i=0;i<4;i++){
                        scope.totals[i]=new Array();scope.totalChanges[i]=new Array();scope.rurals[i]=new Array();scope.ruralChanges[i]=new Array();scope.urbans[i]=new Array();scope.urbanChanges[i]=new Array();scope.prices[i]=new Array();scope.priceChanges[i]=new Array();scope.values[i]=new Array();scope.valueChanges[i]=new Array();scope.fashions[i]=new Array();scope.fashionChanges[i]=new Array();scope.freakss[i]=new Array();scope.freaksChanges[i]=new Array();scope.bms[i]=new Array();scope.bmChanges[i]=new Array();scope.onlines[i]=new Array();scope.onlineChanges[i]=new Array();scope.mixeds[i]=new Array();scope.mixedChanges[i]=new Array();
                    }

                    for(i=0;i<data.data[0].actorInfo.length;i++){
                        for(j=0;j<4;j+=2){
                            var k=0;
                            if(j>=2){
                                k=1;
                            };
                            scope.totals[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolume);
                            scope.totalChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolumeChange);
                            scope.totals[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValue);
                            scope.totalChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValueChange);
                            scope.rurals[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolume);
                            scope.ruralChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolumeChange);
                            scope.rurals[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValue);
                            scope.ruralChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValueChange);
                            scope.urbans[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolume);
                            scope.urbanChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolumeChange);
                            scope.urbans[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValue);
                            scope.urbanChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValueChange);
                            scope.prices[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grms_MarketSalesVolume);
                            scope.priceChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grms_MarketSalesVolumeChange);
                            scope.prices[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grms_MarketNetSalesValue);
                            scope.priceChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grms_MarketNetSalesValueChange);
                            scope.values[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grms_MarketSalesVolume);
                            scope.valueChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grms_MarketSalesVolumeChange);
                            scope.values[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grms_MarketNetSalesValue);
                            scope.valueChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grms_MarketNetSalesValueChange);
                            scope.fashions[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grms_MarketSalesVolume);
                            scope.fashionChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grms_MarketSalesVolumeChange);
                            scope.fashions[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grms_MarketNetSalesValue);
                            scope.fashionChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grms_MarketNetSalesValueChange);
                            scope.freakss[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grms_MarketSalesVolume);
                            scope.freaksChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grms_MarketSalesVolumeChange);
                            scope.freakss[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grms_MarketNetSalesValue);
                            scope.freaksChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grms_MarketNetSalesValueChange);
                            scope.bms[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grms_MarketSalesVolume);
                            scope.bmChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grms_MarketSalesVolumeChange);
                            scope.bms[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grms_MarketNetSalesValue);
                            scope.bmChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grms_MarketNetSalesValueChange);
                            scope.onlines[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grms_MarketSalesVolume);
                            scope.onlineChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grms_MarketSalesVolumeChange);
                            scope.onlines[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grms_MarketNetSalesValue);
                            scope.onlineChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grms_MarketNetSalesValueChange);
                            scope.mixeds[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grms_MarketSalesVolume);
                            scope.mixedChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grms_MarketSalesVolumeChange);
                            scope.mixeds[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grms_MarketNetSalesValue);
                            scope.mixedChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grms_MarketNetSalesValueChange);
                        }
                    }

                    scope.marketSales1Series = [                 
                        {"name": Label.getContent('Producer')+' 1', "data": [scope.totals[0][0],0,scope.rurals[0][0],scope.urbans[0][0],0,scope.prices[0][0],scope.values[0][0],scope.fashions[0][0],scope.freakss[0][0],0,scope.bms[0][0],scope.onlines[0][0],scope.mixeds[0][0]], type: "column",color:'#3257A7'},
                        {"name": Label.getContent('Producer')+' 2', "data": [scope.totals[0][1],0,scope.rurals[0][1],scope.urbans[0][1],0,scope.prices[0][1],scope.values[0][1],scope.fashions[0][1],scope.freakss[0][1],0,scope.bms[0][1],scope.onlines[0][1],scope.mixeds[0][1]], type: "column",color:'#B11E22'},
                        {"name": Label.getContent('Producer')+' 3', "data": [scope.totals[0][2],0,scope.rurals[0][2],scope.urbans[0][2],0,scope.prices[0][2],scope.values[0][2],scope.fashions[0][2],scope.freakss[0][2],0,scope.bms[0][2],scope.onlines[0][2],scope.mixeds[0][2]], type: "column",color:'#F6B920'},
                        {"name": Label.getContent('Producer')+' 4', "data": [scope.totals[0][3],0,scope.rurals[0][3],scope.urbans[0][3],0,scope.prices[0][3],scope.values[0][3],scope.fashions[0][3],scope.freakss[0][3],0,scope.bms[0][3],scope.onlines[0][3],scope.mixeds[0][3]], type: "column",color:'#329444'},
                        {"name": Label.getContent('Retailer')+' 1', "data": [scope.totals[0][4],0,scope.rurals[0][4],scope.urbans[0][4],0,scope.prices[0][4],scope.values[0][4],scope.fashions[0][4],scope.freakss[0][4],0,scope.bms[0][4],scope.onlines[0][4],scope.mixeds[0][4]], type: "column",color:'#8B288B'},
                        {"name": Label.getContent('Retailer')+' 2', "data": [scope.totals[0][5],0,scope.rurals[0][5],scope.urbans[0][5],0,scope.prices[0][5],scope.values[0][5],scope.fashions[0][5],scope.freakss[0][5],0,scope.bms[0][5],scope.onlines[0][5],scope.mixeds[0][5]], type: "column",color:'#F05422'},
                    ];

                    scope.change1s=scope.change2s=scope.change3s=scope.change4s=new Array();
                    for(var i=0;i<6;i++){
                        scope.change1s[i]=scope.change2s[i]=scope.change3s[i]=scope.change4s[i]=new Array();
                    }

                    scope.change1s=[
                        [scope.totalChanges[0][0],0,scope.ruralChanges[0][0],scope.urbanChanges[0][0],0,scope.priceChanges[0][0],scope.valueChanges[0][0],scope.fashionChanges[0][0],scope.freaksChanges[0][0],0,scope.bmChanges[0][0],scope.onlineChanges[0][0],scope.mixedChanges[0][0]],
                        [scope.totalChanges[0][1],0,scope.ruralChanges[0][1],scope.urbanChanges[0][1],0,scope.priceChanges[0][1],scope.valueChanges[0][1],scope.fashionChanges[0][1],scope.freaksChanges[0][1],0,scope.bmChanges[0][1],scope.onlineChanges[0][1],scope.mixedChanges[0][1]],
                        [scope.totalChanges[0][2],0,scope.ruralChanges[0][2],scope.urbanChanges[0][2],0,scope.priceChanges[0][2],scope.valueChanges[0][2],scope.fashionChanges[0][2],scope.freaksChanges[0][2],0,scope.bmChanges[0][2],scope.onlineChanges[0][2],scope.mixedChanges[0][2]],
                        [scope.totalChanges[0][3],0,scope.ruralChanges[0][3],scope.urbanChanges[0][3],0,scope.priceChanges[0][3],scope.valueChanges[0][3],scope.fashionChanges[0][3],scope.freaksChanges[0][3],0,scope.bmChanges[0][3],scope.onlineChanges[0][3],scope.mixedChanges[0][3]],
                        [scope.totalChanges[0][4],0,scope.ruralChanges[0][4],scope.urbanChanges[0][4],0,scope.priceChanges[0][4],scope.valueChanges[0][4],scope.fashionChanges[0][4],scope.freaksChanges[0][4],0,scope.bmChanges[0][4],scope.onlineChanges[0][4],scope.mixedChanges[0][4]],
                        [scope.totalChanges[0][5],0,scope.ruralChanges[0][5],scope.urbanChanges[0][5],0,scope.priceChanges[0][5],scope.valueChanges[0][5],scope.fashionChanges[0][5],scope.freaksChanges[0][5],0,scope.bmChanges[0][5],scope.onlineChanges[0][5],scope.mixedChanges[0][5]]
                    ];

                    scope.marketSales1Config = {
                        options: {
                            xAxis: {
                                categories: [Label.getContent('Total'), '', Label.getContent('Rural'), Label.getContent('Urban'), '', Label.getContent('Price Sensitive'),Label.getContent('Value for Money'),Label.getContent('Fashion'),Label.getContent('Freaks'),'',Label.getContent('B&M Only'),Label.getContent('Online Only'),Label.getContent('Mixed')]
                            },
                            yAxis:{
                                title:{text:"units mln"}
                            },
                            chart: {
                                type: 'areaspline'
                            },
                            tooltip: {
                                formatter: function() {
                                    var s = '<p><b>'+this.series.name+'</b></p>'+'<p>'+Label.getContent('Volume Sales')+':'+this.point.y+'(units mln)</p>'+'<p>'+scope.change1s[this.series._i][this.point.x]+' '+Label.getContent('over previous period')+'</p>';
                                    return s;
                                },
                                shared: false,
                                useHTML: true
                            },
                            plotOptions: {
                                series: {
                                    stacking: 'normal'
                                }
                            }
                        },
                        series: scope.marketSales1Series,
                        title: {
                            text: Label.getContent('Elecssories')+' - '+Label.getContent('Volume Sales')
                        },
                        credits: {
                            enabled: true
                        },
                        loading: false
                    }

                    scope.marketSales2Series = [
                        {"name": Label.getContent('Producer')+' 1', "data": [scope.totals[1][0],0,scope.rurals[1][0],scope.urbans[1][0],0,scope.prices[1][0],scope.values[1][0],scope.fashions[1][0],scope.freakss[1][0],0,scope.bms[1][0],scope.onlines[1][0],scope.mixeds[1][0]], type: "column",color:'#3257A7'},
                        {"name": Label.getContent('Producer')+' 2', "data": [scope.totals[1][1],0,scope.rurals[1][1],scope.urbans[1][1],0,scope.prices[1][1],scope.values[1][1],scope.fashions[1][1],scope.freakss[1][1],0,scope.bms[1][1],scope.onlines[1][1],scope.mixeds[1][1]], type: "column",color:'#B11E22'},
                        {"name": Label.getContent('Producer')+' 3', "data": [scope.totals[1][2],0,scope.rurals[1][2],scope.urbans[1][2],0,scope.prices[1][2],scope.values[1][2],scope.fashions[1][2],scope.freakss[1][2],0,scope.bms[1][2],scope.onlines[1][2],scope.mixeds[1][2]], type: "column",color:'#F6B920'},
                        {"name": Label.getContent('Producer')+' 4', "data": [scope.totals[1][3],0,scope.rurals[1][3],scope.urbans[1][3],0,scope.prices[1][3],scope.values[1][3],scope.fashions[1][3],scope.freakss[1][3],0,scope.bms[1][3],scope.onlines[1][3],scope.mixeds[1][3]], type: "column",color:'#329444'},
                        {"name": Label.getContent('Retailer')+' 1', "data": [scope.totals[1][4],0,scope.rurals[1][4],scope.urbans[1][4],0,scope.prices[1][4],scope.values[1][4],scope.fashions[1][4],scope.freakss[1][4],0,scope.bms[1][4],scope.onlines[1][4],scope.mixeds[1][4]], type: "column",color:'#8B288B'},
                        {"name": Label.getContent('Retailer')+' 2', "data": [scope.totals[1][5],0,scope.rurals[1][5],scope.urbans[1][5],0,scope.prices[1][5],scope.values[1][5],scope.fashions[1][5],scope.freakss[1][5],0,scope.bms[1][5],scope.onlines[1][5],scope.mixeds[1][5]], type: "column",color:'#F05422'},
                    ];

                    scope.change2s=new Array();
                    for(i=0;i<6;i++){
                        scope.change2s[i]=new Array();
                    }

                    scope.change2s=[
                        [scope.totalChanges[1][0],0,scope.ruralChanges[1][0],scope.urbanChanges[1][0],0,scope.priceChanges[1][0],scope.valueChanges[1][0],scope.fashionChanges[1][0],scope.freaksChanges[1][0],0,scope.bmChanges[1][0],scope.onlineChanges[1][0],scope.mixedChanges[1][0]],
                        [scope.totalChanges[1][1],0,scope.ruralChanges[1][1],scope.urbanChanges[1][1],0,scope.priceChanges[1][1],scope.valueChanges[1][1],scope.fashionChanges[1][1],scope.freaksChanges[1][1],0,scope.bmChanges[1][1],scope.onlineChanges[1][1],scope.mixedChanges[1][1]],
                        [scope.totalChanges[1][2],0,scope.ruralChanges[1][2],scope.urbanChanges[1][2],0,scope.priceChanges[1][2],scope.valueChanges[1][2],scope.fashionChanges[1][2],scope.freaksChanges[1][2],0,scope.bmChanges[1][2],scope.onlineChanges[1][2],scope.mixedChanges[1][2]],
                        [scope.totalChanges[1][3],0,scope.ruralChanges[1][3],scope.urbanChanges[1][3],0,scope.priceChanges[1][3],scope.valueChanges[1][3],scope.fashionChanges[1][3],scope.freaksChanges[1][3],0,scope.bmChanges[1][3],scope.onlineChanges[1][3],scope.mixedChanges[1][3]],
                        [scope.totalChanges[1][4],0,scope.ruralChanges[1][4],scope.urbanChanges[1][4],0,scope.priceChanges[1][4],scope.valueChanges[1][4],scope.fashionChanges[1][4],scope.freaksChanges[1][4],0,scope.bmChanges[1][4],scope.onlineChanges[1][4],scope.mixedChanges[1][4]],
                        [scope.totalChanges[1][5],0,scope.ruralChanges[1][5],scope.urbanChanges[1][5],0,scope.priceChanges[1][5],scope.valueChanges[1][5],scope.fashionChanges[1][5],scope.freaksChanges[1][5],0,scope.bmChanges[1][5],scope.onlineChanges[1][5],scope.mixedChanges[1][5]]
                    ];


                    scope.marketSales2Config = {
                        options: {
                            xAxis: {
                                categories: [Label.getContent('Total'), '', Label.getContent('Rural'), Label.getContent('Urban'), '', Label.getContent('Price Sensitive'),Label.getContent('Value for Money'),Label.getContent('Fashion'),Label.getContent('Freaks'),'',Label.getContent('B&M Only'),Label.getContent('Online Only'),Label.getContent('Mixed')]
                            },
                            yAxis:{
                                title:{text:"$mln"}
                            },
                            chart: {
                                type: 'areaspline'
                            },
                            tooltip: {
                                formatter: function() {
                                    var s = '<p><b>'+this.series.name+'</b></p>'+'<p>'+Label.getContent('Value Sales')+':'+this.point.y+'($mln)</p>'+'<p>'+scope.change2s[this.series._i][this.point.x]+' '+Label.getContent('over previous period')+'</p>';
                                    return s;
                                },
                                shared: false,
                                useHTML: true
                            },
                            plotOptions: {
                                series: {
                                    stacking: 'normal'
                                }
                            }
                        },
                        series: scope.marketSales2Series,
                        title: {
                            text: Label.getContent('Elecssories')+' - '+Label.getContent('Value Sales')
                        },
                        credits: {
                            enabled: true
                        },
                        loading: false
                    }

                    scope.marketSales3Series = [
                        {"name": Label.getContent('Producer')+' 1', "data": [scope.totals[2][0],0,scope.rurals[2][0],scope.urbans[2][0],0,scope.prices[2][0],scope.values[2][0],scope.fashions[2][0],scope.freakss[2][0],0,scope.bms[2][0],scope.onlines[2][0],scope.mixeds[2][0]], type: "column",color:'#3257A7'},
                        {"name": Label.getContent('Producer')+' 2', "data": [scope.totals[2][1],0,scope.rurals[2][1],scope.urbans[2][1],0,scope.prices[2][1],scope.values[2][1],scope.fashions[2][1],scope.freakss[2][1],0,scope.bms[2][1],scope.onlines[2][1],scope.mixeds[2][1]], type: "column",color:'#B11E22'},
                        {"name": Label.getContent('Producer')+' 3', "data": [scope.totals[2][2],0,scope.rurals[2][2],scope.urbans[2][2],0,scope.prices[2][2],scope.values[2][2],scope.fashions[2][2],scope.freakss[2][2],0,scope.bms[2][2],scope.onlines[2][2],scope.mixeds[2][2]], type: "column",color:'#F6B920'},
                        {"name": Label.getContent('Producer')+' 4', "data": [scope.totals[2][3],0,scope.rurals[2][3],scope.urbans[2][3],0,scope.prices[2][3],scope.values[2][3],scope.fashions[2][3],scope.freakss[2][3],0,scope.bms[2][3],scope.onlines[2][3],scope.mixeds[2][3]], type: "column",color:'#329444'},
                        {"name": Label.getContent('Retailer')+' 1', "data": [scope.totals[2][4],0,scope.rurals[2][4],scope.urbans[2][4],0,scope.prices[2][4],scope.values[2][4],scope.fashions[2][4],scope.freakss[2][4],0,scope.bms[2][4],scope.onlines[2][4],scope.mixeds[2][4]], type: "column",color:'#8B288B'},
                        {"name": Label.getContent('Retailer')+' 2', "data": [scope.totals[2][5],0,scope.rurals[2][5],scope.urbans[2][5],0,scope.prices[2][5],scope.values[2][5],scope.fashions[2][5],scope.freakss[2][5],0,scope.bms[2][5],scope.onlines[2][5],scope.mixeds[2][5]], type: "column",color:'#F05422'},
                    ];

                    scope.change3s=new Array();
                    for(i=0;i<6;i++){
                        scope.change3s[i]=new Array();
                    }

                    scope.change3s=[
                        [scope.totalChanges[2][0],0,scope.ruralChanges[2][0],scope.urbanChanges[2][0],0,scope.priceChanges[2][0],scope.valueChanges[2][0],scope.fashionChanges[2][0],scope.freaksChanges[2][0],0,scope.bmChanges[2][0],scope.onlineChanges[2][0],scope.mixedChanges[2][0]],
                        [scope.totalChanges[2][1],0,scope.ruralChanges[2][1],scope.urbanChanges[2][1],0,scope.priceChanges[2][1],scope.valueChanges[2][1],scope.fashionChanges[2][1],scope.freaksChanges[2][1],0,scope.bmChanges[2][1],scope.onlineChanges[2][1],scope.mixedChanges[2][1]],
                        [scope.totalChanges[2][2],0,scope.ruralChanges[2][2],scope.urbanChanges[2][2],0,scope.priceChanges[2][2],scope.valueChanges[2][2],scope.fashionChanges[2][2],scope.freaksChanges[2][2],0,scope.bmChanges[2][2],scope.onlineChanges[2][2],scope.mixedChanges[2][2]],
                        [scope.totalChanges[2][3],0,scope.ruralChanges[2][3],scope.urbanChanges[2][3],0,scope.priceChanges[2][3],scope.valueChanges[2][3],scope.fashionChanges[2][3],scope.freaksChanges[2][3],0,scope.bmChanges[2][3],scope.onlineChanges[2][3],scope.mixedChanges[2][3]],
                        [scope.totalChanges[2][4],0,scope.ruralChanges[2][4],scope.urbanChanges[2][4],0,scope.priceChanges[2][4],scope.valueChanges[2][4],scope.fashionChanges[2][4],scope.freaksChanges[2][4],0,scope.bmChanges[2][4],scope.onlineChanges[2][4],scope.mixedChanges[2][4]],
                        [scope.totalChanges[2][5],0,scope.ruralChanges[2][5],scope.urbanChanges[2][5],0,scope.priceChanges[2][5],scope.valueChanges[2][5],scope.fashionChanges[2][5],scope.freaksChanges[2][5],0,scope.bmChanges[2][5],scope.onlineChanges[2][5],scope.mixedChanges[2][5]]
                    ];

                    scope.marketSales3Config = {
                        options: {
                            xAxis: {
                                categories: [Label.getContent('Total'), '', Label.getContent('Rural'), Label.getContent('Urban'), '', Label.getContent('Price Sensitive'),Label.getContent('Value for Money'),Label.getContent('Health Conscious'),Label.getContent('Impatient'),'',Label.getContent('B&M Only'),Label.getContent('Online Only'),Label.getContent('Mixed')]
                            },
                            yAxis:{
                                title:{text:"units mln"}
                            },
                            chart: {
                                type: 'areaspline'
                            },
                            tooltip: {
                                formatter: function() {
                                    var s = '<p><b>'+this.series.name+'</b></p>'+'<p>'+Label.getContent('Volume Sales')+':'+this.point.y+'(units mln)</p>'+'<p>'+scope.change3s[this.series._i][this.point.x]+' '+Label.getContent('over previous period')+'</p>';
                                    return s;
                                },
                                shared: false,
                                useHTML: true
                            },
                            plotOptions: {
                                series: {
                                    stacking: 'normal'
                                }
                            }
                        },
                        series: scope.marketSales3Series,
                        title: {
                            text: Label.getContent('HealthBeauties')+' - '+Label.getContent('Volume Sales')
                        },
                        credits: {
                            enabled: true
                        },
                        loading: false
                    }

                    scope.marketSales4Series = [
                        {"name": Label.getContent('Producer')+' 1', "data": [scope.totals[3][0],0,scope.rurals[3][0],scope.urbans[3][0],0,scope.prices[3][0],scope.values[3][0],scope.fashions[3][0],scope.freakss[3][0],0,scope.bms[3][0],scope.onlines[3][0],scope.mixeds[3][0]], type: "column",color:'#3257A7'},
                        {"name": Label.getContent('Producer')+' 2', "data": [scope.totals[3][1],0,scope.rurals[3][1],scope.urbans[3][1],0,scope.prices[3][1],scope.values[3][1],scope.fashions[3][1],scope.freakss[3][1],0,scope.bms[3][1],scope.onlines[3][1],scope.mixeds[3][1]], type: "column",color:'#B11E22'},
                        {"name": Label.getContent('Producer')+' 3', "data": [scope.totals[3][2],0,scope.rurals[3][2],scope.urbans[3][2],0,scope.prices[3][2],scope.values[3][2],scope.fashions[3][2],scope.freakss[3][2],0,scope.bms[3][2],scope.onlines[3][2],scope.mixeds[3][2]], type: "column",color:'#F6B920'},
                        {"name": Label.getContent('Producer')+' 4', "data": [scope.totals[3][3],0,scope.rurals[3][3],scope.urbans[3][3],0,scope.prices[3][3],scope.values[3][3],scope.fashions[3][3],scope.freakss[3][3],0,scope.bms[3][3],scope.onlines[3][3],scope.mixeds[3][3]], type: "column",color:'#329444'},
                        {"name": Label.getContent('Retailer')+' 1', "data": [scope.totals[3][4],0,scope.rurals[3][4],scope.urbans[3][4],0,scope.prices[3][4],scope.values[3][4],scope.fashions[3][4],scope.freakss[3][4],0,scope.bms[3][4],scope.onlines[3][4],scope.mixeds[3][4]], type: "column",color:'#8B288B'},
                        {"name": Label.getContent('Retailer')+' 2', "data": [scope.totals[3][5],0,scope.rurals[3][5],scope.urbans[3][5],0,scope.prices[3][5],scope.values[3][5],scope.fashions[3][5],scope.freakss[3][5],0,scope.bms[3][5],scope.onlines[3][5],scope.mixeds[3][5]], type: "column",color:'#F05422'},
                    ];
                    scope.change4s=new Array();
                    for(i=0;i<6;i++){
                        scope.change4s[i]=new Array();
                    }

                    scope.change4s=[
                        [scope.totalChanges[3][0],0,scope.ruralChanges[3][0],scope.urbanChanges[3][0],0,scope.priceChanges[3][0],scope.valueChanges[3][0],scope.fashionChanges[3][0],scope.freaksChanges[3][0],0,scope.bmChanges[3][0],scope.onlineChanges[3][0],scope.mixedChanges[3][0]],
                        [scope.totalChanges[3][1],0,scope.ruralChanges[3][1],scope.urbanChanges[3][1],0,scope.priceChanges[3][1],scope.valueChanges[3][1],scope.fashionChanges[3][1],scope.freaksChanges[3][1],0,scope.bmChanges[3][1],scope.onlineChanges[3][1],scope.mixedChanges[3][1]],
                        [scope.totalChanges[3][2],0,scope.ruralChanges[3][2],scope.urbanChanges[3][2],0,scope.priceChanges[3][2],scope.valueChanges[3][2],scope.fashionChanges[3][2],scope.freaksChanges[3][2],0,scope.bmChanges[3][2],scope.onlineChanges[3][2],scope.mixedChanges[3][2]],
                        [scope.totalChanges[3][3],0,scope.ruralChanges[3][3],scope.urbanChanges[3][3],0,scope.priceChanges[3][3],scope.valueChanges[3][3],scope.fashionChanges[3][3],scope.freaksChanges[3][3],0,scope.bmChanges[3][3],scope.onlineChanges[3][3],scope.mixedChanges[3][3]],
                        [scope.totalChanges[3][4],0,scope.ruralChanges[3][4],scope.urbanChanges[3][4],0,scope.priceChanges[3][4],scope.valueChanges[3][4],scope.fashionChanges[3][4],scope.freaksChanges[3][4],0,scope.bmChanges[3][4],scope.onlineChanges[3][4],scope.mixedChanges[3][4]],
                        [scope.totalChanges[3][5],0,scope.ruralChanges[3][5],scope.urbanChanges[3][5],0,scope.priceChanges[3][5],scope.valueChanges[3][5],scope.fashionChanges[3][5],scope.freaksChanges[3][5],0,scope.bmChanges[3][5],scope.onlineChanges[3][5],scope.mixedChanges[3][5]]
                    ];

                    scope.marketSales4Config = {
                        options: {
                            xAxis: {
                                categories: [Label.getContent('Total'), '', Label.getContent('Rural'), Label.getContent('Urban'), '', Label.getContent('Price Sensitive'),Label.getContent('Value for Money'),Label.getContent('Health Conscious'),Label.getContent('Impatient'),'',Label.getContent('B&M Only'),Label.getContent('Online Only'),Label.getContent('Mixed')]
                            },
                            yAxis:{
                                title:{text:"$mln"}
                            },
                            chart: {
                                type: 'areaspline'
                            },
                            tooltip: {
                                formatter: function() {
                                    var s = '<p><b>'+this.series.name+'</b></p>'+'<p>'+Label.getContent('Value Sales')+':'+this.point.y+'($mln)</p>'+'<p>'+scope.change4s[this.series._i][this.point.x]+' '+Label.getContent('over previous period')+'</p>';
                                    return s;
                                },
                                shared: false,
                                useHTML: true
                            },
                            plotOptions: {
                                series: {
                                    stacking: 'normal'
                                }
                            }
                        },
                        series: scope.marketSales4Series,
                        title: {
                            text: Label.getContent('HealthBeauties')+' - '+Label.getContent('Value Sales')
                        },
                        credits: {
                            enabled: true
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

            }
        }
    }])
})