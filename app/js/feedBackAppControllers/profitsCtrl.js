var profitsCtrl=function($scope,$http){
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
    var initPage=function(){
        var Request = GetRequest();
        var url='/getFeedBack/'+Request['seminar']+'/'+Request['period'];
        var currentCategories=new Array();
        var previousCategories=new Array();

        for(var i=-3;i<=Request['period'];i++){
            if(i!=Request['period']){
                currentCategories.push(i);
                previousCategories.push(i); 
            }else{
                currentCategories.push(i);
            }
        }

        var currentOperatingProfits=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});
        var currentOperatingProfitMargins=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});
        var currentNetProfits=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});
        var currentNetProfitMargins=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});
        var previousOperatingProfits=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});
        var previousOperatingProfitMargins=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});
        var previousNetProfits=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});
        var previousNetProfitMargins=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});
        for(var j=0;j<currentCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_OperatingProfit.length;i++){
                if($scope.feedBack.f_OperatingProfit[i].period==currentCategories[j]){
                    if($scope.feedBack.f_OperatingProfit[i].categoryID==3){
                        if($scope.feedBack.f_OperatingProfit[i].actorID<4){
                            currentOperatingProfits[$scope.feedBack.f_OperatingProfit[i].actorID-1].data.push($scope.feedBack.f_OperatingProfit[i].value);
                        }
                        else if($scope.feedBack.f_OperatingProfit[i].actorID>4&&$scope.feedBack.f_OperatingProfit[i].actorID<7){
                            currentOperatingProfits[$scope.feedBack.f_OperatingProfit[i].actorID-2].data.push($scope.feedBack.f_OperatingProfit[i].value);
                        }
                    }
                }
            }
        }
        for(var j=0;j<currentCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_OperatingProfitMargin.length;i++){
                if($scope.feedBack.f_OperatingProfitMargin[i].period==currentCategories[j]){
                   if($scope.feedBack.f_OperatingProfitMargin[i].categoryID==3){
                        if($scope.feedBack.f_OperatingProfitMargin[i].actorID<4){
                            currentOperatingProfitMargins[$scope.feedBack.f_OperatingProfitMargin[i].actorID-1].data.push($scope.feedBack.f_OperatingProfitMargin[i].value * 100);
                        }else if($scope.feedBack.f_OperatingProfitMargin[i].actorID>4&&$scope.feedBack.f_OperatingProfitMargin[i].actorID<7){
                            currentOperatingProfitMargins[$scope.feedBack.f_OperatingProfitMargin[i].actorID-2].data.push($scope.feedBack.f_OperatingProfitMargin[i].value * 100);
                        }
                    }
                }
            }
        }
        for(var j=0;j<currentCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_NetProfit.length;i++){
                if($scope.feedBack.f_NetProfit[i].period==currentCategories[j]){
                    if($scope.feedBack.f_NetProfit[i].categoryID==3){
                        if($scope.feedBack.f_NetProfit[i].actorID<4){
                            currentNetProfits[$scope.feedBack.f_NetProfit[i].actorID-1].data.push($scope.feedBack.f_NetProfit[i].value);
                        }else if($scope.feedBack.f_NetProfit[i].actorID>4&&$scope.feedBack.f_NetProfit[i].actorID<7){
                            currentNetProfits[$scope.feedBack.f_NetProfit[i].actorID-2].data.push($scope.feedBack.f_NetProfit[i].value);
                        }
                    }
                }
            }
        }
        for(var j=0;j<currentCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_NetProfitMargin.length;i++){
                if($scope.feedBack.f_NetProfitMargin[i].period==currentCategories[j]){
                    if($scope.feedBack.f_NetProfitMargin[i].categoryID==3){
                        if($scope.feedBack.f_NetProfitMargin[i].actorID<4){
                            currentNetProfitMargins[$scope.feedBack.f_NetProfitMargin[i].actorID-1].data.push($scope.feedBack.f_NetProfitMargin[i].value * 100);
                        }else if($scope.feedBack.f_NetProfitMargin[i].actorID>4&&$scope.feedBack.f_NetProfitMargin[i].actorID<7){
                            currentNetProfitMargins[$scope.feedBack.f_NetProfitMargin[i].actorID-2].data.push($scope.feedBack.f_NetProfitMargin[i].value * 100);
                        }
                    }
                }
            }
        }

        for(var j=0;j<previousCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_OperatingProfit.length;i++){
                if($scope.feedBack.f_OperatingProfit[i].period==previousCategories[j]){
                    if($scope.feedBack.f_OperatingProfit[i].categoryID==3){
                        if($scope.feedBack.f_OperatingProfit[i].actorID<4){
                            previousOperatingProfits[$scope.feedBack.f_OperatingProfit[i].actorID-1].data.push($scope.feedBack.f_OperatingProfit[i].value);
                        }else if($scope.feedBack.f_OperatingProfit[i].actorID>4&&$scope.feedBack.f_OperatingProfit[i].actorID<7){
                            previousOperatingProfits[$scope.feedBack.f_OperatingProfit[i].actorID-2].data.push($scope.feedBack.f_OperatingProfit[i].value);
                        }
                    }
                }
            }
        }
        for(var j=0;j<previousCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_OperatingProfitMargin.length;i++){
                if($scope.feedBack.f_OperatingProfitMargin[i].period==previousCategories[j]){
                    if($scope.feedBack.f_OperatingProfitMargin[i].categoryID==3){
                        if($scope.feedBack.f_OperatingProfitMargin[i].actorID<4){
                            previousOperatingProfitMargins[$scope.feedBack.f_OperatingProfitMargin[i].actorID-1].data.push($scope.feedBack.f_OperatingProfitMargin[i].value * 100);
                        }else if($scope.feedBack.f_OperatingProfitMargin[i].actorID>4&&$scope.feedBack.f_OperatingProfitMargin[i].actorID<7){
                            previousOperatingProfitMargins[$scope.feedBack.f_OperatingProfitMargin[i].actorID-2].data.push($scope.feedBack.f_OperatingProfitMargin[i].value * 100);
                        }
                    }
                }
            }
        }
        for(var j=0;j<previousCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_NetProfit.length;i++){
                if($scope.feedBack.f_NetProfit[i].period==previousCategories[j]){
                    if($scope.feedBack.f_NetProfit[i].categoryID==3){
                        if($scope.feedBack.f_NetProfit[i].actorID<4){
                            previousNetProfits[$scope.feedBack.f_NetProfit[i].actorID-1].data.push($scope.feedBack.f_NetProfit[i].value);
                        }else if($scope.feedBack.f_NetProfit[i].actorID>4&&$scope.feedBack.f_NetProfit[i].actorID<7){
                            previousNetProfits[$scope.feedBack.f_NetProfit[i].actorID-2].data.push($scope.feedBack.f_NetProfit[i].value);
                        }
                    }
                }
            }
        }
        for(var j=0;j<previousCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_NetProfitMargin.length;i++){
                if($scope.feedBack.f_NetProfitMargin[i].period==previousCategories[j]){
                    if($scope.feedBack.f_NetProfitMargin[i].categoryID==3){
                        if($scope.feedBack.f_NetProfitMargin[i].actorID<4){
                            previousNetProfitMargins[$scope.feedBack.f_NetProfitMargin[i].actorID-1].data.push($scope.feedBack.f_NetProfitMargin[i].value * 100);
                        }else if($scope.feedBack.f_NetProfitMargin[i].actorID>4&&$scope.feedBack.f_NetProfitMargin[i].actorID<7){
                            previousNetProfitMargins[$scope.feedBack.f_NetProfitMargin[i].actorID-2].data.push($scope.feedBack.f_NetProfitMargin[i].value * 100);
                        }
                    }
                }
            }
        }

        $scope.previousOperatingProfits = {
            options: {
                title:{
                    text:'Operating Profits',
                    style: {
                        'font-size':'16px'
                    }
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: '$mln',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                xAxis: {
                    categories: previousCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">$mln:'+this.point.y.toFixed(2)+'</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: previousOperatingProfits,
            loading: false
        }
        $scope.previousOperatingProfitMargins = {
            options: {
                title:{
                    text:'Operating Profit Margins',
                    style: {
                        'font-size':'16px'
                    }
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: '%',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                xAxis: {
                    categories: previousCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">$mln:'+this.point.y.toFixed(2)+'</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: previousOperatingProfitMargins,
            loading: false
        }
        $scope.previousNetProfits = {
            options: {
                title:{
                    text:'Net Profits',
                    style: {
                        'font-size':'16px'
                    }
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: '$mln',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                xAxis: {
                    categories: previousCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: previousNetProfits,
            loading: false
        }
        $scope.previousNetProfitMargins = {
            options: {
                title:{
                    text:'Net Profit Margins',
                    style: {
                        'font-size':'16px'
                    }
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: '%',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                xAxis: {
                    categories: previousCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: previousNetProfitMargins,
            loading: false
        }
        

        $scope.currentOperatingProfits = {
            options: {
                title:{
                    text:'Operating Profits',
                    style: {
                        'font-size':'16px'
                    }
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: '$mln',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">$mln:'+this.point.y.toFixed(2)+'</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: currentOperatingProfits,
            loading: false
        }
        $scope.currentOperatingProfitMargins = {
            options: {
                title:{
                    text:'Operating Profit Margins',
                    style: {
                        'font-size':'16px'
                    }
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: '%',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">$mln:'+this.point.y.toFixed(2)+'</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: currentOperatingProfitMargins,
            loading: false
        }
        $scope.currentNetProfits = {
            options: {
                title:{
                    text:'Net Profits',
                    style: {
                        'font-size':'16px'
                    }
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: '$mln',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: currentNetProfits,
            loading: false
        }
        $scope.currentNetProfitMargins = {
            options: {
                title:{
                    text:'Net Profit Margins',
                    style: {
                        'font-size':'16px'
                    }
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: '%',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%</p>';
                        return s;
                    },
                    positioner: function () {
                        return { x: 80, y: 50 };
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: currentNetProfitMargins,
            loading: false
        }

    }
    $scope.$watch('feedBack', function(newValue, oldValue){
        if(newValue!=undefined) {
            initPage();
        }
    });
}

