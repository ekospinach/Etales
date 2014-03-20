define(['app','socketIO','routingConfig'], function(app) {

	app.controller('summaryReportCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth','$anchorScroll','$q','PlayerInfo','SeminarInfo','PeriodInfo','Label', function($scope, $http, ProducerDecisionBase,$rootScope,Auth,$anchorScroll,$q,PlayerInfo,SeminarInfo,PeriodInfo,Label) {
		// You can access the scope of the controller from here

			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";

		    var switching=function(type){
		    	switch(type){
		    		case'showPerformance':
			    		$scope.Performance=true;
				    	$scope.MarketShare=false;
				    	$scope.MarketSales=false;
				    	$scope.Segment=false;
				    	$scope.Cross=false;
				    	$scope.Product=false;
				    	$scope.EMallPrices=false;
				    break;
				    case'showMarketShare':
			    		$scope.Performance=false;
				    	$scope.MarketShare=true;
				    	$scope.MarketSales=false;
				    	$scope.Segment=false;
				    	$scope.Cross=false;
				    	$scope.Product=false;
				    	$scope.EMallPrices=false;
				    break;
				    case'showMarketSales':
			    		$scope.Performance=false;
				    	$scope.MarketShare=false;
				    	$scope.MarketSales=true;
				    	$scope.Segment=false;
				    	$scope.Cross=false;
				    	$scope.Product=false;
				    	$scope.EMallPrices=false;
				    break;
				    case'showSegment':
			    		$scope.Performance=false;
				    	$scope.MarketShare=false;
				    	$scope.MarketSales=false;
				    	$scope.Segment=true;
				    	$scope.Cross=false;
				    	$scope.Product=false;
				    	$scope.EMallPrices=false;
				    break;
				    case'showCross':
			    		$scope.Performance=false;
				    	$scope.MarketShare=false;
				    	$scope.MarketSales=false;
				    	$scope.Segment=false;
				    	$scope.Cross=true;
				    	$scope.Product=false;
				    	$scope.EMallPrices=false;
				    break;
				    case'showProduct':
			    		$scope.Performance=false;
				    	$scope.MarketShare=false;
				    	$scope.MarketSales=false;
				    	$scope.Segment=false;
				    	$scope.Cross=false;
				    	$scope.Product=true;
				    	$scope.EMallPrices=false;
				    break;
				    case'showEMallPrices':
			    		$scope.Performance=false;
				    	$scope.MarketShare=false;
				    	$scope.MarketSales=false;
				    	$scope.Segment=false;
				    	$scope.Cross=false;
				    	$scope.Product=false;
				    	$scope.EMallPrices=true;
				    break;
		    	}
		    }

		    var showPerformance=function(){
		    	switching('showPerformance');
		    	var url='/performanceHighlights/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod();
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

		    	var url='/marketShare/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod();
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		$scope.totals=new Array();
			    	$scope.totalChanges=new Array();

			    	$scope.rurals=new Array();
			    	$scope.ruralChanges=new Array();
			    	$scope.urbans=new Array();
			    	$scope.urbanChanges=new Array();

			    	$scope.prices=new Array();
			    	$scope.priceChanges=new Array();
			    	$scope.values=new Array();
			    	$scope.valueChanges=new Array();
			    	$scope.fashions=new Array();
			    	$scope.fashionChanges=new Array();
			    	$scope.freakss=new Array();
			    	$scope.freaksChanges=new Array();

			    	$scope.bms=new Array();
			    	$scope.bmChanges=new Array();
			    	$scope.onlines=new Array();
			    	$scope.onlineChanges=new Array();
			    	$scope.mixeds=new Array();
			    	$scope.mixedChanges=new Array();


			    	for(var i=0;i<4;i++){
			    		$scope.totals[i]=new Array();
			    		$scope.totalChanges[i]=new Array();
			    		$scope.rurals[i]=new Array();
			    		$scope.ruralChanges[i]=new Array();
			    		$scope.urbans[i]=new Array();
			    		$scope.urbanChanges[i]=new Array();

			    		$scope.prices[i]=new Array();
			    		$scope.priceChanges[i]=new Array();
			    		$scope.values[i]=new Array();
			    		$scope.valueChanges[i]=new Array();
			    		$scope.fashions[i]=new Array();
			    		$scope.fashionChanges[i]=new Array();
			    		$scope.freakss[i]=new Array();
			    		$scope.freaksChanges[i]=new Array();

			    		$scope.bms[i]=new Array();
			    		$scope.bmChanges[i]=new Array();
			    		$scope.onlines[i]=new Array();
			    		$scope.onlineChanges[i]=new Array();
			    		$scope.mixeds[i]=new Array();
			    		$scope.mixedChanges[i]=new Array();
			    	}

			    	for(i=0;i<data.data[0].actorInfo.length;i++){
			    		//total
			    		$scope.totals[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolume);
			    		$scope.totalChanges[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolumeChange);
			    		$scope.totals[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValue);
			    		$scope.totalChanges[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValueChange);
			    		$scope.totals[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolume);
			    		$scope.totalChanges[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolumeChange);
			    		$scope.totals[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValue);
			    		$scope.totalChanges[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValueChange);
			    		//rural
			    		$scope.rurals[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolume);
			    		$scope.ruralChanges[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolumeChange);
			    		$scope.rurals[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValue);
			    		$scope.ruralChanges[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValueChange);
			    		$scope.rurals[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolume);
			    		$scope.ruralChanges[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolumeChange);
			    		$scope.rurals[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValue);
			    		$scope.ruralChanges[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValueChange);
			    		//urban
			    		$scope.urbans[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolume);
			    		$scope.urbanChanges[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolumeChange);
			    		$scope.urbans[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValue);
			    		$scope.urbanChanges[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValueChange);
			    		$scope.urbans[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolume);
			    		$scope.urbanChanges[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolumeChange);
			    		$scope.urbans[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValue);
			    		$scope.urbanChanges[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValueChange);
			    		//price
			    		$scope.prices[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grsom_MarketShareVolume);
			    		$scope.priceChanges[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grsom_MarketShareVolumeChange);
			    		$scope.prices[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grsom_MarketShareValue);
			    		$scope.priceChanges[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grsom_MarketShareValueChange);
			    		$scope.prices[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grsom_MarketShareVolume);
			    		$scope.priceChanges[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grsom_MarketShareVolumeChange);
			    		$scope.prices[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grsom_MarketShareValue);
			    		$scope.priceChanges[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grsom_MarketShareValueChange);
			    		//value
			    		$scope.values[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grsom_MarketShareVolume);
			    		$scope.valueChanges[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grsom_MarketShareVolumeChange);
			    		$scope.values[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grsom_MarketShareValue);
			    		$scope.valueChanges[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grsom_MarketShareValueChange);
			    		$scope.values[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grsom_MarketShareVolume);
			    		$scope.valueChanges[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grsom_MarketShareVolumeChange);
			    		$scope.values[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grsom_MarketShareValue);
			    		$scope.valueChanges[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grsom_MarketShareValueChange);		    		
			    		//fashion
			    		$scope.fashions[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grsom_MarketShareVolume);
			    		$scope.fashionChanges[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grsom_MarketShareVolumeChange);
			    		$scope.fashions[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grsom_MarketShareValue);
			    		$scope.fashionChanges[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grsom_MarketShareValueChange);
			    		$scope.fashions[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grsom_MarketShareVolume);
			    		$scope.fashionChanges[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grsom_MarketShareVolumeChange);
			    		$scope.fashions[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grsom_MarketShareValue);
			    		$scope.fashionChanges[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grsom_MarketShareValueChange);		    		
			    		//freaks
			    		$scope.freakss[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grsom_MarketShareVolume);
			    		$scope.freaksChanges[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grsom_MarketShareVolumeChange);
			    		$scope.freakss[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grsom_MarketShareValue);
			    		$scope.freaksChanges[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grsom_MarketShareValueChange);
			    		$scope.freakss[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grsom_MarketShareVolume);
			    		$scope.freaksChanges[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grsom_MarketShareVolumeChange);
			    		$scope.freakss[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grsom_MarketShareValue);
			    		$scope.freaksChanges[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grsom_MarketShareValueChange);		    		
			    		//bm
			    		$scope.bms[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grsom_MarketShareVolume);
			    		$scope.bmChanges[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grsom_MarketShareVolumeChange);
			    		$scope.bms[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grsom_MarketShareValue);
			    		$scope.bmChanges[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grsom_MarketShareValueChange);
			    		$scope.bms[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grsom_MarketShareVolume);
			    		$scope.bmChanges[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grsom_MarketShareVolumeChange);
			    		$scope.bms[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grsom_MarketShareValue);
			    		$scope.bmChanges[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grsom_MarketShareValueChange);
			    		//online
			    		$scope.onlines[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grsom_MarketShareVolume);
			    		$scope.onlineChanges[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grsom_MarketShareVolumeChange);
			    		$scope.onlines[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grsom_MarketShareValue);
			    		$scope.onlineChanges[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grsom_MarketShareValueChange);
			    		$scope.onlines[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grsom_MarketShareVolume);
			    		$scope.onlineChanges[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grsom_MarketShareVolumeChange);
			    		$scope.onlines[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grsom_MarketShareValue);
			    		$scope.onlineChanges[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grsom_MarketShareValueChange);
			    		//mixed
			    		$scope.mixeds[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grsom_MarketShareVolume);
			    		$scope.mixedChanges[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grsom_MarketShareVolumeChange);
			    		$scope.mixeds[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grsom_MarketShareValue);
			    		$scope.mixedChanges[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grsom_MarketShareValueChange);
			    		$scope.mixeds[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grsom_MarketShareVolume);
			    		$scope.mixedChanges[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grsom_MarketShareVolumeChange);
			    		$scope.mixeds[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grsom_MarketShareValue);
			    		$scope.mixedChanges[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grsom_MarketShareValueChange);
			    	}

					//color
					/*
						P1 #3257A7
						P2 #B11E22
						P3 #F6B920
						P4 #329444
						R1 #8B288B
						R2 #F05422
					*/

			    	$scope.chart1Series = [			        
				        {"name": Label.getContent('Producer')+' 1', "data": [$scope.totals[0][0],0,$scope.rurals[0][0],$scope.urbans[0][0],0,$scope.prices[0][0],$scope.values[0][0],$scope.fashions[0][0],$scope.freakss[0][0],0,$scope.bms[0][0],$scope.onlines[0][0],$scope.mixeds[0][0]], type: "column",color:'#3257A7'},
				        {"name": Label.getContent('Producer')+' 2', "data": [$scope.totals[0][1],0,$scope.rurals[0][1],$scope.urbans[0][1],0,$scope.prices[0][1],$scope.values[0][1],$scope.fashions[0][1],$scope.freakss[0][1],0,$scope.bms[0][1],$scope.onlines[0][1],$scope.mixeds[0][1]], type: "column",color:'#B11E22'},
				        {"name": Label.getContent('Producer')+' 3', "data": [$scope.totals[0][2],0,$scope.rurals[0][2],$scope.urbans[0][2],0,$scope.prices[0][2],$scope.values[0][2],$scope.fashions[0][2],$scope.freakss[0][2],0,$scope.bms[0][2],$scope.onlines[0][2],$scope.mixeds[0][2]], type: "column",color:'#F6B920'},
				        {"name": Label.getContent('Producer')+' 4', "data": [$scope.totals[0][3],0,$scope.rurals[0][3],$scope.urbans[0][3],0,$scope.prices[0][3],$scope.values[0][3],$scope.fashions[0][3],$scope.freakss[0][3],0,$scope.bms[0][3],$scope.onlines[0][3],$scope.mixeds[0][3]], type: "column",color:'#329444'},
				      	{"name": Label.getContent('Retailer')+' 1', "data": [$scope.totals[0][4],0,$scope.rurals[0][4],$scope.urbans[0][4],0,$scope.prices[0][4],$scope.values[0][4],$scope.fashions[0][4],$scope.freakss[0][4],0,$scope.bms[0][4],$scope.onlines[0][4],$scope.mixeds[0][4]], type: "column",color:'#8B288B'},
				        {"name": Label.getContent('Retailer')+' 2', "data": [$scope.totals[0][5],0,$scope.rurals[0][5],$scope.urbans[0][5],0,$scope.prices[0][5],$scope.values[0][5],$scope.fashions[0][5],$scope.freakss[0][5],0,$scope.bms[0][5],$scope.onlines[0][5],$scope.mixeds[0][5]], type: "column",color:'#F05422'},
				    ];

				    $scope.change1s=new Array();
				    for(i=0;i<6;i++){
				    	$scope.change1s[i]=new Array();
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

		    	var url='/marketSales/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod();
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		$scope.totals=new Array();
			    	$scope.totalChanges=new Array();

			    	$scope.rurals=new Array();
			    	$scope.ruralChanges=new Array();
			    	$scope.urbans=new Array();
			    	$scope.urbanChanges=new Array();

			    	$scope.prices=new Array();
			    	$scope.priceChanges=new Array();
			    	$scope.values=new Array();
			    	$scope.valueChanges=new Array();
			    	$scope.fashions=new Array();
			    	$scope.fashionChanges=new Array();
			    	$scope.freakss=new Array();
			    	$scope.freaksChanges=new Array();

			    	$scope.bms=new Array();
			    	$scope.bmChanges=new Array();
			    	$scope.onlines=new Array();
			    	$scope.onlineChanges=new Array();
			    	$scope.mixeds=new Array();
			    	$scope.mixedChanges=new Array();


			    	for(var i=0;i<4;i++){
			    		$scope.totals[i]=new Array();
			    		$scope.totalChanges[i]=new Array();
			    		$scope.rurals[i]=new Array();
			    		$scope.ruralChanges[i]=new Array();
			    		$scope.urbans[i]=new Array();
			    		$scope.urbanChanges[i]=new Array();

			    		$scope.prices[i]=new Array();
			    		$scope.priceChanges[i]=new Array();
			    		$scope.values[i]=new Array();
			    		$scope.valueChanges[i]=new Array();
			    		$scope.fashions[i]=new Array();
			    		$scope.fashionChanges[i]=new Array();
			    		$scope.freakss[i]=new Array();
			    		$scope.freaksChanges[i]=new Array();

			    		$scope.bms[i]=new Array();
			    		$scope.bmChanges[i]=new Array();
			    		$scope.onlines[i]=new Array();
			    		$scope.onlineChanges[i]=new Array();
			    		$scope.mixeds[i]=new Array();
			    		$scope.mixedChanges[i]=new Array();
			    	}

			    	for(i=0;i<data.data[0].actorInfo.length;i++){
			    		//total
			    		$scope.totals[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolume);
			    		$scope.totalChanges[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolumeChange);
			    		$scope.totals[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValue);
			    		$scope.totalChanges[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValueChange);
			    		$scope.totals[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolume);
			    		$scope.totalChanges[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolumeChange);
			    		$scope.totals[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValue);
			    		$scope.totalChanges[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValueChange);
			    		//rural
			    		$scope.rurals[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolume);
			    		$scope.ruralChanges[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolumeChange);
			    		$scope.rurals[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValue);
			    		$scope.ruralChanges[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValueChange);
			    		$scope.rurals[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolume);
			    		$scope.ruralChanges[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolumeChange);
			    		$scope.rurals[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValue);
			    		$scope.ruralChanges[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValueChange);
			    		//urban
			    		$scope.urbans[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolume);
			    		$scope.urbanChanges[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolumeChange);
			    		$scope.urbans[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValue);
			    		$scope.urbanChanges[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValueChange);
			    		$scope.urbans[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolume);
			    		$scope.urbanChanges[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketSalesVolumeChange);
			    		$scope.urbans[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValue);
			    		$scope.urbanChanges[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grms_MarketNetSalesValueChange);
			    		//price
			    		$scope.prices[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grms_MarketSalesVolume);
			    		$scope.priceChanges[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grms_MarketSalesVolumeChange);
			    		$scope.prices[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grms_MarketNetSalesValue);
			    		$scope.priceChanges[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grms_MarketNetSalesValueChange);
			    		$scope.prices[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grms_MarketSalesVolume);
			    		$scope.priceChanges[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grms_MarketSalesVolumeChange);
			    		$scope.prices[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grms_MarketNetSalesValue);
			    		$scope.priceChanges[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grms_MarketNetSalesValueChange);
			    		//value
			    		$scope.values[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grms_MarketSalesVolume);
			    		$scope.valueChanges[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grms_MarketSalesVolumeChange);
			    		$scope.values[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grms_MarketNetSalesValue);
			    		$scope.valueChanges[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grms_MarketNetSalesValueChange);
			    		$scope.values[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grms_MarketSalesVolume);
			    		$scope.valueChanges[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grms_MarketSalesVolumeChange);
			    		$scope.values[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grms_MarketNetSalesValue);
			    		$scope.valueChanges[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grms_MarketNetSalesValueChange);		    		
			    		//fashion
			    		$scope.fashions[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grms_MarketSalesVolume);
			    		$scope.fashionChanges[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grms_MarketSalesVolumeChange);
			    		$scope.fashions[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grms_MarketNetSalesValue);
			    		$scope.fashionChanges[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grms_MarketNetSalesValueChange);
			    		$scope.fashions[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grms_MarketSalesVolume);
			    		$scope.fashionChanges[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grms_MarketSalesVolumeChange);
			    		$scope.fashions[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grms_MarketNetSalesValue);
			    		$scope.fashionChanges[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grms_MarketNetSalesValueChange);		    		
			    		//freaks
			    		$scope.freakss[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grms_MarketSalesVolume);
			    		$scope.freaksChanges[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grms_MarketSalesVolumeChange);
			    		$scope.freakss[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grms_MarketNetSalesValue);
			    		$scope.freaksChanges[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grms_MarketNetSalesValueChange);
			    		$scope.freakss[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grms_MarketSalesVolume);
			    		$scope.freaksChanges[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grms_MarketSalesVolumeChange);
			    		$scope.freakss[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grms_MarketNetSalesValue);
			    		$scope.freaksChanges[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grms_MarketNetSalesValueChange);		    		
			    		//bm
			    		$scope.bms[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grms_MarketSalesVolume);
			    		$scope.bmChanges[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grms_MarketSalesVolumeChange);
			    		$scope.bms[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grms_MarketNetSalesValue);
			    		$scope.bmChanges[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grms_MarketNetSalesValueChange);
			    		$scope.bms[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grms_MarketSalesVolume);
			    		$scope.bmChanges[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grms_MarketSalesVolumeChange);
			    		$scope.bms[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grms_MarketNetSalesValue);
			    		$scope.bmChanges[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grms_MarketNetSalesValueChange);
			    		//online
			    		$scope.onlines[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grms_MarketSalesVolume);
			    		$scope.onlineChanges[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grms_MarketSalesVolumeChange);
			    		$scope.onlines[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grms_MarketNetSalesValue);
			    		$scope.onlineChanges[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grms_MarketNetSalesValueChange);
			    		$scope.onlines[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grms_MarketSalesVolume);
			    		$scope.onlineChanges[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grms_MarketSalesVolumeChange);
			    		$scope.onlines[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grms_MarketNetSalesValue);
			    		$scope.onlineChanges[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grms_MarketNetSalesValueChange);
			    		//mixed
			    		$scope.mixeds[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grms_MarketSalesVolume);
			    		$scope.mixedChanges[0].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grms_MarketSalesVolumeChange);
			    		$scope.mixeds[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grms_MarketNetSalesValue);
			    		$scope.mixedChanges[1].push(data.data[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grms_MarketNetSalesValueChange);
			    		$scope.mixeds[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grms_MarketSalesVolume);
			    		$scope.mixedChanges[2].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grms_MarketSalesVolumeChange);
			    		$scope.mixeds[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grms_MarketNetSalesValue);
			    		$scope.mixedChanges[3].push(data.data[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grms_MarketNetSalesValueChange);
			    	}

					//color
					/*
						P1 #3257A7
						P2 #B11E22
						P3 #F6B920
						P4 #329444
						R1 #8B288B
						R2 #F05422
					*/

			    	$scope.chart1Series = [			        
				        {"name": Label.getContent('Producer')+' 1', "data": [$scope.totals[0][0],0,$scope.rurals[0][0],$scope.urbans[0][0],0,$scope.prices[0][0],$scope.values[0][0],$scope.fashions[0][0],$scope.freakss[0][0],0,$scope.bms[0][0],$scope.onlines[0][0],$scope.mixeds[0][0]], type: "column",color:'#3257A7'},
				        {"name": Label.getContent('Producer')+' 2', "data": [$scope.totals[0][1],0,$scope.rurals[0][1],$scope.urbans[0][1],0,$scope.prices[0][1],$scope.values[0][1],$scope.fashions[0][1],$scope.freakss[0][1],0,$scope.bms[0][1],$scope.onlines[0][1],$scope.mixeds[0][1]], type: "column",color:'#B11E22'},
				        {"name": Label.getContent('Producer')+' 3', "data": [$scope.totals[0][2],0,$scope.rurals[0][2],$scope.urbans[0][2],0,$scope.prices[0][2],$scope.values[0][2],$scope.fashions[0][2],$scope.freakss[0][2],0,$scope.bms[0][2],$scope.onlines[0][2],$scope.mixeds[0][2]], type: "column",color:'#F6B920'},
				        {"name": Label.getContent('Producer')+' 4', "data": [$scope.totals[0][3],0,$scope.rurals[0][3],$scope.urbans[0][3],0,$scope.prices[0][3],$scope.values[0][3],$scope.fashions[0][3],$scope.freakss[0][3],0,$scope.bms[0][3],$scope.onlines[0][3],$scope.mixeds[0][3]], type: "column",color:'#329444'},
				      	{"name": Label.getContent('Retailer')+' 1', "data": [$scope.totals[0][4],0,$scope.rurals[0][4],$scope.urbans[0][4],0,$scope.prices[0][4],$scope.values[0][4],$scope.fashions[0][4],$scope.freakss[0][4],0,$scope.bms[0][4],$scope.onlines[0][4],$scope.mixeds[0][4]], type: "column",color:'#8B288B'},
				        {"name": Label.getContent('Retailer')+' 2', "data": [$scope.totals[0][5],0,$scope.rurals[0][5],$scope.urbans[0][5],0,$scope.prices[0][5],$scope.values[0][5],$scope.fashions[0][5],$scope.freakss[0][5],0,$scope.bms[0][5],$scope.onlines[0][5],$scope.mixeds[0][5]], type: "column",color:'#F05422'},
				    ];

				    $scope.change1s=new Array();
				    for(i=0;i<6;i++){
				    	$scope.change1s[i]=new Array();
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
		    	var url='/segmentLeadership/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod();
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		//Price marketID :3 segmentID 1 allShopperInfo
		    		//B&m	segmentID 5  BMPrice
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
		    	var url='/crossSegmentSales/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod();
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

		    	var url='/productPortfolio/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod();
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
		    				case '5':
		    					$scope.retailer1es.push(data.data[0].categoryInfo[0].variantInfo[i]);
		    				break;
		    				case '6':
		    					$scope.retailer2es.push(data.data[0].categoryInfo[0].variantInfo[i]);
		    				break;
		    				case '7':break;
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
		    				case '5':
		    					$scope.retailer1hs.push(data.data[0].categoryInfo[1].variantInfo[i]);
		    				break;
		    				case '6':
		    					$scope.retailer2hs.push(data.data[0].categoryInfo[1].variantInfo[i]);
		    				break;
		    				case '7':break;
		    			}
		    		}

		    	},function(){
		    		console.log('fail');
		    	})
		    }

		    var showEMallPrices=function(){
		    	switching('showEMallPrices');
		    	var url='/emallPrices/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod();
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

		    		// $scope.retailer1es=new Array();
		    		// $scope.retailer1hs=new Array();

		    		// $scope.retailer2es=new Array();
		    		// $scope.retailer2hs=new Array();

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
		    				// case '5':
		    				// 	$scope.retailer1es.push(data.data[0].categoryInfo[0].variantInfo[i]);
		    				// break;
		    				// case '6':
		    				// 	$scope.retailer2es.push(data.data[0].categoryInfo[0].variantInfo[i]);
		    				// break;
		    				// case '7':break;
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

		    $scope.switching=switching;
		    $scope.showPerformance=showPerformance;
		    $scope.showMarketShare=showMarketShare;
		    $scope.showMarketSales=showMarketSales;
		    $scope.showSegment=showSegment;
		    $scope.showCross=showCross;
		    $scope.showProduct=showProduct;
		  	$scope.showEMallPrices=showEMallPrices;
		  	showPerformance();

	}]);

});
