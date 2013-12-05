define(['app','socketIO','routingConfig'], function(app) {

	app.controller('reportCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth', function($scope, $http, ProducerDecisionBase,$rootScope,Auth) {
		// You can access the scope of the controller from here
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
		var myfinreport="";
		$scope.myfinreport=myfinreport;

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
		    }else if(finTitleENG!="Prices per unit"){
		      $rootScope.finDetailShow="";
		    }
		    if(type=="Fin"){
		      url='/finReport?period='+period+'&seminar='+seminar+'&titleENG='+finTitleENG+'&role='+role;
		    }else if(type=="Vol"){
		      url='/volReport?period='+period+'&seminar='+seminar+'&titleENG='+finTitleENG+'&role='+role;
		    }
		    $http({method: 'GET', url: url}).
		      success(function(data, status, headers, config) {
		        myfinreport=data;
		        showFinReport($scope.cat,$scope.market,$scope.language,$scope.detail,$scope.roleID);
		      }).
		      error(function(data, status, headers, config) {
		        myfinreport=null;
		      });
		      console.log($scope.myfinreport);
		  }

		  var showFinReport=function(cat,market,language,detail,roleID){
		    $scope.cat=cat;
		    $scope.market=market;
		    $scope.language=language;
		    $scope.detail=detail;
		    $scope.roleID=roleID;
		    $scope.showRoleID=roleID;
		    var charttable = {};
		    var title="";
		    if(roleID=="Retailer 3"){
		      $scope.showRoleID="Traditional Trade";
		    }else if(roleID=="Retailer 4"){
		      $scope.showRoleID="E-Mall";  
		    }
		    if(detail=="Global"||detail=="Category"){//"Global","Category","Brand","Variant"
		      $scope.reportCollection=_.find(myfinreport.dataCollection,function(obj){
		        return (obj.market==market&&obj.detail==detail&&obj.roleID==roleID)
		      });
		      $rootScope.finCatShow="hide";
		      $rootScope.finCatCss="";
		    }else{
		      $scope.reportCollection=_.find(myfinreport.dataCollection,function(obj){
		        return (obj.market==market&&obj.category==cat&&obj.detail==detail&&obj.roleID==roleID)
		      });
		      $rootScope.finCatShow="";
		      $rootScope.finCatCss="margin-left:10px";    
		    }
		    if($scope.reportCollection==undefined){
		      charttable=null;
		      title="";
		    }else if($scope.reportCollection!=undefined){
		          for(var i=0;i<$scope.reportCollection.data.rows.length;i++){
		      for(var j=0;j<$scope.reportCollection.data.rows[i].c.length;j++){
		        if(j==0){
		          if(language=="Russian"){
		            $scope.reportCollection.data.rows[i].c[j].f=$scope.reportCollection.data.rows[i].c[j].vRUS;
		          }else if(language=="Chinese"){
		            $scope.reportCollection.data.rows[i].c[j].f=$scope.reportCollection.data.rows[i].c[j].vCHN;
		          }else{
		            $scope.reportCollection.data.rows[i].c[j].f=$scope.reportCollection.data.rows[i].c[j].v;
		          }
		        }
		        else{
		          $scope.reportCollection.data.rows[i].c[j].f=$scope.reportCollection.data.rows[i].c[j].v;
		        }
		      }
		    }
		    for(var i=0;i<$scope.reportCollection.data.cols.length;i++){
		      /*多语言数据不全*/
		      /*if(language=="Russian"){
		        $scope.reportCollection.data.cols[i].label=$scope.reportCollection.data.cols[i].labelRUS;
		        console.log(charttable.data.cols[i].labelCHN);
		      }else if(language=="Chinese"){
		        $scope.reportCollection.data.cols[i].label=$scope.reportCollection.data.cols[i].labelCHN;
		        console.log(charttable.data.cols[i].labelCHN);
		      }else{
		        $scope.reportCollection.data.cols[i].label=$scope.reportCollection.data.cols[i].labelENG;
		        console.log(charttable.data.cols[i].labelCHN);
		      }*/
		      $scope.reportCollection.data.cols[i].label=$scope.reportCollection.data.cols[i]["label "];
		    }
		        var charttable = {};
		        charttable.type = "Table";
		        charttable.displayed = true;
		        charttable.cssStyle = "height:400px; width:100%;";
		        charttable.data=$scope.reportCollection.data;
		        var title="";
		        if(language=="Russian"){
		          title=myfinreport.titleRUS;
		        }
		        else if(language=="English"){
		          title=myfinreport.titleENG;
		        }
		        else if(language=="Chinese"){
		          title=myfinreport.titleCHN;
		        }
		        charttable.options = {
		          "title": title,
		          "isStacked": "true",
		          "fill": 20,
		          "displayExactValues": true,
		          "vAxis": {
		              "title": "Sales unit", "gridlines": {"count": 10}
		          },
		          "hAxis": {
		              "title": "Date"
		          }
		      }
		    }
		      $scope.optitle=title;
		      $scope.charttable=charttable;
		  }

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
		  $scope.roleID="Producer 1";
		  $scope.showRoleID="Producer 1";
		  $scope.cat="HealthBeauties";
		  $scope.market="Urban";
		  $scope.language="English";
		  $scope.detail="Brand";
		  $scope.role="Producer";
		  $scope.type="Fin";

		  $scope.getFinReport=getFinReport;
		  $scope.showFinReport=showFinReport;

		  getFinReport($scope.seminar,$scope.realTitleENG,$scope.period,$scope.role,$scope.type);

	}]);

});

