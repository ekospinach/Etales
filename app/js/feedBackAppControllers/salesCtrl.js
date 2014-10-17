var salesCtrl=function($scope,$http){
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

        var currentElecssoriesVolume=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'})
        var currentElecssoriesValue=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'})
        var previousElecssoriesVolume=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'})
        var previousElecssoriesValue=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'})
        var currentHealthBeautiesVolume=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'})
        var currentHealthBeautiesValue=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'})
        var previousHealthBeautiesVolume=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'})
        var previousHealthBeautiesValue=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'})
         

        for(var j=0;j<currentCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_MarketSalesVolume.length;i++){
                if($scope.feedBack.f_MarketSalesVolume[i].period==currentCategories[j]){
                    if($scope.feedBack.f_MarketSalesVolume[i].categoryID==1){
                        currentElecssoriesVolume[$scope.feedBack.f_MarketSalesVolume[i].actorID-1].data.push($scope.feedBack.f_MarketSalesVolume[i].value);
                    }else if($scope.feedBack.f_MarketSalesVolume[i].categoryID==2){
                        currentHealthBeautiesVolume[$scope.feedBack.f_MarketSalesVolume[i].actorID-1].data.push($scope.feedBack.f_MarketSalesVolume[i].value);
                    }
                }
            }
        }
        for(var j=0;j<currentCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_MarketSalesValue.length;i++){
                if($scope.feedBack.f_MarketSalesValue[i].period==currentCategories[j]){
                    if($scope.feedBack.f_MarketSalesValue[i].categoryID==1){
                        currentElecssoriesValue[$scope.feedBack.f_MarketSalesValue[i].actorID-1].data.push($scope.feedBack.f_MarketSalesValue[i].value);
                    }else if($scope.feedBack.f_MarketSalesValue[i].categoryID==2){
                        currentHealthBeautiesValue[$scope.feedBack.f_MarketSalesValue[i].actorID-1].data.push($scope.feedBack.f_MarketSalesValue[i].value);
                    }
                }
            }
        }
        for(var j=0;j<previousCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_MarketSalesVolume.length;i++){
                if($scope.feedBack.f_MarketSalesVolume[i].period==previousCategories[j]){
                    if($scope.feedBack.f_MarketSalesVolume[i].categoryID==1){
                        previousElecssoriesVolume[$scope.feedBack.f_MarketSalesVolume[i].actorID-1].data.push($scope.feedBack.f_MarketSalesVolume[i].value);
                    }else if($scope.feedBack.f_MarketSalesVolume[i].categoryID==2){
                        previousHealthBeautiesVolume[$scope.feedBack.f_MarketSalesVolume[i].actorID-1].data.push($scope.feedBack.f_MarketSalesVolume[i].value);
                    }
                }
            }
        }
        for(var j=0;j<previousCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_MarketSalesValue.length;i++){
                if($scope.feedBack.f_MarketSalesValue[i].period==previousCategories[j]){
                    if($scope.feedBack.f_MarketSalesValue[i].categoryID==1){
                        previousElecssoriesValue[$scope.feedBack.f_MarketSalesValue[i].actorID-1].data.push($scope.feedBack.f_MarketSalesValue[i].value);
                    }else if($scope.feedBack.f_MarketSalesValue[i].categoryID==2){
                        previousHealthBeautiesValue[$scope.feedBack.f_MarketSalesValue[i].actorID-1].data.push($scope.feedBack.f_MarketSalesValue[i].value);
                    }
                }
            }
        }

        $scope.previousSalesVolumeElecssories = {
            options: {
                title:{
                    text:'Sales Volumes',
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
                        text: 'mln units',
                        style: {
                            'font-size':'16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: previousCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    },
                    tickmarkPlacement: 'on'
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">mln units:'+this.point.y.toFixed(2)+'</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: previousElecssoriesVolume,
            loading: false
        }
        $scope.previousSalesVolumeHealthBeauties = {
            options: {
                title:{
                    text:'Sales Volumes',
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
                        text: 'mln units',
                        style: {
                            'font-size':'16px'
                        }
                    },
                    gridLineColor: 'transparent'
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
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">mln units:'+this.point.y.toFixed(2)+'</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: previousHealthBeautiesVolume,
            loading: false
        }
        $scope.previousSalesValueElecssories = {
            options: {
                title:{
                    text:'Sales Values',
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
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: previousCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    },
                    tickmarkPlacement: 'on'
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
            series: previousElecssoriesValue,
            loading: false
        }
        $scope.previousSalesValueHealthBeauties = {
            options: {
                title:{
                    text:'Sales Values',
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
                    },
                    gridLineColor: 'transparent'
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
            series: previousHealthBeautiesValue,
            loading: false
        }
        $scope.currentSalesVolumeElecssories = {
            options: {
                title:{
                    text:'Sales Volumes',
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
                        text: 'mln units',
                        style: {
                            'font-size':'16px'
                        }
                    },
                    gridLineColor: 'transparent'
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
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">mln units:'+this.point.y.toFixed(2)+'</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: currentElecssoriesVolume,
            loading: false
        }
        $scope.currentSalesVolumeHealthBeauties = {
            options: {
                title:{
                    text:'Sales Volumes',
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
                        text: 'mln units',
                        style: {
                            'font-size':'16px'
                        }
                    },
                    gridLineColor: 'transparent'
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
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">mln units:'+this.point.y.toFixed(2)+'</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: currentHealthBeautiesVolume,
            loading: false
        }
        $scope.currentSalesValueElecssories = {
            options: {
                title:{
                    text:'Sales Values',
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
                    },
                    gridLineColor: 'transparent'
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
            series: currentElecssoriesValue,
            loading: false
        }
        $scope.currentSalesValueHealthBeauties = {
            options: {
                title:{
                    text:'Sales Values',
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
                    },
                    gridLineColor: 'transparent'
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
            series: currentHealthBeautiesValue,
            loading: false
        }

    }
    $scope.$watch('feedBack', function(newValue, oldValue){
        if(newValue!=undefined) {
            initPage();
        }
    });
}

