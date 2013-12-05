define(['app','socketIO','routingConfig'], function(app) {

	app.controller('mapCtrl',['$scope','$rootScope','$http','$location','$resource','map','Map','Auth', 
		function($scope, $rootScope,$http,$location,$resource,map,Map,Auth) {
		// You can access the scope of the controller from here
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
		$scope.map=map;
    	var getMap=function(seminar,period){
	    	$scope.seminar=seminar;
	    	$scope.period=period;
	    	$rootScope.mapPeriod=period;
	    	Map.get({seminar: seminar,period:period}, function(newmap) {
			   	$scope.map=newmap;
			   	showChart($scope.cat,$scope.market,$scope.language);
			});
		}
		//showall
		var showChart = function(cat,market,language){
			$scope.cat=cat;
			$scope.market=market;
			$scope.language=language;
			$scope.pageCollection=_.find($scope.map.pageCollection, function(obj) { 
				return (obj.category == cat&&obj.market==market) 
			});

			var colors=new Array("#000000");
			var tree = [{
	            "key": "P-1",
	            "values": []
	        },{
	            "key": "P-2",
	            "values": []
	        },{
	            "key": "P-3",
	            "values": []
	        },{
	            "key": "R-1",
	            "values": []
	        },{
	            "key": "R-2",
	            "values": []
	        }];
			var length=$scope.pageCollection.brandCollection.length;
			var brandname="";
			var datas=new Array([0,0,0,""]);
			if(language=="English"){
					mapTitle=datas[0][4]=$scope.pageCollection.titleENG;
				}
				else if(language=="Chinese"){
					mapTitle=datas[0][4]=$scope.pageCollection.titleCHN;
				}
				else if(language=="Russian"){
					mapTitle=datas[0][4]=$scope.pageCollection.titleRUS;
				}
			for (var i=1;i<=length;i++){
				datas[i]=new Array();
				datas[i][0]=parseInt($scope.pageCollection.brandCollection[i-1].easeOfUsePerception.Value);
				datas[i][1]=parseInt($scope.pageCollection.brandCollection[i-1].qualityPerception.Value);
				datas[i][2]=1;
				brandname=datas[i][3]=$scope.pageCollection.brandCollection[i-1].brandName;
				switch(brandname.substr(brandname.length-1)){
					case "1":
							tree[0].values.push({"key":brandname});
							colors[i]="#004CE5";
							break;
					case "2":
							tree[1].values.push({"key":brandname});
							colors[i]="#BB0000"
							break;
					case "3":
							tree[2].values.push({"key":brandname});
							colors[i]="#FFBC01";
							break;
					case "5":
							tree[3].values.push({"key":brandname});
							colors[i]="#339933";
							break;
					case "6":
							tree[4].values.push({"key":brandname});
							colors[i]="#990099";
							break;
				}
				datas[i][4]=new Array();
				datas[i][4]=$scope.pageCollection.brandCollection[i-1];

				if(language=="English"){
					datas[i][4].easeOfUsePerception.Selectlabel=datas[i][4].easeOfUsePerception.labelENG;
					datas[i][4].qualityPerception.Selectlabel=datas[i][4].qualityPerception.labelENG;
					datas[i][4].pricePerception.Selectlabel=datas[i][4].pricePerception.labelENG;
					datas[i][4].marketShare.Selectlabel=datas[i][4].marketShare.labelENG;
					datas[i][4].brandAwareness.Selectlabel=datas[i][4].brandAwareness.labelENG;
					datas[i][4].visibilityShare.Selectlabel=datas[i][4].visibilityShare.labelENG;
				}
				else if(language=="Chinese"){
					datas[i][4].easeOfUsePerception.Selectlabel=datas[i][4].easeOfUsePerception.labelCHN;
					datas[i][4].qualityPerception.Selectlabel=datas[i][4].qualityPerception.labelCHN;
					datas[i][4].pricePerception.Selectlabel=datas[i][4].pricePerception.labelCHN;
					datas[i][4].marketShare.Selectlabel=datas[i][4].marketShare.labelCHN;
					datas[i][4].brandAwareness.Selectlabel=datas[i][4].brandAwareness.labelCHN;
					datas[i][4].visibilityShare.Selectlabel=datas[i][4].visibilityShare.labelCHN;
				}
				else if(language=="Russian"){
					datas[i][4].easeOfUsePerception.Selectlabel=datas[i][4].easeOfUsePerception.labelRUS;
					datas[i][4].qualityPerception.Selectlabel=datas[i][4].qualityPerception.labelRUS;
					datas[i][4].pricePerception.Selectlabel=datas[i][4].pricePerception.labelRUS;
					datas[i][4].marketShare.Selectlabel=datas[i][4].marketShare.labelRUS;
					datas[i][4].brandAwareness.Selectlabel=datas[i][4].brandAwareness.labelRUS;
					datas[i][4].visibilityShare.Selectlabel=datas[i][4].visibilityShare.labelRUS;
				}
			}
			$scope.data=datas;
			$scope.mapTitle=mapTitle;
			for(var i=0;i<tree.length;i++){
				if(tree[i].values.length==0){
					tree.splice(i,1);
				}
			}
			$scope.colors=colors;
			$scope.tree=tree;
		}

		//showselect

		var showSelect=function(){

			//var data="?period="+$scope.period+"&cat="+$scope.cat+"&market="+$scope.market+"&language="+$scope.language+"&data="+JSON.stringify($('.listTree').data('listTree').selected);
			var select=$('.listTree').data('listTree').selected;
			var selectdata=new Array();
			for(var i=0;i<select.length;i++){
				for(var j=0;j<select[i].values.length;j++){
					selectdata.push(select[i].values[j]);
				}
			}
			//console.log(selectdata);
			Map.get({seminar: seminar,period:period}, function(newmap) {
			   	$scope.map=newmap;
			   	$scope.pageCollection=_.find($scope.map.pageCollection, function(obj) { 
					return (obj.category == $scope.cat&&obj.market==$scope.market) 
				});
				var length=$scope.pageCollection.brandCollection.length;
				var brandname="";
				var datas=new Array([0,0,0,""]);
				var colors=new Array("#000000");
				if($scope.language=="English"){
						mapTitle=datas[0][4]=$scope.pageCollection.titleENG;
					}
					else if($scope.language=="Chinese"){
						mapTitle=datas[0][4]=$scope.pageCollection.titleCHN;
					}
					else if($scope.language=="Russian"){
						mapTitle=datas[0][4]=$scope.pageCollection.titleRUS;
					}
				for (var i=1;i<=length;i++){
					datas[i]=new Array();
					datas[i][0]=parseInt($scope.pageCollection.brandCollection[i-1].easeOfUsePerception.Value);
					datas[i][1]=parseInt($scope.pageCollection.brandCollection[i-1].qualityPerception.Value);
					datas[i][2]=1;
					brandname=datas[i][3]=$scope.pageCollection.brandCollection[i-1].brandName;
					switch(brandname.substr(brandname.length-1)){
					case "1":
							colors[i]="#004CE5";
							break;
					case "2":
							colors[i]="#BB0000"
							break;
					case "3":
							colors[i]="#FFBC01";
							break;
					case "5":
							colors[i]="#339933";
							break;
					case "6":
							colors[i]="#990099";
							break;
				}

					datas[i][4]=new Array();
					datas[i][4]=$scope.pageCollection.brandCollection[i-1];

					if($scope.language=="English"){
						datas[i][4].easeOfUsePerception.Selectlabel=datas[i][4].easeOfUsePerception.labelENG;
						datas[i][4].qualityPerception.Selectlabel=datas[i][4].qualityPerception.labelENG;
						datas[i][4].pricePerception.Selectlabel=datas[i][4].pricePerception.labelENG;
						datas[i][4].marketShare.Selectlabel=datas[i][4].marketShare.labelENG;
						datas[i][4].brandAwareness.Selectlabel=datas[i][4].brandAwareness.labelENG;
						datas[i][4].visibilityShare.Selectlabel=datas[i][4].visibilityShare.labelENG;
					}
					else if($scope.language=="Chinese"){
						datas[i][4].easeOfUsePerception.Selectlabel=datas[i][4].easeOfUsePerception.labelCHN;
						datas[i][4].qualityPerception.Selectlabel=datas[i][4].qualityPerception.labelCHN;
						datas[i][4].pricePerception.Selectlabel=datas[i][4].pricePerception.labelCHN;
						datas[i][4].marketShare.Selectlabel=datas[i][4].marketShare.labelCHN;
						datas[i][4].brandAwareness.Selectlabel=datas[i][4].brandAwareness.labelCHN;
						datas[i][4].visibilityShare.Selectlabel=datas[i][4].visibilityShare.labelCHN;
					}
					else if($scope.language=="Russian"){
						datas[i][4].easeOfUsePerception.Selectlabel=datas[i][4].easeOfUsePerception.labelRUS;
						datas[i][4].qualityPerception.Selectlabel=datas[i][4].qualityPerception.labelRUS;
						datas[i][4].pricePerception.Selectlabel=datas[i][4].pricePerception.labelRUS;
						datas[i][4].marketShare.Selectlabel=datas[i][4].marketShare.labelRUS;
						datas[i][4].brandAwareness.Selectlabel=datas[i][4].brandAwareness.labelRUS;
						datas[i][4].visibilityShare.Selectlabel=datas[i][4].visibilityShare.labelRUS;
					}
				}
				var count=0;
				var deletedata=new Array();
				for(var i=1;i<datas.length;i++){
					count=0;
					for(var j=0;j<selectdata.length;j++)
					{
						if(datas[i][3]==selectdata[j].key){
							count++;
						}
					}
					if(count==0){
						deletedata.push(i);
					}
				}
				for(var i=deletedata.length-1;i>=0;i--){
					datas.splice(deletedata[i],1);
					colors.splice(deletedata[i],1);
				}
				//console.log(datas);
				$scope.data=datas;
				$scope.colors=colors;
				$scope.mapTitle=mapTitle;
			});
		}

	//default report for Elecsorries

		$scope.params="";
		$scope.mapTitle="";
		$scope.cat="Elecsories";
		$scope.market="Rural";
		$scope.language="English";
		var startFrom=$rootScope.rootStartFrom;
		var endWith=$rootScope.rootEndWith;
		var period=endWith;
		var periods=new Array();
		for(var i=startFrom;i<=endWith;i++){
			periods.push(i);
		}
		$scope.seminar=$rootScope.user.seminar;
		$scope.periods=periods;
		$scope.period=endWith;
		$scope.getMap=getMap;
		$scope.showSelect=showSelect;
		$scope.showChart = showChart;
		showChart($scope.cat,$scope.market,$scope.language);
	}]);
});