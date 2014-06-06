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
        
        testCategories=[Request['period']-2,Request['period']-1];
        myCategories=[Request['period']-2,Request['period']-1,'',Request['period']-2,Request['period']-1];

        var salesValueElecssories=new Array();


        $http({
            method:'GET',
            url:url
        }).then(function(data){
            var rotationIndexSalesValueElecssories=new Array({
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });
            var rotationIndexSalesValueHealthBeauties=new Array({
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });
            var rotationIndexSalesVolumeElecssories=new Array({
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });
            var rotationIndexSalesVolumeHealthBeauties=new Array({
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });

            var previousUrbanProfitabilityIndex=new Array({
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });
            var currentUrbanProfitabilityIndex=new Array({
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });
            var previousRuralProfitabilityIndex=new Array({
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });
            var currentRuralProfitabilityIndex=new Array({
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });
            var ruralStockCover=new Array({
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });
            var urbanStockCover=new Array({
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });
            var ruralShareOfShoppers=new Array({
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });
            var urbanShareOfShoppers=new Array({
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });

            //rotationIndexSalesValue
            for(var j=0;j<testCategories.length;j++){
                for(var i=0;i<data.data.f_RetailersValueRotationIndex.length;i++){
                    if(data.data.f_RetailersValueRotationIndex[i].period==testCategories[j]){
                        if(data.data.f_RetailersValueRotationIndex[i].categoryID==1){
                            if(data.data.f_RetailersValueRotationIndex[i].marketID==2){
                                rotationIndexSalesValueElecssories[data.data.f_RetailersValueRotationIndex[i].retailerID-1].data.push(data.data.f_RetailersValueRotationIndex[i].value);
                            }
                        }else if(data.data.f_RetailersValueRotationIndex[i].categoryID==2){
                            if(data.data.f_RetailersValueRotationIndex[i].marketID==2){
                                rotationIndexSalesValueHealthBeauties[data.data.f_RetailersValueRotationIndex[i].retailerID-1].data.push(data.data.f_RetailersValueRotationIndex[i].value);
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
                for(var i=0;i<data.data.f_RetailersValueRotationIndex.length;i++){
                    if(data.data.f_RetailersValueRotationIndex[i].period==testCategories[j]){
                        if(data.data.f_RetailersValueRotationIndex[i].categoryID==1){
                            if(data.data.f_RetailersValueRotationIndex[i].marketID==1){
                                rotationIndexSalesValueElecssories[data.data.f_RetailersValueRotationIndex[i].retailerID-1].data.push(data.data.f_RetailersValueRotationIndex[i].value);
                            }
                        }else if(data.data.f_RetailersValueRotationIndex[i].categoryID==2){
                            if(data.data.f_RetailersValueRotationIndex[i].marketID==1){
                                rotationIndexSalesValueHealthBeauties[data.data.f_RetailersValueRotationIndex[i].retailerID-1].data.push(data.data.f_RetailersValueRotationIndex[i].value);
                            }
                        }
                    }
                }
            }
            //rotationIndexSalesVolume
            for(var j=0;j<testCategories.length;j++){
                for(var i=0;i<data.data.f_RetailersVolumeRotationIndex.length;i++){
                    if(data.data.f_RetailersVolumeRotationIndex[i].period==testCategories[j]){
                        if(data.data.f_RetailersVolumeRotationIndex[i].categoryID==1){
                            if(data.data.f_RetailersVolumeRotationIndex[i].marketID==2){
                                rotationIndexSalesVolumeElecssories[data.data.f_RetailersVolumeRotationIndex[i].retailerID-1].data.push(data.data.f_RetailersVolumeRotationIndex[i].value);
                            }
                        }else if(data.data.f_RetailersVolumeRotationIndex[i].categoryID==2){
                            if(data.data.f_RetailersVolumeRotationIndex[i].marketID==2){
                                rotationIndexSalesVolumeHealthBeauties[data.data.f_RetailersVolumeRotationIndex[i].retailerID-1].data.push(data.data.f_RetailersVolumeRotationIndex[i].value);
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
                for(var i=0;i<data.data.f_RetailersVolumeRotationIndex.length;i++){
                    if(data.data.f_RetailersVolumeRotationIndex[i].period==testCategories[j]){
                        if(data.data.f_RetailersVolumeRotationIndex[i].categoryID==1){
                            if(data.data.f_RetailersVolumeRotationIndex[i].marketID==1){
                                rotationIndexSalesVolumeElecssories[data.data.f_RetailersVolumeRotationIndex[i].retailerID-1].data.push(data.data.f_RetailersVolumeRotationIndex[i].value);
                            }
                        }else if(data.data.f_RetailersVolumeRotationIndex[i].categoryID==2){
                            if(data.data.f_RetailersVolumeRotationIndex[i].marketID==1){
                                rotationIndexSalesVolumeHealthBeauties[data.data.f_RetailersVolumeRotationIndex[i].retailerID-1].data.push(data.data.f_RetailersVolumeRotationIndex[i].value);
                            }
                        }
                    }
                }
            }

            //currentProfitability Index
            for(var j=0;j<currentCategories.length;j++){
                for(var i=0;i<data.data.f_RetailersProfitabilityIndex.length;i++){
                    if(data.data.f_RetailersProfitabilityIndex[i].period==currentCategories[j]){
                        if(data.data.f_RetailersProfitabilityIndex[i].categoryID==3){
                            if(data.data.f_RetailersProfitabilityIndex[i].marketID==1){
                                currentUrbanProfitabilityIndex[data.data.f_RetailersProfitabilityIndex[i].retailerID-1].data.push(data.data.f_RetailersProfitabilityIndex[i].value);
                            }else if(data.data.f_RetailersProfitabilityIndex[i].marketID==2){
                                currentRuralProfitabilityIndex[data.data.f_RetailersProfitabilityIndex[i].retailerID-1].data.push(data.data.f_RetailersProfitabilityIndex[i].value);
                            }
                        }
                    }
                }
            }
            //previousProfitability Index
            for(var j=0;j<previousCategories.length;j++){
                for(var i=0;i<data.data.f_RetailersProfitabilityIndex.length;i++){
                    if(data.data.f_RetailersProfitabilityIndex[i].period==previousCategories[j]){
                        if(data.data.f_RetailersProfitabilityIndex[i].categoryID==3){
                            if(data.data.f_RetailersProfitabilityIndex[i].marketID==1){
                                previousUrbanProfitabilityIndex[data.data.f_RetailersProfitabilityIndex[i].retailerID-1].data.push(data.data.f_RetailersProfitabilityIndex[i].value);
                            }else if(data.data.f_RetailersProfitabilityIndex[i].marketID==2){
                                previousRuralProfitabilityIndex[data.data.f_RetailersProfitabilityIndex[i].retailerID-1].data.push(data.data.f_RetailersProfitabilityIndex[i].value);
                            }
                        }
                    }
                }
            }
            //Stock Cover
            for(var j=0;j<currentCategories.length;j++){
                for(var i=0;i<data.data.f_RetailersStocksCover.length;i++){
                    if(data.data.f_RetailersStocksCover[i].period==currentCategories[j]){
                        if(data.data.f_RetailersStocksCover[i].categoryID==3){
                            if(data.data.f_RetailersStocksCover[i].marketID==1){
                                urbanStockCover[data.data.f_RetailersStocksCover[i].retailerID-1].data.push(data.data.f_RetailersStocksCover[i].value);
                            }else if(data.data.f_RetailersStocksCover[i].marketID==2){
                                ruralStockCover[data.data.f_RetailersStocksCover[i].retailerID-1].data.push(data.data.f_RetailersStocksCover[i].value);
                            }
                        }
                    }
                }
            }

            //ShareofShoppers
            for(var j=0;j<testCategories.length;j++){
                for(var i=0;i<data.data.f_RetailersShoppersShare.length;i++){
                    if(data.data.f_RetailersShoppersShare[i].period==testCategories[j]){
                        if(data.data.f_RetailersShoppersShare[i].categoryID==3){
                            if(data.data.f_RetailersShoppersShare[i].marketID==2){
                                ruralShareOfShoppers[data.data.f_RetailersShoppersShare[i].retailerID-1].data.push(data.data.f_RetailersShoppersShare[i].value);
                            }else if(data.data.f_RetailersShoppersShare[i].marketID==1){
                                urbanShareOfShoppers[data.data.f_RetailersShoppersShare[i].retailerID-1].data.push(data.data.f_RetailersShoppersShare[i].value);
                            }
                        }
                    }
                }
            }
            for(var i=0;i<2+testCategories.length;i++){
                ruralShareOfShoppers[0].data.push('');
                ruralShareOfShoppers[1].data.push('');
                urbanShareOfShoppers[0].data.push('');
                urbanShareOfShoppers[1].data.push('');
            }
            //ALL Shoppers is not ready
            // for(var i=0;i<2;i++){
            //     ruralShareOfShoppers[i].data.push('');
            //     urbanShareOfShoppers[i].data.push('');
            // }
            // for(var j=0;j<testCategories.length;j++){
            //     for(var i=0;i<data.data.f_RetailersShoppersShare.length;i++){
            //         if(data.data.f_RetailersShoppersShare[i].period==testCategories[j]){
            //             if(data.data.f_RetailersShoppersShare[i].categoryID==3){
            //                 if(data.data.f_RetailersShoppersShare[i].marketID==2){
            //                     ruralShareOfShoppers[data.data.f_RetailersShoppersShare[i].retailerID-1].data.push(data.data.f_RetailersShoppersShare[i].value);
            //                 }else if(data.data.f_RetailersShoppersShare[i].marketID==1){
            //                     urbanShareOfShoppers[data.data.f_RetailersShoppersShare[i].retailerID-1].data.push(data.data.f_RetailersShoppersShare[i].value);
            //                 }
            //             }
            //         }
            //     }
            // }



            $scope.rotationIndexSalesValueElecssories={
                options: {
                    xAxis: {
                        categories: myCategories,
                        title: {
                            text: 'Period'
                        }
                    },
                    yAxis:{
                        title: {
                            text: '$mln'
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
                    text: 'Elecssories - Sales Value'
                },
                subtitle: {
                    text: '<p style="font-size:20px;float:left;" class="text-left">Rural Market</p><p style="font-size:20px;float:right;" class="text-right">Urban Market</p>',
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
                            text: 'Period'
                        }
                    },
                    yAxis:{
                        title: {
                            text: '$mln'
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
                    text: 'HealthBeauties - Sales Value'
                },
                subtitle: {
                    text: '<p style="font-size:20px;float:left;" class="text-left">Rural Market</p><p style="font-size:20px;float:right;" class="text-right">Urban Market</p>',
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
                            text: 'Period'
                        }
                    },
                    yAxis:{
                        title: {
                            text: 'mln units'
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
                    text: 'Elecssories - Sales Volume'
                },
                subtitle: {
                    text: '<p style="font-size:20px;float:left;" class="text-left">Rural Market</p><p style="font-size:20px;float:right;" class="text-right">Urban Market</p>',
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
                            text: 'Period'
                        }
                    },
                    yAxis:{
                        title: {
                            text: 'mln units'
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
                    text: 'HealthBeauties - Sales Volume'
                },
                subtitle: {
                    text: '<p style="font-size:20px;float:left;" class="text-left">Rural Market</p><p style="font-size:20px;float:right;" class="text-right">Urban Market</p>',
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
                    },
                    chart: {
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    yAxis: {
                        title: {
                            text: 'Profitability Index($mln)'
                        },
                        gridLineColor: 'transparent'
                    },
                    xAxis: {
                        categories: currentCategories,
                        title: {
                            text: 'Period'
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
                    },
                    chart: {
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    yAxis: {
                        title: {
                            text: 'Profitability Index($mln)'
                        },
                        gridLineColor: 'transparent'
                    },
                    xAxis: {
                        categories: currentCategories,
                        title: {
                            text: 'Period'
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
                    },
                    chart: {
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    yAxis: {
                        title: {
                            text: 'Profitability Index($mln)'
                        },
                        gridLineColor: 'transparent'
                    },
                    xAxis: {
                        categories: currentCategories,
                        title: {
                            text: 'Period'
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
                    },
                    chart: {
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    yAxis: {
                        title: {
                            text: 'Profitability Index($mln)'
                        },
                        gridLineColor: 'transparent'
                    },
                    xAxis: {
                        categories: currentCategories,
                        title: {
                            text: 'Period'
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

            $scope.urbanStockCover = {
                options: {
                    title:{
                        text:'Urban Market',
                    },
                    chart: {
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    yAxis: {
                        title: {
                            text: 'Stock Cover (in Weeks)'
                        },
                        gridLineColor: 'transparent'
                    },
                    xAxis: {
                        categories: currentCategories,
                        title: {
                            text: 'Period'
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
                series: urbanStockCover,
                loading: false
            }
            $scope.ruralStockCover = {
                options: {
                    title:{
                        text:'Rural Market',
                    },
                    chart: {
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    yAxis: {
                        title: {
                            text: 'Stock Cover (in Weeks)'
                        },
                        gridLineColor: 'transparent'
                    },
                    xAxis: {
                        categories: currentCategories,
                        title: {
                            text: 'Period'
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
                series: ruralStockCover,
                loading: false
            }

            $scope.ruralShareOfShoppers={
                options: {
                    xAxis: {
                        categories: myCategories,
                        title: {
                            text: 'Period'
                        }
                    },
                    yAxis:{
                        title: {
                            text: '%'
                        },
                        gridLineColor: 'transparent'
                    },
                    chart: {
                        type: 'column',
                        backgroundColor: 'transparent',
                    },
                    tooltip: {
                        formatter: function() {
                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'('+this.point.percentage.toFixed(2)+'%)</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
                    },
                    plotOptions: {
                        series: {
                            stacking: 'percent'
                        }
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
                series: ruralShareOfShoppers,
                title: {
                    text: 'Rural Market'
                },
                subtitle: {
                    text: '<p style="font-size:20px;float:left;" class="text-left">B&M Shoppers</p><p style="font-size:20px;float:right;" class="text-right">All Shoppers</p>',
                    useHTML:true,

                },
                credits: {
                    enabled: false
                },
                loading: false
            }
            $scope.urbanShareOfShoppers={
                options: {
                    xAxis: {
                        categories: myCategories,
                        title: {
                            text: 'Period'
                        }
                    },
                    yAxis:{
                        title: {
                            text: '%'
                        },
                        gridLineColor: 'transparent'
                    },
                    chart: {
                        type: 'column',
                        backgroundColor: 'transparent',
                    },
                    tooltip: {
                        formatter: function() {
                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'('+this.point.percentage.toFixed(2)+'%)</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
                    },
                    plotOptions: {
                        series: {
                            stacking: 'percent'
                        }
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
                series: urbanShareOfShoppers,
                title: {
                    text: 'Urban Market'
                },
                subtitle: {
                    text: '<p style="font-size:20px;float:left;" class="text-left">B&M Shoppers</p><p style="font-size:20px;float:right;" class="text-right">All Shoppers</p>',
                    useHTML:true,

                },
                credits: {
                    enabled: false
                },
                loading: false
            }

        });
    }
    initPage();
}

