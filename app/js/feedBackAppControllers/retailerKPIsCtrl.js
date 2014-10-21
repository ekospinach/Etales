var retailerKPIsCtrl=function($scope,$http){
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
        var myCategories=new Array();
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
        
        testCategories=[Request['period']-1,Request['period']];
        myCategories=[Request['period']-1,Request['period'],'',Request['period']-1,Request['period']];

        var salesValueElecssories=new Array();

        var rotationIndexSalesValueElecssories=new Array({name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});
        var rotationIndexSalesValueHealthBeauties=new Array({name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});
        var rotationIndexSalesVolumeElecssories=new Array({name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});
        var rotationIndexSalesVolumeHealthBeauties=new Array({name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});

        var previousUrbanProfitabilityIndex=new Array({name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});
        var currentUrbanProfitabilityIndex=new Array({name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});
        var previousRuralProfitabilityIndex=new Array({name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});
        var currentRuralProfitabilityIndex=new Array({name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});
        
        var ruralStockCover=new Array({name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});
        var urbanStockCover=new Array({name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});
        var EStockCover=new Array({name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});
        var HStockCover=new Array({name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});

        var ruralShareOfShoppers=new Array({name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});
        var urbanShareOfShoppers=new Array({name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'});

        //rotationIndexSalesValue
        for(var j=0;j<testCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_RetailersValueRotationIndex.length;i++){
                if($scope.feedBack.f_RetailersValueRotationIndex[i].period==testCategories[j]){
                    if($scope.feedBack.f_RetailersValueRotationIndex[i].categoryID==1){
                        if($scope.feedBack.f_RetailersValueRotationIndex[i].marketID==1){
                            rotationIndexSalesValueElecssories[$scope.feedBack.f_RetailersValueRotationIndex[i].retailerID-1].data.push($scope.feedBack.f_RetailersValueRotationIndex[i].value);
                        }
                    }else if($scope.feedBack.f_RetailersValueRotationIndex[i].categoryID==2){
                        if($scope.feedBack.f_RetailersValueRotationIndex[i].marketID==1){
                            rotationIndexSalesValueHealthBeauties[$scope.feedBack.f_RetailersValueRotationIndex[i].retailerID-1].data.push($scope.feedBack.f_RetailersValueRotationIndex[i].value);
                        }
                    }
                }
            }
        }
        for(var i=0;i<2;i++){
            rotationIndexSalesValueElecssories[i].data.push('');
            rotationIndexSalesValueHealthBeauties[i].data.push('');
        }
        for(var j=0;j<testCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_RetailersValueRotationIndex.length;i++){
                if($scope.feedBack.f_RetailersValueRotationIndex[i].period==testCategories[j]){
                    if($scope.feedBack.f_RetailersValueRotationIndex[i].categoryID==1){
                        if($scope.feedBack.f_RetailersValueRotationIndex[i].marketID==2){
                            rotationIndexSalesValueElecssories[$scope.feedBack.f_RetailersValueRotationIndex[i].retailerID-1].data.push($scope.feedBack.f_RetailersValueRotationIndex[i].value);
                        }
                    }else if($scope.feedBack.f_RetailersValueRotationIndex[i].categoryID==2){
                        if($scope.feedBack.f_RetailersValueRotationIndex[i].marketID==2){
                            rotationIndexSalesValueHealthBeauties[$scope.feedBack.f_RetailersValueRotationIndex[i].retailerID-1].data.push($scope.feedBack.f_RetailersValueRotationIndex[i].value);
                        }
                    }
                }
            }
        }
        
        //rotationIndexSalesVolume
        for(var j=0;j<testCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_RetailersVolumeRotationIndex.length;i++){
                if($scope.feedBack.f_RetailersVolumeRotationIndex[i].period==testCategories[j]){
                    if($scope.feedBack.f_RetailersVolumeRotationIndex[i].categoryID==1){
                        if($scope.feedBack.f_RetailersVolumeRotationIndex[i].marketID==1){
                            rotationIndexSalesVolumeElecssories[$scope.feedBack.f_RetailersVolumeRotationIndex[i].retailerID-1].data.push($scope.feedBack.f_RetailersVolumeRotationIndex[i].value);
                        }
                    }else if($scope.feedBack.f_RetailersVolumeRotationIndex[i].categoryID==2){
                        if($scope.feedBack.f_RetailersVolumeRotationIndex[i].marketID==1){
                            rotationIndexSalesVolumeHealthBeauties[$scope.feedBack.f_RetailersVolumeRotationIndex[i].retailerID-1].data.push($scope.feedBack.f_RetailersVolumeRotationIndex[i].value);
                        }
                    }
                }
            }
        }
        for(var i=0;i<2;i++){
            rotationIndexSalesVolumeElecssories[i].data.push('');
            rotationIndexSalesVolumeHealthBeauties[i].data.push('');
        }
        for(var j=0;j<testCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_RetailersVolumeRotationIndex.length;i++){
                if($scope.feedBack.f_RetailersVolumeRotationIndex[i].period==testCategories[j]){
                    if($scope.feedBack.f_RetailersVolumeRotationIndex[i].categoryID==1){
                        if($scope.feedBack.f_RetailersVolumeRotationIndex[i].marketID==2){
                            rotationIndexSalesVolumeElecssories[$scope.feedBack.f_RetailersVolumeRotationIndex[i].retailerID-1].data.push($scope.feedBack.f_RetailersVolumeRotationIndex[i].value);
                        }
                    }else if($scope.feedBack.f_RetailersVolumeRotationIndex[i].categoryID==2){
                        if($scope.feedBack.f_RetailersVolumeRotationIndex[i].marketID==2){
                            rotationIndexSalesVolumeHealthBeauties[$scope.feedBack.f_RetailersVolumeRotationIndex[i].retailerID-1].data.push($scope.feedBack.f_RetailersVolumeRotationIndex[i].value);
                        }
                    }
                }
            }
        }

        //currentProfitability Index
        for(var j=0;j<currentCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_RetailersProfitabilityIndex.length;i++){
                if($scope.feedBack.f_RetailersProfitabilityIndex[i].period==currentCategories[j]){
                    if($scope.feedBack.f_RetailersProfitabilityIndex[i].categoryID==3){
                        if($scope.feedBack.f_RetailersProfitabilityIndex[i].marketID==1){
                            currentUrbanProfitabilityIndex[$scope.feedBack.f_RetailersProfitabilityIndex[i].retailerID-1].data.push($scope.feedBack.f_RetailersProfitabilityIndex[i].value);
                        }else if($scope.feedBack.f_RetailersProfitabilityIndex[i].marketID==2){
                            currentRuralProfitabilityIndex[$scope.feedBack.f_RetailersProfitabilityIndex[i].retailerID-1].data.push($scope.feedBack.f_RetailersProfitabilityIndex[i].value);
                        }
                    }
                }
            }
        }
        //previousProfitability Index
        for(var j=0;j<previousCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_RetailersProfitabilityIndex.length;i++){
                if($scope.feedBack.f_RetailersProfitabilityIndex[i].period==previousCategories[j]){
                    if($scope.feedBack.f_RetailersProfitabilityIndex[i].categoryID==3){
                        if($scope.feedBack.f_RetailersProfitabilityIndex[i].marketID==1){
                            previousUrbanProfitabilityIndex[$scope.feedBack.f_RetailersProfitabilityIndex[i].retailerID-1].data.push($scope.feedBack.f_RetailersProfitabilityIndex[i].value);
                        }else if($scope.feedBack.f_RetailersProfitabilityIndex[i].marketID==2){
                            previousRuralProfitabilityIndex[$scope.feedBack.f_RetailersProfitabilityIndex[i].retailerID-1].data.push($scope.feedBack.f_RetailersProfitabilityIndex[i].value);
                        }
                    }
                }
            }
        }
        //Stock Cover
        for(var j=0;j<currentCategories.length;j++){
            for(var i=0;i<$scope.feedBack.f_RetailersStocksCover.length;i++){
                if($scope.feedBack.f_RetailersStocksCover[i].period==currentCategories[j]){
                    if($scope.feedBack.f_RetailersStocksCover[i].marketID==3){
                        if($scope.feedBack.f_RetailersStocksCover[i].categoryID==1){
                            EStockCover[$scope.feedBack.f_RetailersStocksCover[i].retailerID-1].data.push($scope.feedBack.f_RetailersStocksCover[i].value);
                        } else if($scope.feedBack.f_RetailersStocksCover[i].categoryID==2){
                            HStockCover[$scope.feedBack.f_RetailersStocksCover[i].retailerID-1].data.push($scope.feedBack.f_RetailersStocksCover[i].value);
                        }
                    }
                }
            }
        }



        $scope.rotationIndexSalesValueElecssories={
            options: {
                xAxis: {
                    categories: myCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                yAxis:{
                    title: {
                        text: '$mln',
                        style: {
                            'font-size':'16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">$mln:'+this.point.y.toFixed(2)+'</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                // legend: {
                //     layout: 'vertical',
                //     align: 'right',
                //     verticalAlign: 'middle'
                // },
                credits: {
                    enabled: false
                }
            },
            series: rotationIndexSalesValueElecssories,
            title: {
                text: 'Elecssories - Sales Value',
                style: {
                    'font-size':'16px'
                }
            },
            subtitle: {
                text: '<p style="font-size:20px;float:left;" class="text-left">Urban Market</p><p style="font-size:20px;float:right;" class="text-right">Rural Market</p>',
                useHTML:true,

            },
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.rotationIndexSalesValueHealthBeauties={
            options: {
                xAxis: {
                    categories: myCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                yAxis:{
                    title: {
                        text: '$mln',
                        style: {
                            'font-size':'16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">$mln:'+this.point.y.toFixed(2)+'</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                // legend: {
                //     layout: 'vertical',
                //     align: 'right',
                //     verticalAlign: 'middle'
                // },
                credits: {
                    enabled: false
                }
            },
            series: rotationIndexSalesValueHealthBeauties,
            title: {
                text: 'HealthBeauties - Sales Value',
                style: {
                    'font-size':'16px'
                }
            },
            subtitle: {
                text: '<p style="font-size:20px;float:left;" class="text-left">Urban Market</p><p style="font-size:20px;float:right;" class="text-right">Rural Market</p>',
                useHTML:true,

            },
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.rotationIndexSalesVolumeElecssories={
            options: {
                xAxis: {
                    categories: myCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                yAxis:{
                    title: {
                        text: 'mln units',
                        style: {
                            'font-size':'16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">mln units:'+this.point.y.toFixed(2)+'</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                // legend: {
                //     layout: 'vertical',
                //     align: 'right',
                //     verticalAlign: 'middle'
                // },
                credits: {
                    enabled: false
                }
            },
            series: rotationIndexSalesVolumeElecssories,
            title: {
                text: 'Elecssories - Sales Volume',
                style: {
                    'font-size':'16px'
                }
            },
            subtitle: {
                text: '<p style="font-size:20px;float:left;" class="text-left">Urban Market</p><p style="font-size:20px;float:right;" class="text-right">Rural Market</p>',
                useHTML:true,

            },
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.rotationIndexSalesVolumeHealthBeauties={
            options: {
                xAxis: {
                    categories: myCategories,
                    title: {
                        text: 'Period',
                        style: {
                            'font-size':'16px'
                        }
                    }
                },
                yAxis:{
                    title: {
                        text: 'mln units',
                        style: {
                            'font-size':'16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">mln units:'+this.point.y.toFixed(2)+'</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                // legend: {
                //     layout: 'vertical',
                //     align: 'right',
                //     verticalAlign: 'middle'
                // },
                credits: {
                    enabled: false
                }
            },
            series: rotationIndexSalesVolumeHealthBeauties,
            title: {
                text: 'HealthBeauties - Sales Volume',
                style: {
                    'font-size':'16px'
                }
            },
            subtitle: {
                text: '<p style="font-size:20px;float:left;" class="text-left">Urban Market</p><p style="font-size:20px;float:right;" class="text-right">Rural Market</p>',
                useHTML:true,

            },
            credits: {
                enabled: false
            },
            loading: false
        }

        $scope.previousRuralProfitabilityIndex = {
            options: {
                title:{
                    text:'Rural Market',
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
                        text: 'Profitability Index($mln)',
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
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">Profitability Index:'+this.point.y.toFixed(2)+'($mln)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: previousRuralProfitabilityIndex,
            loading: false
        }
        $scope.previousUrbanProfitabilityIndex = {
            options: {
                title:{
                    text:'Urban Market',
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
                        text: 'Profitability Index($mln)',
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
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">Profitability Index:'+this.point.y.toFixed(2)+'($mln)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: previousUrbanProfitabilityIndex,
            loading: false
        }
        $scope.currentRuralProfitabilityIndex = {
            options: {
                title:{
                    text:'Rural Market',
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
                        text: 'Profitability Index($mln)',
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
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">Profitability Index:'+this.point.y.toFixed(2)+'($mln)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: currentRuralProfitabilityIndex,
            loading: false
        }
        $scope.currentUrbanProfitabilityIndex = {
            options: {
                title:{
                    text:'Urban Market',
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
                        text: 'Profitability Index($mln)',
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
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">Profitability Index:'+this.point.y.toFixed(2)+'($mln)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: currentUrbanProfitabilityIndex,
            loading: false
        }

        $scope.EStockCover = {
            options: {
                title:{
                    text:'Elecssories',
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
                        text: 'Stock Cover (in Weeks)',
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
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">Stock Cover:'+this.point.y.toFixed(2)+'(in Weeks)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: EStockCover,
            loading: false
        }
        $scope.HStockCover = {
            options: {
                title:{
                    text:'HealthBeauties',
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
                        text: 'Stock Cover (in Weeks)',
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
                        var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">Stock Cover:'+this.point.y.toFixed(2)+'(in Weeks)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: HStockCover,
            loading: false
        }
    }
    $scope.$watch('feedBack', function(newValue, oldValue){
        if(newValue!=undefined) {
            initPage();
        }
    });
}

