define(['app','socketIO','routingConfig'], function(app) {
	app.controller('summaryReportCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth','$anchorScroll','$q','PlayerInfo','SeminarInfo','PeriodInfo','Label','RoleInfo', function($scope, $http, ProducerDecisionBase,$rootScope,Auth,$anchorScroll,$q,PlayerInfo,SeminarInfo,PeriodInfo,Label,RoleInfo) {
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
		    if(RoleInfo.getRole()==2){
		    	$scope.producerShow=true;
		    	$scope.retailerShow=false;
		    }else if(RoleInfo.getRole()==4){
		    	$scope.retailerShow=true;
		    	$scope.producerShow=false;
		    }

		    var switching=function(type){
		    	$scope.Performance=$scope.MarketShare=$scope.MarketSales=$scope.Segment=$scope.Cross=$scope.Product=$scope.EMallPrices=$scope.ProducerConsolidate=$scope.ProducerBMBusiness=$scope.ProducerOnlineBusiness=$scope.ProducerProfitability=$scope.ProducerNegotiations=$scope.ElecssoriesConsumer=$scope.ElecssoriesShopper=$scope.ElecssoriesVolume=$scope.HealthBeautiesConsumer=$scope.HealthBeautiesShopper=$scope.HealthBeautiesVolume=$scope.ProducerKey=$scope.showRuralConsumer=$scope.showRuralShopper=$scope.showRuralVolume=$scope.showUrbanConsumer=$scope.showUrbanShopper=$scope.showUrbanVolume=$scope.showRetailerKey=$scope.showRetailerConsolidate=$scope.showRetailerRuralProfit=$scope.showRetailerUrbanProfit=$scope.showRetailerProfitability=$scope.showRetailerNegotiations=false;
		    	switch(type){
		    		case'showPerformance':$scope.Performance=true;break;
				    case'showMarketShare':$scope.MarketShare=true;break;
				    case'showMarketSales':$scope.MarketSales=true;break;
				    case'showSegment':$scope.Segment=true;break;
				    case'showCross':$scope.Cross=true;break;
				    case'showProduct':$scope.Product=true;break;
				    case'showEMallPrices':$scope.EMallPrices=true;break;
				    
				    case'showProducerConsolidate':$scope.ProducerConsolidate=true;break;
				    case'showProducerBMBusiness':$scope.ProducerBMBusiness=true;break;
				    case'showProducerOnlineBusiness':$scope.ProducerOnlineBusiness=true;break;
				    case'showProducerProfitability':$scope.ProducerProfitability=true;break;
				    case'showProducerNegotiations':$scope.ProducerNegotiations=true;break;
				    case'showElecssoriesConsumer':$scope.ElecssoriesConsumer=true;break;
				    case'showElecssoriesShopper':$scope.ElecssoriesShopper=true;break;
				    case'showElecssoriesVolume':$scope.ElecssoriesVolume=true;break;
				    case'showHealthBeautiesConsumer':$scope.HealthBeautiesConsumer=true;break;
				    case'showHealthBeautiesShopper':$scope.HealthBeautiesShopper=true;break;
				    case'showHealthBeautiesVolume':$scope.HealthBeautiesVolume=true;break;
				    case'showProducerKey':$scope.ProducerKey=true;break;
				   
				    case'showRetailerConsolidate':$scope.RetailerConsolidate=true;break;
				    case'showRetailerRuralProfit':$scope.RetailerRuralProfit=true;break;
				    case'showRetailerUrbanProfit':$scope.RetailerUrbanProfit=true;break;
				    case'showRetailerProfitability':$scope.RetailerProfitability=true;break;
				    case'showRetailerNegotiations':$scope.RetailerNegotiations=true;break;
				    case'showRuralConsumer':$scope.RuralConsumer=true;break;
				    case'showRuralShopper':$scope.RuralShopper=true;break;
				    case'showRuralVolume':$scope.RuralVolume=true;break;
				    case'showUrbanConsumer':$scope.UrbanConsumer=true;break;
				    case'showUrbanShopper':$scope.UrbanShopper=true;break;
				    case'showUrbanVolume':$scope.UrbanVolume=true;break;
				    case'showRetailerKey':$scope.RetailerKey=true;break;
		    	}
		    }

		    var showPerformance=function(){
		    	switching('showPerformance');
		    	var url='/performanceHighlights/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		$scope.operatingProfits=new Array();
			    	$scope.cumulativeInvestments=new Array();
			    	$scope.salesVolumes=new Array();
			    	$scope.salesValues=new Array();
			    	$scope.volumeShares=new Array();
			    	$scope.valueShares=new Array();
			    	for(var i=0;i<data.data[0].actorInfo.length;i++){
			    		$scope.operatingProfits.push({'value':data.data[0].actorInfo[i].grph_OperatingProfit});
			    		$scope.cumulativeInvestments.push({'value':data.data[0].actorInfo[i].grph_CumulativeInvestment});
			    		for(j=0;j<data.data[0].actorInfo[i].actorCategoryInfo.length-1;j++){
			    			$scope.salesVolumes.push({'value':data.data[0].actorInfo[i].actorCategoryInfo[j].grph_SalesVolume});
			    			$scope.salesValues.push({'value':data.data[0].actorInfo[i].actorCategoryInfo[j].grph_NetSalesValue});
			    			$scope.valueShares.push({'value':data.data[0].actorInfo[i].actorCategoryInfo[j].grph_ValueMarketShare});
			    			$scope.volumeShares.push({'value':data.data[0].actorInfo[i].actorCategoryInfo[j].grph_VolumeMarketShare});
			    		}
			    	}
		    	},function(){
		    		console.log('fail');
		    	});
		    }

		    var showMarketShare=function(){
		    	switching('showMarketShare');
		    	var url='/marketShare/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		$scope.totals=$scope.totalChanges=$scope.rurals=$scope.ruralChanges=$scope.urbans=$scope.urbanChanges=$scope.prices=$scope.priceChanges=$scope.values=$scope.valueChanges=$scope.fashions=$scope.fashionChanges=$scope.freakss=$scope.freaksChanges=$scope.bms=$scope.bmChanges=$scope.onlines=$scope.onlineChanges=$scope.mixeds=$scope.mixedChanges=new Array();
			    	for(var i=0;i<4;i++){
			    		$scope.totals[i]=$scope.totalChanges[i]=$scope.rurals[i]=$scope.ruralChanges[i]=$scope.urbans[i]=$scope.urbanChanges[i]=$scope.prices[i]=$scope.priceChanges[i]=$scope.values[i]=$scope.valueChanges[i]=$scope.fashions[i]=$scope.fashionChanges[i]=$scope.freakss[i]=$scope.freaksChanges[i]=$scope.bms[i]=$scope.bmChanges[i]=$scope.onlines[i]=$scope.onlineChanges[i]=$scope.mixeds[i]=$scope.mixedChanges[i]=new Array();
			    	}
			    	for(i=0;i<data.data[0].actorInfo.length;i++){
			    		for(var j=0;j<4;j+=2){
			    			var k=0;
			    			if(j>=2){
			    				k=1;
			    			}
			    			$scope.totals[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolume);
				    		$scope.totalChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolumeChange);
				    		$scope.totals[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValue);
				    		$scope.totalChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValueChange);
				    		$scope.rurals[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolume);
				    		$scope.ruralChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolumeChange);
				    		$scope.rurals[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValue);
				    		$scope.ruralChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValueChange);
				    		$scope.urbans[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolume);
				    		$scope.urbanChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolumeChange);
				    		$scope.urbans[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValue);
				    		$scope.urbanChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValueChange);
				    		$scope.prices[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grsom_MarketShareVolume);
				    		$scope.priceChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grsom_MarketShareVolumeChange);
				    		$scope.prices[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grsom_MarketShareValue);
				    		$scope.values[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grsom_MarketShareVolume);
				    		$scope.valueChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grsom_MarketShareVolumeChange);
				    		$scope.values[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grsom_MarketShareValue);
				    		$scope.valueChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grsom_MarketShareValueChange);
				    		$scope.fashions[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grsom_MarketShareVolume);
				    		$scope.fashionChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grsom_MarketShareVolumeChange);
				    		$scope.fashions[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grsom_MarketShareValue);
				    		$scope.fashionChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grsom_MarketShareValueChange);
				    		$scope.freakss[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grsom_MarketShareVolume);
				    		$scope.freaksChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grsom_MarketShareVolumeChange);
				    		$scope.freakss[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grsom_MarketShareValue);
				    		$scope.freaksChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grsom_MarketShareValueChange);
				    		$scope.bms[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grsom_MarketShareVolume);
				    		$scope.bmChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grsom_MarketShareVolumeChange);
				    		$scope.bms[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grsom_MarketShareValue);
				    		$scope.bmChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grsom_MarketShareValueChange);
				    		$scope.onlines[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grsom_MarketShareVolume);
				    		$scope.onlineChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grsom_MarketShareVolumeChange);
				    		$scope.onlines[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grsom_MarketShareValue);
				    		$scope.onlineChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grsom_MarketShareValueChange);
				    		$scope.mixeds[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grsom_MarketShareVolume);
				    		$scope.mixedChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grsom_MarketShareVolumeChange);
				    		$scope.mixeds[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grsom_MarketShareValue);
				    		$scope.mixedChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grsom_MarketShareValueChange);
			    		
			    		}
			    	}

			    	$scope.chart1Series = [			        
				        {"name": Label.getContent('Producer')+' 1', "data": [$scope.totals[0][0],0,$scope.rurals[0][0],$scope.urbans[0][0],0,$scope.prices[0][0],$scope.values[0][0],$scope.fashions[0][0],$scope.freakss[0][0],0,$scope.bms[0][0],$scope.onlines[0][0],$scope.mixeds[0][0]], type: "column",color:'#3257A7'},
				        {"name": Label.getContent('Producer')+' 2', "data": [$scope.totals[0][1],0,$scope.rurals[0][1],$scope.urbans[0][1],0,$scope.prices[0][1],$scope.values[0][1],$scope.fashions[0][1],$scope.freakss[0][1],0,$scope.bms[0][1],$scope.onlines[0][1],$scope.mixeds[0][1]], type: "column",color:'#B11E22'},
				        {"name": Label.getContent('Producer')+' 3', "data": [$scope.totals[0][2],0,$scope.rurals[0][2],$scope.urbans[0][2],0,$scope.prices[0][2],$scope.values[0][2],$scope.fashions[0][2],$scope.freakss[0][2],0,$scope.bms[0][2],$scope.onlines[0][2],$scope.mixeds[0][2]], type: "column",color:'#F6B920'},
				        {"name": Label.getContent('Producer')+' 4', "data": [$scope.totals[0][3],0,$scope.rurals[0][3],$scope.urbans[0][3],0,$scope.prices[0][3],$scope.values[0][3],$scope.fashions[0][3],$scope.freakss[0][3],0,$scope.bms[0][3],$scope.onlines[0][3],$scope.mixeds[0][3]], type: "column",color:'#329444'},
				      	{"name": Label.getContent('Retailer')+' 1', "data": [$scope.totals[0][4],0,$scope.rurals[0][4],$scope.urbans[0][4],0,$scope.prices[0][4],$scope.values[0][4],$scope.fashions[0][4],$scope.freakss[0][4],0,$scope.bms[0][4],$scope.onlines[0][4],$scope.mixeds[0][4]], type: "column",color:'#8B288B'},
				        {"name": Label.getContent('Retailer')+' 2', "data": [$scope.totals[0][5],0,$scope.rurals[0][5],$scope.urbans[0][5],0,$scope.prices[0][5],$scope.values[0][5],$scope.fashions[0][5],$scope.freakss[0][5],0,$scope.bms[0][5],$scope.onlines[0][5],$scope.mixeds[0][5]], type: "column",color:'#F05422'},
				    ];

				    $scope.change1s=$scope.change2s=$scope.change3s=$scope.change4s=new Array();
				    for(var i=0;i<6;i++){
				    	$scope.change1s[i]=$scope.change2s[i]=$scope.change3s[i]=$scope.change4s[i]=new Array();
				    }

				    $scope.change1s=[
				    	[$scope.totalChanges[0][0],0,$scope.ruralChanges[0][0],$scope.urbanChanges[0][0],0,$scope.priceChanges[0][0],$scope.valueChanges[0][0],$scope.fashionChanges[0][0],$scope.freaksChanges[0][0],0,$scope.bmChanges[0][0],$scope.onlineChanges[0][0],$scope.mixedChanges[0][0]],
				    	[$scope.totalChanges[0][1],0,$scope.ruralChanges[0][1],$scope.urbanChanges[0][1],0,$scope.priceChanges[0][1],$scope.valueChanges[0][1],$scope.fashionChanges[0][1],$scope.freaksChanges[0][1],0,$scope.bmChanges[0][1],$scope.onlineChanges[0][1],$scope.mixedChanges[0][1]],
				    	[$scope.totalChanges[0][2],0,$scope.ruralChanges[0][2],$scope.urbanChanges[0][2],0,$scope.priceChanges[0][2],$scope.valueChanges[0][2],$scope.fashionChanges[0][2],$scope.freaksChanges[0][2],0,$scope.bmChanges[0][2],$scope.onlineChanges[0][2],$scope.mixedChanges[0][2]],
				    	[$scope.totalChanges[0][3],0,$scope.ruralChanges[0][3],$scope.urbanChanges[0][3],0,$scope.priceChanges[0][3],$scope.valueChanges[0][3],$scope.fashionChanges[0][3],$scope.freaksChanges[0][3],0,$scope.bmChanges[0][3],$scope.onlineChanges[0][3],$scope.mixedChanges[0][3]],
				    	[$scope.totalChanges[0][4],0,$scope.ruralChanges[0][4],$scope.urbanChanges[0][4],0,$scope.priceChanges[0][4],$scope.valueChanges[0][4],$scope.fashionChanges[0][4],$scope.freaksChanges[0][4],0,$scope.bmChanges[0][4],$scope.onlineChanges[0][4],$scope.mixedChanges[0][4]],
				    	[$scope.totalChanges[0][5],0,$scope.ruralChanges[0][5],$scope.urbanChanges[0][5],0,$scope.priceChanges[0][5],$scope.valueChanges[0][5],$scope.fashionChanges[0][5],$scope.freaksChanges[0][5],0,$scope.bmChanges[0][5],$scope.onlineChanges[0][5],$scope.mixedChanges[0][5]]
				    ];

				    $scope.chart1Config = {
				        options: {
				        	xAxis: {
					            categories: [Label.getContent('Total'), '', Label.getContent('Rural'), Label.getContent('Urban'), '', Label.getContent('Price Sensitive'),Label.getContent('Value for Money'),Label.getContent('Fashion'),Label.getContent('Freaks'),'',Label.getContent('B&M Only'),Label.getContent('Online Only'),Label.getContent('Mixed')]
					        },
					        yAxis:{
					        	title:''
					        },
				            chart: {
				                type: 'areaspline'
				            },
				            tooltip: {
					            formatter: function() {
					                var s = '<p><b>'+this.series.name+'</b></p>'+'<p>'+Label.getContent('Volume Market Shares')+':'+this.point.percentage.toFixed(2)+'%</p>'+'<p>'+$scope.change1s[this.series._i][this.point.x]+' '+Label.getContent('over previous period')+'</p>';
					                return s;
					            },
					            shared: false,
					            useHTML: true
					        },
				            plotOptions: {
				                series: {
				                    stacking: 'percent'
				                }
				            }
				        },
				        series: $scope.chart1Series,
				        title: {
				            text: Label.getContent('Elecssories')+' - '+Label.getContent('Volume Market Shares')
				        },
				        credits: {
				            enabled: true
				        },
				        loading: false
				    }

				    $scope.chart2Series = [
				        {"name": Label.getContent('Producer')+' 1', "data": [$scope.totals[1][0],0,$scope.rurals[1][0],$scope.urbans[1][0],0,$scope.prices[1][0],$scope.values[1][0],$scope.fashions[1][0],$scope.freakss[1][0],0,$scope.bms[1][0],$scope.onlines[1][0],$scope.mixeds[1][0]], type: "column",color:'#3257A7'},
				        {"name": Label.getContent('Producer')+' 2', "data": [$scope.totals[1][1],0,$scope.rurals[1][1],$scope.urbans[1][1],0,$scope.prices[1][1],$scope.values[1][1],$scope.fashions[1][1],$scope.freakss[1][1],0,$scope.bms[1][1],$scope.onlines[1][1],$scope.mixeds[1][1]], type: "column",color:'#B11E22'},
				        {"name": Label.getContent('Producer')+' 3', "data": [$scope.totals[1][2],0,$scope.rurals[1][2],$scope.urbans[1][2],0,$scope.prices[1][2],$scope.values[1][2],$scope.fashions[1][2],$scope.freakss[1][2],0,$scope.bms[1][2],$scope.onlines[1][2],$scope.mixeds[1][2]], type: "column",color:'#F6B920'},
				        {"name": Label.getContent('Producer')+' 4', "data": [$scope.totals[1][3],0,$scope.rurals[1][3],$scope.urbans[1][3],0,$scope.prices[1][3],$scope.values[1][3],$scope.fashions[1][3],$scope.freakss[1][3],0,$scope.bms[1][3],$scope.onlines[1][3],$scope.mixeds[1][3]], type: "column",color:'#329444'},
				      	{"name": Label.getContent('Retailer')+' 1', "data": [$scope.totals[1][4],0,$scope.rurals[1][4],$scope.urbans[1][4],0,$scope.prices[1][4],$scope.values[1][4],$scope.fashions[1][4],$scope.freakss[1][4],0,$scope.bms[1][4],$scope.onlines[1][4],$scope.mixeds[1][4]], type: "column",color:'#8B288B'},
				        {"name": Label.getContent('Retailer')+' 2', "data": [$scope.totals[1][5],0,$scope.rurals[1][5],$scope.urbans[1][5],0,$scope.prices[1][5],$scope.values[1][5],$scope.fashions[1][5],$scope.freakss[1][5],0,$scope.bms[1][5],$scope.onlines[1][5],$scope.mixeds[1][5]], type: "column",color:'#F05422'},
				    ];

				    $scope.change2s=[
				    	[$scope.totalChanges[1][0],0,$scope.ruralChanges[1][0],$scope.urbanChanges[1][0],0,$scope.priceChanges[1][0],$scope.valueChanges[1][0],$scope.fashionChanges[1][0],$scope.freaksChanges[1][0],0,$scope.bmChanges[1][0],$scope.onlineChanges[1][0],$scope.mixedChanges[1][0]],
				    	[$scope.totalChanges[1][1],0,$scope.ruralChanges[1][1],$scope.urbanChanges[1][1],0,$scope.priceChanges[1][1],$scope.valueChanges[1][1],$scope.fashionChanges[1][1],$scope.freaksChanges[1][1],0,$scope.bmChanges[1][1],$scope.onlineChanges[1][1],$scope.mixedChanges[1][1]],
				    	[$scope.totalChanges[1][2],0,$scope.ruralChanges[1][2],$scope.urbanChanges[1][2],0,$scope.priceChanges[1][2],$scope.valueChanges[1][2],$scope.fashionChanges[1][2],$scope.freaksChanges[1][2],0,$scope.bmChanges[1][2],$scope.onlineChanges[1][2],$scope.mixedChanges[1][2]],
				    	[$scope.totalChanges[1][3],0,$scope.ruralChanges[1][3],$scope.urbanChanges[1][3],0,$scope.priceChanges[1][3],$scope.valueChanges[1][3],$scope.fashionChanges[1][3],$scope.freaksChanges[1][3],0,$scope.bmChanges[1][3],$scope.onlineChanges[1][3],$scope.mixedChanges[1][3]],
				    	[$scope.totalChanges[1][4],0,$scope.ruralChanges[1][4],$scope.urbanChanges[1][4],0,$scope.priceChanges[1][4],$scope.valueChanges[1][4],$scope.fashionChanges[1][4],$scope.freaksChanges[1][4],0,$scope.bmChanges[1][4],$scope.onlineChanges[1][4],$scope.mixedChanges[1][4]],
				    	[$scope.totalChanges[1][5],0,$scope.ruralChanges[1][5],$scope.urbanChanges[1][5],0,$scope.priceChanges[1][5],$scope.valueChanges[1][5],$scope.fashionChanges[1][5],$scope.freaksChanges[1][5],0,$scope.bmChanges[1][5],$scope.onlineChanges[1][5],$scope.mixedChanges[1][5]]
				    ];

				    $scope.chart2Config = {
				        options: {

				        	xAxis: {
					            categories: [Label.getContent('Total'), '', Label.getContent('Rural'), Label.getContent('Urban'), '', Label.getContent('Price Sensitive'),Label.getContent('Value for Money'),Label.getContent('Fashion'),Label.getContent('Freaks'),'',Label.getContent('B&M Only'),Label.getContent('Online Only'),Label.getContent('Mixed')]
					        },
					        yAxis:{
					        	title:''
					        },
				            chart: {
				                type: 'areaspline'
				            },
				            tooltip: {
					            formatter: function() {
					                var s = '<p><b>'+this.series.name+'</b></p>'+'<p>'+Label.getContent('Value Market Shares')+':'+this.point.percentage.toFixed(2)+'%</p>'+'<p>'+$scope.change2s[this.series._i][this.point.x]+' '+Label.getContent('over previous period')+'</p>';
					                return s;
					            },
					            shared: false,
					            useHTML: true
					        },
				            plotOptions: {
				                series: {
				                    stacking: 'percent'
				                }
				            }
				        },
				        series: $scope.chart2Series,
				        title: {
				            text: Label.getContent('Elecssories')+' - '+Label.getContent('Value Market Shares')
				        },
				        credits: {
				            enabled: true
				        },
				        loading: false
				    }

				    $scope.chart3Series = [
				        {"name": Label.getContent('Producer')+' 1', "data": [$scope.totals[2][0],0,$scope.rurals[2][0],$scope.urbans[2][0],0,$scope.prices[2][0],$scope.values[2][0],$scope.fashions[2][0],$scope.freakss[2][0],0,$scope.bms[2][0],$scope.onlines[2][0],$scope.mixeds[2][0]], type: "column",color:'#3257A7'},
				        {"name": Label.getContent('Producer')+' 2', "data": [$scope.totals[2][1],0,$scope.rurals[2][1],$scope.urbans[2][1],0,$scope.prices[2][1],$scope.values[2][1],$scope.fashions[2][1],$scope.freakss[2][1],0,$scope.bms[2][1],$scope.onlines[2][1],$scope.mixeds[2][1]], type: "column",color:'#B11E22'},
				        {"name": Label.getContent('Producer')+' 3', "data": [$scope.totals[2][2],0,$scope.rurals[2][2],$scope.urbans[2][2],0,$scope.prices[2][2],$scope.values[2][2],$scope.fashions[2][2],$scope.freakss[2][2],0,$scope.bms[2][2],$scope.onlines[2][2],$scope.mixeds[2][2]], type: "column",color:'#F6B920'},
				        {"name": Label.getContent('Producer')+' 4', "data": [$scope.totals[2][3],0,$scope.rurals[2][3],$scope.urbans[2][3],0,$scope.prices[2][3],$scope.values[2][3],$scope.fashions[2][3],$scope.freakss[2][3],0,$scope.bms[2][3],$scope.onlines[2][3],$scope.mixeds[2][3]], type: "column",color:'#329444'},
				      	{"name": Label.getContent('Retailer')+' 1', "data": [$scope.totals[2][4],0,$scope.rurals[2][4],$scope.urbans[2][4],0,$scope.prices[2][4],$scope.values[2][4],$scope.fashions[2][4],$scope.freakss[2][4],0,$scope.bms[2][4],$scope.onlines[2][4],$scope.mixeds[2][4]], type: "column",color:'#8B288B'},
				        {"name": Label.getContent('Retailer')+' 2', "data": [$scope.totals[2][5],0,$scope.rurals[2][5],$scope.urbans[2][5],0,$scope.prices[2][5],$scope.values[2][5],$scope.fashions[2][5],$scope.freakss[2][5],0,$scope.bms[2][5],$scope.onlines[2][5],$scope.mixeds[2][5]], type: "column",color:'#F05422'},
				    ];

				    $scope.change3s=[
				    	[$scope.totalChanges[2][0],0,$scope.ruralChanges[2][0],$scope.urbanChanges[2][0],0,$scope.priceChanges[2][0],$scope.valueChanges[2][0],$scope.fashionChanges[2][0],$scope.freaksChanges[2][0],0,$scope.bmChanges[2][0],$scope.onlineChanges[2][0],$scope.mixedChanges[2][0]],
				    	[$scope.totalChanges[2][1],0,$scope.ruralChanges[2][1],$scope.urbanChanges[2][1],0,$scope.priceChanges[2][1],$scope.valueChanges[2][1],$scope.fashionChanges[2][1],$scope.freaksChanges[2][1],0,$scope.bmChanges[2][1],$scope.onlineChanges[2][1],$scope.mixedChanges[2][1]],
				    	[$scope.totalChanges[2][2],0,$scope.ruralChanges[2][2],$scope.urbanChanges[2][2],0,$scope.priceChanges[2][2],$scope.valueChanges[2][2],$scope.fashionChanges[2][2],$scope.freaksChanges[2][2],0,$scope.bmChanges[2][2],$scope.onlineChanges[2][2],$scope.mixedChanges[2][2]],
				    	[$scope.totalChanges[2][3],0,$scope.ruralChanges[2][3],$scope.urbanChanges[2][3],0,$scope.priceChanges[2][3],$scope.valueChanges[2][3],$scope.fashionChanges[2][3],$scope.freaksChanges[2][3],0,$scope.bmChanges[2][3],$scope.onlineChanges[2][3],$scope.mixedChanges[2][3]],
				    	[$scope.totalChanges[2][4],0,$scope.ruralChanges[2][4],$scope.urbanChanges[2][4],0,$scope.priceChanges[2][4],$scope.valueChanges[2][4],$scope.fashionChanges[2][4],$scope.freaksChanges[2][4],0,$scope.bmChanges[2][4],$scope.onlineChanges[2][4],$scope.mixedChanges[2][4]],
				    	[$scope.totalChanges[2][5],0,$scope.ruralChanges[2][5],$scope.urbanChanges[2][5],0,$scope.priceChanges[2][5],$scope.valueChanges[2][5],$scope.fashionChanges[2][5],$scope.freaksChanges[2][5],0,$scope.bmChanges[2][5],$scope.onlineChanges[2][5],$scope.mixedChanges[2][5]]
				    ];

				    $scope.chart3Config = {
				        options: {
				        	xAxis: {
					            categories: [Label.getContent('Total'), '', Label.getContent('Rural'), Label.getContent('Urban'), '', Label.getContent('Price Sensitive'),Label.getContent('Value for Money'),Label.getContent('Fashion'),Label.getContent('Freaks'),'',Label.getContent('B&M Only'),Label.getContent('Online Only'),Label.getContent('Mixed')]
					        },
					        yAxis:{
					        	title:''
					        },
				            chart: {
				                type: 'areaspline'
				            },
				            tooltip: {
					            formatter: function() {
					                var s = '<p><b>'+this.series.name+'</b></p>'+'<p>'+Label.getContent('Volume Market Shares')+':'+this.point.percentage.toFixed(2)+'%</p>'+'<p>'+$scope.change3s[this.series._i][this.point.x]+' '+Label.getContent('over previous period')+'</p>';
					                return s;
					            },
					            shared: false,
					            useHTML: true
					        },
				            plotOptions: {
				                series: {
				                    stacking: 'percent'
				                }
				            }
				        },
				        series: $scope.chart3Series,
				        title: {
				            text: Label.getContent('HealthBeauties')+' - '+Label.getContent('Volume Market Shares')
				        },
				        credits: {
				            enabled: true
				        },
				        loading: false
				    }

				    $scope.chart4Series = [
				        {"name": Label.getContent('Producer')+' 1', "data": [$scope.totals[3][0],0,$scope.rurals[3][0],$scope.urbans[3][0],0,$scope.prices[3][0],$scope.values[3][0],$scope.fashions[3][0],$scope.freakss[3][0],0,$scope.bms[3][0],$scope.onlines[3][0],$scope.mixeds[3][0]], type: "column",color:'#3257A7'},
				        {"name": Label.getContent('Producer')+' 2', "data": [$scope.totals[3][1],0,$scope.rurals[3][1],$scope.urbans[3][1],0,$scope.prices[3][1],$scope.values[3][1],$scope.fashions[3][1],$scope.freakss[3][1],0,$scope.bms[3][1],$scope.onlines[3][1],$scope.mixeds[3][1]], type: "column",color:'#B11E22'},
				        {"name": Label.getContent('Producer')+' 3', "data": [$scope.totals[3][2],0,$scope.rurals[3][2],$scope.urbans[3][2],0,$scope.prices[3][2],$scope.values[3][2],$scope.fashions[3][2],$scope.freakss[3][2],0,$scope.bms[3][2],$scope.onlines[3][2],$scope.mixeds[3][2]], type: "column",color:'#F6B920'},
				        {"name": Label.getContent('Producer')+' 4', "data": [$scope.totals[3][3],0,$scope.rurals[3][3],$scope.urbans[3][3],0,$scope.prices[3][3],$scope.values[3][3],$scope.fashions[3][3],$scope.freakss[3][3],0,$scope.bms[3][3],$scope.onlines[3][3],$scope.mixeds[3][3]], type: "column",color:'#329444'},
				      	{"name": Label.getContent('Retailer')+' 1', "data": [$scope.totals[3][4],0,$scope.rurals[3][4],$scope.urbans[3][4],0,$scope.prices[3][4],$scope.values[3][4],$scope.fashions[3][4],$scope.freakss[3][4],0,$scope.bms[3][4],$scope.onlines[3][4],$scope.mixeds[3][4]], type: "column",color:'#8B288B'},
				        {"name": Label.getContent('Retailer')+' 2', "data": [$scope.totals[3][5],0,$scope.rurals[3][5],$scope.urbans[3][5],0,$scope.prices[3][5],$scope.values[3][5],$scope.fashions[3][5],$scope.freakss[3][5],0,$scope.bms[3][5],$scope.onlines[3][5],$scope.mixeds[3][5]], type: "column",color:'#F05422'},
				    ];

				    $scope.change4s=[
				    	[$scope.totalChanges[3][0],0,$scope.ruralChanges[3][0],$scope.urbanChanges[3][0],0,$scope.priceChanges[3][0],$scope.valueChanges[3][0],$scope.fashionChanges[3][0],$scope.freaksChanges[3][0],0,$scope.bmChanges[3][0],$scope.onlineChanges[3][0],$scope.mixedChanges[3][0]],
				    	[$scope.totalChanges[3][1],0,$scope.ruralChanges[3][1],$scope.urbanChanges[3][1],0,$scope.priceChanges[3][1],$scope.valueChanges[3][1],$scope.fashionChanges[3][1],$scope.freaksChanges[3][1],0,$scope.bmChanges[3][1],$scope.onlineChanges[3][1],$scope.mixedChanges[3][1]],
				    	[$scope.totalChanges[3][2],0,$scope.ruralChanges[3][2],$scope.urbanChanges[3][2],0,$scope.priceChanges[3][2],$scope.valueChanges[3][2],$scope.fashionChanges[3][2],$scope.freaksChanges[3][2],0,$scope.bmChanges[3][2],$scope.onlineChanges[3][2],$scope.mixedChanges[3][2]],
				    	[$scope.totalChanges[3][3],0,$scope.ruralChanges[3][3],$scope.urbanChanges[3][3],0,$scope.priceChanges[3][3],$scope.valueChanges[3][3],$scope.fashionChanges[3][3],$scope.freaksChanges[3][3],0,$scope.bmChanges[3][3],$scope.onlineChanges[3][3],$scope.mixedChanges[3][3]],
				    	[$scope.totalChanges[3][4],0,$scope.ruralChanges[3][4],$scope.urbanChanges[3][4],0,$scope.priceChanges[3][4],$scope.valueChanges[3][4],$scope.fashionChanges[3][4],$scope.freaksChanges[3][4],0,$scope.bmChanges[3][4],$scope.onlineChanges[3][4],$scope.mixedChanges[3][4]],
				    	[$scope.totalChanges[3][5],0,$scope.ruralChanges[3][5],$scope.urbanChanges[3][5],0,$scope.priceChanges[3][5],$scope.valueChanges[3][5],$scope.fashionChanges[3][5],$scope.freaksChanges[3][5],0,$scope.bmChanges[3][5],$scope.onlineChanges[3][5],$scope.mixedChanges[3][5]]
				    ];

				    $scope.chart4Config = {
				        options: {
				        	xAxis: {
					            categories: [Label.getContent('Total'), '', Label.getContent('Rural'), Label.getContent('Urban'), '', Label.getContent('Price Sensitive'),Label.getContent('Value for Money'),Label.getContent('Fashion'),Label.getContent('Freaks'),'',Label.getContent('B&M Only'),Label.getContent('Online Only'),Label.getContent('Mixed')]
					        },
					        yAxis:{
					        	title:''
					        },
				            chart: {
				                type: 'areaspline'
				            },
				            tooltip: {
					            formatter: function() {
					                var s = '<p><b>'+this.series.name+'</b></p>'+'<p>'+Label.getContent('Value Market Shares')+':'+this.point.percentage.toFixed(2)+'%</p>'+'<p>'+$scope.change4s[this.series._i][this.point.x]+' '+Label.getContent('over previous period')+'</p>';
					                return s;
					            },
					            shared: false,
					            useHTML: true
					        },
				            plotOptions: {
				                series: {
				                    stacking: 'percent'
				                }
				            }
				        },
				        series: $scope.chart4Series,
				        title: {
				            text: Label.getContent('HealthBeauties')+' - '+Label.getContent('Value Market Shares')
				        },
				        credits: {
				            enabled: true
				        },
				        loading: false
				    }
		    	});		    	
		    }

		    var showMarketSales=function(){
		    	switching('showMarketSales');

		    	var url='/marketSales/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		$scope.totals=$scope.totalChanges=$scope.rurals=$scope.ruralChanges=$scope.urbans=$scope.urbanChanges=$scope.prices=$scope.priceChanges=$scope.values=$scope.valueChanges=$scope.fashions=$scope.fashionChanges=$scope.freakss=$scope.freaksChanges=$scope.bms=$scope.bmChanges=$scope.onlines=$scope.onlineChanges=$scope.mixeds=$scope.mixedChanges=new Array();
		    		for(var i=0;i<4;i++){
			    		$scope.totals[i]=$scope.totalChanges[i]=$scope.rurals[i]=$scope.ruralChanges[i]=$scope.urbans[i]=$scope.urbanChanges[i]=$scope.prices[i]=$scope.priceChanges[i]=$scope.values[i]=$scope.valueChanges[i]=$scope.fashions[i]=$scope.fashionChanges[i]=$scope.freakss[i]=$scope.freaksChanges[i]=$scope.bms[i]=$scope.bmChanges[i]=$scope.onlines[i]=$scope.onlineChanges[i]=$scope.mixeds[i]=$scope.mixedChanges[i]=new Array();
			    	}

			    	for(i=0;i<data.data[0].actorInfo.length;i++){
			    		for(j=0;j<4;j+=2){
			    			var k=0;
			    			if(j>=2){
			    				k=1;
			    			};
			    			$scope.totals[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolume);
			    			$scope.totalChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolumeChange);
							$scope.totals[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValue);
			    			$scope.totalChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValueChange);
							$scope.rurals[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolume);
			    			$scope.ruralChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolumeChange);
			    			$scope.rurals[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValue);
			    			$scope.ruralChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValueChange);
				    		$scope.urbans[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolume);
				    		$scope.urbanChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolumeChange);
				    		$scope.urbans[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValue);
				    		$scope.urbanChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValueChange);
				    		$scope.prices[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grms_MarketSalesVolume);
				    		$scope.priceChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grms_MarketSalesVolumeChange);
				    		$scope.prices[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grms_MarketNetSalesValue);
				    		$scope.priceChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grms_MarketNetSalesValueChange);
				    		$scope.values[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grms_MarketSalesVolume);
				    		$scope.valueChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grms_MarketSalesVolumeChange);
				    		$scope.values[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grms_MarketNetSalesValue);
				    		$scope.valueChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grms_MarketNetSalesValueChange);
				    		$scope.fashions[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grms_MarketSalesVolume);
				    		$scope.fashionChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grms_MarketSalesVolumeChange);
				    		$scope.fashions[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grms_MarketNetSalesValue);
				    		$scope.fashionChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grms_MarketNetSalesValueChange);
				    		$scope.freakss[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grms_MarketSalesVolume);
				    		$scope.freaksChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grms_MarketSalesVolumeChange);
				    		$scope.freakss[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grms_MarketNetSalesValue);
				    		$scope.freaksChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grms_MarketNetSalesValueChange);
				    		$scope.bms[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grms_MarketSalesVolume);
				    		$scope.bmChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grms_MarketSalesVolumeChange);
				    		$scope.bms[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grms_MarketNetSalesValue);
				    		$scope.bmChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grms_MarketNetSalesValueChange);
				    		$scope.onlines[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grms_MarketSalesVolume);
				    		$scope.onlineChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grms_MarketSalesVolumeChange);
				    		$scope.onlines[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grms_MarketNetSalesValue);
				    		$scope.onlineChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grms_MarketNetSalesValueChange);
							$scope.mixeds[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grms_MarketSalesVolume);
				    		$scope.mixedChanges[j].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grms_MarketSalesVolumeChange);
				    		$scope.mixeds[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grms_MarketNetSalesValue);
				    		$scope.mixedChanges[j+1].push(data.data[0].actorInfo[i].actorCategoryInfo[k].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grms_MarketNetSalesValueChange);
			    		}
			    	}

			    	$scope.chart1Series = [			        
				        {"name": Label.getContent('Producer')+' 1', "data": [$scope.totals[0][0],0,$scope.rurals[0][0],$scope.urbans[0][0],0,$scope.prices[0][0],$scope.values[0][0],$scope.fashions[0][0],$scope.freakss[0][0],0,$scope.bms[0][0],$scope.onlines[0][0],$scope.mixeds[0][0]], type: "column",color:'#3257A7'},
				        {"name": Label.getContent('Producer')+' 2', "data": [$scope.totals[0][1],0,$scope.rurals[0][1],$scope.urbans[0][1],0,$scope.prices[0][1],$scope.values[0][1],$scope.fashions[0][1],$scope.freakss[0][1],0,$scope.bms[0][1],$scope.onlines[0][1],$scope.mixeds[0][1]], type: "column",color:'#B11E22'},
				        {"name": Label.getContent('Producer')+' 3', "data": [$scope.totals[0][2],0,$scope.rurals[0][2],$scope.urbans[0][2],0,$scope.prices[0][2],$scope.values[0][2],$scope.fashions[0][2],$scope.freakss[0][2],0,$scope.bms[0][2],$scope.onlines[0][2],$scope.mixeds[0][2]], type: "column",color:'#F6B920'},
				        {"name": Label.getContent('Producer')+' 4', "data": [$scope.totals[0][3],0,$scope.rurals[0][3],$scope.urbans[0][3],0,$scope.prices[0][3],$scope.values[0][3],$scope.fashions[0][3],$scope.freakss[0][3],0,$scope.bms[0][3],$scope.onlines[0][3],$scope.mixeds[0][3]], type: "column",color:'#329444'},
				      	{"name": Label.getContent('Retailer')+' 1', "data": [$scope.totals[0][4],0,$scope.rurals[0][4],$scope.urbans[0][4],0,$scope.prices[0][4],$scope.values[0][4],$scope.fashions[0][4],$scope.freakss[0][4],0,$scope.bms[0][4],$scope.onlines[0][4],$scope.mixeds[0][4]], type: "column",color:'#8B288B'},
				        {"name": Label.getContent('Retailer')+' 2', "data": [$scope.totals[0][5],0,$scope.rurals[0][5],$scope.urbans[0][5],0,$scope.prices[0][5],$scope.values[0][5],$scope.fashions[0][5],$scope.freakss[0][5],0,$scope.bms[0][5],$scope.onlines[0][5],$scope.mixeds[0][5]], type: "column",color:'#F05422'},
				    ];

				    $scope.change1s=$scope.change2s=$scope.change3s=$scope.change4s=new Array();
				    for(var i=0;i<6;i++){
				    	$scope.change1s[i]=$scope.change2s[i]=$scope.change3s[i]=$scope.change4s[i]=new Array();
				    }

				    $scope.change1s=[
				    	[$scope.totalChanges[0][0],0,$scope.ruralChanges[0][0],$scope.urbanChanges[0][0],0,$scope.priceChanges[0][0],$scope.valueChanges[0][0],$scope.fashionChanges[0][0],$scope.freaksChanges[0][0],0,$scope.bmChanges[0][0],$scope.onlineChanges[0][0],$scope.mixedChanges[0][0]],
				    	[$scope.totalChanges[0][1],0,$scope.ruralChanges[0][1],$scope.urbanChanges[0][1],0,$scope.priceChanges[0][1],$scope.valueChanges[0][1],$scope.fashionChanges[0][1],$scope.freaksChanges[0][1],0,$scope.bmChanges[0][1],$scope.onlineChanges[0][1],$scope.mixedChanges[0][1]],
				    	[$scope.totalChanges[0][2],0,$scope.ruralChanges[0][2],$scope.urbanChanges[0][2],0,$scope.priceChanges[0][2],$scope.valueChanges[0][2],$scope.fashionChanges[0][2],$scope.freaksChanges[0][2],0,$scope.bmChanges[0][2],$scope.onlineChanges[0][2],$scope.mixedChanges[0][2]],
				    	[$scope.totalChanges[0][3],0,$scope.ruralChanges[0][3],$scope.urbanChanges[0][3],0,$scope.priceChanges[0][3],$scope.valueChanges[0][3],$scope.fashionChanges[0][3],$scope.freaksChanges[0][3],0,$scope.bmChanges[0][3],$scope.onlineChanges[0][3],$scope.mixedChanges[0][3]],
				    	[$scope.totalChanges[0][4],0,$scope.ruralChanges[0][4],$scope.urbanChanges[0][4],0,$scope.priceChanges[0][4],$scope.valueChanges[0][4],$scope.fashionChanges[0][4],$scope.freaksChanges[0][4],0,$scope.bmChanges[0][4],$scope.onlineChanges[0][4],$scope.mixedChanges[0][4]],
				    	[$scope.totalChanges[0][5],0,$scope.ruralChanges[0][5],$scope.urbanChanges[0][5],0,$scope.priceChanges[0][5],$scope.valueChanges[0][5],$scope.fashionChanges[0][5],$scope.freaksChanges[0][5],0,$scope.bmChanges[0][5],$scope.onlineChanges[0][5],$scope.mixedChanges[0][5]]
				    ];

				    $scope.chart1Config = {
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
					                var s = '<p><b>'+this.series.name+'</b></p>'+'<p>'+Label.getContent('Volume Sales')+':'+this.point.y+'(units mln)</p>'+'<p>'+$scope.change1s[this.series._i][this.point.x]+' '+Label.getContent('over previous period')+'</p>';
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
				        series: $scope.chart1Series,
				        title: {
				            text: Label.getContent('Elecssories')+' - '+Label.getContent('Volume Sales')
				        },
				        credits: {
				            enabled: true
				        },
				        loading: false
				    }

				    $scope.chart2Series = [
				        {"name": Label.getContent('Producer')+' 1', "data": [$scope.totals[1][0],0,$scope.rurals[1][0],$scope.urbans[1][0],0,$scope.prices[1][0],$scope.values[1][0],$scope.fashions[1][0],$scope.freakss[1][0],0,$scope.bms[1][0],$scope.onlines[1][0],$scope.mixeds[1][0]], type: "column",color:'#3257A7'},
				        {"name": Label.getContent('Producer')+' 2', "data": [$scope.totals[1][1],0,$scope.rurals[1][1],$scope.urbans[1][1],0,$scope.prices[1][1],$scope.values[1][1],$scope.fashions[1][1],$scope.freakss[1][1],0,$scope.bms[1][1],$scope.onlines[1][1],$scope.mixeds[1][1]], type: "column",color:'#B11E22'},
				        {"name": Label.getContent('Producer')+' 3', "data": [$scope.totals[1][2],0,$scope.rurals[1][2],$scope.urbans[1][2],0,$scope.prices[1][2],$scope.values[1][2],$scope.fashions[1][2],$scope.freakss[1][2],0,$scope.bms[1][2],$scope.onlines[1][2],$scope.mixeds[1][2]], type: "column",color:'#F6B920'},
				        {"name": Label.getContent('Producer')+' 4', "data": [$scope.totals[1][3],0,$scope.rurals[1][3],$scope.urbans[1][3],0,$scope.prices[1][3],$scope.values[1][3],$scope.fashions[1][3],$scope.freakss[1][3],0,$scope.bms[1][3],$scope.onlines[1][3],$scope.mixeds[1][3]], type: "column",color:'#329444'},
				      	{"name": Label.getContent('Retailer')+' 1', "data": [$scope.totals[1][4],0,$scope.rurals[1][4],$scope.urbans[1][4],0,$scope.prices[1][4],$scope.values[1][4],$scope.fashions[1][4],$scope.freakss[1][4],0,$scope.bms[1][4],$scope.onlines[1][4],$scope.mixeds[1][4]], type: "column",color:'#8B288B'},
				        {"name": Label.getContent('Retailer')+' 2', "data": [$scope.totals[1][5],0,$scope.rurals[1][5],$scope.urbans[1][5],0,$scope.prices[1][5],$scope.values[1][5],$scope.fashions[1][5],$scope.freakss[1][5],0,$scope.bms[1][5],$scope.onlines[1][5],$scope.mixeds[1][5]], type: "column",color:'#F05422'},
				    ];

				    $scope.change2s=new Array();
				    for(i=0;i<6;i++){
				    	$scope.change2s[i]=new Array();
				    }

				    $scope.change2s=[
				    	[$scope.totalChanges[1][0],0,$scope.ruralChanges[1][0],$scope.urbanChanges[1][0],0,$scope.priceChanges[1][0],$scope.valueChanges[1][0],$scope.fashionChanges[1][0],$scope.freaksChanges[1][0],0,$scope.bmChanges[1][0],$scope.onlineChanges[1][0],$scope.mixedChanges[1][0]],
				    	[$scope.totalChanges[1][1],0,$scope.ruralChanges[1][1],$scope.urbanChanges[1][1],0,$scope.priceChanges[1][1],$scope.valueChanges[1][1],$scope.fashionChanges[1][1],$scope.freaksChanges[1][1],0,$scope.bmChanges[1][1],$scope.onlineChanges[1][1],$scope.mixedChanges[1][1]],
				    	[$scope.totalChanges[1][2],0,$scope.ruralChanges[1][2],$scope.urbanChanges[1][2],0,$scope.priceChanges[1][2],$scope.valueChanges[1][2],$scope.fashionChanges[1][2],$scope.freaksChanges[1][2],0,$scope.bmChanges[1][2],$scope.onlineChanges[1][2],$scope.mixedChanges[1][2]],
				    	[$scope.totalChanges[1][3],0,$scope.ruralChanges[1][3],$scope.urbanChanges[1][3],0,$scope.priceChanges[1][3],$scope.valueChanges[1][3],$scope.fashionChanges[1][3],$scope.freaksChanges[1][3],0,$scope.bmChanges[1][3],$scope.onlineChanges[1][3],$scope.mixedChanges[1][3]],
				    	[$scope.totalChanges[1][4],0,$scope.ruralChanges[1][4],$scope.urbanChanges[1][4],0,$scope.priceChanges[1][4],$scope.valueChanges[1][4],$scope.fashionChanges[1][4],$scope.freaksChanges[1][4],0,$scope.bmChanges[1][4],$scope.onlineChanges[1][4],$scope.mixedChanges[1][4]],
				    	[$scope.totalChanges[1][5],0,$scope.ruralChanges[1][5],$scope.urbanChanges[1][5],0,$scope.priceChanges[1][5],$scope.valueChanges[1][5],$scope.fashionChanges[1][5],$scope.freaksChanges[1][5],0,$scope.bmChanges[1][5],$scope.onlineChanges[1][5],$scope.mixedChanges[1][5]]
				    ];


				    $scope.chart2Config = {
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
					                var s = '<p><b>'+this.series.name+'</b></p>'+'<p>'+Label.getContent('Value Sales')+':'+this.point.y+'($mln)</p>'+'<p>'+$scope.change2s[this.series._i][this.point.x]+' '+Label.getContent('over previous period')+'</p>';
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
				        series: $scope.chart2Series,
				        title: {
				            text: Label.getContent('Elecssories')+' - '+Label.getContent('Value Sales')
				        },
				        credits: {
				            enabled: true
				        },
				        loading: false
				    }

				    $scope.chart3Series = [
				        {"name": Label.getContent('Producer')+' 1', "data": [$scope.totals[2][0],0,$scope.rurals[2][0],$scope.urbans[2][0],0,$scope.prices[2][0],$scope.values[2][0],$scope.fashions[2][0],$scope.freakss[2][0],0,$scope.bms[2][0],$scope.onlines[2][0],$scope.mixeds[2][0]], type: "column",color:'#3257A7'},
				        {"name": Label.getContent('Producer')+' 2', "data": [$scope.totals[2][1],0,$scope.rurals[2][1],$scope.urbans[2][1],0,$scope.prices[2][1],$scope.values[2][1],$scope.fashions[2][1],$scope.freakss[2][1],0,$scope.bms[2][1],$scope.onlines[2][1],$scope.mixeds[2][1]], type: "column",color:'#B11E22'},
				        {"name": Label.getContent('Producer')+' 3', "data": [$scope.totals[2][2],0,$scope.rurals[2][2],$scope.urbans[2][2],0,$scope.prices[2][2],$scope.values[2][2],$scope.fashions[2][2],$scope.freakss[2][2],0,$scope.bms[2][2],$scope.onlines[2][2],$scope.mixeds[2][2]], type: "column",color:'#F6B920'},
				        {"name": Label.getContent('Producer')+' 4', "data": [$scope.totals[2][3],0,$scope.rurals[2][3],$scope.urbans[2][3],0,$scope.prices[2][3],$scope.values[2][3],$scope.fashions[2][3],$scope.freakss[2][3],0,$scope.bms[2][3],$scope.onlines[2][3],$scope.mixeds[2][3]], type: "column",color:'#329444'},
				      	{"name": Label.getContent('Retailer')+' 1', "data": [$scope.totals[2][4],0,$scope.rurals[2][4],$scope.urbans[2][4],0,$scope.prices[2][4],$scope.values[2][4],$scope.fashions[2][4],$scope.freakss[2][4],0,$scope.bms[2][4],$scope.onlines[2][4],$scope.mixeds[2][4]], type: "column",color:'#8B288B'},
				        {"name": Label.getContent('Retailer')+' 2', "data": [$scope.totals[2][5],0,$scope.rurals[2][5],$scope.urbans[2][5],0,$scope.prices[2][5],$scope.values[2][5],$scope.fashions[2][5],$scope.freakss[2][5],0,$scope.bms[2][5],$scope.onlines[2][5],$scope.mixeds[2][5]], type: "column",color:'#F05422'},
				    ];

				    $scope.change3s=new Array();
				    for(i=0;i<6;i++){
				    	$scope.change3s[i]=new Array();
				    }

				    $scope.change3s=[
				    	[$scope.totalChanges[2][0],0,$scope.ruralChanges[2][0],$scope.urbanChanges[2][0],0,$scope.priceChanges[2][0],$scope.valueChanges[2][0],$scope.fashionChanges[2][0],$scope.freaksChanges[2][0],0,$scope.bmChanges[2][0],$scope.onlineChanges[2][0],$scope.mixedChanges[2][0]],
				    	[$scope.totalChanges[2][1],0,$scope.ruralChanges[2][1],$scope.urbanChanges[2][1],0,$scope.priceChanges[2][1],$scope.valueChanges[2][1],$scope.fashionChanges[2][1],$scope.freaksChanges[2][1],0,$scope.bmChanges[2][1],$scope.onlineChanges[2][1],$scope.mixedChanges[2][1]],
				    	[$scope.totalChanges[2][2],0,$scope.ruralChanges[2][2],$scope.urbanChanges[2][2],0,$scope.priceChanges[2][2],$scope.valueChanges[2][2],$scope.fashionChanges[2][2],$scope.freaksChanges[2][2],0,$scope.bmChanges[2][2],$scope.onlineChanges[2][2],$scope.mixedChanges[2][2]],
				    	[$scope.totalChanges[2][3],0,$scope.ruralChanges[2][3],$scope.urbanChanges[2][3],0,$scope.priceChanges[2][3],$scope.valueChanges[2][3],$scope.fashionChanges[2][3],$scope.freaksChanges[2][3],0,$scope.bmChanges[2][3],$scope.onlineChanges[2][3],$scope.mixedChanges[2][3]],
				    	[$scope.totalChanges[2][4],0,$scope.ruralChanges[2][4],$scope.urbanChanges[2][4],0,$scope.priceChanges[2][4],$scope.valueChanges[2][4],$scope.fashionChanges[2][4],$scope.freaksChanges[2][4],0,$scope.bmChanges[2][4],$scope.onlineChanges[2][4],$scope.mixedChanges[2][4]],
				    	[$scope.totalChanges[2][5],0,$scope.ruralChanges[2][5],$scope.urbanChanges[2][5],0,$scope.priceChanges[2][5],$scope.valueChanges[2][5],$scope.fashionChanges[2][5],$scope.freaksChanges[2][5],0,$scope.bmChanges[2][5],$scope.onlineChanges[2][5],$scope.mixedChanges[2][5]]
				    ];

				    $scope.chart3Config = {
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
					                var s = '<p><b>'+this.series.name+'</b></p>'+'<p>'+Label.getContent('Volume Sales')+':'+this.point.y+'(units mln)</p>'+'<p>'+$scope.change3s[this.series._i][this.point.x]+' '+Label.getContent('over previous period')+'</p>';
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
				        series: $scope.chart3Series,
				        title: {
				            text: Label.getContent('HealthBeauties')+' - '+Label.getContent('Volume Sales')
				        },
				        credits: {
				            enabled: true
				        },
				        loading: false
				    }

				    $scope.chart4Series = [
				        {"name": Label.getContent('Producer')+' 1', "data": [$scope.totals[3][0],0,$scope.rurals[3][0],$scope.urbans[3][0],0,$scope.prices[3][0],$scope.values[3][0],$scope.fashions[3][0],$scope.freakss[3][0],0,$scope.bms[3][0],$scope.onlines[3][0],$scope.mixeds[3][0]], type: "column",color:'#3257A7'},
				        {"name": Label.getContent('Producer')+' 2', "data": [$scope.totals[3][1],0,$scope.rurals[3][1],$scope.urbans[3][1],0,$scope.prices[3][1],$scope.values[3][1],$scope.fashions[3][1],$scope.freakss[3][1],0,$scope.bms[3][1],$scope.onlines[3][1],$scope.mixeds[3][1]], type: "column",color:'#B11E22'},
				        {"name": Label.getContent('Producer')+' 3', "data": [$scope.totals[3][2],0,$scope.rurals[3][2],$scope.urbans[3][2],0,$scope.prices[3][2],$scope.values[3][2],$scope.fashions[3][2],$scope.freakss[3][2],0,$scope.bms[3][2],$scope.onlines[3][2],$scope.mixeds[3][2]], type: "column",color:'#F6B920'},
				        {"name": Label.getContent('Producer')+' 4', "data": [$scope.totals[3][3],0,$scope.rurals[3][3],$scope.urbans[3][3],0,$scope.prices[3][3],$scope.values[3][3],$scope.fashions[3][3],$scope.freakss[3][3],0,$scope.bms[3][3],$scope.onlines[3][3],$scope.mixeds[3][3]], type: "column",color:'#329444'},
				      	{"name": Label.getContent('Retailer')+' 1', "data": [$scope.totals[3][4],0,$scope.rurals[3][4],$scope.urbans[3][4],0,$scope.prices[3][4],$scope.values[3][4],$scope.fashions[3][4],$scope.freakss[3][4],0,$scope.bms[3][4],$scope.onlines[3][4],$scope.mixeds[3][4]], type: "column",color:'#8B288B'},
				        {"name": Label.getContent('Retailer')+' 2', "data": [$scope.totals[3][5],0,$scope.rurals[3][5],$scope.urbans[3][5],0,$scope.prices[3][5],$scope.values[3][5],$scope.fashions[3][5],$scope.freakss[3][5],0,$scope.bms[3][5],$scope.onlines[3][5],$scope.mixeds[3][5]], type: "column",color:'#F05422'},
				    ];
				    $scope.change4s=new Array();
				    for(i=0;i<6;i++){
				    	$scope.change4s[i]=new Array();
				    }

				    $scope.change4s=[
				    	[$scope.totalChanges[3][0],0,$scope.ruralChanges[3][0],$scope.urbanChanges[3][0],0,$scope.priceChanges[3][0],$scope.valueChanges[3][0],$scope.fashionChanges[3][0],$scope.freaksChanges[3][0],0,$scope.bmChanges[3][0],$scope.onlineChanges[3][0],$scope.mixedChanges[3][0]],
				    	[$scope.totalChanges[3][1],0,$scope.ruralChanges[3][1],$scope.urbanChanges[3][1],0,$scope.priceChanges[3][1],$scope.valueChanges[3][1],$scope.fashionChanges[3][1],$scope.freaksChanges[3][1],0,$scope.bmChanges[3][1],$scope.onlineChanges[3][1],$scope.mixedChanges[3][1]],
				    	[$scope.totalChanges[3][2],0,$scope.ruralChanges[3][2],$scope.urbanChanges[3][2],0,$scope.priceChanges[3][2],$scope.valueChanges[3][2],$scope.fashionChanges[3][2],$scope.freaksChanges[3][2],0,$scope.bmChanges[3][2],$scope.onlineChanges[3][2],$scope.mixedChanges[3][2]],
				    	[$scope.totalChanges[3][3],0,$scope.ruralChanges[3][3],$scope.urbanChanges[3][3],0,$scope.priceChanges[3][3],$scope.valueChanges[3][3],$scope.fashionChanges[3][3],$scope.freaksChanges[3][3],0,$scope.bmChanges[3][3],$scope.onlineChanges[3][3],$scope.mixedChanges[3][3]],
				    	[$scope.totalChanges[3][4],0,$scope.ruralChanges[3][4],$scope.urbanChanges[3][4],0,$scope.priceChanges[3][4],$scope.valueChanges[3][4],$scope.fashionChanges[3][4],$scope.freaksChanges[3][4],0,$scope.bmChanges[3][4],$scope.onlineChanges[3][4],$scope.mixedChanges[3][4]],
				    	[$scope.totalChanges[3][5],0,$scope.ruralChanges[3][5],$scope.urbanChanges[3][5],0,$scope.priceChanges[3][5],$scope.valueChanges[3][5],$scope.fashionChanges[3][5],$scope.freaksChanges[3][5],0,$scope.bmChanges[3][5],$scope.onlineChanges[3][5],$scope.mixedChanges[3][5]]
				    ];

				    $scope.chart4Config = {
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
					                var s = '<p><b>'+this.series.name+'</b></p>'+'<p>'+Label.getContent('Value Sales')+':'+this.point.y+'($mln)</p>'+'<p>'+$scope.change4s[this.series._i][this.point.x]+' '+Label.getContent('over previous period')+'</p>';
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
				        series: $scope.chart4Series,
				        title: {
				            text: Label.getContent('HealthBeauties')+' - '+Label.getContent('Value Sales')
				        },
				        credits: {
				            enabled: true
				        },
				        loading: false
				    }
		    	}) 	
		    }

		    var showSegment=function(){
		    	switching('showSegment');
		    	var url='/segmentLeadership/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		$scope.priceSensitives=new Array();
		    		$scope.valueForMoneies=new Array();
		    		$scope.fashions=new Array();
		    		$scope.freakses=new Array();

					$scope.bms=new Array();
					$scope.onlines=new Array();
					$scope.mixeds=new Array();	    	

		    		//data.data[0].categoryInfo[2].marketInfo[2].segmentInfo[0].shopperInfo[3].grsl_ValueLeaders
		    		$scope.priceSensitives.push(data.data[0].categoryInfo[0].marketInfo[2].segmentInfo[0].shopperInfo[3],data.data[0].categoryInfo[1].marketInfo[2].segmentInfo[0].shopperInfo[3]);
		    		$scope.valueForMoneies.push(data.data[0].categoryInfo[0].marketInfo[2].segmentInfo[1].shopperInfo[3],data.data[0].categoryInfo[1].marketInfo[2].segmentInfo[1].shopperInfo[3]);
		    		$scope.fashions.push(data.data[0].categoryInfo[0].marketInfo[2].segmentInfo[2].shopperInfo[3],data.data[0].categoryInfo[1].marketInfo[2].segmentInfo[2].shopperInfo[3]);
		    		$scope.freakses.push(data.data[0].categoryInfo[0].marketInfo[2].segmentInfo[3].shopperInfo[3],data.data[0].categoryInfo[1].marketInfo[2].segmentInfo[3].shopperInfo[3]);
					
					$scope.bms.push(data.data[0].categoryInfo[0].marketInfo[2].segmentInfo[4].shopperInfo[0],data.data[0].categoryInfo[1].marketInfo[2].segmentInfo[4].shopperInfo[0]);
					$scope.onlines.push(data.data[0].categoryInfo[0].marketInfo[2].segmentInfo[4].shopperInfo[1],data.data[0].categoryInfo[1].marketInfo[2].segmentInfo[4].shopperInfo[1]);
					$scope.mixeds.push(data.data[0].categoryInfo[0].marketInfo[2].segmentInfo[4].shopperInfo[2],data.data[0].categoryInfo[1].marketInfo[2].segmentInfo[4].shopperInfo[2]);	

		    	},function(){
		    		console.log('fail');
		    	})
		    }

		    var showCross=function(){
		    	switching('showCross');
		    	var url='/crossSegmentSales/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		$scope.priceSensitives=new Array();
		    		$scope.valueForMoneies=new Array();
		    		$scope.fashions=new Array();
		    		$scope.freakses=new Array();
		    		for(var i=0;i<4;i++){
		    			$scope.priceSensitives[i]=new Array();
			    		$scope.valueForMoneies[i]=new Array();
			    		$scope.fashions[i]=new Array();
			    		$scope.freakses[i]=new Array();
		    		}

		    		for(var i=0;i<4;i++){
		    			//priceSensitives
		    			$scope.priceSensitives[0].push(data.data[0].categoryInfo[0].marketInfo[0].segmentInfo[0].shopperInfo[i].grcss_CrossSegmentsVolumes);
		    			$scope.priceSensitives[1].push(data.data[0].categoryInfo[0].marketInfo[1].segmentInfo[0].shopperInfo[i].grcss_CrossSegmentsVolumes);
		    			$scope.priceSensitives[2].push(data.data[0].categoryInfo[1].marketInfo[0].segmentInfo[0].shopperInfo[i].grcss_CrossSegmentsVolumes);
		    			$scope.priceSensitives[3].push(data.data[0].categoryInfo[1].marketInfo[1].segmentInfo[0].shopperInfo[i].grcss_CrossSegmentsVolumes);
		    			//valueForMoneies
		    			$scope.valueForMoneies[0].push(data.data[0].categoryInfo[0].marketInfo[0].segmentInfo[1].shopperInfo[i].grcss_CrossSegmentsVolumes);
		    			$scope.valueForMoneies[1].push(data.data[0].categoryInfo[0].marketInfo[1].segmentInfo[1].shopperInfo[i].grcss_CrossSegmentsVolumes);
		    			$scope.valueForMoneies[2].push(data.data[0].categoryInfo[1].marketInfo[0].segmentInfo[1].shopperInfo[i].grcss_CrossSegmentsVolumes);
		    			$scope.valueForMoneies[3].push(data.data[0].categoryInfo[1].marketInfo[1].segmentInfo[1].shopperInfo[i].grcss_CrossSegmentsVolumes);
		    			//fashions
		    			$scope.fashions[0].push(data.data[0].categoryInfo[0].marketInfo[0].segmentInfo[2].shopperInfo[i].grcss_CrossSegmentsVolumes);
		    			$scope.fashions[1].push(data.data[0].categoryInfo[0].marketInfo[1].segmentInfo[2].shopperInfo[i].grcss_CrossSegmentsVolumes);
		    			$scope.fashions[2].push(data.data[0].categoryInfo[1].marketInfo[0].segmentInfo[2].shopperInfo[i].grcss_CrossSegmentsVolumes);
		    			$scope.fashions[3].push(data.data[0].categoryInfo[1].marketInfo[1].segmentInfo[2].shopperInfo[i].grcss_CrossSegmentsVolumes);
		    			//freakses
		    			$scope.freakses[0].push(data.data[0].categoryInfo[0].marketInfo[0].segmentInfo[3].shopperInfo[i].grcss_CrossSegmentsVolumes);
		    			$scope.freakses[1].push(data.data[0].categoryInfo[0].marketInfo[1].segmentInfo[3].shopperInfo[i].grcss_CrossSegmentsVolumes);
		    			$scope.freakses[2].push(data.data[0].categoryInfo[1].marketInfo[0].segmentInfo[3].shopperInfo[i].grcss_CrossSegmentsVolumes);
		    			$scope.freakses[3].push(data.data[0].categoryInfo[1].marketInfo[1].segmentInfo[3].shopperInfo[i].grcss_CrossSegmentsVolumes);
		    		}
		    					    	
		    		$scope.chart1Series = [			        
				        {"name": Label.getContent('B&M Only'), "data": [$scope.priceSensitives[0][0],$scope.valueForMoneies[0][0],$scope.fashions[0][0],$scope.freakses[0][0]], type: "column",color:'#D9534F'},
				        {"name": Label.getContent('Online Only'), "data": [$scope.priceSensitives[0][1],$scope.valueForMoneies[0][1],$scope.fashions[0][1],$scope.freakses[0][1]], type: "column",color:'#428BCA'},
				        {"name": Label.getContent('Mixed'), "data": [$scope.priceSensitives[0][2],$scope.valueForMoneies[0][2],$scope.fashions[0][2],$scope.freakses[0][2]], type: "column",color:'#5CB85C'},
				    ];

				    $scope.chart1Config = {
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
				            plotOptions: {
				                series: {
				                    stacking: ''
				                }
				            }
				        },
				        series: $scope.chart1Series,
				        title: {
				            text: Label.getContent('Elecssories')+' - '+Label.getContent('Urban')
				        },
				        credits: {
				            enabled: true
				        },
				        loading: false
				    }

				    $scope.chart2Series = [			        
				        {"name": Label.getContent('B&M Only'), "data": [$scope.priceSensitives[1][0],$scope.valueForMoneies[1][0],$scope.fashions[1][0],$scope.freakses[1][0]], type: "column",color:'#D9534F'},
				        {"name": Label.getContent('Online Only'), "data": [$scope.priceSensitives[1][1],$scope.valueForMoneies[1][1],$scope.fashions[1][1],$scope.freakses[1][1]], type: "column",color:'#428BCA'},
				        {"name": Label.getContent('Mixed'), "data": [$scope.priceSensitives[1][2],$scope.valueForMoneies[1][2],$scope.fashions[1][2],$scope.freakses[1][2]], type: "column",color:'#5CB85C'},
				    ];

				    $scope.chart2Config = {
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
				            plotOptions: {
				                series: {
				                    stacking: ''
				                }
				            }
				        },
				        series: $scope.chart2Series,
				        title: {
				            text: Label.getContent('Elecssories')+' - '+Label.getContent('Rural')
				        },
				        credits: {
				            enabled: true
				        },
				        loading: false
				    }

				    $scope.chart3Series = [			        
				        {"name": Label.getContent('B&M Only'), "data": [$scope.priceSensitives[2][0],$scope.valueForMoneies[2][0],$scope.fashions[2][0],$scope.freakses[2][0]], type: "column",color:'#D9534F'},
				        {"name": Label.getContent('Online Only'), "data": [$scope.priceSensitives[2][1],$scope.valueForMoneies[2][1],$scope.fashions[2][1],$scope.freakses[2][1]], type: "column",color:'#428BCA'},
				        {"name": Label.getContent('Mixed'), "data": [$scope.priceSensitives[2][2],$scope.valueForMoneies[2][2],$scope.fashions[2][2],$scope.freakses[2][2]], type: "column",color:'#5CB85C'},
				    ];

				    $scope.chart3Config = {
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
				            plotOptions: {
				                series: {
				                    stacking: ''
				                }
				            }
				        },
				        series: $scope.chart3Series,
				        title: {
				            text: Label.getContent('HealthBeauties')+' - '+Label.getContent('Urban')
				        },
				        credits: {
				            enabled: true
				        },
				        loading: false
				    }

				    $scope.chart4Series = [			        
				        {"name": Label.getContent('B&M Only'), "data": [$scope.priceSensitives[3][0],$scope.valueForMoneies[3][0],$scope.fashions[3][0],$scope.freakses[3][0]], type: "column",color:'#D9534F'},
				        {"name": Label.getContent('Online Only'), "data": [$scope.priceSensitives[3][1],$scope.valueForMoneies[3][1],$scope.fashions[3][1],$scope.freakses[3][1]], type: "column",color:'#428BCA'},
				        {"name": Label.getContent('Mixed'), "data": [$scope.priceSensitives[3][2],$scope.valueForMoneies[3][2],$scope.fashions[3][2],$scope.freakses[3][2]], type: "column",color:'#5CB85C'},
				    ];

				    $scope.chart4Config = {
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
				            plotOptions: {
				                series: {
				                    stacking: ''
				                }
				            }
				        },
				        series: $scope.chart4Series,
				        title: {
				            text: Label.getContent('HealthBeauties')+' - '+Label.getContent('Rural')
				        },
				        credits: {
				            enabled: true
				        },
				        loading: false
				    }
		    	},function(){
		    		console.log('fail');
		    	})
		    }

		    var showProduct=function(){
		    	switching('showProduct');

		    	var url='/productPortfolio/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		$scope.producer1es=new Array();
		    		$scope.producer1hs=new Array();		    		
		    		$scope.producer2es=new Array();
		    		$scope.producer2hs=new Array();
		    		$scope.producer3es=new Array();
		    		$scope.producer3hs=new Array();
		    		$scope.retailer1es=new Array();
		    		$scope.retailer1hs=new Array();
		    		$scope.retailer2es=new Array();
		    		$scope.retailer2hs=new Array();
		    		for(var i=0;i<data.data[0].categoryInfo[0].variantInfo.length;i++){
		    			switch(data.data[0].categoryInfo[0].variantInfo[i].varName.substring(data.data[0].categoryInfo[0].variantInfo[i].varName.length-1)){
		    				case '1':$scope.producer1es.push(data.data[0].categoryInfo[0].variantInfo[i]);break;
		    				case '2':$scope.producer2es.push(data.data[0].categoryInfo[0].variantInfo[i]);break;
		    				case '3':$scope.producer3es.push(data.data[0].categoryInfo[0].variantInfo[i]);break;
		    				case '4':break;
		    				case '5':$scope.retailer1es.push(data.data[0].categoryInfo[0].variantInfo[i]);break;
		    				case '6':$scope.retailer2es.push(data.data[0].categoryInfo[0].variantInfo[i]);break;
		    				case '7':break;
		    			}
		    		}
		    		for(var i=0;i<data.data[0].categoryInfo[1].variantInfo.length;i++){
		    			switch(data.data[0].categoryInfo[1].variantInfo[i].varName.substring(data.data[0].categoryInfo[1].variantInfo[i].varName.length-1)){
		    				case '1':$scope.producer1hs.push(data.data[0].categoryInfo[1].variantInfo[i]);break;
		    				case '2':$scope.producer2hs.push(data.data[0].categoryInfo[1].variantInfo[i]);break;
		    				case '3':$scope.producer3hs.push(data.data[0].categoryInfo[1].variantInfo[i]);break;
		    				case '4':break;
		    				case '5':$scope.retailer1hs.push(data.data[0].categoryInfo[1].variantInfo[i]);break;
		    				case '6':$scope.retailer2hs.push(data.data[0].categoryInfo[1].variantInfo[i]);break;
		    				case '7':break;
		    			}
		    		}
		    	},function(){
		    		console.log('fail');
		    	})
		    }

		    var showEMallPrices=function(){
		    	switching('showEMallPrices');
		    	var url='/emallPrices/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		$scope.producer1es=new Array();
		    		$scope.producer1hs=new Array();		    		
		    		$scope.producer2es=new Array();
		    		$scope.producer2hs=new Array();		    		
		    		$scope.producer3es=new Array();
		    		$scope.producer3hs=new Array();

		    		for(var i=0;i<data.data[0].categoryInfo[0].variantInfo.length;i++){
		    			switch(data.data[0].categoryInfo[0].variantInfo[i].varName.substring(data.data[0].categoryInfo[0].variantInfo[i].varName.length-1)){
		    				case '1':
		    					$scope.producer1es.push(data.data[0].categoryInfo[0].variantInfo[i]);
		    				break;
		    				case '2':
		    					$scope.producer2es.push(data.data[0].categoryInfo[0].variantInfo[i]);
		    				break;
		    				case '3':
		    					$scope.producer3es.push(data.data[0].categoryInfo[0].variantInfo[i]);
		    				break;
		    				case '4':break;
		    			}
		    		}
		    		for(var i=0;i<data.data[0].categoryInfo[1].variantInfo.length;i++){
		    			switch(data.data[0].categoryInfo[1].variantInfo[i].varName.substring(data.data[0].categoryInfo[1].variantInfo[i].varName.length-1)){
		    				case '1':
		    					$scope.producer1hs.push(data.data[0].categoryInfo[1].variantInfo[i]);
		    				break;
		    				case '2':
		    					$scope.producer2hs.push(data.data[0].categoryInfo[1].variantInfo[i]);
		    				break;
		    				case '3':
		    					$scope.producer3hs.push(data.data[0].categoryInfo[1].variantInfo[i]);
		    				break;
		    				case '4':break;
		    				// case '5':
		    				// 	$scope.retailer1hs.push(data.data[0].categoryInfo[0].variantInfo[i]);
		    				// break;
		    				// case '6':
		    				// 	$scope.retailer2hs.push(data.data[0].categoryInfo[0].variantInfo[i]);
		    				// break;
		    				// case '7':break;
		    			}
		    		}
		    		
		    	},function(){
		    		console.log('fail');
		    	})
		    }


		    var showProducerConsolidate=function(){
		    	switching('showProducerConsolidate');
		    	var url='/SCR-consolidatedProfitAndLoss/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		$scope.sales=data.data[0].scrpl_Sales;
		    		$scope.salesChanges=data.data[0].scrpl_SalesChange;
		    		$scope.materialCosts=data.data[0].scrpl_MaterialCosts;
		    		$scope.costGoodsSolds=data.data[0].scrpl_CostOfGoodsSold;
		    		$scope.discontinuedGoodsCosts=data.data[0].scrpl_DiscontinuedGoodsCost;
		    		$scope.holdingCosts=data.data[0].scrpl_InventoryHoldingCost;
		    		$scope.grossProfits=data.data[0].scrpl_GrossProfit;
		    		$scope.grossProfitChanges=data.data[0].scrpl_GrossProfitChange;
		    		$scope.grossProfitMargins=data.data[0].scrpl_GrossProfitMargin;
		    		$scope.expenseValues=data.data[0].scrpl_TradeAndMarketing;
		    		$scope.expenseShares=data.data[0].scrpl_TradeAndMarketingAsPercentageOfSales;
		    		$scope.generalExpenses=data.data[0].scrpl_GeneralExpenses;
		    		$scope.amortisations=data.data[0].scrpl_Amortisation;
		    		$scope.operatingProfits=data.data[0].scrpl_OperatingProfit;
		    		$scope.operatingProfitChanges=data.data[0].scrpl_OperatingProfitChange;
		    		$scope.operatingProfitMargins=data.data[0].scrpl_OperatingProfitMargin;
		    		$scope.interests=data.data[0].scrpl_Interest;
		    		$scope.taxes=data.data[0].scrpl_Taxes;
		    		$scope.costsProfits=data.data[0].scrpl_ExceptionalItems;
		    		$scope.netProfits=data.data[0].scrpl_NetProfit;
		    		$scope.netProfitChanges=data.data[0].scrpl_NetProfitChange;
		    		$scope.netProfitMargins=data.data[0].scrpl_NetProfitMargin;
		    	},function(){
		    		console.log('fail');
		    	})
		    }

		    var loadValue=function(data,name,num){
		    	var array=_.find(data,function(obj){
		    		return (obj.brandName==name);
		    	});
		    	return array.value[num];
		    }

		    var loadBusiness=function(data,category,num){
		    	if(category==1){
		    		$scope.brand1s=new Array();
		    		$scope.total1s=new Array();
		    	}else{
		    		$scope.brand2s=new Array();
		    		$scope.total2s=new Array();
		    	}
		    	var brandName;//Sales,totalChanges,Changes,totalSalesShareInCategory,SalesShareInCategory,totalCostOfGoodsSold,CostOfGoodsSold,totalDiscontinuedGoodsCost,DiscontinuedGoodsCost,totalInventoryHoldingCost,InventoryHoldingCost,totalGrossProfit,GrossProfit,totalGrossProfitChange,GrossProfitChange,totalTradeAndMarketing,TradeAndMarketing,totalAdvertisingOnLine,AdvertisingOnLine,totalAdvertisingOffLine,AdvertisingOffLine,totalTradeAndMarketingAsPercentageOfSales,TradeAndMarketingAsPercentageOfSales,totalTradeAndMarketingShareInCategory,TradeAndMarketingShareInCategory,totalGeneralExpenses,GeneralExpenses,totalAmortisation,Amortisation,totalOperatingProfit,OperatingProfit,totalOperatingProfitChange,OperatingProfitChange,totalOperatingProfitMargin,OperatingProfitMargin,totalOperatingProfitShareInCategory,OperatingProfitShareInCategory,totalInterest,Interest,totalTaxes,Taxes,totalExceptionalItems,ExceptionalItems,totalNetProfit,NetProfit,totalNetProfitChange,NetProfitChange,totalNetProfitMargin,NetProfitMargin,totalNetProfitShareInCategory,NetProfitShareInCategory;
		    	for(var i=0;i<data.data[0].scrb_Sales.length;i++){
		    		if(data.data[0].scrb_Sales[i].parentCategoryID==category){
		    			var brandName=data.data[0].scrb_Sales[i].brandName;
		    			var Sales=data.data[0].scrb_Sales[i].value[num];
		    			var SalesChange=loadValue(data.data[0].scrb_SalesChange,brandName,num);
			    		var SalesShareInCategory=loadValue(data.data[0].scrb_SalesShareInCategory,brandName,num);
			    		var MaterialCosts=loadValue(data.data[0].scrb_MaterialCosts,brandName,num);
			    		var CostOfGoodsSold=loadValue(data.data[0].scrb_CostOfGoodsSold,brandName,num);
			    		var DiscontinuedGoodsCost=loadValue(data.data[0].scrb_DiscontinuedGoodsCost,brandName,num);
			    		var InventoryHoldingCost=loadValue(data.data[0].scrb_InventoryHoldingCost,brandName,num);
			    		var GrossProfit=loadValue(data.data[0].scrb_GrossProfit,brandName,num);
			    		var GrossProfitChange=loadValue(data.data[0].scrb_GrossProfitChange,brandName,num);
			    		var GrossProfitMargin=loadValue(data.data[0].scrb_GrossProfitMargin,brandName,num);
			    		var GrossProfitMarginShare=loadValue(data.data[0].scrb_GrossProfitMarginShare,brandName,num);
			    		var TradeAndMarketing=loadValue(data.data[0].scrb_TradeAndMarketing,brandName,num);
			    		var AdvertisingOnLine=loadValue(data.data[0].scrb_AdvertisingOnLine,brandName,num);
			    		var AdvertisingOffLine=loadValue(data.data[0].scrb_AdvertisingOffLine,brandName,num);
			    		var TradeAndMarketingAsPercentageOfSales=loadValue(data.data[0].scrb_TradeAndMarketingAsPercentageOfSales,brandName,num);
			    		var TradeAndMarketingShareInCategory=loadValue(data.data[0].scrb_TradeAndMarketingShareInCategory,brandName,num);
			    		var GeneralExpenses=loadValue(data.data[0].scrb_GeneralExpenses,brandName,num);
			    		var Amortisation=loadValue(data.data[0].scrb_Amortisation,brandName,num);
			    		var OperatingProfit=loadValue(data.data[0].scrb_OperatingProfit,brandName,num);
			    		var OperatingProfitChange=loadValue(data.data[0].scrb_OperatingProfitChange,brandName,num);
			    		var OperatingProfitMargin=loadValue(data.data[0].scrb_OperatingProfitMargin,brandName,num);
			    		var OperatingProfitShareInCategory=loadValue(data.data[0].scrb_OperatingProfitShareInCategory,brandName,num);
			    		var Interest=loadValue(data.data[0].scrb_Interest,brandName,num);
			    		var Taxes=loadValue(data.data[0].scrb_Taxes,brandName,num);
			    		var ExceptionalItems=loadValue(data.data[0].scrb_ExceptionalItems,brandName,num);
			    		var NetProfit=loadValue(data.data[0].scrb_NetProfit,brandName,num);
			    		var NetProfitChange=loadValue(data.data[0].scrb_NetProfitChange,brandName,num);
			    		var NetProfitMargin=loadValue(data.data[0].scrb_NetProfitMargin,brandName,num);
			    		var NetProfitShareInCategory=loadValue(data.data[0].scrb_NetProfitShareInCategory,brandName,num);
			    		if(category==1){
							$scope.brand1s.push({'brandName':brandName,'Sales':Sales,'SalesChange':SalesChange,'SalesShareInCategory':SalesShareInCategory,'MaterialCosts':MaterialCosts,'CostOfGoodsSold':CostOfGoodsSold,'DiscontinuedGoodsCost':DiscontinuedGoodsCost,'InventoryHoldingCost':InventoryHoldingCost,'GrossProfit':GrossProfit,
				    		'GrossProfitChange':GrossProfitChange,'TradeAndMarketing':TradeAndMarketing,'AdvertisingOnLine':AdvertisingOnLine,'AdvertisingOffLine':AdvertisingOffLine,'TradeAndMarketingAsPercentageOfSales':TradeAndMarketingAsPercentageOfSales,'TradeAndMarketingShareInCategory':TradeAndMarketingShareInCategory,
				    		'GeneralExpenses':GeneralExpenses,'Amortisation':Amortisation,'OperatingProfit':OperatingProfit,'OperatingProfitChange':OperatingProfitChange,'OperatingProfitMargin':OperatingProfitMargin,'OperatingProfitMargin':OperatingProfitMargin,'OperatingProfitShareInCategory':OperatingProfitShareInCategory,
				   			'Interest':Interest,'Taxes':Taxes,'ExceptionalItems':ExceptionalItems,'NetProfit':NetProfit,'NetProfitChange':NetProfitChange,'NetProfitMargin':NetProfitMargin,'NetProfitShareInCategory':NetProfitShareInCategory,'GrossProfitMargin':GrossProfitMargin,'GrossProfitMarginShare':GrossProfitMarginShare});
			    		}else{
			   				$scope.brand2s.push({'brandName':brandName,'Sales':Sales,'SalesChange':SalesChange,'SalesShareInCategory':SalesShareInCategory,'MaterialCosts':MaterialCosts,'CostOfGoodsSold':CostOfGoodsSold,'DiscontinuedGoodsCost':DiscontinuedGoodsCost,'InventoryHoldingCost':InventoryHoldingCost,'GrossProfit':GrossProfit,
			    			'GrossProfitChange':GrossProfitChange,'TradeAndMarketing':TradeAndMarketing,'AdvertisingOnLine':AdvertisingOnLine,'AdvertisingOffLine':AdvertisingOffLine,'TradeAndMarketingAsPercentageOfSales':TradeAndMarketingAsPercentageOfSales,'TradeAndMarketingShareInCategory':TradeAndMarketingShareInCategory,
			    			'GeneralExpenses':GeneralExpenses,'Amortisation':Amortisation,'OperatingProfit':OperatingProfit,'OperatingProfitChange':OperatingProfitChange,'OperatingProfitMargin':OperatingProfitMargin,'OperatingProfitMargin':OperatingProfitMargin,'OperatingProfitShareInCategory':OperatingProfitShareInCategory,
			    			'Interest':Interest,'Taxes':Taxes,'ExceptionalItems':ExceptionalItems,'NetProfit':NetProfit,'NetProfitChange':NetProfitChange,'NetProfitMargin':NetProfitMargin,'NetProfitShareInCategory':NetProfitShareInCategory,'GrossProfitMargin':GrossProfitMargin,'GrossProfitMarginShare':GrossProfitMarginShare});
			    		}
		   			}
		    	}
		    }

		    var showProducerBMBusiness=function(){
		    	switching('showProducerBMBusiness');
		    	var url='/SCR-consolidatedProfitAndLoss/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		loadBusiness(data,1,0);
		    		loadBusiness(data,2,0);
		    	},function(){
		    		console.log('fail');
		    	})
		    }

		    var showProducerOnlineBusiness=function(){
		    	switching('showProducerOnlineBusiness');
		    }

		    var showProducerProfitability=function(){
		    	switching('showProducerProfitability');
		    	var url='/SCR-channelsProfitability/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		$scope.volumeOrdereds=data.data[0].scrcp_VolumeOrdered;
		    		$scope.volumeSolds=data.data[0].scrcp_VolumeSold;
		    		$scope.volumeSoldShares=data.data[0].scrcp_VolumeSoldShare;
		    		$scope.salesValues=data.data[0].scrcp_SalesValue;
    				$scope.salesValueShares=data.data[0].scrcp_SalesValueShare;
    				$scope.costOfGoodsSolds=data.data[0].scrcp_CostOfGoodsSold;
    				$scope.tradeSupports=data.data[0].scrcp_TradeSupport;
    				$scope.tradeProfits=data.data[0].scrcp_TradeProfit;   
    				$scope.tradeProfitShares=data.data[0].scrcp_TradeProfitShare;
		    	},function(){
		    		console.log('fail');
		    	})
		    }

		    var loadNegotiations=function(data,category,retailer,i,j){
		    	var varName,brandName,discount_MinimumVolume,discount_Rate,bonus_TargetVolume,bonus_Rate,bonus_Value,vnd_PaymentTerm,vnd_OtherCompensation,vnd_ContractHonoured;
		    							brandName=data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].parentBrandName;
			    						varName=data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].variantName;
			    						discount_MinimumVolume=data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].modernRetailerInfo[j].value;
			    						var discount_Rates=_.find(data.data[0].vnd_QuantityDiscount.discount_Rate,function(obj){
			    							return(obj.variantName==varName&&obj.parentBrandName==brandName);
			    						});
			    						for(var k=0;k<discount_Rates.modernRetailerInfo.length;k++){
			    							if(discount_Rates.modernRetailerInfo[k].modernRetailerID==retailer){
			    								discount_Rate=discount_Rates.modernRetailerInfo[k].value;
			    								break;
			    							}
			    						}
			    						var bonus_TargetVolumes=_.find(data.data[0].vnd_TargetBonus.bonus_TargetVolume,function(obj){
			    							return(obj.variantName==varName&&obj.parentBrandName==brandName);
			    						});
			    						for(var k=0;k<bonus_TargetVolumes.modernRetailerInfo.length;k++){
			    							if(bonus_TargetVolumes.modernRetailerInfo[k].modernRetailerID==retailer){
			    								bonus_TargetVolume=bonus_TargetVolumes.modernRetailerInfo[k].value;
			    								break;
			    							}
			    						}
			    						var bonus_Rates=_.find(data.data[0].vnd_TargetBonus.bonus_TargetVolume,function(obj){
			    							return(obj.variantName==varName&&obj.parentBrandName==brandName);
			    						});
			    						for(var k=0;k<bonus_Rates.modernRetailerInfo.length;k++){
			    							if(bonus_Rates.modernRetailerInfo[k].modernRetailerID==retailer){
			    								bonus_Rate=bonus_Rates.modernRetailerInfo[k].value;
			    								break;
			    							}
			    						}
			    						var bonus_Values=_.find(data.data[0].vnd_TargetBonus.bonus_TargetVolume,function(obj){
			    							return(obj.variantName==varName&&obj.parentBrandName==brandName);
			    						});
			    						for(var k=0;k<bonus_Values.modernRetailerInfo.length;k++){
			    							if(bonus_Values.modernRetailerInfo[k].modernRetailerID==retailer){
			    								bonus_Value=bonus_Values.modernRetailerInfo[k].value;
			    								break;
			    							}
			    						}
			    						var vnd_PaymentTerms=_.find(data.data[0].vnd_PaymentTerms,function(obj){
			    							return(obj.variantName==varName&&obj.parentBrandName==brandName);
			    						});
			    						for(var k=0;k<vnd_PaymentTerms.modernRetailerInfo.length;k++){
			    							if(vnd_PaymentTerms.modernRetailerInfo[k].modernRetailerID==retailer){
			    								vnd_PaymentTerm=vnd_PaymentTerms.modernRetailerInfo[k].value;
			    								break;
			    							}
			    						}
			    						var vnd_OtherCompensations=_.find(data.data[0].vnd_OtherCompensation,function(obj){
			    							return(obj.variantName==varName&&obj.parentBrandName==brandName);
			    						});
			    						for(var k=0;k<vnd_OtherCompensations.modernRetailerInfo.length;k++){
			    							if(vnd_OtherCompensations.modernRetailerInfo[k].modernRetailerID==retailer){
			    								vnd_OtherCompensation=vnd_OtherCompensations.modernRetailerInfo[k].value;
			    								break;
			    							}
			    						}
			    						var vnd_ContractHonoureds=_.find(data.data[0].vnd_ContractHonoured,function(obj){
			    							return(obj.variantName==varName&&obj.parentBrandName==brandName);
			    						});
			    						for(var k=0;k<vnd_ContractHonoureds.modernRetailerInfo.length;k++){
			    							if(vnd_ContractHonoureds.modernRetailerInfo[k].modernRetailerID==retailer){
			    								vnd_ContractHonoured=vnd_ContractHonoureds.modernRetailerInfo[k].value;
			    								break;
			    							}
			    						}
			    						if(vnd_ContractHonoured==1){
			    							vnd_ContractHonoured="yes";
			    						}else{
			    							vnd_ContractHonoured="no";
			    						}
			    if(category==1){
			    	if(retailer==1){
			    		if(discount_MinimumVolume!=undefined&&discount_Rate!=undefined&&bonus_TargetVolume!=undefined&&bonus_Rate!=undefined&&bonus_Value!=undefined&&vnd_PaymentTerm!=undefined&vnd_OtherCompensation!=undefined&&vnd_ContractHonoured!=undefined)
			    		{
			    			$scope.product1es.push({'fullName':brandName+varName,'discount_MinimumVolume':discount_MinimumVolume,'discount_Rate':discount_Rate,'bonus_TargetVolume':bonus_TargetVolume,'bonus_Rate':bonus_Rate,'bonus_Value':bonus_Value,'vnd_PaymentTerm':vnd_PaymentTerm,'vnd_OtherCompensation':vnd_OtherCompensation,'vnd_ContractHonoured':vnd_ContractHonoured});
			    		}
			    	}else{
			    		if(discount_MinimumVolume!=undefined&&discount_Rate!=undefined&&bonus_TargetVolume!=undefined&&bonus_Rate!=undefined&&bonus_Value!=undefined&&vnd_PaymentTerm!=undefined&vnd_OtherCompensation!=undefined&&vnd_ContractHonoured!=undefined)
			    		{
			    			$scope.product2es.push({'fullName':brandName+varName,'discount_MinimumVolume':discount_MinimumVolume,'discount_Rate':discount_Rate,'bonus_TargetVolume':bonus_TargetVolume,'bonus_Rate':bonus_Rate,'bonus_Value':bonus_Value,'vnd_PaymentTerm':vnd_PaymentTerm,'vnd_OtherCompensation':vnd_OtherCompensation,'vnd_ContractHonoured':vnd_ContractHonoured});
			    		}
			    	}
			    }else{
			    	if(retailer==1){
			    		if(discount_MinimumVolume!=undefined&&discount_Rate!=undefined&&bonus_TargetVolume!=undefined&&bonus_Rate!=undefined&&bonus_Value!=undefined&&vnd_PaymentTerm!=undefined&vnd_OtherCompensation!=undefined&&vnd_ContractHonoured!=undefined)
			    		{
			    			$scope.product1hs.push({'fullName':brandName+varName,'discount_MinimumVolume':discount_MinimumVolume,'discount_Rate':discount_Rate,'bonus_TargetVolume':bonus_TargetVolume,'bonus_Rate':bonus_Rate,'bonus_Value':bonus_Value,'vnd_PaymentTerm':vnd_PaymentTerm,'vnd_OtherCompensation':vnd_OtherCompensation,'vnd_ContractHonoured':vnd_ContractHonoured});
			    		}
			    	}else{
			    		if(discount_MinimumVolume!=undefined&&discount_Rate!=undefined&&bonus_TargetVolume!=undefined&&bonus_Rate!=undefined&&bonus_Value!=undefined&&vnd_PaymentTerm!=undefined&vnd_OtherCompensation!=undefined&&vnd_ContractHonoured!=undefined)
			    		{
			    			$scope.product2hs.push({'fullName':brandName+varName,'discount_MinimumVolume':discount_MinimumVolume,'discount_Rate':discount_Rate,'bonus_TargetVolume':bonus_TargetVolume,'bonus_Rate':bonus_Rate,'bonus_Value':bonus_Value,'vnd_PaymentTerm':vnd_PaymentTerm,'vnd_OtherCompensation':vnd_OtherCompensation,'vnd_ContractHonoured':vnd_ContractHonoured});
			    		}
			    	}
			    }
		    }

		    var showProducerNegotiations=function(){
		    	switching('showProducerNegotiations');
		    	var url='/SCR-negotiations/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		$scope.product1es=new Array();
		    		$scope.product1hs=new Array();
		    		$scope.product2es=new Array();
		    		$scope.product2hs=new Array();
		    		var varName,brandName,discount_MinimumVolume,discount_Rate,bonus_TargetVolume,bonus_Rate,bonus_Value,vnd_PaymentTerm,vnd_OtherCompensation,vnd_ContractHonoured;

		    		for(var i=0;i<data.data[0].vnd_QuantityDiscount.discount_MinimumVolume.length;i++){
		    			if(data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].parentCategoryID==1){
		    				for(var j=0;j<data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].modernRetailerInfo.length;j++){
		    					switch(data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].modernRetailerInfo[j].modernRetailerID){
			    					case 1:loadNegotiations(data,1,1,i,j);break;
			    					case 2:loadNegotiations(data,1,2,i,j);break;
			    				}
		    				}
		    			}else{
		    				for(var j=0;j<data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].modernRetailerInfo.length;j++){
		    					switch(data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].modernRetailerInfo[j].modernRetailerID){
		    						case 1:loadNegotiations(data,2,1,i,j);break;
			    					case 2:loadNegotiations(data,2,2,i,j);break;
		    					}
		    				}
		    			}
		    		}
		    	},function(){
		    		console.log('fail');
		    	})
		    }

		    var loadConsumer=function(data,category){
		    		$scope.rural1s=new Array();
		    		$scope.urban1s=new Array();
		    		$scope.rural2s=new Array();
		    		$scope.urban2s=new Array();
		    		var varName,brandName,priceShare,priceChange,moneyShare,moneyChange,fashionShare,fashionChange,freaksShare,freaksChange;
		    		for(var i=0;i<data.data[0].absoluteValue.length;i++){
		    			if(data.data[0].absoluteValue[i].parentCategoryID==category){
		    				varName=data.data[0].absoluteValue[i].variantName;
		    				brandName=data.data[0].absoluteValue[i].parentBrandName;
		    				priceShare=data.data[0].absoluteValue[i].marketInfo[0].segmentInfo[0].shopperInfo[3].value;
		    				moneyShare=data.data[0].absoluteValue[i].marketInfo[0].segmentInfo[1].shopperInfo[3].value;
		    				fashionShare=data.data[0].absoluteValue[i].marketInfo[0].segmentInfo[2].shopperInfo[3].value;
		    				freaksShare=data.data[0].absoluteValue[i].marketInfo[0].segmentInfo[3].shopperInfo[3].value;
		    				var Changes=_.find(data.data[0].valueChange,function(obj){
			    				return(obj.variantName==varName&&obj.parentBrandName==brandName);
		    				});
		    				priceChange=Changes.marketInfo[0].segmentInfo[0].shopperInfo[3].value;
		    				moneyChange=Changes.marketInfo[0].segmentInfo[1].shopperInfo[3].value;
		    				fashionChange=Changes.marketInfo[0].segmentInfo[2].shopperInfo[3].value;
		    				freaksChange=Changes.marketInfo[0].segmentInfo[3].shopperInfo[3].value;
		    				$scope.urban1s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
		    				priceShare=data.data[0].absoluteValue[i].marketInfo[1].segmentInfo[0].shopperInfo[3].value;
		    				moneyShare=data.data[0].absoluteValue[i].marketInfo[1].segmentInfo[1].shopperInfo[3].value;
		    				fashionShare=data.data[0].absoluteValue[i].marketInfo[1].segmentInfo[2].shopperInfo[3].value;
		    				freaksShare=data.data[0].absoluteValue[i].marketInfo[1].segmentInfo[3].shopperInfo[3].value;
		    				priceChange=Changes.marketInfo[1].segmentInfo[0].shopperInfo[3].value;
		    				moneyChange=Changes.marketInfo[1].segmentInfo[1].shopperInfo[3].value;
		    				fashionChange=Changes.marketInfo[1].segmentInfo[2].shopperInfo[3].value;
		    				freaksChange=Changes.marketInfo[1].segmentInfo[3].shopperInfo[3].value;
		    				$scope.rural1s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
		    				var Volumes=_.find(data.data[0].absoluteVolume,function(obj){
			    				return(obj.variantName==varName&&obj.parentBrandName==brandName);
		    				});
		    				var Changes=_.find(data.data[0].volumeChange,function(obj){
			    				return(obj.variantName==varName&&obj.parentBrandName==brandName);
		    				});
		    				priceChange=Volumes.marketInfo[0].segmentInfo[0].shopperInfo[3].value;
		    				moneyChange=Volumes.marketInfo[0].segmentInfo[1].shopperInfo[3].value;
		    				fashionChange=Volumes.marketInfo[0].segmentInfo[2].shopperInfo[3].value;
		    				freaksChange=Volumes.marketInfo[0].segmentInfo[3].shopperInfo[3].value;
		    				priceChange=Changes.marketInfo[0].segmentInfo[0].shopperInfo[3].value;
		    				moneyChange=Changes.marketInfo[0].segmentInfo[1].shopperInfo[3].value;
		    				fashionChange=Changes.marketInfo[0].segmentInfo[2].shopperInfo[3].value;
		    				freaksChange=Changes.marketInfo[0].segmentInfo[3].shopperInfo[3].value;
		    				$scope.urban2s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
		    				priceChange=Volumes.marketInfo[1].segmentInfo[0].shopperInfo[3].value;
		    				moneyChange=Volumes.marketInfo[1].segmentInfo[1].shopperInfo[3].value;
		    				fashionChange=Volumes.marketInfo[1].segmentInfo[2].shopperInfo[3].value;
		    				freaksChange=Volumes.marketInfo[1].segmentInfo[3].shopperInfo[3].value;
		    				priceChange=Changes.marketInfo[1].segmentInfo[0].shopperInfo[3].value;
		    				moneyChange=Changes.marketInfo[1].segmentInfo[1].shopperInfo[3].value;
		    				fashionChange=Changes.marketInfo[1].segmentInfo[2].shopperInfo[3].value;
		    				freaksChange=Changes.marketInfo[1].segmentInfo[3].shopperInfo[3].value;
		    				$scope.rural2s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
		    			}
		    		}
		    }

		    var loadShooper=function(data,category){
		    		$scope.rural1s=new Array();
		    		$scope.urban1s=new Array();
		    		$scope.rural2s=new Array();
		    		$scope.urban2s=new Array();
		    		var varName,brandName,bmShare,bmChange,onlineShare,onlineChange,mixedShare,mixedChange;
		    		for(var i=0;i<data.data[0].absoluteValue.length;i++){
		    			if(data.data[0].absoluteValue[i].parentCategoryID==category){
		    				varName=data.data[0].absoluteValue[i].variantName;
		    				brandName=data.data[0].absoluteValue[i].parentBrandName;
		    				bmShare=data.data[0].absoluteValue[i].marketInfo[0].segmentInfo[4].shopperInfo[0].value;
		    				onlineShare=data.data[0].absoluteValue[i].marketInfo[0].segmentInfo[4].shopperInfo[1].value;
		    				mixedShare=data.data[0].absoluteValue[i].marketInfo[0].segmentInfo[4].shopperInfo[2].value;
		    				var Changes=_.find(data.data[0].valueChange,function(obj){
			    				return(obj.variantName==varName&&obj.parentBrandName==brandName);
		    				});
		    				bmChange=Changes.marketInfo[0].segmentInfo[4].shopperInfo[0].value;
		    				onlineChange=Changes.marketInfo[0].segmentInfo[4].shopperInfo[1].value;
		    				mixedChange=Changes.marketInfo[0].segmentInfo[4].shopperInfo[2].value;
		    				$scope.urban1s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});

		    				bmShare=data.data[0].absoluteValue[i].marketInfo[1].segmentInfo[4].shopperInfo[0].value;
		    				onlineShare=data.data[0].absoluteValue[i].marketInfo[1].segmentInfo[4].shopperInfo[1].value;
		    				mixedShare=data.data[0].absoluteValue[i].marketInfo[1].segmentInfo[4].shopperInfo[2].value;
		    				bmChange=Changes.marketInfo[1].segmentInfo[4].shopperInfo[0].value;
		    				onlineChange=Changes.marketInfo[1].segmentInfo[4].shopperInfo[1].value;
		    				mixedChange=Changes.marketInfo[1].segmentInfo[4].shopperInfo[2].value;
		    				$scope.rural1s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});
		    				var Volumes=_.find(data.data[0].absoluteVolume,function(obj){
			    				return(obj.variantName==varName&&obj.parentBrandName==brandName);
		    				});
		    				var Changes=_.find(data.data[0].volumeChange,function(obj){
			    				return(obj.variantName==varName&&obj.parentBrandName==brandName);
		    				});
		    				bmShare=Volumes.marketInfo[0].segmentInfo[4].shopperInfo[0].value;
		    				onlineShare=Volumes.marketInfo[0].segmentInfo[4].shopperInfo[1].value;
		    				mixedShare=Volumes.marketInfo[0].segmentInfo[4].shopperInfo[2].value;
		    				bmChange=Changes.marketInfo[0].segmentInfo[4].shopperInfo[0].value;
		    				onlineChange=Changes.marketInfo[0].segmentInfo[4].shopperInfo[1].value;
		    				mixedChange=Changes.marketInfo[0].segmentInfo[4].shopperInfo[2].value;
		    				$scope.urban2s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});
		    				bmShare=Volumes.marketInfo[1].segmentInfo[4].shopperInfo[0].value;
		    				onlineShare=Volumes.marketInfo[1].segmentInfo[4].shopperInfo[1].value;
		    				mixedShare=Volumes.marketInfo[1].segmentInfo[4].shopperInfo[2].value;
		    				bmChange=Changes.marketInfo[1].segmentInfo[4].shopperInfo[0].value;
		    				onlineChange=Changes.marketInfo[1].segmentInfo[4].shopperInfo[1].value;
		    				mixedChange=Changes.marketInfo[1].segmentInfo[4].shopperInfo[2].value;
		    				$scope.rural2s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});

		    			}
		    		}
		    }

		    var loadVolume=function(data,category){
		    		$scope.products=new Array();
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
		    				$scope.products.push({'fullName':brandName+varName,'initial':initial,'production':production,'sales':sales,'discontinued':discontinued,'closing':closing});
		    			}
		    		}
		    }

		    var showElecssoriesConsumer=function(){
		    	switching('showElecssoriesConsumer');
		    	var url='/SCR-sharesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		loadConsumer(data,1);
		    	},function(){
		    		console.log('fail');
		    	})
		    }

		    var showElecssoriesShopper=function(){
		    	switching('showElecssoriesShopper');
		    	var url='/SCR-sharesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		loadShooper(data,1);
		    	},function(){
		    		console.log('fail');
		    	})
		    }

		    var showElecssoriesVolume=function(){
		    	switching('showElecssoriesVolume');
		    	var url='/SCR-inventoryVolumes/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		loadVolume(data,1);
		    	},function(){
		    		console.log('fail');
		    	})
		    }

		    var showHealthBeautiesConsumer=function(){
		    	switching('showHealthBeautiesConsumer');
		    	var url='/SCR-sharesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		loadConsumer(data,2);
		    	},function(){
		    		console.log('fail');
		    	})
		    }

		    var showHealthBeautiesShopper=function(){
		    	switching('showHealthBeautiesShopper');
		    	var url='/SCR-sharesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		loadShooper(data,2);
		    	},function(){
		    		console.log('fail');
		    	})
		    }
		    
		    var showHealthBeautiesVolume=function(){
		    	switching('showHealthBeautiesVolume');
		    	var url='/SCR-inventoryVolumes/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		loadVolume(data,2);
		    	},function(){
		    		console.log('fail');
		    	})
		    }
		    
		    var showProducerKey=function(){
		    	switching('showProducerKey');
		    	var url='/SCR-keyPerformanceIndicators/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
					$scope.data=data.data[0];
		    	},function(){
		    		console.log('fail');
		    	})
		    }

		    var showRetailerConsolidate=function(){
		    	switching('showRetailerConsolidate');
		    	console.log('read');
		    }

		    var showRetailerRuralProfit=function(){
		    	switching('showRetailerRuralProfit');

		    }
		    var showRetailerUrbanProfit=function(){
		    	switching('showRetailerUrbanProfit');

		    }
		    var showRetailerProfitability=function(){
		    	switching('showRetailerProfitability');

		    }
		    var showRetailerNegotiations=function(){
		    	switching('showRetailerNegotiations');

		    }
		    var showRuralConsumer=function(){
		    	switching('showRuralConsumer');

		    }
		    var showRuralShopper=function(){
		    	switching('showRuralShopper');

		    }
		    var showRuralVolume=function(){
		    	switching('showRuralVolume');

		    }
		    var showUrbanConsumer=function(){
		    	switching('showUrbanConsumer');

		    }
		    var showUrbanShopper=function(){
		    	switching('showUrbanShopper');

		    }
		    var showUrbanVolume=function(){
		    	switching('showUrbanVolume');

		    }
		    var showRetailerKey=function(){
		    	switching('showRetailerKey');

		    }

		    //load Function
		    $scope.switching=switching;
		    $scope.loadValue=loadValue;
		    $scope.loadBusiness=loadBusiness;
		    $scope.loadConsumer=loadConsumer;
		    $scope.loadShooper=loadShooper;
		    $scope.loadVolume=loadVolume;
		    //general report
		    $scope.showPerformance=showPerformance;
		    $scope.showMarketShare=showMarketShare;
		    $scope.showMarketSales=showMarketSales;
		    $scope.showSegment=showSegment;
		    $scope.showCross=showCross;
		    $scope.showProduct=showProduct;
		  	$scope.showEMallPrices=showEMallPrices;
		  	//producer report
			$scope.showProducerConsolidate=showProducerConsolidate;
			$scope.showProducerBMBusiness=showProducerBMBusiness;
			$scope.showProducerOnlineBusiness=showProducerOnlineBusiness;
			$scope.showProducerProfitability=showProducerProfitability;
			$scope.showProducerNegotiations=showProducerNegotiations;
			$scope.showElecssoriesConsumer=showElecssoriesConsumer;
			$scope.showElecssoriesShopper=showElecssoriesShopper;
			$scope.showElecssoriesVolume=showElecssoriesVolume;
			$scope.showHealthBeautiesConsumer=showHealthBeautiesConsumer;
			$scope.showHealthBeautiesShopper=showHealthBeautiesShopper;
			$scope.showHealthBeautiesVolume=showHealthBeautiesVolume;
			$scope.showProducerKey=showProducerKey;  	
		  	//retailer report
		  	$scope.showRetailerConsolidate=showRetailerConsolidate;
			$scope.showRetailerRuralProfit=showRetailerRuralProfit;
			$scope.showRetailerUrbanProfit=showRetailerUrbanProfit;
			$scope.showRetailerProfitability=showRetailerProfitability;
			$scope.showRetailerNegotiations=showRetailerNegotiations;
			$scope.showRuralConsumer=showRuralConsumer;
			$scope.showRuralShopper=showRuralShopper;
			$scope.showRuralVolume=showRuralVolume;
			$scope.showUrbanConsumer=showUrbanConsumer;
			$scope.showUrbanShopper=showUrbanShopper;
			$scope.showUrbanVolume=showUrbanVolume;
			$scope.showRetailerKey=showRetailerKey;  

		  	showPerformance();

	}]);

});
