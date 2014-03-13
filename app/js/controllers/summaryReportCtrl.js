define(['app','socketIO','routingConfig'], function(app) {

	app.controller('summaryReportCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth','$anchorScroll','$q','PlayerInfo','SeminarInfo','PeriodInfo','Label', function($scope, $http, ProducerDecisionBase,$rootScope,Auth,$anchorScroll,$q,PlayerInfo,SeminarInfo,PeriodInfo,Label) {
		// You can access the scope of the controller from here

			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";

		    var generalReport="";
		    var url="/getGeneralReport/"+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod();
		    $http({
		    	method:'GET',
		    	url:url
		    }).then(function(data){
		    	$scope.generalReport=data.data;
		    	showPerformance();
		    });

		    var showPerformance=function(){
		    	$scope.Performance=true;
		    	$scope.MarketShare=false;
		    	$scope.Product=false;
		    	$scope.EMallPrices=false;

		    	$scope.operatingProfits=new Array();
		    	$scope.cumulativeInvestments=new Array();
		    	$scope.salesVolumes=new Array();
		    	$scope.salesValues=new Array();
		    	$scope.volumeShares=new Array();
		    	$scope.valueShares=new Array();
		    	for(i=0;i<$scope.generalReport[0].actorInfo.length;i++){
		    		$scope.operatingProfits.push({'value':$scope.generalReport[0].actorInfo[i].grph_OperatingProfit});
		    		$scope.cumulativeInvestments.push({'value':$scope.generalReport[0].actorInfo[i].grph_CumulativeInvestment});
		    		for(j=0;j<$scope.generalReport[0].actorInfo[i].actorCategoryInfo.length-1;j++){
		    			$scope.salesVolumes.push({'value':$scope.generalReport[0].actorInfo[i].actorCategoryInfo[j].grph_SalesVolume});
		    			$scope.salesValues.push({'value':$scope.generalReport[0].actorInfo[i].actorCategoryInfo[j].grph_NetSalesValue});
		    			$scope.valueShares.push({'value':$scope.generalReport[0].actorInfo[i].actorCategoryInfo[j].grph_ValueMarketShare});
		    			$scope.volumeShares.push({'value':$scope.generalReport[0].actorInfo[i].actorCategoryInfo[j].grph_VolumeMarketShare});
		    		}
		    	}
		    }

		    var showMarketShare=function(){
		    	$scope.Performance=false;
		    	$scope.MarketShare=true;
		    	$scope.Product=false;
		    	$scope.EMallPrices=false;

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

		    	for(i=0;i<$scope.generalReport[0].actorInfo.length;i++){
		    		//total
		    		$scope.totals[0].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolume);
		    		$scope.totalChanges[0].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolumeChange);
		    		$scope.totals[1].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValue);
		    		$scope.totalChanges[1].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValueChange);
		    		$scope.totals[2].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolume);
		    		$scope.totalChanges[2].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolumeChange);
		    		$scope.totals[3].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValue);
		    		$scope.totalChanges[3].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValueChange);
		    		//rural
		    		$scope.rurals[0].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolume);
		    		$scope.ruralChanges[0].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolumeChange);
		    		$scope.rurals[1].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValue);
		    		$scope.ruralChanges[1].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValueChange);
		    		$scope.rurals[2].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolume);
		    		$scope.ruralChanges[2].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolumeChange);
		    		$scope.rurals[3].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValue);
		    		$scope.ruralChanges[3].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[0].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValueChange);
		    		//urban
		    		$scope.urbans[0].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolume);
		    		$scope.urbanChanges[0].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolumeChange);
		    		$scope.urbans[1].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValue);
		    		$scope.urbanChanges[1].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValueChange);
		    		$scope.urbans[2].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolume);
		    		$scope.urbanChanges[2].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareVolumeChange);
		    		$scope.urbans[3].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValue);
		    		$scope.urbanChanges[3].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[1].actorSegmentInfo[4].actorShopperInfo[3].grsom_MarketShareValueChange);
		    		//price
		    		$scope.prices[0].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grsom_MarketShareVolume);
		    		$scope.priceChanges[0].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grsom_MarketShareVolumeChange);
		    		$scope.prices[1].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grsom_MarketShareValue);
		    		$scope.priceChanges[1].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grsom_MarketShareValueChange);
		    		$scope.prices[2].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grsom_MarketShareVolume);
		    		$scope.priceChanges[2].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grsom_MarketShareVolumeChange);
		    		$scope.prices[3].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grsom_MarketShareValue);
		    		$scope.priceChanges[3].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[0].actorShopperInfo[3].grsom_MarketShareValueChange);
		    		//value
		    		$scope.values[0].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grsom_MarketShareVolume);
		    		$scope.valueChanges[0].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grsom_MarketShareVolumeChange);
		    		$scope.values[1].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grsom_MarketShareValue);
		    		$scope.valueChanges[1].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grsom_MarketShareValueChange);
		    		$scope.values[2].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grsom_MarketShareVolume);
		    		$scope.valueChanges[2].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grsom_MarketShareVolumeChange);
		    		$scope.values[3].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grsom_MarketShareValue);
		    		$scope.valueChanges[3].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[1].actorShopperInfo[3].grsom_MarketShareValueChange);		    		
		    		//fashion
		    		$scope.fashions[0].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grsom_MarketShareVolume);
		    		$scope.fashionChanges[0].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grsom_MarketShareVolumeChange);
		    		$scope.fashions[1].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grsom_MarketShareValue);
		    		$scope.fashionChanges[1].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grsom_MarketShareValueChange);
		    		$scope.fashions[2].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grsom_MarketShareVolume);
		    		$scope.fashionChanges[2].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grsom_MarketShareVolumeChange);
		    		$scope.fashions[3].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grsom_MarketShareValue);
		    		$scope.fashionChanges[3].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[2].actorShopperInfo[3].grsom_MarketShareValueChange);		    		
		    		//freaks
		    		$scope.freakss[0].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grsom_MarketShareVolume);
		    		$scope.freaksChanges[0].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grsom_MarketShareVolumeChange);
		    		$scope.freakss[1].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grsom_MarketShareValue);
		    		$scope.freaksChanges[1].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grsom_MarketShareValueChange);
		    		$scope.freakss[2].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grsom_MarketShareVolume);
		    		$scope.freaksChanges[2].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grsom_MarketShareVolumeChange);
		    		$scope.freakss[3].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grsom_MarketShareValue);
		    		$scope.freaksChanges[3].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[3].actorShopperInfo[3].grsom_MarketShareValueChange);		    		
		    		//bm
		    		$scope.bms[0].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grsom_MarketShareVolume);
		    		$scope.bmChanges[0].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grsom_MarketShareVolumeChange);
		    		$scope.bms[1].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grsom_MarketShareValue);
		    		$scope.bmChanges[1].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grsom_MarketShareValueChange);
		    		$scope.bms[2].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grsom_MarketShareVolume);
		    		$scope.bmChanges[2].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grsom_MarketShareVolumeChange);
		    		$scope.bms[3].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grsom_MarketShareValue);
		    		$scope.bmChanges[3].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[0].grsom_MarketShareValueChange);
		    		//online
		    		$scope.onlines[0].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grsom_MarketShareVolume);
		    		$scope.onlineChanges[0].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grsom_MarketShareVolumeChange);
		    		$scope.onlines[1].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grsom_MarketShareValue);
		    		$scope.onlineChanges[1].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grsom_MarketShareValueChange);
		    		$scope.onlines[2].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grsom_MarketShareVolume);
		    		$scope.onlineChanges[2].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grsom_MarketShareVolumeChange);
		    		$scope.onlines[3].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grsom_MarketShareValue);
		    		$scope.onlineChanges[3].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[1].grsom_MarketShareValueChange);
		    		//mixed
		    		$scope.mixeds[0].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grsom_MarketShareVolume);
		    		$scope.mixedChanges[0].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grsom_MarketShareVolumeChange);
		    		$scope.mixeds[1].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grsom_MarketShareValue);
		    		$scope.mixedChanges[1].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[0].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grsom_MarketShareValueChange);
		    		$scope.mixeds[2].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grsom_MarketShareVolume);
		    		$scope.mixedChanges[2].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grsom_MarketShareVolumeChange);
		    		$scope.mixeds[3].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grsom_MarketShareValue);
		    		$scope.mixedChanges[3].push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[1].actorMarketInfo[2].actorSegmentInfo[4].actorShopperInfo[2].grsom_MarketShareValueChange);
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

		    	$scope.chartSeries = [
			        {"name": Label.getContent('Producer')+' 1', "data": [$scope.totals[0][0],0,$scope.rurals[0][0],$scope.urbans[0][0],0,$scope.prices[0][0],$scope.values[0][0],$scope.fashions[0][0],$scope.freakss[0][0],0,$scope.bms[0][0],$scope.onlines[0][0],$scope.mixeds[0][0]], type: "column",color:'#3257A7'},
			        {"name": Label.getContent('Producer')+' 2', "data": [$scope.totals[0][1],0,$scope.rurals[0][1],$scope.urbans[0][1],0,$scope.prices[0][1],$scope.values[0][1],$scope.fashions[0][1],$scope.freakss[0][1],0,$scope.bms[0][1],$scope.onlines[0][1],$scope.mixeds[0][1]], type: "column",color:'#B11E22'},
			        {"name": Label.getContent('Producer')+' 3', "data": [$scope.totals[0][2],0,$scope.rurals[0][2],$scope.urbans[0][2],0,$scope.prices[0][2],$scope.values[0][2],$scope.fashions[0][2],$scope.freakss[0][2],0,$scope.bms[0][2],$scope.onlines[0][2],$scope.mixeds[0][2]], type: "column",color:'#F6B920'},
			        {"name": Label.getContent('Producer')+' 4', "data": [$scope.totals[0][3],0,$scope.rurals[0][3],$scope.urbans[0][3],0,$scope.prices[0][3],$scope.values[0][3],$scope.fashions[0][3],$scope.freakss[0][3],0,$scope.bms[0][3],$scope.onlines[0][3],$scope.mixeds[0][3]], type: "column",color:'#329444'},
			      	{"name": Label.getContent('Retailer')+' 1', "data": [$scope.totals[0][4],0,$scope.rurals[0][4],$scope.urbans[0][4],0,$scope.prices[0][4],$scope.values[0][4],$scope.fashions[0][4],$scope.freakss[0][4],0,$scope.bms[0][4],$scope.onlines[0][4],$scope.mixeds[0][4]], type: "column",color:'#8B288B'},
			        {"name": Label.getContent('Retailer')+' 2', "data": [$scope.totals[0][5],0,$scope.rurals[0][5],$scope.urbans[0][5],0,$scope.prices[0][5],$scope.values[0][5],$scope.fashions[0][5],$scope.freakss[0][5],0,$scope.bms[0][5],$scope.onlines[0][5],$scope.mixeds[0][5]], type: "column",color:'#F05422'},
			    ];

			    $scope.chartConfig = {
			        options: {
			        	xAxis: {
				            categories: ['Total', '', 'Rural', 'Urban', '', 'Price Sensitive','Value for Money','Fashion','Freaks','','B&M Only','Online Only','Mixed']
				        },
			            chart: {
			                type: 'areaspline'
			            },
			            plotOptions: {
			                series: {
			                    stacking: 'percent'
			                }
			            }
			        },
			        series: $scope.chartSeries,
			        title: {
			            text: 'Hello'
			        },
			        credits: {
			            enabled: true
			        },
			        loading: false
			    }
		    }

		    var showProduct=function(){
		    	$scope.Performance=false;
		    	$scope.MarketShare=false;
		    	$scope.Product=true;
		    	$scope.EMallPrices=false;
		    }

		    var showEMallPrices=function(){
		    	$scope.Performance=false;
		    	$scope.MarketShare=false;
		    	$scope.Product=false;
		    	$scope.EMallPrices=true;
		    }

		    $scope.showPerformance=showPerformance;
		    $scope.showMarketShare=showMarketShare;
		    $scope.showProduct=showProduct;
		  	$scope.showEMallPrices=showEMallPrices;

	}]);

});
