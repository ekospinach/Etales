define(['app','socketIO','routingConfig'], function(app) {

	app.controller('reportCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth','Label', function($scope, $http, ProducerDecisionBase,$rootScope,Auth,Label) {
		var myfinreport="";
		$scope.myfinreport=myfinreport;

		//send request to server to get data
		var getFinReport=function(seminar,finTitleENG,period,role,type){
		    $scope.finTitleENG=finTitleENG;
		    $scope.period=period;
		    $scope.seminar=seminar;
		    $scope.role=role;
		    $scope.type=type;

		    if(role=="Producer"){
		      if($scope.roleID=="Retailer 1"||$scope.roleID=="Retailer 2"||$scope.roleID=="Retailer 3"||$scope.roleID=="Retailer 4"){
		        $scope.roleID="Producer 1";
		      }
		      $rootScope.finProShow="";
		      $rootScope.finRetShow="hide";
		    }else if(role=="Retailer"){
		      if($scope.roleID=="Producer 1"||$scope.roleID=="Producer 2"||$scope.roleID=="Producer 3"||$scope.roleID=="Producer 4"){
		        $scope.roleID="Retailer 1";
		      }
		      $rootScope.finProShow="hide";
		      $rootScope.finRetShow="";
		    }

		    var url="";
		    if(finTitleENG=="Prices per unit"){
		      $scope.detail="Variant";
		      $rootScope.finDetailShow="hide";
		    }else if(finTitleENG=="Profitability by Supplier" || finTitleENG=="Profitability by Channel"){
		      $scope.detail="Category";
		      $rootScope.finDetailShow="hide";
		    }else {
		      $rootScope.finDetailShow="";
		    }

		    if(type=="Fin"){
		      url='/finReport?period='+period+'&seminar='+seminar+'&titleENG='+finTitleENG+'&role='+role;
		    }else if(type=="Vol"){
		      url='/volReport?period='+period+'&seminar='+seminar+'&titleENG='+finTitleENG+'&role='+role;
		    }

		    //console.log(url);

		    $http({method: 'GET', url: url}).
		      success(function(data, status, headers, config) {
		        myfinreport=data;
		        $scope.showTitleENG=finTitleENG;
		        showFinReport($scope.cat,$scope.market,$scope.language,$scope.detail,$scope.roleID);
		      }).
		      error(function(data, status, headers, config) {
		        myfinreport=null;
		      });
		  }

		  //filter data from server, show result
		  var showFinReport=function(cat,market,language,detail,roleID){
		    $scope.cat=cat;
		    $scope.market=market;
		    $scope.language=language;
		    $scope.detail=detail;
		    $scope.roleID=roleID;
		    $scope.showRoleID=roleID;
		    
		    var reportCollection;
		    if(roleID=="Retailer 3"){
		    	$scope.showRoleID="Traditional Trade";
		    }else if(roleID=="Retailer 4"){
		      	$scope.showRoleID="E-Mall";  
		    }

		    if(detail=="Global"){//||detail=="Category"){//"Global","Category","Brand","Variant"
				reportCollection=_.find(myfinreport.dataCollection,function(obj){
		        	return (obj.market==market&&obj.detail==detail&&obj.roleID==roleID)
		      	});
		      	$rootScope.finCatShow="hide";
		     	$rootScope.finCatCss="";
		    }else if(detail=="Category"){
		    	reportCollection=_.find(myfinreport.dataCollection,function(obj){
		        	return (obj.market==market&&obj.detail==detail&&obj.roleID==roleID)
		      	});
		      	$rootScope.finCatShow="";
		      	$rootScope.finCatCss="margin-left:10px";
		    }else{
				reportCollection=_.find(myfinreport.dataCollection,function(obj){
		        	return (obj.market==market&&obj.category==cat&&obj.detail==detail&&obj.roleID==roleID)
		      	});
		      	$rootScope.finCatShow="";
		      	$rootScope.finCatCss="margin-left:10px";    
		    }

		    if(reportCollection){
		      //deal with multiple language 
		      for(var i=0;i<reportCollection.data.rows.length;i++){
			    for(var j=0;j<reportCollection.data.rows[i].c.length;j++){
			        if(j==0){
			          if(language=="RUS"){
			            reportCollection.data.rows[i].c[j].f=reportCollection.data.rows[i].c[j].vRUS;
			          }else if(language=="CHN"){
			            reportCollection.data.rows[i].c[j].f=reportCollection.data.rows[i].c[j].vCHN;
			          }else{
			            reportCollection.data.rows[i].c[j].f=reportCollection.data.rows[i].c[j].v;
			          }
			        }
			        else{
			          reportCollection.data.rows[i].c[j].v=reportCollection.data.rows[i].c[j].v;
			        }
			    }
		      }

		    }
		    $scope.reportCollection = reportCollection;
		    console.log($scope.reportCollection);
		  }		      
		    // for(var i=0;i<reportCollection.data.cols.length;i++){
		    //   /*多语言数据不全*/
		    //   if(language=="Russian"){
		    //     reportCollection.data.cols[i].label=reportCollection.data.cols[i].labelRUS;
		    //     console.log(charttable.data.cols[i].labelCHN);
		    //   }else if(language=="Chinese"){
		    //     reportCollection.data.cols[i].label=reportCollection.data.cols[i].labelCHN;
		    //     console.log(charttable.data.cols[i].labelCHN);
		    //   }else{
		    //     reportCollection.data.cols[i].label=reportCollection.data.cols[i].labelENG;
		    //     console.log(charttable.data.cols[i].labelCHN);
		    //   }
		    //   reportCollection.data.cols[i].label=reportCollection.data.cols[i]["label "];
		    // }

		  //set default value, show report depends on login user's role
		  var initialisePage = function(){
			  var seminar=$rootScope.user.seminar;
			  var finTitleENG="Profit and Loss Statement";
			  $scope.seminar=seminar;
			  $scope.realTitleENG=finTitleENG;
			  $scope.showTitleENG=finTitleENG;
			  var startFrom=$rootScope.rootStartFrom;
			  var endWith=$rootScope.rootEndWith;

			  var period=endWith;
			  var periods=new Array();
			  for(var i=startFrom;i<=endWith;i++){
			    periods.push(i);
			  }
			  $scope.periods=periods;
			  $scope.period=period;
			  $scope.cat="HealthBeauties";
			  $scope.market="Urban";
			  $scope.language=Label.getCurrentLanguage();
			  $scope.detail="Brand";
			  $scope.type="Fin";
			  $scope.getFinReport=getFinReport;
			  $scope.showFinReport=showFinReport;
			  
			  switch(parseInt($rootScope.user.role)){
				case Auth.userRoles.producer:
				    $scope.role="Producer";
				    $scope.roleID="Producer " + $rootScope.user.roleID;
				    $scope.showRoleID="Producer " + $rootScope.user.roleID;
				    $scope.isRoleIDChangeBtnShow = false;
					break;
				case Auth.userRoles.retailer:
				    $scope.role="Retailer";
				    $scope.roleID="Retailer " + $rootScope.user.roleID;
				    $scope.showRoleID="Retailer " + $rootScope.user.roleID;
				    $scope.isRoleIDChangeBtnShow = false;
					break;
				case Auth.userRoles.facilitator:
				    $scope.role="Producer";
				    $scope.roleID="Producer 1";
				    $scope.showRoleID="Producer 1";
				    $scope.isRoleIDChangeBtnShow = true;
					break;				
				default:
				    $scope.role="Producer";
				    $scope.roleID="Producer 1";
				    $scope.showRoleID="Producer 1";	
				    $scope.isRoleIDChangeBtnShow = true;  	
			  } 
			  getFinReport($scope.seminar,$scope.realTitleENG,$scope.period,$scope.role,$scope.type);	  	
		  };

		  initialisePage();

	}]);

});

