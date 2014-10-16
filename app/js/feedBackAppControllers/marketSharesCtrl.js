var marketSharesCtrl=function($scope,$http){
    function GetRequest() {
       var url = document.location.search; //获取url中"?"符后的字串
       var theRequest = new Object();
       if (url.indexOf("?") != -1) {
          var str = url.substr(1);
          var strs = str.split("&");
          for(var i = 0; i < strs.length; i ++) {
             theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
          }
       }
       return theRequest;
    }
    var initPage=function(){
        var Request = GetRequest();
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

        var currentElecssoriesVolume=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
        var currentElecssoriesValue=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
        var previousElecssoriesVolume=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
        var previousElecssoriesValue=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
        var currentHealthBeautiesVolume=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
        var currentHealthBeautiesValue=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
        var previousHealthBeautiesVolume=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
        var previousHealthBeautiesValue=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
            

        for(var j=0;j<currentCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_VolumeMarketShares.length;i++){
                if($scope.feedBack.f_VolumeMarketShares[i].period==currentCategories[j]){
                    if($scope.feedBack.f_VolumeMarketShares[i].categoryID==1){
                        currentElecssoriesVolume[$scope.feedBack.f_VolumeMarketShares[i].actorID-1].data.push($scope.feedBack.f_VolumeMarketShares[i].value * 100);
                    }else if($scope.feedBack.f_VolumeMarketShares[i].categoryID==2){
                        currentHealthBeautiesVolume[$scope.feedBack.f_VolumeMarketShares[i].actorID-1].data.push($scope.feedBack.f_VolumeMarketShares[i].value * 100);
                    }
                }
            }
        }
        for(var j=0;j<currentCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_ValueMarketShares.length;i++){
                if($scope.feedBack.f_ValueMarketShares[i].period==currentCategories[j]){
                    if($scope.feedBack.f_ValueMarketShares[i].categoryID==1){
                        currentElecssoriesValue[$scope.feedBack.f_ValueMarketShares[i].actorID-1].data.push($scope.feedBack.f_ValueMarketShares[i].value * 100);
                    }else if($scope.feedBack.f_ValueMarketShares[i].categoryID==2){
                        currentHealthBeautiesValue[$scope.feedBack.f_ValueMarketShares[i].actorID-1].data.push($scope.feedBack.f_ValueMarketShares[i].value * 100);
                    }
                }
            }
        }
        for(var j=0;j<previousCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_VolumeMarketShares.length;i++){
                if($scope.feedBack.f_VolumeMarketShares[i].period==previousCategories[j]){
                    if($scope.feedBack.f_VolumeMarketShares[i].categoryID==1){
                        previousElecssoriesVolume[$scope.feedBack.f_VolumeMarketShares[i].actorID-1].data.push($scope.feedBack.f_VolumeMarketShares[i].value * 100);
                    }else if($scope.feedBack.f_VolumeMarketShares[i].categoryID==2){
                        previousHealthBeautiesVolume[$scope.feedBack.f_VolumeMarketShares[i].actorID-1].data.push($scope.feedBack.f_VolumeMarketShares[i].value * 100);
                    }
                }
            }
        }
        for(var j=0;j<previousCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_ValueMarketShares.length;i++){
                if($scope.feedBack.f_ValueMarketShares[i].period==previousCategories[j]){
                    if($scope.feedBack.f_ValueMarketShares[i].categoryID==1){
                        previousElecssoriesValue[$scope.feedBack.f_ValueMarketShares[i].actorID-1].data.push($scope.feedBack.f_ValueMarketShares[i].value * 100);
                    }else if($scope.feedBack.f_ValueMarketShares[i].categoryID==2){
                        previousHealthBeautiesValue[$scope.feedBack.f_ValueMarketShares[i].actorID-1].data.push($scope.feedBack.f_ValueMarketShares[i].value * 100);
                    }
                }
            }
        }

        $scope.previousSharesVolumeElecssories = {
            options: {
                title:{
                    text:'Volumes Shares',
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
            series: previousElecssoriesVolume,
            loading: false
        }
        $scope.previousSharesVolumeHealthBeauties = {
            options: {
                title:{
                    text:'Volumes Shares',
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
            series: previousHealthBeautiesVolume,
            loading: false
        }
        $scope.previousSharesValueElecssories = {
            options: {
                title:{
                    text:'Values Shares',
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
            series: previousElecssoriesValue,
            loading: false
        }
        $scope.previousSharesValueHealthBeauties = {
            options: {
                title:{
                    text:'Values Shares',
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
            series: previousHealthBeautiesValue,
            loading: false
        }
        $scope.currentSharesVolumeElecssories = {
            options: {
                title:{
                    text:'Volumes Shares',
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
        $scope.currentSharesVolumeHealthBeauties = {
            options: {
                title:{
                    text:'Volumes Shares',
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
        $scope.currentSharesValueElecssories = {
            options: {
                title:{
                    text:'Values Shares',
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
        $scope.currentSharesValueHealthBeauties = {
            options: {
                title:{
                    text:'Values Shares',
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

